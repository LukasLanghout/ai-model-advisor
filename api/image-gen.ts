// Node.js runtime — supports up to 60s timeout (needed for image generation)
export const maxDuration = 60;

interface ImageGenBody {
  prompt: string;
  modelId: string;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// HF Inference Providers router: POST with { inputs } returns raw image bytes.
// Abort at 50s so we can return a clean JSON error before Vercel's 60s hard kill.
async function callHfInference(modelId: string, prompt: string, token?: string): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const routerUrl = `https://router.huggingface.co/hf-inference/models/${modelId}`;
  return fetch(routerUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ inputs: prompt }),
    signal: AbortSignal.timeout(50_000),
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  let body: ImageGenBody;
  try {
    body = (await req.json()) as ImageGenBody;
  } catch {
    return new Response(JSON.stringify({ error: 'Ongeldige JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { prompt, modelId } = body;
  if (!prompt?.trim() || !modelId?.trim()) {
    return new Response(JSON.stringify({ error: 'prompt en modelId zijn verplicht' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const hfToken = process.env.HUGGINGFACE_TOKEN;
  const start = Date.now();

  let res: Response;
  try {
    res = await callHfInference(modelId, prompt, hfToken);
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === 'TimeoutError';
    return new Response(
      JSON.stringify({
        error: isTimeout
          ? 'Generatie duurde langer dan 50s (model is waarschijnlijk aan het opstarten). Probeer het over een minuut opnieuw.'
          : `Netwerkfout bij verbinding met HuggingFace: ${String(err)}`,
      }),
      { status: isTimeout ? 504 : 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const latency = Date.now() - start;

  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`;
    try {
      const j = (await res.json()) as { error?: string; message?: string; estimated_time?: number };
      if (j.estimated_time) {
        errMsg = `Model is aan het laden, probeer over ~${Math.ceil(j.estimated_time)}s opnieuw.`;
      } else {
        errMsg = j.error ?? j.message ?? errMsg;
      }
    } catch {
      errMsg = (await res.text().catch(() => errMsg)) || errMsg;
    }
    return new Response(JSON.stringify({ error: errMsg }), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const contentType = res.headers.get('content-type') ?? 'image/jpeg';

  let buffer: ArrayBuffer;
  try {
    buffer = await res.arrayBuffer();
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Fout bij ophalen afbeelding: ${String(err)}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const base64 = arrayBufferToBase64(buffer);

  return new Response(
    JSON.stringify({ image: `data:${contentType};base64,${base64}`, latency }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}

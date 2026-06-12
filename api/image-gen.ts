export const config = { runtime: 'edge' };

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

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  let body: ImageGenBody;
  try {
    body = (await req.json()) as ImageGenBody;
  } catch {
    return new Response(JSON.stringify({ error: 'Ongeldige JSON body' }), { status: 400 });
  }

  const { prompt, modelId } = body;
  if (!prompt?.trim() || !modelId?.trim()) {
    return new Response(JSON.stringify({ error: 'prompt en modelId zijn verplicht' }), { status: 400 });
  }

  const hfToken = process.env.HUGGINGFACE_TOKEN;
  const start = Date.now();

  let res: Response;
  try {
    res = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(hfToken ? { Authorization: `Bearer ${hfToken}` } : {}),
      },
      body: JSON.stringify({ inputs: prompt }),
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Netwerkfout: ${String(err)}` }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const latency = Date.now() - start;

  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`;
    try {
      const j = await res.json() as { error?: string; message?: string };
      errMsg = j.error ?? j.message ?? errMsg;
    } catch {
      errMsg = (await res.text().catch(() => errMsg)) || errMsg;
    }
    return new Response(
      JSON.stringify({ error: errMsg }),
      { status: res.status, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const contentType = res.headers.get('content-type') ?? 'image/jpeg';

  // Return binary image as base64 so the browser can display it directly
  const buffer = await res.arrayBuffer();
  const base64 = arrayBufferToBase64(buffer);

  return new Response(
    JSON.stringify({ image: `data:${contentType};base64,${base64}`, latency }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}

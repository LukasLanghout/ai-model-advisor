import type { VercelRequest, VercelResponse } from '@vercel/node';

// Node.js serverless function — maxDuration: 60 staat in vercel.json.
// Edge runtime kan hier niet: die heeft een 25s-limiet en image-generatie duurt 15-45s.

interface ImageGenBody {
  prompt?: string;
  modelId?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, modelId } = (req.body ?? {}) as ImageGenBody;
  if (!prompt?.trim() || !modelId?.trim()) {
    return res.status(400).json({ error: 'prompt en modelId zijn verplicht' });
  }

  const hfToken = process.env.HUGGINGFACE_TOKEN;
  const start = Date.now();

  // HF Inference Providers router: POST met { inputs } geeft raw image bytes terug.
  // Abort op 50s zodat we een nette JSON-fout kunnen sturen vóór Vercel's 60s hard kill.
  let hfRes: Response;
  try {
    hfRes = await fetch(`https://router.huggingface.co/hf-inference/models/${modelId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(hfToken ? { Authorization: `Bearer ${hfToken}` } : {}),
      },
      body: JSON.stringify({ inputs: prompt }),
      signal: AbortSignal.timeout(50_000),
    });
  } catch (err) {
    const isTimeout = err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError');
    return res.status(isTimeout ? 504 : 502).json({
      error: isTimeout
        ? 'Generatie duurde langer dan 50s (model is waarschijnlijk aan het opstarten). Probeer het over een minuut opnieuw.'
        : `Netwerkfout bij verbinding met HuggingFace: ${String(err)}`,
    });
  }

  const latency = Date.now() - start;

  if (!hfRes.ok) {
    let errMsg = `HTTP ${hfRes.status}`;
    try {
      const j = (await hfRes.json()) as { error?: string; message?: string; estimated_time?: number };
      if (j.estimated_time) {
        errMsg = `Model is aan het laden, probeer over ~${Math.ceil(j.estimated_time)}s opnieuw.`;
      } else {
        errMsg = j.error ?? j.message ?? errMsg;
      }
    } catch {
      errMsg = (await hfRes.text().catch(() => errMsg)) || errMsg;
    }
    return res.status(hfRes.status).json({ error: errMsg });
  }

  const contentType = hfRes.headers.get('content-type') ?? 'image/jpeg';

  let base64: string;
  try {
    const buffer = await hfRes.arrayBuffer();
    base64 = Buffer.from(buffer).toString('base64');
  } catch (err) {
    return res.status(500).json({ error: `Fout bij ophalen afbeelding: ${String(err)}` });
  }

  return res.status(200).json({ image: `data:${contentType};base64,${base64}`, latency });
}

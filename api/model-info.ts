export const config = { runtime: 'edge' };

export interface ModelInfoResult {
  summary: string;
  strengths: string[];
  useCases: string[];
  limitations: string[];
  alternatives: string[];
  hfData?: {
    downloads: number;
    likes: number;
    tags: string[];
    inference: string;
  };
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const { modelId, modelName } = await request.json() as {
    modelId: string;
    modelName?: string;
  };

  if (!modelId?.trim()) {
    return new Response(JSON.stringify({ error: 'modelId is vereist' }), { status: 400 });
  }

  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    return new Response(JSON.stringify({ error: 'GROQ_API_KEY niet geconfigureerd' }), { status: 500 });
  }

  // ── Optional: fetch HF Hub metadata ──────────────────────
  let hfData: ModelInfoResult['hfData'] | undefined;
  try {
    const hfToken = process.env.HUGGINGFACE_TOKEN;
    const hfRes = await fetch(`https://huggingface.co/api/models/${modelId}?full=false`, {
      headers: {
        ...(hfToken ? { Authorization: `Bearer ${hfToken}` } : {}),
        'User-Agent': 'ai-model-advisor/1.0',
      },
    });
    if (hfRes.ok) {
      const hf = await hfRes.json() as {
        downloads?: number;
        likes?: number;
        tags?: string[];
        inference?: string;
      };
      hfData = {
        downloads: hf.downloads ?? 0,
        likes:     hf.likes     ?? 0,
        tags:      (hf.tags     ?? []).slice(0, 10),
        inference: hf.inference ?? 'unknown',
      };
    }
  } catch { /* HF data is optional — fail silently */ }

  // ── Groq: generate structured model info ─────────────────
  const displayName = modelName ?? modelId;
  const hfContext = hfData
    ? `\nHuggingFace statistieken: ${hfData.downloads.toLocaleString('nl')} downloads, ${hfData.likes} likes, tags: ${hfData.tags.join(', ')}.`
    : '';

  const prompt = `Je bent een AI-expert. Geef gestructureerde technische informatie over het taalmodel "${displayName}" (model ID: ${modelId}).${hfContext}

Reageer UITSLUITEND met geldig JSON in dit exacte formaat — geen extra tekst of uitleg:
{
  "summary": "2-3 informatieve zinnen: wat is dit model, wie maakte het, wat maakt het uniek vergeleken met andere modellen?",
  "strengths": ["specifieke kracht 1", "specifieke kracht 2", "specifieke kracht 3"],
  "useCases": ["concrete use case 1", "concrete use case 2", "concrete use case 3"],
  "limitations": ["beperking of nadeel 1", "beperking of nadeel 2"],
  "alternatives": ["AlternatielModelNaam1", "AlternatielModelNaam2", "AlternatielModelNaam3"]
}

Regels:
- Schrijf in het Nederlands
- Wees concreet en feitelijk, geen marketingtaal
- Alternatieven zijn echte modelnamen (bijv. "Llama 3.3 70B", "Mistral Small 3.1")`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${groqKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 700,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(
      JSON.stringify({ error: `Groq API fout (${res.status}): ${err.slice(0, 200)}` }),
      { status: 502 },
    );
  }

  const data = await res.json() as {
    choices: Array<{ message: { content: string } }>;
  };

  try {
    const parsed = JSON.parse(data.choices[0]?.message?.content ?? '{}') as ModelInfoResult;
    return new Response(
      JSON.stringify({ ...parsed, hfData }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' } },
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Kon het Groq-antwoord niet verwerken' }),
      { status: 500 },
    );
  }
}

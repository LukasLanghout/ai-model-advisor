export const config = { runtime: 'edge' };

interface PlayBody {
  prompt: string;
  modelId: string;
  modelName: string;
  inputPer1M: number;
  outputPer1M: number;
  provider?: 'groq' | 'huggingface';
}

const EUR_RATE = 0.93;

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const body = await request.json() as PlayBody;
  const { prompt, modelId, modelName, provider = 'groq' } = body;

  if (!prompt?.trim()) {
    return new Response(JSON.stringify({ error: 'Prompt is leeg' }), { status: 400 });
  }

  // ── HuggingFace Serverless Inference API ──────────────────
  if (provider === 'huggingface') {
    const hfToken = process.env.HUGGINGFACE_TOKEN;
    if (!hfToken) {
      return new Response(
        JSON.stringify({
          modelId,
          modelName,
          output: '',
          latency: 0,
          inputTokens: 0,
          outputTokens: 0,
          estimatedCostEur: 0,
          error: 'HUGGINGFACE_TOKEN is niet geconfigureerd in Vercel. Voeg hem toe via Project → Settings → Environment Variables.',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }
    return runProvider('https://api-inference.huggingface.co/v1/chat/completions', hfToken, body);
  }

  // ── Groq ──────────────────────────────────────────────────
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    return new Response(
      JSON.stringify({ error: 'GROQ_API_KEY niet geconfigureerd.' }),
      { status: 500 },
    );
  }
  return runProvider('https://api.groq.com/openai/v1/chat/completions', groqKey, body);
}

async function runProvider(url: string, apiKey: string, body: PlayBody): Promise<Response> {
  const { prompt, modelId, modelName, inputPer1M, outputPer1M } = body;
  const start = Date.now();

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    const latency = Date.now() - start;

    if (!res.ok) {
      const raw = await res.text();
      // Try to extract a human-readable message from the JSON error
      let detail = raw.slice(0, 300);
      try {
        const parsed = JSON.parse(raw) as { error?: { message?: string } | string };
        if (typeof parsed.error === 'string') detail = parsed.error;
        else if (typeof parsed.error === 'object' && parsed.error?.message) detail = parsed.error.message;
      } catch { /* keep raw */ }
      return new Response(
        JSON.stringify({ modelId, modelName, output: '', latency, inputTokens: 0, outputTokens: 0, estimatedCostEur: 0, error: `API fout ${res.status}: ${detail}` }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const data = await res.json() as {
      choices: Array<{ message: { content: string } }>;
      usage?: { prompt_tokens: number; completion_tokens: number };
    };

    const inputTokens  = data.usage?.prompt_tokens    ?? 0;
    const outputTokens = data.usage?.completion_tokens ?? 0;
    const costUsd =
      (inputTokens  / 1_000_000) * inputPer1M +
      (outputTokens / 1_000_000) * outputPer1M;

    return new Response(
      JSON.stringify({
        modelId,
        modelName,
        output: data.choices[0]?.message?.content ?? '',
        latency,
        inputTokens,
        outputTokens,
        estimatedCostEur: costUsd * EUR_RATE,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ modelId, modelName, output: '', latency: Date.now() - start, inputTokens: 0, outputTokens: 0, estimatedCostEur: 0, error: String(err) }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

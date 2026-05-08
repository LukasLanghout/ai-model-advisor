export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GROQ_API_KEY niet geconfigureerd.' }), { status: 500 });
  }

  const { prompt, modelId, modelName, inputPer1M, outputPer1M } = await request.json() as {
    prompt: string;
    modelId: string;
    modelName: string;
    inputPer1M: number;
    outputPer1M: number;
  };

  if (!prompt?.trim()) {
    return new Response(JSON.stringify({ error: 'Prompt is leeg' }), { status: 400 });
  }

  const EUR_RATE = 0.93;
  const start = Date.now();

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
      const err = await res.text();
      return new Response(
        JSON.stringify({ modelId, modelName, error: `API fout: ${res.status} — ${err}`, latency }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await res.json() as {
      choices: Array<{ message: { content: string } }>;
      usage: { prompt_tokens: number; completion_tokens: number };
    };

    const inputTokens = data.usage?.prompt_tokens ?? 0;
    const outputTokens = data.usage?.completion_tokens ?? 0;
    const costUsd =
      (inputTokens / 1_000_000) * inputPer1M +
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
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ modelId, modelName, error: String(err), latency: Date.now() - start }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export const config = { runtime: 'edge' };

interface CompareModelInput {
  id: string;
  name: string;
  provider: string;
  params?: string;
  contextK?: number;
  specialties?: string[];
}

export interface CompareResult {
  verdict: string;
  differences: string[];
  whenToPick: Array<{ model: string; when: string }>;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const { models } = await request.json() as { models: CompareModelInput[] };

  if (!Array.isArray(models) || models.length < 2 || models.length > 3) {
    return new Response(JSON.stringify({ error: 'Geef 2 of 3 modellen op' }), { status: 400 });
  }

  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    return new Response(JSON.stringify({ error: 'GROQ_API_KEY niet geconfigureerd' }), { status: 500 });
  }

  const modelDescriptions = models
    .map((m) => `- ${m.name} (${m.provider}${m.params ? `, ${m.params}` : ''}${m.contextK ? `, ${m.contextK}K context` : ''}${m.specialties?.length ? `, sterk in: ${m.specialties.join(', ')}` : ''})`)
    .join('\n');

  const prompt = `Je bent een AI-expert. Vergelijk deze ${models.length} taalmodellen objectief:
${modelDescriptions}

Reageer UITSLUITEND met geldig JSON in dit exacte formaat — geen extra tekst:
{
  "verdict": "2-3 zinnen: wat is het belangrijkste verschil tussen deze modellen en voor wie is welk model?",
  "differences": ["concreet verschil 1", "concreet verschil 2", "concreet verschil 3", "concreet verschil 4"],
  "whenToPick": [
    ${models.map((m) => `{ "model": "${m.name}", "when": "kies dit model als..." }`).join(',\n    ')}
  ]
}

Regels:
- Schrijf in het Nederlands
- Wees concreet en feitelijk, geen marketingtaal
- Focus op praktische verschillen: kwaliteit, snelheid, kosten, hardware-eisen, use cases`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${groqKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
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
    const parsed = JSON.parse(data.choices[0]?.message?.content ?? '{}') as CompareResult;
    return new Response(
      JSON.stringify(parsed),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' } },
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Kon het Groq-antwoord niet verwerken' }),
      { status: 500 },
    );
  }
}

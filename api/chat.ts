export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GROQ_API_KEY niet geconfigureerd.' }), { status: 500 });
  }

  const { messages } = await request.json() as { messages: Array<{ role: string; content: string }> };

  const systemPrompt = `Je bent een AI consultant die een discovery-gesprek voert om het beste AI-model aan te bevelen.

Je doel is 7 onderwerpen te behandelen door gerichte FOLLOW-UP VRAGEN te stellen:
1. useCase – wat bouwt of lost de gebruiker op? (chatbot, RAG, classificatie, samenvatting, code, vision, agents)
2. scale – verwacht volume (requests of tokens per maand, ruwe schatting)
3. latency – real-time (<1s), interactief (1-5s), batch (>5s), asynchroon (minuten)
4. budget – maandbudget in euro's
5. privacy – cloud mag, EU-only vereist, of only on-premise
6. languages – welke talen (is Nederlands vereist?)
7. contextWindow – korte responses, lange documenten, of enorme context nodig?

Regels:
- Stel MAXIMAAL ÉÉN vraag per keer
- Als een antwoord meerdere topics dekt, update coveredTopics dienovereenkomstig
- Wees conversational en beknopt (niet meer dan 2 zinnen + 1 vraag)
- Na 4-6 uitwisselingen, of zodra je de 5 meest kritieke topics hebt (useCase, scale, latency, budget, privacy), return type "ready"
- Bij "ready": geef een bondig scenario-object terug op basis van het gesprek

Geef JSON terug in dit EXACTE formaat:

Bij een vervolgvraag:
{
  "type": "question",
  "question": "De vraag die je stelt",
  "hint": "Korte toelichting of voorbeeld voor de gebruiker",
  "coveredTopics": ["useCase", "scale"]
}

Wanneer je genoeg info hebt:
{
  "type": "ready",
  "summary": "Samenvatting van het gesprek in 2-3 zinnen",
  "coveredTopics": ["useCase", "scale", "latency", "budget", "privacy", "languages", "contextWindow"],
  "scenario": {
    "useCase": "beschrijving van de use case",
    "scale": "geschat volume",
    "latency": "latency vereiste",
    "budget": "budget range",
    "privacy": "privacy vereiste",
    "languages": ["Nederlands", "Engels"],
    "contextWindow": "context behoefte",
    "description": "volledige beschrijving voor de aanbeveling prompt"
  }
}`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 512,
        temperature: 0.4,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Groq chat fout:', res.status, err);
      return new Response(JSON.stringify({ error: `Groq API fout (${res.status})` }), { status: 502 });
    }

    const data = await res.json() as { choices: Array<{ message: { content: string } }> };
    const content = data.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(content);

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Chat fout:', err);
    return new Response(JSON.stringify({ error: 'Gespreksfout' }), { status: 500 });
  }
}

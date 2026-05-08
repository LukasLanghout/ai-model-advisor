export const config = { runtime: 'edge' };

// Expanded model context inspired by llmfit's model database (github.com/AlexsJones/llmfit)
const MODELS_CONTEXT = `
Beschikbare AI modellen (id | naam | provider | type | sterke punten | prijzen | latency | privacy | context | hardware voor self-hosting):

claude-3-5-sonnet | Claude 3.5 Sonnet | Anthropic | cloud | Uitstekende redenering, codering, 200K context, betrouwbaar zakelijk gebruik | $3/1M in, $15/1M out | medium | cloud-only | 200K tokens | n.v.t.
claude-3-haiku | Claude 3 Haiku | Anthropic | cloud | Zeer snel en goedkoop, hoog volume, visiemogelijkheden | $0.25/1M in, $1.25/1M out | fast | cloud-only | 200K tokens | n.v.t.
gpt-4o | GPT-4o | OpenAI | cloud | Sterk multimodaal, uitstekende function calling, breed ecosysteem | $5/1M in, $15/1M out | medium | cloud-only | 128K tokens | n.v.t.
gpt-4o-mini | GPT-4o Mini | OpenAI | cloud | Zeer goedkoop, snel, function calling, goed voor hoog volume | $0.15/1M in, $0.60/1M out | fast | cloud-only | 128K tokens | n.v.t.
gemini-1-5-pro | Gemini 1.5 Pro | Google | cloud | Enorm 2M tokens context, multimodaal (tekst+video+audio), Google Cloud integratie | $3.50/1M in, $10.50/1M out | medium | cloud-only | 2M tokens | n.v.t.
gemini-1-5-flash | Gemini 1.5 Flash | Google | cloud | Zeer snel, goedkoop, 1M context, goed multimodaal | $0.075/1M in, $0.30/1M out | fast | cloud-only | 1M tokens | n.v.t.
llama-3-1-70b | Llama 3.1 70B | Meta | open-source | Volledig open source, on-premise, geen per-token kosten, sterk algemeen gebruik | Gratis self-hosted / ~$0.59-0.90/1M via API | medium | on-premise of cloud | 128K tokens | ~48GB RAM of 2x24GB GPU
llama-3-1-8b | Llama 3.1 8B | Meta | open-source | Lichtgewicht, edge-geschikt, snel, gratis | Gratis self-hosted / ~$0.06/1M via API | fast | on-premise/edge/cloud | 128K tokens | ~6GB RAM of 1x8GB GPU
llama-3-3-70b | Llama 3.3 70B | Meta | open-source | Nieuwste Llama, sterk redeneren, on-premise geschikt | Gratis self-hosted / ~$0.59/1M via Groq | fast | on-premise of cloud | 128K tokens | ~48GB RAM of 2x24GB GPU
deepseek-r1 | DeepSeek R1 | DeepSeek | open-source | Uitstekend redeneren en wiskunde, open source, alternatieven voor o1 | Gratis self-hosted / ~$0.55/1M via API | medium | on-premise of cloud | 128K tokens | ~48GB RAM (70B variant)
qwen-2-5-72b | Qwen 2.5 72B | Alibaba | open-source | Sterk meertalig (ook Nederlands), uitstekende codering, open source | Gratis self-hosted / ~$0.35/1M via API | medium | on-premise of cloud | 128K tokens | ~48GB RAM of 2x24GB GPU
qwen-2-5-coder | Qwen 2.5 Coder 32B | Alibaba | open-source | Gespecialiseerd in code, state-of-the-art coderingsprestaties | Gratis self-hosted / ~$0.20/1M via API | medium | on-premise of cloud | 128K tokens | ~24GB GPU
gemma-2-27b | Gemma 2 27B | Google | open-source | Efficiënt, goede kwaliteit voor de grootte, door Google geoptimaliseerd | Gratis self-hosted | medium | on-premise | 8K tokens | ~20GB RAM of 1x24GB GPU
mistral-large | Mistral Large | Mistral AI | hybrid | Europese provider (GDPR), sterk meertalig, zelf-deploybaar | $3/1M in, $9/1M out | medium | EU-cloud of on-premise | 128K tokens | ~48GB RAM (self-hosted)
mistral-7b | Mistral 7B / Mixtral | Mistral AI | open-source | Open source, efficiënt, Europese oorsprong, self-deploybaar | Gratis self-hosted / ~$0.25/1M | fast | on-premise of cloud | 32K tokens | ~6GB RAM
groq | Groq (Llama/Mixtral) | Groq | cloud | Extreem snel (300+ tokens/sec), lage latency, ideaal voor real-time | $0.05-0.27/1M tokens | fast | cloud-only | 32K tokens | n.v.t.
phi-3 | Phi-3.5 Mini | Microsoft | open-source | Zeer kleine footprint (3.8B params), draait on-device, gratis | Gratis | fast | on-premise/edge | 128K tokens | ~4GB RAM of smartphone
`.trim();

interface ExtractedScenario {
  useCase: string;
  scale: string;
  latency: string;
  budget: string;
  privacy: string;
  languages: string[];
  contextWindow: string;
  description: string;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'GROQ_API_KEY is niet geconfigureerd in Vercel Environment Variables.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: { scenario: ExtractedScenario };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Ongeldig JSON verzoek' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { scenario } = body;

  const prompt = `Je bent een expert AI consultant. Analyseer het onderstaande gebruikersscenario en geef de beste AI model aanbevelingen.

Gebruikersscenario (verzameld via een discovery-gesprek):
- Use case: ${scenario.useCase}
- Schaal/volume: ${scenario.scale}
- Latency vereiste: ${scenario.latency}
- Budget: ${scenario.budget}
- Privacy/compliance: ${scenario.privacy}
- Talen: ${Array.isArray(scenario.languages) ? scenario.languages.join(', ') : scenario.languages}
- Context behoefte: ${scenario.contextWindow}

Volledige beschrijving: ${scenario.description}

${MODELS_CONTEXT}

Geef een JSON object terug met exacte structuur:
{
  "summary": "Beknopte samenvatting (2-3 zinnen) over waarom deze modellen zijn gekozen",
  "keyConsiderations": ["overweging 1", "overweging 2", "overweging 3"],
  "topThreeComparison": "Vergelijking van de top 3 in 2-3 zinnen: wanneer kies je welk en waarom",
  "decisionFactors": [
    { "factor": "Privacy vereiste", "impact": "hoog", "led_to": "Alleen EU/on-premise modellen meegenomen" }
  ],
  "recommendations": [
    {
      "modelId": "exacte id uit de lijst",
      "modelName": "naam",
      "provider": "provider",
      "rank": 1,
      "score": 9.2,
      "reasoning": "Waarom dit model past (2-3 zinnen, specifiek voor dit scenario)",
      "pros": ["voordeel 1", "voordeel 2", "voordeel 3"],
      "cons": ["nadeel 1", "nadeel 2"],
      "estimatedMonthlyCost": "~€50–€200/maand",
      "documentationUrl": "https://...",
      "type": "cloud",
      "tradeOff": "Beste keuze als X belangrijker is dan Y"
    }
  ]
}

Geef 3–5 aanbevelingen. Als privacy strikt is of on-premise vereist, geef uitsluitend open-source/zelf-hostbare modellen.
Voeg voor elke aanbeveling een tradeOff toe die uitlegt wanneer dit model de betere keuze is ten opzichte van de andere aanbevelingen.`;

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Je bent een expert AI consultant. Stuur uitsluitend geldig JSON terug zonder extra tekst of markdown.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 2048,
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error('Groq API fout:', groqRes.status, errText);
      return new Response(
        JSON.stringify({ error: `Groq API fout (${groqRes.status}). Controleer je GROQ_API_KEY.` }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const groqData = await groqRes.json() as {
      choices: Array<{ message: { content: string } }>;
    };
    const responseText = groqData.choices[0]?.message?.content ?? '{}';
    const result = JSON.parse(responseText);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Fout in recommend functie:', err);
    return new Response(
      JSON.stringify({ error: 'Er ging iets mis bij het genereren van aanbevelingen.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

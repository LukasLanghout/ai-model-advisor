import Anthropic from '@anthropic-ai/sdk';

export const config = { runtime: 'nodejs' };

const MODELS_CONTEXT = `
Beschikbare AI modellen (id | naam | provider | type | sterke punten | prijzen | latency | privacy opties | context venster):

claude-3-5-sonnet | Claude 3.5 Sonnet | Anthropic | cloud | Uitstekende redenering & analyse, sterke codering, 200K tokens context, betrouwbaar voor zakelijk gebruik, visiemogelijkheden | $3/1M input, $15/1M output | medium | cloud (Anthropic) | 200.000 tokens
claude-3-haiku | Claude 3 Haiku | Anthropic | cloud | Zeer snel en goedkoop, goed voor hoog volume, betrouwbare kwaliteit | $0.25/1M input, $1.25/1M output | fast | cloud (Anthropic) | 200.000 tokens
gpt-4o | GPT-4o | OpenAI | cloud | Sterk multimodaal, uitstekende function calling, breed ecosysteem, goede redenering | $5/1M input, $15/1M output | medium | cloud (Azure/OpenAI) | 128.000 tokens
gpt-4o-mini | GPT-4o Mini | OpenAI | cloud | Zeer goedkoop, snel, goede kwaliteit voor de kosten, function calling | $0.15/1M input, $0.60/1M output | fast | cloud (Azure/OpenAI) | 128.000 tokens
gemini-1-5-pro | Gemini 1.5 Pro | Google | cloud | Enorm 2M tokens context, multimodaal (tekst+video+audio), Google Cloud integratie | $3.50/1M input, $10.50/1M output | medium | cloud (Google Cloud) | 2.000.000 tokens
gemini-1-5-flash | Gemini 1.5 Flash | Google | cloud | Zeer snel, goedkoop, groot context (1M tokens), goed multimodaal | $0.075/1M input, $0.30/1M output | fast | cloud (Google Cloud) | 1.000.000 tokens
llama-3-1-70b | Llama 3.1 70B | Meta (open source) | open-source | Volledig open source, on-premise draaibaar, geen per-token kosten, sterke prestaties, privacyvriendelijk | Gratis (self-hosted) of ~$0.59-0.90/1M via API's | medium | on-premise, cloud (diverse) | 128.000 tokens
llama-3-1-8b | Llama 3.1 8B | Meta (open source) | open-source | Zeer lichtgewicht, draait op bescheiden hardware, gratis, snelle inferentie, edge/mobiel mogelijk | Gratis (self-hosted) of ~$0.06/1M via API's | fast | on-premise, cloud, edge | 128.000 tokens
mistral-large | Mistral Large | Mistral AI | hybrid | Europese provider (GDPR vriendelijk), sterk meertalig, zelf-deploybaar, goede redenering | $3/1M input, $9/1M output | medium | cloud (EU), on-premise | 128.000 tokens
mistral-7b | Mistral 7B / Mixtral | Mistral AI | open-source | Open source, efficiënt, Europese oorsprong, zelf-deploybaar | Gratis (self-hosted) of ~$0.25/1M | fast | on-premise, cloud | 32.000 tokens
groq | Groq (Llama/Mixtral) | Groq | cloud | Extreem snel (100+ tokens/sec), lage latency, betaalbare prijzen, ideaal voor real-time apps | $0.05-0.27/1M tokens | fast | cloud (Groq) | 32.000 tokens
phi-3 | Phi-3 Mini/Medium | Microsoft | open-source | Zeer kleine footprint, draait on-device, goede kwaliteit voor de grootte, gratis | Gratis (open source) | fast | on-premise, edge/mobiel | 4.000-128.000 tokens
`.trim();

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY is niet geconfigureerd.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { scenario: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Ongeldig JSON verzoek' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { scenario } = body;

  const useCaseLabels: Record<string, string> = {
    'text-language': 'Tekst & taalverwerking (chatbot, samenvatting, vertaling, schrijven)',
    'code-development': 'Code & development (code genereren, review, debugging)',
    'data-analysis': 'Data-analyse & inzichten (analyse, gestructureerde data, rapporten)',
    'image-vision': 'Beeld & vision (afbeelding classificatie, OCR, visuele analyse)',
    'automation-agents': 'Automatisering & agents (multi-step taken, workflows)',
    other: 'Overig / niet-gespecificeerd',
  };
  const scaleLabels: Record<string, string> = {
    prototype: '< 100 requests/dag (prototype)',
    small: '100–1.000 requests/dag (kleine app)',
    medium: '1.000–10.000 requests/dag (middelgrote app)',
    large: '10.000–100.000 requests/dag (grote app)',
    enterprise: '> 100.000 requests/dag (enterprise schaal)',
  };
  const latencyLabels: Record<string, string> = {
    realtime: 'Real-time (< 1 seconde, live chat, autocomplete)',
    interactive: 'Interactief (1–5 seconden, conversaties)',
    batch: 'Batch (5–30 seconden, rapporten, analyses)',
    async: 'Asynchroon (minuten/uren, achtergrondverwerking)',
  };
  const budgetLabels: Record<string, string> = {
    hobby: '< €50/maand',
    small: '€50–€500/maand',
    medium: '€500–€5.000/maand',
    large: '> €5.000/maand',
    'self-hosted': 'Voorkeur self-hosted (kosten voor eigen hardware)',
  };
  const privacyLabels: Record<string, string> = {
    open: 'Geen beperkingen (openbare data, cloud is prima)',
    business: 'Zakelijk gevoelig (cloud ok met verwerkersovereenkomst)',
    sensitive: 'Sterk gevoelig (EU-cloud vereist)',
    confidential: 'Strikt vertrouwelijk (alleen on-premise)',
  };
  const integrationLabels: Record<string, string> = {
    api: 'REST API (standaard cloud-integratie)',
    'on-premise': 'On-premise (eigen servers)',
    edge: 'Edge / mobiel (lichtgewicht, offline)',
    hybrid: 'Hybride (mix van cloud en lokaal)',
  };

  const prompt = `Je bent een expert AI consultant. Een bedrijf of developer heeft hun use case beschreven. Geef de beste AI model aanbevelingen gebaseerd op hun situatie.

Gebruikersscenario:
- Use case: ${useCaseLabels[scenario.useCase] ?? scenario.useCase}
- Schaal: ${scaleLabels[scenario.scale] ?? scenario.scale}
- Latency vereisten: ${latencyLabels[scenario.latency] ?? scenario.latency}
- Maandbudget: ${budgetLabels[scenario.budget] ?? scenario.budget}
- Privacy vereisten: ${privacyLabels[scenario.privacy] ?? scenario.privacy}
- Integratie voorkeur: ${integrationLabels[scenario.integration] ?? scenario.integration}

${MODELS_CONTEXT}

Analyseer dit scenario zorgvuldig en geef gestructureerde aanbevelingen. Stuur ALLEEN een geldig JSON object terug — geen markdown, geen uitleg buiten het JSON object:

{
  "summary": "Korte samenvatting van de aanbeveling in 2-3 zinnen",
  "keyConsiderations": ["overweging 1", "overweging 2", "overweging 3"],
  "recommendations": [
    {
      "modelId": "exacte id uit de lijst hierboven",
      "modelName": "Model naam",
      "provider": "Provider naam",
      "rank": 1,
      "score": 9.2,
      "reasoning": "Waarom dit model het beste past bij dit scenario (2-3 zinnen)",
      "pros": ["voordeel 1", "voordeel 2", "voordeel 3"],
      "cons": ["nadeel 1", "nadeel 2"],
      "estimatedMonthlyCost": "~€50–€200/maand",
      "documentationUrl": "https://...",
      "type": "cloud"
    }
  ]
}

Geef 3–5 gerangschikte aanbevelingen. Rangschik op de beste match met het opgegeven scenario. Wees specifiek en praktisch — vermijd generieke antwoorden.`;

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Geen geldig JSON gevonden in antwoord');

    const result = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Claude API fout:', err);
    return new Response(
      JSON.stringify({ error: 'Aanbevelingen genereren mislukt. Controleer je API key.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

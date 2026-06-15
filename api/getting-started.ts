export const config = { runtime: 'edge' };

interface GettingStartedRequest {
  modelId: string;
  modelName: string;
  provider: string;
  type: 'cloud' | 'open-source' | 'hybrid';
  useCase: string;
  scenario: string;
}

const PROVIDER_API_INFO: Record<string, { steps: string[]; url: string }> = {
  'OpenAI': {
    url: 'https://platform.openai.com/api-keys',
    steps: [
      'Ga naar platform.openai.com en maak een gratis account aan',
      'Klik rechtsboven op je profielfoto → kies "API keys"',
      'Klik op "Create new secret key", geef het een naam en kopieer de sleutel (begint met sk-…)',
      'De sleutel wordt maar éénmalig getoond — sla hem direct op in een wachtwoordmanager',
      'Voeg een betaalmethode toe via "Billing" als je meer dan het starttegoed wilt gebruiken',
    ],
  },
  'Anthropic': {
    url: 'https://console.anthropic.com/settings/keys',
    steps: [
      'Ga naar console.anthropic.com en maak een account aan',
      'Navigeer naar "API Keys" in het linkermenu',
      'Klik op "Create Key", geef het een naam en bevestig',
      'Kopieer de sleutel (begint met sk-ant-…) — deze zie je maar één keer',
      'Koop credits via "Billing" om de API te gebruiken (geen gratis tier)',
    ],
  },
  'Google': {
    url: 'https://aistudio.google.com/apikey',
    steps: [
      'Ga naar aistudio.google.com en log in met je Google-account',
      'Klik bovenaan op "Get API key" → "Create API key in new project"',
      'Kopieer de API key die verschijnt',
      'Gratis tier beschikbaar via Google AI Studio (Gemini Flash is gratis)',
      'Voor productie via Vertex AI: activeer de Vertex AI API in Google Cloud Console',
    ],
  },
  'Groq': {
    url: 'https://console.groq.com/keys',
    steps: [
      'Ga naar console.groq.com en maak een gratis account aan (geen betaalgegevens nodig)',
      'Klik in het linkermenu op "API Keys"',
      'Klik op "Create API Key", geef het een naam en kopieer de sleutel (begint met gsk_…)',
      'Gratis tier: 30 verzoeken/minuut op Llama 3.3 70B — meer dan genoeg om te beginnen',
      'Klaar! Geen creditcard vereist voor de gratis tier',
    ],
  },
  'Mistral AI': {
    url: 'https://console.mistral.ai/api-keys',
    steps: [
      'Ga naar console.mistral.ai en maak een account aan',
      'Navigeer naar "API Keys" in het linkermenu',
      'Klik op "Create new key", geef het een naam en kopieer de sleutel',
      'Voeg minimaal €5 credits toe via "Billing" om de Mistral API te gebruiken',
      'Self-hosting is gratis: download het model via Hugging Face en host het lokaal',
    ],
  },
  'HuggingFace': {
    url: 'https://huggingface.co/settings/tokens',
    steps: [
      'Ga naar huggingface.co en maak een gratis account aan',
      'Klik op je profielfoto rechts → "Settings" → "Access Tokens"',
      'Klik op "New token", kies rol "Read" (of "Write" als je modellen wilt uploaden)',
      'Geef het een naam, klik op "Generate" en kopieer de token (begint met hf_…)',
      'Gratis tier beschikbaar voor veel modellen via de Inference API!',
    ],
  },
  'Black Forest Labs': {
    url: 'https://huggingface.co/settings/tokens',
    steps: [
      'FLUX-modellen zijn beschikbaar via HuggingFace — maak daar een gratis account aan',
      'Ga naar huggingface.co → profielfoto → "Settings" → "Access Tokens"',
      'Klik op "New token", kies rol "Read" en kopieer de token (begint met hf_…)',
      'Ga naar huggingface.co/black-forest-labs/FLUX.1-schnell en klik "Agree and access"',
      'Gratis tier: je kunt direct via de Inference API genereren!',
    ],
  },
  'Stability AI': {
    url: 'https://huggingface.co/settings/tokens',
    steps: [
      'Stable Diffusion is via HuggingFace beschikbaar — maak een gratis account aan',
      'Ga naar huggingface.co → profielfoto → "Settings" → "Access Tokens"',
      'Klik op "New token", kies "Read" en kopieer de token (begint met hf_…)',
      'Accepteer de licentie via de model-pagina op HuggingFace',
      'Gebruik de Inference API of download het model voor lokale gebruik',
    ],
  },
  'Midjourney': {
    url: 'https://www.midjourney.com',
    steps: [
      'Ga naar midjourney.com en klik op "Sign In" — je logt in via je Discord-account',
      'Koop een abonnement via midjourney.com/account (Basic: $10/maand)',
      'Ga naar discord.com en join de Midjourney Discord server',
      'Gebruik in een #newbies kanaal het commando: /imagine prompt: [jouw beschrijving]',
      'Optioneel: gebruik de Midjourney web interface op midjourney.com/app',
    ],
  },
  'Meta': {
    url: 'https://huggingface.co/settings/tokens',
    steps: [
      'Llama-modellen zijn gratis te downloaden via HuggingFace of Meta AI',
      'Ga naar huggingface.co en maak een account aan',
      'Bezoek huggingface.co/meta-llama en accepteer de licentieovereenkomst',
      'Download via Hugging Face CLI of gebruik Ollama (aanbevolen voor lokaal gebruik)',
      'Alternatief: gebruik Groq voor razendsnel Llama via de cloud (gratis tier beschikbaar)',
    ],
  },
  'Microsoft': {
    url: 'https://huggingface.co/settings/tokens',
    steps: [
      'Phi-modellen zijn gratis beschikbaar via HuggingFace',
      'Maak een account aan op huggingface.co',
      'Ga naar "Settings" → "Access Tokens" → "New token" (rol: Read)',
      'Download het model via HuggingFace CLI of gebruik Ollama',
      'Aanbevolen voor lokaal: ollama pull phi4 (of phi3)',
    ],
  },
};

const OLLAMA_MODEL_MAP: Record<string, string> = {
  'llama-3.2-1b': 'llama3.2:1b',
  'llama-3.2-3b': 'llama3.2:3b',
  'llama-3-1-8b': 'llama3.1:8b',
  'llama-3-1-70b': 'llama3.1:70b',
  'llama-3-3-70b': 'llama3.3',
  'llama-3.2-11b-vision': 'llama3.2-vision',
  'mistral-7b': 'mistral',
  'mistral-small-24b': 'mistral-small',
  'mistral-nemo-12b': 'mistral-nemo',
  'mixtral-8x22b': 'mixtral',
  'gemma-3-1b': 'gemma3:1b',
  'gemma-2-2b': 'gemma2:2b',
  'gemma-3-4b': 'gemma3:4b',
  'gemma-2-9b': 'gemma2:9b',
  'gemma-3-12b': 'gemma3:12b',
  'gemma-3-27b': 'gemma3:27b',
  'phi-3': 'phi3',
  'phi-4': 'phi4',
  'phi-4-mini': 'phi4-mini',
  'qwen3-8b': 'qwen3:8b',
  'qwen3-14b': 'qwen3:14b',
  'qwen3-32b': 'qwen3:32b',
  'deepseek-r1-7b': 'deepseek-r1:7b',
  'deepseek-r1-32b': 'deepseek-r1:32b',
  'codellama-7b': 'codellama:7b',
  'codellama-13b': 'codellama:13b',
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GROQ_API_KEY niet geconfigureerd' }), { status: 500 });
  }

  const { modelId, modelName, provider, type, useCase, scenario } =
    await request.json() as GettingStartedRequest;

  // Static provider info
  const providerInfo = PROVIDER_API_INFO[provider] ?? PROVIDER_API_INFO['HuggingFace'];
  const ollamaModel = OLLAMA_MODEL_MAP[modelId];
  const isOpenSource = type === 'open-source';

  const localSetupSteps = isOpenSource && ollamaModel
    ? [
        'Download en installeer Ollama op ollama.ai (gratis, voor Windows/Mac/Linux)',
        `Open een terminal en voer uit: ollama pull ${ollamaModel}`,
        `Start de interactieve chat: ollama run ${ollamaModel}`,
        'Of gebruik via de lokale REST API: POST naar http://localhost:11434/api/generate',
        'Voordeel: volledig lokaal, geen internettoegang of API-key nodig!',
      ]
    : undefined;

  const prompt = `Je bent een AI-expert die een beginner helpt aan de slag te gaan met ${modelName} (van ${provider}).
De gebruiker wil het model inzetten voor: ${useCase}.
Context van het scenario: ${scenario}

Genereer UITSLUITEND geldig JSON in dit exacte formaat:
{
  "starterPrompt": "Een kant-en-klare Nederlandse systeemprompt van 3-5 zinnen die de gebruiker direct kan gebruiken voor hun specifieke use case. Maak het concreet en praktisch, niet generiek.",
  "quickStartCode": "Een minimaal maar werkend Python-codeblok (max 25 regels) dat laat zien hoe je ${modelName} aanspreekt via de API. Gebruik de juiste library/endpoint voor ${provider}. Voeg commentaar toe in het Nederlands. Gebruik 'YOUR_API_KEY' als placeholder.",
  "firstTestPrompt": "Een korte, concrete eerste zin of vraag die de gebruiker als eerste kan insturen om de kracht van het model te ervaren voor hun use case. Max 2 zinnen."
}

Regels:
- Schrijf alle tekst in het Nederlands (code-commentaar ook)
- De starterPrompt moet écht specifiek zijn voor de use case, niet generiek
- De code moet werken met de juiste Python library: ${
    provider === 'OpenAI' ? 'openai (pip install openai)' :
    provider === 'Anthropic' ? 'anthropic (pip install anthropic)' :
    provider === 'Google' ? 'google-generativeai (pip install google-generativeai)' :
    provider === 'Groq' ? 'groq (pip install groq)' :
    provider === 'Mistral AI' ? 'mistralai (pip install mistralai)' :
    'requests (standaard beschikbaar)'
  }`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1200,
      temperature: 0.4,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: res.status === 429 ? 'Te veel verzoeken — wacht even en probeer opnieuw.' : `Groq fout (${res.status})` }),
      { status: res.status === 429 ? 429 : 502 },
    );
  }

  const data = await res.json() as { choices: Array<{ message: { content: string } }> };
  const aiResult = JSON.parse(data.choices[0]?.message?.content ?? '{}') as {
    starterPrompt: string;
    quickStartCode: string;
    firstTestPrompt: string;
  };

  return new Response(
    JSON.stringify({
      starterPrompt: aiResult.starterPrompt ?? '',
      quickStartCode: aiResult.quickStartCode ?? '',
      firstTestPrompt: aiResult.firstTestPrompt ?? '',
      apiKeySteps: providerInfo.steps,
      apiKeyUrl: providerInfo.url,
      localSetupSteps,
      ollamaModelName: ollamaModel,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
}

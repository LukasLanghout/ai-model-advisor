export const config = { runtime: 'edge' };

// 106-model context — sourced from llmfit (github.com/AlexsJones/llmfit) + public pricing
// Format: id | naam | params | context | sterke punten | kosten/tier | VRAM self-host | privacy
const MODELS_CONTEXT = `
=== CLOUD-ONLY MODELLEN (geen self-hosting mogelijk) ===
claude-3-5-sonnet | Claude 3.5 Sonnet | ~200B | 200K | Uitstekend redeneren+codering, betrouwbaar zakelijk | $3/$15 per 1M | n.v.t. | yellow (VS, DPA)
claude-3-haiku | Claude 3 Haiku | ~20B | 200K | Snel, goedkoop, hoog volume, vision | $0.25/$1.25 per 1M | n.v.t. | yellow (VS, DPA)
gpt-4o | GPT-4o | ~200B | 128K | Sterk multimodaal, function calling, breed ecosysteem | $5/$15 per 1M | n.v.t. | yellow (VS, Azure EU optie)
gpt-4o-mini | GPT-4o Mini | ~8B | 128K | Goedkoop, snel, function calling, hoog volume | $0.15/$0.60 per 1M | n.v.t. | yellow (VS, Azure EU optie)
gemini-1-5-pro | Gemini 1.5 Pro | ~340B | 2M | Mega context (2M!), multimodaal incl. video | $3.50/$10.50 per 1M | n.v.t. | yellow (VS, Vertex AI EU optie)
gemini-1-5-flash | Gemini 1.5 Flash | ~7B | 1M | Snel, goedkoop, 1M context | $0.075/$0.30 per 1M | n.v.t. | yellow
groq | Groq API | diverse | 32K | Extreem snel (300+ t/s), real-time, lage latency | $0.06-$0.59 per 1M | n.v.t. | yellow (VS)

=== MISTRAL AI — Europese provider (beste GDPR cloud-optie) ===
mistral-large | Mistral Large 123B | 123B | 128K | Sterk redeneren, EU-cloud, meertalig | $3/$9 per 1M | ~70GB | green (EU)
mistral-small-3.1 | Mistral Small 3.1 24B | 24B | 128K | Multimodaal+vision, EU, self-host | gratis self-hosted / goedkoop API | ~16GB | green (EU)
mistral-small-24b | Mistral Small 24B | 24B | 32K | Balanced, EU-compliant, self-host | gratis self-hosted | ~16GB | green (EU)
mistral-nemo-12b | Mistral Nemo 12B | 12.2B | 128K | Lichtgewicht EU-model, lange context | gratis self-hosted | ~8GB | green (EU)
ministral-8b | Ministral 8B | 8B | 32K | Snel EU-model voor edge/API | gratis self-hosted | ~6GB | green (EU)
mistral-7b | Mistral 7B / Mixtral 8x7B | 7-46B | 32K | Open source EU, snel, self-hostbaar | gratis self-hosted | ~5-27GB | green (EU)
mixtral-8x22b | Mixtral 8x22B MoE | 140B (MoE) | 64K | Groot EU MoE-model, krachtig | gratis self-hosted | ~80GB | green (EU)

=== META LLAMA — Open source, self-hostbaar (VS) ===
llama-3.2-1b | Llama 3.2 1B | 1.2B | 4K | Edge/mobiel, ultra licht | gratis self-hosted | ~1GB | green
llama-3.2-3b | Llama 3.2 3B | 3.2B | 4K | Licht, mobiel geschikt | gratis self-hosted | ~2GB | green
llama-3-1-8b | Llama 3.1 8B | 8B | 128K | Snel, instruct, beste 8B | gratis self-hosted / $0.05 Groq | ~6GB | green
llama-3.2-11b-vision | Llama 3.2 11B Vision | 10.7B | 4K | Vision + tekst, multimodaal | gratis self-hosted | ~8GB | green
llama-3-1-70b | Llama 3.1 70B | 70.6B | 128K | Krachtig, on-premise, algemeen | gratis self-hosted / $0.59 Groq | ~48GB | green
llama-3-3-70b | Llama 3.3 70B | 70.6B | 128K | Beste open 70B, state-of-the-art redeneren | gratis self-hosted / $0.59 Groq | ~48GB | green
llama-3.1-405b | Llama 3.1 405B | 405.9B | 128K | Maximale kwaliteit, enterprise self-hosted | gratis self-hosted | ~250GB | green
llama-4-scout | Llama 4 Scout 17B-16E | 109B (MoE) | 10M | 10M context, multimodaal, MoE efficiënt | gratis self-hosted | ~80GB | green
llama-4-maverick | Llama 4 Maverick 17B-128E | 400B (MoE) | 1M | State-of-the-art, multimodaal, enorm context | gratis self-hosted | ~250GB | green
codellama-7b | Code Llama 7B | 6.7B | 4K | Code generatie, licht | gratis self-hosted | ~5GB | green
codellama-13b | Code Llama 13B | 13B | 4K | Code, balanced | gratis self-hosted | ~9GB | green
codellama-34b | Code Llama 34B | 33.7B | 4K | Code, krachtig | gratis self-hosted | ~20GB | green

=== GOOGLE GEMMA — Open source, self-hostbaar (VS) ===
gemma-3-1b | Gemma 3 1B | 1B | 32K | Ultra licht, edge | gratis self-hosted | ~1GB | green
gemma-2-2b | Gemma 2 2B | 2.6B | 4K | Licht, efficiënt | gratis self-hosted | ~2GB | green
gemma-3-4b | Gemma 3 4B | 4B | 128K | Licht + lange context | gratis self-hosted | ~3GB | green
gemma-2-9b | Gemma 2 9B | 9.2B | 4K | Goede kwaliteit voor de grootte | gratis self-hosted | ~6GB | green
gemma-3-12b | Gemma 3 12B | 12B | 128K | Multimodaal vision + tekst | gratis self-hosted | ~8GB | green
gemma-3-27b | Gemma 3 27B | 27B | 128K | Krachtig, vision, lange context | gratis self-hosted | ~18GB | green
gemma-2-27b | Gemma 2 27B | 27.2B | 4K | Bewezen kwaliteit | gratis self-hosted | ~18GB | green

=== MICROSOFT PHI — Open source, edge-geoptimaliseerd (VS) ===
phi-3 | Phi-3.5 Mini 3.8B | 3.8B | 128K | On-device/edge, ultra licht, gratis | gratis | ~3GB | green
phi-4-mini | Phi-4 Mini 3.8B | 3.8B | 128K | Nieuwe generatie edge-model | gratis self-hosted | ~3GB | green
phi-4 | Phi-4 14B | 14B | 16K | Redeneren, STEM, codering | gratis self-hosted | ~9GB | green
phi-3-medium | Phi-3 Medium 14B | 14B | 4K | Balanced redeneren | gratis self-hosted | ~9GB | green
orca-2-7b | Orca 2 7B | 7B | 4K | Stap-voor-stap redeneren | gratis self-hosted | ~5GB | green
orca-2-13b | Orca 2 13B | 13B | 4K | Stap-voor-stap redeneren, groter | gratis self-hosted | ~9GB | green

=== IBM GRANITE — Open source enterprise (VS) ===
granite-4-micro | Granite 4.0 Micro 3B | 3B | 128K | Enterprise edge, hybrid Mamba/transformer | gratis self-hosted | ~2GB | green
granite-4-tiny-moe | Granite 4.0 Tiny 7B MoE | 7B (MoE) | 128K | Enterprise efficiënt, MoE | gratis self-hosted | ~5GB | green
granite-3.1-8b | Granite 3.1 8B | 8.1B | 128K | Enterprise instructie, veilig | gratis self-hosted | ~6GB | green
granite-4-small-moe | Granite 4.0 Small 32B MoE | 32B (MoE) | 128K | Enterprise krachtig, MoE | gratis self-hosted | ~20GB | green

=== ALIBABA QWEN — Self-hosted aanbevolen voor GDPR! (Chinees bedrijf) ===
qwen3-0.6b | Qwen3 0.6B | 600M | 40K | Ultra licht, edge | gratis self-hosted | ~1GB | yellow/red cloud
qwen3-1.7b | Qwen3 1.7B | 1.7B | 40K | Licht, edge | gratis self-hosted | ~1.5GB | yellow/red cloud
qwen2.5-coder-1.5b | Qwen2.5 Coder 1.5B | 1.5B | 32K | Code, licht | gratis self-hosted | ~1.5GB | yellow/red cloud
qwen3.5-2b | Qwen3.5 2B | 2.3B | 256K | Multimodaal, vision | gratis self-hosted | ~2GB | yellow/red cloud
qwen2.5-vl-3b | Qwen2.5-VL 3B | 3.8B | 32K | Vision/multimodaal | gratis self-hosted | ~3GB | yellow/red cloud
qwen3-4b | Qwen3 4B | 4B | 40K | Algemeen, balanced | gratis self-hosted | ~3GB | yellow/red cloud
qwen3.5-4b | Qwen3.5 4B | 4.7B | 256K | Multimodaal, vision | gratis self-hosted | ~4GB | yellow/red cloud
qwen2.5-7b | Qwen2.5 7B | 7.6B | 32K | Instruct, meertalig | gratis self-hosted | ~6GB | yellow/red cloud
qwen2.5-coder-7b | Qwen2.5 Coder 7B | 7.6B | 32K | Code, balanced | gratis self-hosted | ~6GB | yellow/red cloud
qwen3-8b | Qwen3 8B | 8.2B | 40K | Redeneren, algemeen | gratis self-hosted | ~6GB | yellow/red cloud
qwen2.5-vl-7b | Qwen2.5-VL 7B | 8.3B | 32K | Vision, multimodaal | gratis self-hosted | ~6GB | yellow/red cloud
qwen3.5-9b | Qwen3.5 9B | 9.7B | 256K | Multimodaal, lange context | gratis self-hosted | ~7GB | yellow/red cloud
qwen2.5-14b | Qwen2.5 14B | 14.8B | 128K | Krachtig, meertalig | gratis self-hosted | ~10GB | yellow/red cloud
qwen3-14b | Qwen3 14B | 14.8B | 128K | Redeneren, algemeen | gratis self-hosted | ~10GB | yellow/red cloud
qwen2.5-coder-14b | Qwen2.5 Coder 14B | 14.8B | 32K | Code, krachtig | gratis self-hosted | ~10GB | yellow/red cloud
qwen3.5-27b | Qwen3.5 27B | 27.8B | 256K | Multimodaal, krachtig | gratis self-hosted | ~18GB | yellow/red cloud
qwen2.5-32b | Qwen2.5 32B | 32.5B | 128K | Krachtig instruct | gratis self-hosted | ~20GB | yellow/red cloud
qwen3-32b | Qwen3 32B | 32.8B | 40K | Redeneren, sterk | gratis self-hosted | ~20GB | yellow/red cloud
qwen3-30b-moe | Qwen3 30B-A3B MoE | 30.5B (MoE) | 40K | Efficiënt MoE, algemeen | gratis self-hosted | ~20GB | yellow/red cloud
qwen3.5-35b-moe | Qwen3.5 35B-A3B MoE | 36B (MoE) | 256K | Multimodaal MoE | gratis self-hosted | ~22GB | yellow/red cloud
qwen-2-5-72b | Qwen2.5 72B | 72.7B | 32K | Sterk meertalig, krachtig | $0.35/$0.40 per 1M / gratis self-hosted | ~48GB | yellow
qwen-2-5-coder | Qwen2.5 Coder 32B | 32.8B | 32K | State-of-the-art code | $0.20/$0.20 per 1M / gratis self-hosted | ~20GB | yellow
qwen3.5-122b-moe | Qwen3.5 122B-A10B MoE | 125B (MoE) | 256K | Multimodaal, krachtig MoE | gratis self-hosted | ~80GB | yellow/red cloud
qwen3-235b-moe | Qwen3 235B-A22B MoE | 235B (MoE) | 40K | State-of-the-art MoE | gratis self-hosted | ~130GB | yellow/red cloud
qwen3.5-397b-moe | Qwen3.5 397B-A17B MoE | 403B (MoE) | 256K | Ultra krachtig, multimodaal | gratis self-hosted | ~220GB | yellow/red cloud
qwen3-coder-480b | Qwen3 Coder 480B MoE | 480B (MoE) | 256K | Code, state-of-the-art, MoE | gratis self-hosted | ~265GB | yellow/red cloud

=== DEEPSEEK — Self-hosted VERPLICHT voor GDPR (Chinees bedrijf) ===
deepseek-r1-7b | DeepSeek-R1 Distill 7B | 7.6B | 128K | Redeneren, licht, chain-of-thought | gratis self-hosted | ~6GB | red cloud / green self-host
deepseek-coder-v2-16b | DeepSeek Coder V2 Lite 16B | 16B (MoE) | 128K | Code MoE, efficiënt | gratis self-hosted | ~12GB | red cloud / green self-host
deepseek-r1-32b | DeepSeek-R1 Distill 32B | 32.8B | 128K | Redeneren, krachtig | gratis self-hosted | ~20GB | red cloud / green self-host
deepseek-r1 | DeepSeek R1 671B | 671B (MoE) | 128K | Beste redeneren+wiskunde, o1-alternatief | gratis self-hosted | ~370GB | red cloud / green self-host
deepseek-v3 | DeepSeek V3 685B | 685B (MoE) | 128K | State-of-the-art MoE, algemeen | gratis self-hosted | ~380GB | red cloud / green self-host

=== OVERIGE OPEN SOURCE MODELLEN ===
yi-6b-chat | Yi 6B Chat (01.ai) | 6.1B | 4K | Chat, meertalig | gratis self-hosted | ~5GB | yellow (US-China)
yi-34b-chat | Yi 34B Chat (01.ai) | 34.4B | 4K | Krachtige chat, meertalig | gratis self-hosted | ~20GB | yellow (US-China)
olmo2-32b | OLMo 2 32B | 32B | 4K | Volledig transparant open source | gratis self-hosted | ~20GB | green
ling-lite-16b | Ling Lite 16B MoE (Ant) | 16.8B (MoE) | 128K | MoE efficiënt | gratis self-hosted | ~12GB | yellow (China)
bge-large-en | BGE Large EN (embedding) | 335M | 512 | RAG embeddings, vector search | gratis self-hosted | <1GB | green
ernie-4.5-300b | ERNIE 4.5 300B MoE (Baidu) | 300B (MoE) | 128K | Meertalig, redeneren | gratis self-hosted | ~170GB | red (China staat)
starcoder2-7b | StarCoder2 7B | 7.2B | 16K | Code, 600+ talen | gratis self-hosted | ~5GB | green
starcoder2-15b | StarCoder2 15B | 15.7B | 16K | Code, krachtig | gratis self-hosted | ~10GB | green
bloom-176b | BLOOM 176B | 176B | 2K | Sterk meertalig (46 talen), volledig open | gratis self-hosted | ~100GB | green
command-r-35b | Cohere Command R 35B | 35B | 128K | RAG specialist, tool use, agents | $0.50/$1.50 per 1M / gratis self-hosted | ~22GB | yellow (Canada)
tinyllama-1.1b | TinyLlama 1.1B | 1.1B | 2K | Ultra licht, mobiel/edge | gratis self-hosted | ~1GB | green
zephyr-7b | Zephyr 7B | 7.2B | 32K | Chat, instruct, HuggingFace fine-tune | gratis self-hosted | ~5GB | green
vicuna-7b | Vicuna 7B | 7B | 4K | Chat, Llama fine-tune | gratis self-hosted | ~5GB | green
vicuna-13b | Vicuna 13B | 13B | 4K | Chat, krachtig | gratis self-hosted | ~9GB | green
longcat-flash-560b | LongCat Flash 560B MoE (Meituan) | 560B (MoE) | 512K | Ultra lange context, MoE | gratis self-hosted | ~310GB | red (China)
kimi-k2 | Kimi K2 1T MoE (Moonshot) | 1000B (MoE) | 128K | Redeneren, MoE, state-of-the-art | gratis self-hosted | ~550GB | red (China)
nomic-embed | Nomic Embed Text (embedding) | 137M | 8K | RAG embeddings, vector search | gratis self-hosted | <1GB | green
nous-hermes-2-mixtral | Nous Hermes 2 Mixtral | 46.7B (MoE) | 32K | Algemeen, chat, Mixtral fine-tune | gratis self-hosted | ~27GB | green
openchat-3.5 | OpenChat 3.5 | 7B | 8K | Chat, instruct | gratis self-hosted | ~5GB | green
dots-llm1-142b | Dots LLM1 142B MoE (Rednote) | 142B (MoE) | 128K | MoE, algemeen | gratis self-hosted | ~80GB | red (China)
stablelm-2-1.6b | StableLM 2 1.6B | 1.6B | 4K | Ultra licht, edge | gratis self-hosted | ~1.5GB | green
falcon-7b | Falcon 7B (TII) | 7.2B | 4K | Instruct, meertalig | gratis self-hosted | ~5GB | green
falcon3-7b | Falcon3 7B (TII) | 7.5B | 32K | Nieuwere Falcon, instruct | gratis self-hosted | ~5GB | green
falcon3-10b | Falcon3 10B (TII) | 10.3B | 32K | Balanced, instruct | gratis self-hosted | ~7GB | green
falcon-40b | Falcon 40B (TII) | 40B | 2K | Krachtig, instruct | gratis self-hosted | ~25GB | green
falcon-180b | Falcon 180B (TII) | 180B | 2K | Large-scale, instruct | gratis self-hosted | ~100GB | green
solar-10.7b | SOLAR 10.7B (Upstage) | 10.7B | 4K | Hoge kwaliteit instruct | gratis self-hosted | ~7GB | green
wizardlm-13b | WizardLM 13B | 13B | 4K | Instructie, chat | gratis self-hosted | ~9GB | green
wizardcoder-15b | WizardCoder 15B | 15.5B | 8K | Code, instruct | gratis self-hosted | ~10GB | green
grok-1 | Grok-1 314B MoE (xAI) | 314B (MoE) | 8K | MoE, algemeen, open weights | gratis self-hosted | ~180GB | yellow (VS)
glm-4-9b | GLM-4 9B (Zhipu AI) | 9B | 128K | Meertalig, Chinees, instruct | gratis self-hosted | ~6GB | red (China)
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

  const prompt = `Je bent een expert AI consultant. Analyseer het onderstaande gebruikersscenario en geef de beste AI model aanbevelingen uit de gegeven database van 106 modellen.

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

Selectieregels:
- Bij privacy "on-premise/strikt": ALLEEN modellen met "green" privacy (self-hosted EU/US open source of Mistral EU)
- Bij privacyrisico Chinese modellen: vermeld dat self-hosting verplicht is voor GDPR
- Bij budget "hobby/klein": prioriteer gratis self-hosted of goedkope cloud
- Bij latency "real-time": prioriteer groq, kleine modellen, of Mistral-snel
- Bij Nederlandse taal: voorkeur voor gpt-4o, Qwen2.5 (self-hosted), BLOOM, Mistral
- Bij code: voorkeur voor qwen-2-5-coder, codellama, starcoder2, deepseek-coder, phi-4
- Bij RAG/embeddings: overweeg bge-large-en of nomic-embed als aanvulling
- Bij MoE-modellen: vermeld dat MoE efficient is maar meer RAM nodig heeft dan params suggereert

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
      "modelId": "exacte id uit de lijst hierboven",
      "modelName": "naam",
      "provider": "provider",
      "rank": 1,
      "score": 9.2,
      "reasoning": "Waarom dit model past (2-3 zinnen, specifiek voor dit scenario)",
      "pros": ["voordeel 1", "voordeel 2", "voordeel 3"],
      "cons": ["nadeel 1", "nadeel 2"],
      "estimatedMonthlyCost": "~€0 (self-hosted) of ~€50–€200/maand",
      "documentationUrl": "https://...",
      "type": "cloud",
      "tradeOff": "Beste keuze als X belangrijker is dan Y"
    }
  ]
}

Geef 3–5 aanbevelingen, inclusief ten minste één budgetvriendelijke optie als het budget niet unlimited is.`;

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

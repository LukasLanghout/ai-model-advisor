export type GdprLevel = 'green' | 'yellow' | 'red';
export type TrainingPolicy = 'no' | 'opt-out' | 'yes' | 'unknown';
export type LockInLevel = 'low' | 'medium' | 'high';
export type DutchQuality = 'excellent' | 'good' | 'fair' | 'basic';

export interface ModelCompliance {
  gdpr: GdprLevel;
  gdprNote: string;
  dataResidency: string;
  trainingOnPrompts: TrainingPolicy;
  trainingNote: string;
  vendorLockIn: LockInLevel;
  dpaAvailable: boolean;
  dutchQuality: DutchQuality;
  openSource: boolean;
  certifications: string[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const EU_OPEN_SOURCE = (dutchQuality: DutchQuality = 'fair'): ModelCompliance => ({
  gdpr: 'green', gdprNote: 'EU-bedrijf (Mistral AI, Frankrijk). Zowel cloud als self-hosted voldoen aan GDPR.',
  dataResidency: 'Europa (zelf te bepalen bij self-hosting)',
  trainingOnPrompts: 'no', trainingNote: 'API: geen training op jouw data. Self-hosted: geen externe dataoverdracht.',
  vendorLockIn: 'low', dpaAvailable: true, dutchQuality, openSource: true, certifications: ['ISO 27001'],
});

const US_OPEN_SOURCE = (dutchQuality: DutchQuality = 'good'): ModelCompliance => ({
  gdpr: 'green', gdprNote: 'Open source, volledig self-hostbaar. Geen data verlaat jouw infrastructuur bij self-hosting.',
  dataResidency: 'Volledig zelf te bepalen',
  trainingOnPrompts: 'no', trainingNote: 'Self-hosted: geen externe dataoverdracht.',
  vendorLockIn: 'low', dpaAvailable: false, dutchQuality, openSource: true, certifications: [],
});

const CHINESE_OPEN_SOURCE = (dutchQuality: DutchQuality = 'fair'): ModelCompliance => ({
  gdpr: 'yellow', gdprNote: 'Chinees bedrijf. Self-hosted is GDPR-veilig; cloud-API heeft dataresidency risico. Gebruik alleen self-hosted voor gevoelige data.',
  dataResidency: 'China via cloud (self-hosted: volledig zelf te bepalen)',
  trainingOnPrompts: 'unknown', trainingNote: 'Self-hosted: veilig. Cloud-API: onduidelijk beleid.',
  vendorLockIn: 'low', dpaAvailable: false, dutchQuality, openSource: true, certifications: [],
});

const CHINESE_HIGH_RISK = (dutchQuality: DutchQuality = 'fair'): ModelCompliance => ({
  gdpr: 'red', gdprNote: 'Chinees staatsbedrijf of sterk gelieerd aan Chinese overheid. Data kan worden verstuurd naar servers in China. Uitsluitend self-hosted inzetten voor GDPR-gevoelige data.',
  dataResidency: 'China (self-hosted: vrij te kiezen)',
  trainingOnPrompts: 'unknown', trainingNote: 'Via cloud API onduidelijk. Self-hosted: geen extern verkeer.',
  vendorLockIn: 'low', dpaAvailable: false, dutchQuality, openSource: true, certifications: [],
});

export const COMPLIANCE_DATA: Record<string, ModelCompliance> = {
  // ── Cloud-only ──────────────────────────────────────────────────────────────
  'claude-3-5-sonnet': {
    gdpr: 'yellow', gdprNote: 'Verwerkersovereenkomst beschikbaar. Servers in VS — EU-residency alleen via Amazon Bedrock.',
    dataResidency: 'VS (of EU via AWS Bedrock)', trainingOnPrompts: 'no',
    trainingNote: 'API-calls worden niet gebruikt voor modeltraining.',
    vendorLockIn: 'medium', dpaAvailable: true, dutchQuality: 'good', openSource: false, certifications: ['SOC 2 Type II'],
  },
  'claude-3-haiku': {
    gdpr: 'yellow', gdprNote: 'Zelfde als Sonnet. DPA beschikbaar, maar servers standaard buiten EU.',
    dataResidency: 'VS (of EU via AWS Bedrock)', trainingOnPrompts: 'no',
    trainingNote: 'API-calls worden niet gebruikt voor modeltraining.',
    vendorLockIn: 'medium', dpaAvailable: true, dutchQuality: 'good', openSource: false, certifications: ['SOC 2 Type II'],
  },
  'gpt-4o': {
    gdpr: 'yellow', gdprNote: 'DPA beschikbaar. EU-residency mogelijk via Azure OpenAI Service.',
    dataResidency: 'VS (of EU via Azure)', trainingOnPrompts: 'opt-out',
    trainingNote: 'Standaard geen training op API-data; opt-out aanbevolen voor extra zekerheid.',
    vendorLockIn: 'high', dpaAvailable: true, dutchQuality: 'excellent', openSource: false, certifications: ['ISO 27001', 'SOC 2', 'HIPAA'],
  },
  'gpt-4o-mini': {
    gdpr: 'yellow', gdprNote: 'Zelfde beleid als GPT-4o.',
    dataResidency: 'VS (of EU via Azure)', trainingOnPrompts: 'opt-out',
    trainingNote: 'Standaard geen training op API-data.',
    vendorLockIn: 'high', dpaAvailable: true, dutchQuality: 'excellent', openSource: false, certifications: ['ISO 27001', 'SOC 2'],
  },
  'gemini-1-5-pro': {
    gdpr: 'yellow', gdprNote: 'DPA beschikbaar via Google Cloud. EU-datalocatie mogelijk met Vertex AI.',
    dataResidency: 'VS/globaal (EU via Vertex AI)', trainingOnPrompts: 'opt-out',
    trainingNote: 'Workspace/API: geen training standaard. Consumentenproducten wel.',
    vendorLockIn: 'high', dpaAvailable: true, dutchQuality: 'good', openSource: false, certifications: ['ISO 27001', 'SOC 2', 'GDPR'],
  },
  'gemini-1-5-flash': {
    gdpr: 'yellow', gdprNote: 'Zelfde beleid als Gemini Pro.',
    dataResidency: 'VS/globaal (EU via Vertex AI)', trainingOnPrompts: 'opt-out',
    trainingNote: 'API-gebruik standaard niet voor training.',
    vendorLockIn: 'high', dpaAvailable: true, dutchQuality: 'good', openSource: false, certifications: ['ISO 27001', 'SOC 2'],
  },
  'groq': {
    gdpr: 'yellow', gdprNote: 'Amerikaans bedrijf. Geen EU-dataresidency. Geschikt voor niet-gevoelige use cases.',
    dataResidency: 'VS', trainingOnPrompts: 'no',
    trainingNote: 'Groq gebruikt API-prompts niet voor modeltraining.',
    vendorLockIn: 'medium', dpaAvailable: false, dutchQuality: 'good', openSource: false, certifications: ['SOC 2'],
  },

  // ── Mistral AI (EU) ─────────────────────────────────────────────────────────
  'mistral-large':     { ...EU_OPEN_SOURCE('good'), openSource: false, gdpr: 'green', gdprNote: 'Frans/EU bedrijf. Servers in Europa. Sterkste GDPR-positie van de cloud-modellen.' },
  'mistral-small-3.1': EU_OPEN_SOURCE('good'),
  'mistral-small-24b': EU_OPEN_SOURCE('good'),
  'mistral-nemo-12b':  EU_OPEN_SOURCE('fair'),
  'ministral-8b':      EU_OPEN_SOURCE('fair'),
  'mistral-7b':        { ...EU_OPEN_SOURCE('fair'), gdprNote: 'Open source, Europese oorsprong. Self-hosted of EU-cloud via Mistral La Plateforme.', dataResidency: 'Europa of self-hosted', dpaAvailable: true },
  'mixtral-8x22b':     EU_OPEN_SOURCE('good'),

  // ── Meta Llama ──────────────────────────────────────────────────────────────
  'llama-3.2-1b':         US_OPEN_SOURCE('basic'),
  'llama-3.2-3b':         US_OPEN_SOURCE('fair'),
  'llama-3-1-8b':         US_OPEN_SOURCE('fair'),
  'llama-3.2-11b-vision': US_OPEN_SOURCE('fair'),
  'llama-3-1-70b':        US_OPEN_SOURCE('good'),
  'llama-3-3-70b':        US_OPEN_SOURCE('good'),
  'llama-3.1-405b':       US_OPEN_SOURCE('good'),
  'llama-4-scout':        US_OPEN_SOURCE('good'),
  'llama-4-maverick':     US_OPEN_SOURCE('good'),
  'codellama-7b':         US_OPEN_SOURCE('basic'),
  'codellama-13b':        US_OPEN_SOURCE('basic'),
  'codellama-34b':        US_OPEN_SOURCE('basic'),

  // ── Google Gemma ────────────────────────────────────────────────────────────
  'gemma-3-1b':  US_OPEN_SOURCE('basic'),
  'gemma-2-2b':  US_OPEN_SOURCE('fair'),
  'gemma-3-4b':  US_OPEN_SOURCE('fair'),
  'gemma-2-9b':  US_OPEN_SOURCE('fair'),
  'gemma-3-12b': US_OPEN_SOURCE('fair'),
  'gemma-3-27b': US_OPEN_SOURCE('good'),
  'gemma-2-27b': {
    gdpr: 'green', gdprNote: 'Open source van Google. Self-hosted: volledige datagecontroleerde omgeving.',
    dataResidency: 'Volledig zelf te bepalen', trainingOnPrompts: 'no',
    trainingNote: 'Self-hosted: geen externe dataoverdracht.',
    vendorLockIn: 'low', dpaAvailable: false, dutchQuality: 'fair', openSource: true, certifications: [],
  },

  // ── Microsoft ───────────────────────────────────────────────────────────────
  'phi-3':        { ...US_OPEN_SOURCE('basic'), gdprNote: 'Volledig on-device of self-hosted. Geen dataoverdracht bij lokaal gebruik.', dataResidency: 'Volledig lokaal / zelf te bepalen' },
  'phi-4-mini':   US_OPEN_SOURCE('basic'),
  'phi-4':        US_OPEN_SOURCE('fair'),
  'phi-3-medium': US_OPEN_SOURCE('fair'),
  'orca-2-7b':    US_OPEN_SOURCE('fair'),
  'orca-2-13b':   US_OPEN_SOURCE('fair'),

  // ── IBM Granite ─────────────────────────────────────────────────────────────
  'granite-4-micro':     { ...US_OPEN_SOURCE('fair'), gdprNote: 'IBM open source model. Volledig self-hostbaar, enterprise-grade.' },
  'granite-4-tiny-moe':  { ...US_OPEN_SOURCE('fair'), gdprNote: 'IBM open source model. Volledig self-hostbaar, enterprise-grade.' },
  'granite-3.1-8b':      { ...US_OPEN_SOURCE('fair'), gdprNote: 'IBM enterprise model. Volledig self-hostbaar.' },
  'granite-4-small-moe': { ...US_OPEN_SOURCE('fair'), gdprNote: 'IBM open source model. Volledig self-hostbaar, enterprise-grade.' },

  // ── Alibaba / Qwen ──────────────────────────────────────────────────────────
  'qwen3-0.6b':         CHINESE_OPEN_SOURCE('fair'),
  'qwen3-1.7b':         CHINESE_OPEN_SOURCE('fair'),
  'qwen2.5-coder-1.5b': CHINESE_OPEN_SOURCE('fair'),
  'qwen3.5-2b':         CHINESE_OPEN_SOURCE('fair'),
  'qwen2.5-vl-3b':      CHINESE_OPEN_SOURCE('fair'),
  'qwen3-4b':           CHINESE_OPEN_SOURCE('fair'),
  'qwen3.5-4b':         CHINESE_OPEN_SOURCE('fair'),
  'qwen2.5-7b':         CHINESE_OPEN_SOURCE('good'),
  'qwen2.5-coder-7b':   CHINESE_OPEN_SOURCE('good'),
  'qwen3-8b':           CHINESE_OPEN_SOURCE('good'),
  'qwen2.5-vl-7b':      CHINESE_OPEN_SOURCE('good'),
  'qwen3.5-9b':         CHINESE_OPEN_SOURCE('good'),
  'qwen2.5-14b':        CHINESE_OPEN_SOURCE('good'),
  'qwen3-14b':          CHINESE_OPEN_SOURCE('good'),
  'qwen2.5-coder-14b':  CHINESE_OPEN_SOURCE('good'),
  'qwen3.5-27b':        CHINESE_OPEN_SOURCE('good'),
  'qwen2.5-32b':        CHINESE_OPEN_SOURCE('good'),
  'qwen3-32b':          CHINESE_OPEN_SOURCE('good'),
  'qwen3-30b-moe':      CHINESE_OPEN_SOURCE('good'),
  'qwen3.5-35b-moe':    CHINESE_OPEN_SOURCE('good'),
  'qwen-2-5-72b': {
    gdpr: 'yellow', gdprNote: 'Alibaba/Chinese oorsprong. Self-hosted is GDPR-veilig; cloud-API heeft dataresidency risico.',
    dataResidency: 'China via cloud (self-hosted: vrij)', trainingOnPrompts: 'unknown',
    trainingNote: 'Self-hosted: veilig. Cloud-API: onduidelijk beleid.',
    vendorLockIn: 'low', dpaAvailable: false, dutchQuality: 'good', openSource: true, certifications: [],
  },
  'qwen-2-5-coder': {
    gdpr: 'yellow', gdprNote: 'Zelfde als Qwen 2.5 72B. Self-hosted aanbevolen voor gevoelige codebases.',
    dataResidency: 'China via cloud (self-hosted: vrij)', trainingOnPrompts: 'unknown',
    trainingNote: 'Self-hosted: geen extern verkeer.',
    vendorLockIn: 'low', dpaAvailable: false, dutchQuality: 'fair', openSource: true, certifications: [],
  },
  'qwen3.5-122b-moe':  CHINESE_OPEN_SOURCE('good'),
  'qwen3-235b-moe':    CHINESE_OPEN_SOURCE('good'),
  'qwen3.5-397b-moe':  CHINESE_OPEN_SOURCE('good'),
  'qwen3-coder-480b':  CHINESE_OPEN_SOURCE('good'),

  // ── DeepSeek ────────────────────────────────────────────────────────────────
  'deepseek-r1-7b': {
    gdpr: 'red', gdprNote: 'Chinees bedrijf. Self-hosted is veilig. Cloud-API: data kan naar China. Sterk afraden voor GDPR-gevoelige data.',
    dataResidency: 'China (self-hosted: vrij te kiezen)', trainingOnPrompts: 'unknown',
    trainingNote: 'Via cloud API onduidelijk. Self-hosted: geen extern verkeer.',
    vendorLockIn: 'low', dpaAvailable: false, dutchQuality: 'fair', openSource: true, certifications: [],
  },
  'deepseek-coder-v2-16b': { ...CHINESE_OPEN_SOURCE('fair'), gdpr: 'red', gdprNote: 'Chinees bedrijf. Gebruik alleen self-hosted voor gevoelige data.' },
  'deepseek-r1-32b':  { ...CHINESE_OPEN_SOURCE('fair'), gdpr: 'red', gdprNote: 'Chinees bedrijf. Gebruik alleen self-hosted voor gevoelige data.' },
  'deepseek-r1': {
    gdpr: 'red', gdprNote: 'Chinees bedrijf. Data kan worden verstuurd naar servers in China. Sterk afraden voor GDPR-gevoelige data.',
    dataResidency: 'China (self-hosted: vrij te kiezen)', trainingOnPrompts: 'unknown',
    trainingNote: 'Via cloud API onduidelijk. Self-hosted: geen extern verkeer.',
    vendorLockIn: 'low', dpaAvailable: false, dutchQuality: 'fair', openSource: true, certifications: [],
  },
  'deepseek-v3': { ...CHINESE_OPEN_SOURCE('good'), gdpr: 'red', gdprNote: 'Chinees bedrijf. Gebruik uitsluitend self-hosted voor GDPR-compliance.' },

  // ── Other open-source ───────────────────────────────────────────────────────
  'yi-6b-chat':  { ...US_OPEN_SOURCE('fair'), gdpr: 'yellow', gdprNote: 'US-China joint venture (01.ai). Self-hosted is veilig. Cloud-API: check dataresidency.' },
  'yi-34b-chat': { ...US_OPEN_SOURCE('fair'), gdpr: 'yellow', gdprNote: 'US-China joint venture (01.ai). Self-hosted is veilig. Cloud-API: check dataresidency.' },
  'olmo2-32b':   { ...US_OPEN_SOURCE('fair'), gdprNote: 'Volledig open source (Allen Institute). Transparantste model in de lijst.' },
  'ling-lite-16b': CHINESE_OPEN_SOURCE('fair'),
  'bge-large-en': { ...US_OPEN_SOURCE('fair'), gdpr: 'green', gdprNote: 'BAAI embedding model. Volledig open source, geen chat-risico\'s.' },
  'ernie-4.5-300b': CHINESE_HIGH_RISK('fair'),
  'starcoder2-7b':  US_OPEN_SOURCE('basic'),
  'starcoder2-15b': US_OPEN_SOURCE('basic'),
  'bloom-176b':  { ...US_OPEN_SOURCE('good'), gdprNote: 'BigScience collaborative model. Volledig open source, sterk meertalig.' },
  'command-r-35b': {
    gdpr: 'yellow', gdprNote: 'Cohere is Canadees bedrijf. API heeft dataresidency buiten EU. Self-hosted open source versie is GDPR-veilig.',
    dataResidency: 'Canada/VS (self-hosted: vrij)', trainingOnPrompts: 'opt-out',
    trainingNote: 'API: opt-out voor training aanbevolen. Self-hosted: geen extern verkeer.',
    vendorLockIn: 'medium', dpaAvailable: true, dutchQuality: 'good', openSource: true, certifications: ['SOC 2'],
  },
  'tinyllama-1.1b': US_OPEN_SOURCE('basic'),
  'zephyr-7b':      US_OPEN_SOURCE('fair'),
  'vicuna-7b':      US_OPEN_SOURCE('fair'),
  'vicuna-13b':     US_OPEN_SOURCE('fair'),
  'longcat-flash-560b': CHINESE_HIGH_RISK('fair'),
  'kimi-k2':        CHINESE_HIGH_RISK('good'),
  'nomic-embed':    US_OPEN_SOURCE('basic'),
  'nous-hermes-2-mixtral': US_OPEN_SOURCE('fair'),
  'openchat-3.5':   US_OPEN_SOURCE('fair'),
  'dots-llm1-142b': CHINESE_HIGH_RISK('fair'),
  'stablelm-2-1.6b': US_OPEN_SOURCE('basic'),
  'falcon-7b':  { ...US_OPEN_SOURCE('fair'), gdprNote: 'TII (UAE). Open source, self-hostbaar. UAE-origine maar geen dataresidency-risico bij self-hosting.' },
  'falcon3-7b': { ...US_OPEN_SOURCE('fair'), gdprNote: 'TII (UAE). Open source, self-hostbaar.' },
  'falcon3-10b': { ...US_OPEN_SOURCE('fair'), gdprNote: 'TII (UAE). Open source, self-hostbaar.' },
  'falcon-40b': { ...US_OPEN_SOURCE('fair'), gdprNote: 'TII (UAE). Open source, self-hostbaar.' },
  'falcon-180b': { ...US_OPEN_SOURCE('fair'), gdprNote: 'TII (UAE). Open source, self-hostbaar.' },
  'solar-10.7b': { ...US_OPEN_SOURCE('fair'), gdprNote: 'Upstage (Korea). Open source. Self-hosted is GDPR-veilig.' },
  'wizardlm-13b':    US_OPEN_SOURCE('fair'),
  'wizardcoder-15b': US_OPEN_SOURCE('basic'),
  'grok-1': {
    gdpr: 'yellow', gdprNote: 'xAI (VS). Open weights, self-hostbaar. Geen DPA voor cloud-gebruik.',
    dataResidency: 'VS (self-hosted: vrij)', trainingOnPrompts: 'unknown',
    trainingNote: 'Open weights — self-hosted heeft geen extern verkeer.',
    vendorLockIn: 'low', dpaAvailable: false, dutchQuality: 'fair', openSource: true, certifications: [],
  },
  'glm-4-9b': CHINESE_HIGH_RISK('good'),
};

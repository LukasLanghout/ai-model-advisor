export interface AIModelData {
  id: string;
  name: string;
  provider: string;
  type: 'cloud' | 'open-source' | 'hybrid';
  documentationUrl: string;
  color: string;
  params?: string;       // e.g. "7B", "32B (MoE)"
  contextK?: number;     // context window in thousands of tokens
  specialties?: string[];
}

// ── Cloud-only models ──────────────────────────────────────────────────────────
const CLOUD_MODELS: AIModelData[] = [
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet',    provider: 'Anthropic',  type: 'cloud',   documentationUrl: 'https://docs.anthropic.com',                         color: '#d97706', params: '~200B',  contextK: 200,   specialties: ['redenering', 'codering', 'analyse'] },
  { id: 'claude-3-haiku',    name: 'Claude 3 Haiku',       provider: 'Anthropic',  type: 'cloud',   documentationUrl: 'https://docs.anthropic.com',                         color: '#d97706', params: '~20B',   contextK: 200,   specialties: ['snel', 'goedkoop', 'hoog volume'] },
  { id: 'gpt-4o',            name: 'GPT-4o',               provider: 'OpenAI',     type: 'cloud',   documentationUrl: 'https://platform.openai.com/docs',                   color: '#16a34a', params: '~200B',  contextK: 128,   specialties: ['multimodaal', 'function calling', 'ecosysteem'] },
  { id: 'gpt-4o-mini',       name: 'GPT-4o Mini',          provider: 'OpenAI',     type: 'cloud',   documentationUrl: 'https://platform.openai.com/docs',                   color: '#16a34a', params: '~8B',    contextK: 128,   specialties: ['goedkoop', 'snel', 'function calling'] },
  { id: 'gemini-1-5-pro',    name: 'Gemini 1.5 Pro',       provider: 'Google',     type: 'cloud',   documentationUrl: 'https://ai.google.dev/docs',                         color: '#2563eb', params: '~340B',  contextK: 2000,  specialties: ['mega context', 'multimodaal', 'video'] },
  { id: 'gemini-1-5-flash',  name: 'Gemini 1.5 Flash',     provider: 'Google',     type: 'cloud',   documentationUrl: 'https://ai.google.dev/docs',                         color: '#2563eb', params: '~7B',    contextK: 1000,  specialties: ['snel', 'goedkoop', 'lange context'] },
  { id: 'groq',              name: 'Groq (Llama/Mixtral)', provider: 'Groq',       type: 'cloud',   documentationUrl: 'https://console.groq.com/docs',                      color: '#dc2626', params: 'diverse', contextK: 32,  specialties: ['extreem snel', 'real-time', '300+ tokens/sec'] },
];

// ── Mistral AI (EU) ────────────────────────────────────────────────────────────
const MISTRAL_MODELS: AIModelData[] = [
  { id: 'mistral-large',       name: 'Mistral Large 123B',    provider: 'Mistral AI', type: 'hybrid',      documentationUrl: 'https://docs.mistral.ai', color: '#0891b2', params: '123B',  contextK: 128, specialties: ['EU-compliant', 'meertalig', 'redenering'] },
  { id: 'mistral-small-3.1',   name: 'Mistral Small 3.1 24B', provider: 'Mistral AI', type: 'open-source', documentationUrl: 'https://docs.mistral.ai', color: '#0891b2', params: '24B',   contextK: 128, specialties: ['EU-compliant', 'multimodaal', 'vision'] },
  { id: 'mistral-small-24b',   name: 'Mistral Small 24B',     provider: 'Mistral AI', type: 'open-source', documentationUrl: 'https://docs.mistral.ai', color: '#0891b2', params: '24B',   contextK: 32,  specialties: ['EU-compliant', 'balanced'] },
  { id: 'mistral-nemo-12b',    name: 'Mistral Nemo 12B',      provider: 'Mistral AI', type: 'open-source', documentationUrl: 'https://docs.mistral.ai', color: '#0891b2', params: '12B',   contextK: 128, specialties: ['EU-compliant', 'lichtgewicht', 'instruct'] },
  { id: 'ministral-8b',        name: 'Ministral 8B',          provider: 'Mistral AI', type: 'open-source', documentationUrl: 'https://docs.mistral.ai', color: '#0891b2', params: '8B',    contextK: 32,  specialties: ['EU-compliant', 'snel', 'edge'] },
  { id: 'mistral-7b',          name: 'Mistral 7B / Mixtral',  provider: 'Mistral AI', type: 'open-source', documentationUrl: 'https://docs.mistral.ai', color: '#0891b2', params: '7-46B', contextK: 32,  specialties: ['EU-compliant', 'open source', 'snel'] },
  { id: 'mixtral-8x22b',       name: 'Mixtral 8x22B',         provider: 'Mistral AI', type: 'open-source', documentationUrl: 'https://docs.mistral.ai', color: '#0891b2', params: '140B (MoE)', contextK: 64, specialties: ['EU-compliant', 'krachtig', 'MoE'] },
];

// ── Meta Llama ─────────────────────────────────────────────────────────────────
const META_MODELS: AIModelData[] = [
  { id: 'llama-3.2-1b',       name: 'Llama 3.2 1B',          provider: 'Meta', type: 'open-source', documentationUrl: 'https://llama.meta.com', color: '#7c3aed', params: '1.2B',      contextK: 4,    specialties: ['edge', 'mobiel', 'ultra licht'] },
  { id: 'llama-3.2-3b',       name: 'Llama 3.2 3B',          provider: 'Meta', type: 'open-source', documentationUrl: 'https://llama.meta.com', color: '#7c3aed', params: '3.2B',      contextK: 4,    specialties: ['lichtgewicht', 'mobiel'] },
  { id: 'llama-3-1-8b',       name: 'Llama 3.1 8B',          provider: 'Meta', type: 'open-source', documentationUrl: 'https://llama.meta.com', color: '#7c3aed', params: '8B',        contextK: 128,  specialties: ['algemeen', 'instruct', 'snel'] },
  { id: 'llama-3.2-11b-vision', name: 'Llama 3.2 11B Vision', provider: 'Meta', type: 'open-source', documentationUrl: 'https://llama.meta.com', color: '#7c3aed', params: '10.7B',     contextK: 4,    specialties: ['vision', 'multimodaal'] },
  { id: 'llama-3-1-70b',      name: 'Llama 3.1 70B',         provider: 'Meta', type: 'open-source', documentationUrl: 'https://llama.meta.com', color: '#7c3aed', params: '70.6B',     contextK: 128,  specialties: ['krachtig', 'on-premise', 'algemeen'] },
  { id: 'llama-3-3-70b',      name: 'Llama 3.3 70B',         provider: 'Meta', type: 'open-source', documentationUrl: 'https://llama.meta.com', color: '#7c3aed', params: '70.6B',     contextK: 128,  specialties: ['state-of-the-art', 'redenering', 'on-premise'] },
  { id: 'llama-3.1-405b',     name: 'Llama 3.1 405B',        provider: 'Meta', type: 'open-source', documentationUrl: 'https://llama.meta.com', color: '#7c3aed', params: '405.9B',    contextK: 128,  specialties: ['maximale kwaliteit', 'enterprise'] },
  { id: 'llama-4-scout',      name: 'Llama 4 Scout 17B',     provider: 'Meta', type: 'open-source', documentationUrl: 'https://llama.meta.com', color: '#7c3aed', params: '109B (MoE)', contextK: 10000, specialties: ['mega context', 'multimodaal', 'MoE'] },
  { id: 'llama-4-maverick',   name: 'Llama 4 Maverick',      provider: 'Meta', type: 'open-source', documentationUrl: 'https://llama.meta.com', color: '#7c3aed', params: '400B (MoE)', contextK: 1000,  specialties: ['state-of-the-art', 'multimodaal', 'MoE'] },
  { id: 'codellama-7b',       name: 'Code Llama 7B',         provider: 'Meta', type: 'open-source', documentationUrl: 'https://llama.meta.com', color: '#7c3aed', params: '6.7B',      contextK: 4,    specialties: ['code', 'lichtgewicht'] },
  { id: 'codellama-13b',      name: 'Code Llama 13B',        provider: 'Meta', type: 'open-source', documentationUrl: 'https://llama.meta.com', color: '#7c3aed', params: '13B',       contextK: 4,    specialties: ['code', 'balanced'] },
  { id: 'codellama-34b',      name: 'Code Llama 34B',        provider: 'Meta', type: 'open-source', documentationUrl: 'https://llama.meta.com', color: '#7c3aed', params: '33.7B',     contextK: 4,    specialties: ['code', 'krachtig'] },
];

// ── Google Gemma ───────────────────────────────────────────────────────────────
const GOOGLE_OS_MODELS: AIModelData[] = [
  { id: 'gemma-3-1b',  name: 'Gemma 3 1B',    provider: 'Google', type: 'open-source', documentationUrl: 'https://ai.google.dev/gemma', color: '#2563eb', params: '1B',    contextK: 32,  specialties: ['ultra licht', 'edge'] },
  { id: 'gemma-2-2b',  name: 'Gemma 2 2B',    provider: 'Google', type: 'open-source', documentationUrl: 'https://ai.google.dev/gemma', color: '#2563eb', params: '2.6B',  contextK: 4,   specialties: ['lichtgewicht'] },
  { id: 'gemma-3-4b',  name: 'Gemma 3 4B',    provider: 'Google', type: 'open-source', documentationUrl: 'https://ai.google.dev/gemma', color: '#2563eb', params: '4B',    contextK: 128, specialties: ['balanced', 'instruct'] },
  { id: 'gemma-2-9b',  name: 'Gemma 2 9B',    provider: 'Google', type: 'open-source', documentationUrl: 'https://ai.google.dev/gemma', color: '#2563eb', params: '9.2B',  contextK: 4,   specialties: ['algemeen', 'kwaliteit'] },
  { id: 'gemma-3-12b', name: 'Gemma 3 12B',   provider: 'Google', type: 'open-source', documentationUrl: 'https://ai.google.dev/gemma', color: '#2563eb', params: '12B',   contextK: 128, specialties: ['vision', 'multimodaal'] },
  { id: 'gemma-3-27b', name: 'Gemma 3 27B',   provider: 'Google', type: 'open-source', documentationUrl: 'https://ai.google.dev/gemma', color: '#2563eb', params: '27B',   contextK: 128, specialties: ['krachtig', 'algemeen'] },
  { id: 'gemma-2-27b', name: 'Gemma 2 27B',   provider: 'Google', type: 'open-source', documentationUrl: 'https://huggingface.co/google/gemma-2-27b-it', color: '#2563eb', params: '27.2B', contextK: 4, specialties: ['kwaliteit', 'algemeen'] },
];

// ── Microsoft ──────────────────────────────────────────────────────────────────
const MICROSOFT_MODELS: AIModelData[] = [
  { id: 'phi-3',        name: 'Phi-3.5 Mini',      provider: 'Microsoft', type: 'open-source', documentationUrl: 'https://huggingface.co/microsoft/Phi-3.5-mini-instruct', color: '#0369a1', params: '3.8B', contextK: 128, specialties: ['edge', 'mobiel', 'ultra licht'] },
  { id: 'phi-4-mini',   name: 'Phi-4 Mini',        provider: 'Microsoft', type: 'open-source', documentationUrl: 'https://huggingface.co/microsoft/Phi-4-mini-instruct',   color: '#0369a1', params: '3.8B', contextK: 128, specialties: ['edge', 'nieuwste generatie'] },
  { id: 'phi-4',        name: 'Phi-4 14B',         provider: 'Microsoft', type: 'open-source', documentationUrl: 'https://huggingface.co/microsoft/phi-4',                  color: '#0369a1', params: '14B',  contextK: 16,  specialties: ['redenering', 'STEM', 'codering'] },
  { id: 'phi-3-medium', name: 'Phi-3 Medium 14B',  provider: 'Microsoft', type: 'open-source', documentationUrl: 'https://huggingface.co/microsoft/Phi-3-medium-14b-instruct', color: '#0369a1', params: '14B', contextK: 4, specialties: ['balanced', 'redenering'] },
  { id: 'orca-2-7b',    name: 'Orca 2 7B',         provider: 'Microsoft', type: 'open-source', documentationUrl: 'https://huggingface.co/microsoft/Orca-2-7b',              color: '#0369a1', params: '7B',   contextK: 4,   specialties: ['redenering', 'stap-voor-stap'] },
  { id: 'orca-2-13b',   name: 'Orca 2 13B',        provider: 'Microsoft', type: 'open-source', documentationUrl: 'https://huggingface.co/microsoft/Orca-2-13b',             color: '#0369a1', params: '13B',  contextK: 4,   specialties: ['redenering', 'stap-voor-stap'] },
];

// ── IBM Granite ────────────────────────────────────────────────────────────────
const IBM_MODELS: AIModelData[] = [
  { id: 'granite-4-micro',    name: 'Granite 4.0 Micro 3B',    provider: 'IBM', type: 'open-source', documentationUrl: 'https://huggingface.co/ibm-granite', color: '#1e40af', params: '3B',       contextK: 128, specialties: ['enterprise', 'edge', 'hybrid Mamba'] },
  { id: 'granite-4-tiny-moe', name: 'Granite 4.0 Tiny 7B MoE', provider: 'IBM', type: 'open-source', documentationUrl: 'https://huggingface.co/ibm-granite', color: '#1e40af', params: '7B (MoE)',  contextK: 128, specialties: ['enterprise', 'efficiënt', 'MoE'] },
  { id: 'granite-3.1-8b',     name: 'Granite 3.1 8B',          provider: 'IBM', type: 'open-source', documentationUrl: 'https://huggingface.co/ibm-granite', color: '#1e40af', params: '8.1B',      contextK: 128, specialties: ['enterprise', 'instructie', 'veilig'] },
  { id: 'granite-4-small-moe', name: 'Granite 4.0 Small 32B MoE', provider: 'IBM', type: 'open-source', documentationUrl: 'https://huggingface.co/ibm-granite', color: '#1e40af', params: '32B (MoE)', contextK: 128, specialties: ['enterprise', 'krachtig', 'MoE'] },
];

// ── Alibaba / Qwen ─────────────────────────────────────────────────────────────
const QWEN_MODELS: AIModelData[] = [
  { id: 'qwen3-0.6b',         name: 'Qwen3 0.6B',            provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '600M',       contextK: 40,  specialties: ['ultra licht', 'edge'] },
  { id: 'qwen3-1.7b',         name: 'Qwen3 1.7B',            provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '1.7B',        contextK: 40,  specialties: ['lichtgewicht', 'edge'] },
  { id: 'qwen2.5-coder-1.5b', name: 'Qwen2.5 Coder 1.5B',   provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '1.5B',        contextK: 32,  specialties: ['code', 'lichtgewicht'] },
  { id: 'qwen3.5-2b',         name: 'Qwen3.5 2B',            provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '2.3B',        contextK: 256, specialties: ['multimodaal', 'vision'] },
  { id: 'qwen2.5-vl-3b',      name: 'Qwen2.5-VL 3B',        provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '3.8B',        contextK: 32,  specialties: ['vision', 'multimodaal'] },
  { id: 'qwen3-4b',           name: 'Qwen3 4B',              provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '4B',          contextK: 40,  specialties: ['algemeen', 'balanced'] },
  { id: 'qwen3.5-4b',         name: 'Qwen3.5 4B',            provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '4.7B',        contextK: 256, specialties: ['multimodaal', 'vision'] },
  { id: 'qwen2.5-7b',         name: 'Qwen2.5 7B',            provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '7.6B',        contextK: 32,  specialties: ['instruct', 'meertalig'] },
  { id: 'qwen2.5-coder-7b',   name: 'Qwen2.5 Coder 7B',     provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '7.6B',        contextK: 32,  specialties: ['code', 'balanced'] },
  { id: 'qwen3-8b',           name: 'Qwen3 8B',              provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '8.2B',        contextK: 40,  specialties: ['algemeen', 'redenering'] },
  { id: 'qwen2.5-vl-7b',      name: 'Qwen2.5-VL 7B',        provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '8.3B',        contextK: 32,  specialties: ['vision', 'multimodaal'] },
  { id: 'qwen3.5-9b',         name: 'Qwen3.5 9B',            provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '9.7B',        contextK: 256, specialties: ['multimodaal', 'vision', 'lange context'] },
  { id: 'qwen2.5-14b',        name: 'Qwen2.5 14B',           provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '14.8B',       contextK: 128, specialties: ['krachtig', 'meertalig'] },
  { id: 'qwen3-14b',          name: 'Qwen3 14B',             provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '14.8B',       contextK: 128, specialties: ['redenering', 'algemeen'] },
  { id: 'qwen2.5-coder-14b',  name: 'Qwen2.5 Coder 14B',    provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '14.8B',       contextK: 32,  specialties: ['code', 'krachtig'] },
  { id: 'qwen3.5-27b',        name: 'Qwen3.5 27B',           provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '27.8B',       contextK: 256, specialties: ['multimodaal', 'vision', 'krachtig'] },
  { id: 'qwen2.5-32b',        name: 'Qwen2.5 32B',           provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '32.5B',       contextK: 128, specialties: ['krachtig', 'instruct'] },
  { id: 'qwen3-32b',          name: 'Qwen3 32B',             provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '32.8B',       contextK: 40,  specialties: ['redenering', 'algemeen'] },
  { id: 'qwen3-30b-moe',      name: 'Qwen3 30B-A3B MoE',    provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '30.5B (MoE)', contextK: 40,  specialties: ['efficiënt', 'MoE', 'algemeen'] },
  { id: 'qwen3.5-35b-moe',    name: 'Qwen3.5 35B-A3B MoE',  provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '36B (MoE)',   contextK: 256, specialties: ['multimodaal', 'MoE'] },
  { id: 'qwen-2-5-72b',       name: 'Qwen2.5 72B',           provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen/Qwen2.5-72B-Instruct', color: '#ea580c', params: '72.7B', contextK: 32, specialties: ['krachtig', 'meertalig', 'instruct'] },
  { id: 'qwen-2-5-coder',     name: 'Qwen2.5 Coder 32B',    provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen/Qwen2.5-Coder-32B',      color: '#ea580c', params: '32.8B', contextK: 32, specialties: ['code', 'state-of-the-art'] },
  { id: 'qwen3.5-122b-moe',   name: 'Qwen3.5 122B-A10B MoE', provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '125B (MoE)', contextK: 256, specialties: ['multimodaal', 'krachtig', 'MoE'] },
  { id: 'qwen3-235b-moe',     name: 'Qwen3 235B-A22B MoE',  provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '235B (MoE)', contextK: 40,  specialties: ['state-of-the-art', 'MoE'] },
  { id: 'qwen3.5-397b-moe',   name: 'Qwen3.5 397B-A17B MoE', provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '403B (MoE)', contextK: 256, specialties: ['ultra krachtig', 'multimodaal', 'MoE'] },
  { id: 'qwen3-coder-480b',   name: 'Qwen3 Coder 480B MoE', provider: 'Alibaba', type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen', color: '#ea580c', params: '480B (MoE)', contextK: 256, specialties: ['code', 'state-of-the-art', 'MoE'] },
];

// ── DeepSeek ───────────────────────────────────────────────────────────────────
const DEEPSEEK_MODELS: AIModelData[] = [
  { id: 'deepseek-r1-7b',       name: 'DeepSeek-R1 Distill 7B',  provider: 'DeepSeek', type: 'open-source', documentationUrl: 'https://github.com/deepseek-ai', color: '#0f766e', params: '7.6B',       contextK: 128, specialties: ['redenering', 'lichtgewicht'] },
  { id: 'deepseek-coder-v2-16b', name: 'DeepSeek Coder V2 16B',  provider: 'DeepSeek', type: 'open-source', documentationUrl: 'https://github.com/deepseek-ai', color: '#0f766e', params: '16B (MoE)',   contextK: 128, specialties: ['code', 'MoE', 'efficiënt'] },
  { id: 'deepseek-r1-32b',      name: 'DeepSeek-R1 Distill 32B', provider: 'DeepSeek', type: 'open-source', documentationUrl: 'https://github.com/deepseek-ai', color: '#0f766e', params: '32.8B',       contextK: 128, specialties: ['redenering', 'krachtig'] },
  { id: 'deepseek-r1',          name: 'DeepSeek R1 671B',        provider: 'DeepSeek', type: 'open-source', documentationUrl: 'https://github.com/deepseek-ai/DeepSeek-R1', color: '#0f766e', params: '671B (MoE)', contextK: 128, specialties: ['redenering', 'wiskunde', 'state-of-the-art'] },
  { id: 'deepseek-v3',          name: 'DeepSeek V3 685B',        provider: 'DeepSeek', type: 'open-source', documentationUrl: 'https://github.com/deepseek-ai', color: '#0f766e', params: '685B (MoE)',   contextK: 128, specialties: ['state-of-the-art', 'MoE', 'algemeen'] },
];

// ── Other open-source models ───────────────────────────────────────────────────
const OTHER_OS_MODELS: AIModelData[] = [
  // 01.ai / Yi
  { id: 'yi-6b-chat',    name: 'Yi 6B Chat',   provider: '01.ai',     type: 'open-source', documentationUrl: 'https://huggingface.co/01-ai', color: '#6366f1', params: '6.1B',  contextK: 4,   specialties: ['chat', 'meertalig'] },
  { id: 'yi-34b-chat',   name: 'Yi 34B Chat',  provider: '01.ai',     type: 'open-source', documentationUrl: 'https://huggingface.co/01-ai', color: '#6366f1', params: '34.4B', contextK: 4,   specialties: ['chat', 'krachtig', 'meertalig'] },
  // Allen Institute
  { id: 'olmo2-32b',     name: 'OLMo 2 32B',   provider: 'Allen Institute', type: 'open-source', documentationUrl: 'https://huggingface.co/allenai', color: '#6366f1', params: '32B', contextK: 4, specialties: ['volledig open source', 'transparant'] },
  // Ant Group
  { id: 'ling-lite-16b', name: 'Ling Lite 16B MoE', provider: 'Ant Group', type: 'open-source', documentationUrl: 'https://huggingface.co/inclusionAI', color: '#6366f1', params: '16.8B (MoE)', contextK: 128, specialties: ['MoE', 'efficiënt'] },
  // BAAI
  { id: 'bge-large-en',  name: 'BGE Large EN (embedding)', provider: 'BAAI', type: 'open-source', documentationUrl: 'https://huggingface.co/BAAI', color: '#6366f1', params: '335M', contextK: 0.5, specialties: ['embeddings', 'RAG', 'vector search'] },
  // Baidu
  { id: 'ernie-4.5-300b', name: 'ERNIE 4.5 300B MoE', provider: 'Baidu', type: 'open-source', documentationUrl: 'https://huggingface.co/baidu', color: '#ef4444', params: '300B (MoE)', contextK: 128, specialties: ['meertalig', 'redenering'] },
  // BigCode
  { id: 'starcoder2-7b',  name: 'StarCoder2 7B',  provider: 'BigCode', type: 'open-source', documentationUrl: 'https://huggingface.co/bigcode', color: '#6366f1', params: '7.2B',  contextK: 16, specialties: ['code', 'meerdere programmeertalen'] },
  { id: 'starcoder2-15b', name: 'StarCoder2 15B', provider: 'BigCode', type: 'open-source', documentationUrl: 'https://huggingface.co/bigcode', color: '#6366f1', params: '15.7B', contextK: 16, specialties: ['code', 'krachtig'] },
  // BigScience
  { id: 'bloom-176b',    name: 'BLOOM 176B',   provider: 'BigScience', type: 'open-source', documentationUrl: 'https://huggingface.co/bigscience', color: '#6366f1', params: '176B', contextK: 2, specialties: ['meertalig', 'volledig open'] },
  // Cohere
  { id: 'command-r-35b', name: 'Command R 35B', provider: 'Cohere', type: 'hybrid', documentationUrl: 'https://docs.cohere.com', color: '#6366f1', params: '35B', contextK: 128, specialties: ['RAG', 'tool use', 'agents'] },
  // Community
  { id: 'tinyllama-1.1b', name: 'TinyLlama 1.1B', provider: 'Community', type: 'open-source', documentationUrl: 'https://huggingface.co/TinyLlama', color: '#6366f1', params: '1.1B', contextK: 2, specialties: ['ultra licht', 'edge', 'mobiel'] },
  // HuggingFace
  { id: 'zephyr-7b',     name: 'Zephyr 7B',    provider: 'HuggingFace', type: 'open-source', documentationUrl: 'https://huggingface.co/HuggingFaceH4', color: '#6366f1', params: '7.2B', contextK: 32, specialties: ['chat', 'instruct'] },
  // LMSYS
  { id: 'vicuna-7b',     name: 'Vicuna 7B',    provider: 'LMSYS', type: 'open-source', documentationUrl: 'https://huggingface.co/lmsys', color: '#6366f1', params: '7B',   contextK: 4,  specialties: ['chat', 'instructie'] },
  { id: 'vicuna-13b',    name: 'Vicuna 13B',   provider: 'LMSYS', type: 'open-source', documentationUrl: 'https://huggingface.co/lmsys', color: '#6366f1', params: '13B',  contextK: 4,  specialties: ['chat', 'krachtig'] },
  // Meituan
  { id: 'longcat-flash-560b', name: 'LongCat Flash 560B MoE', provider: 'Meituan', type: 'open-source', documentationUrl: 'https://huggingface.co/meituan', color: '#ef4444', params: '560B (MoE)', contextK: 512, specialties: ['ultralange context', 'MoE'] },
  // Moonshot
  { id: 'kimi-k2',       name: 'Kimi K2 1T MoE', provider: 'Moonshot', type: 'open-source', documentationUrl: 'https://huggingface.co/moonshotai', color: '#ef4444', params: '1000B (MoE)', contextK: 128, specialties: ['redenering', 'MoE', 'state-of-the-art'] },
  // Nomic
  { id: 'nomic-embed',   name: 'Nomic Embed Text (embedding)', provider: 'Nomic', type: 'open-source', documentationUrl: 'https://huggingface.co/nomic-ai', color: '#6366f1', params: '137M', contextK: 8, specialties: ['embeddings', 'RAG', 'vector search'] },
  // NousResearch
  { id: 'nous-hermes-2-mixtral', name: 'Nous Hermes 2 Mixtral', provider: 'NousResearch', type: 'open-source', documentationUrl: 'https://huggingface.co/NousResearch', color: '#6366f1', params: '46.7B (MoE)', contextK: 32, specialties: ['algemeen', 'chat', 'MoE'] },
  // OpenChat
  { id: 'openchat-3.5',  name: 'OpenChat 3.5', provider: 'OpenChat', type: 'open-source', documentationUrl: 'https://huggingface.co/openchat', color: '#6366f1', params: '7B', contextK: 8, specialties: ['chat', 'instruct'] },
  // Rednote
  { id: 'dots-llm1-142b', name: 'Dots LLM1 142B MoE', provider: 'Rednote', type: 'open-source', documentationUrl: 'https://huggingface.co/rednote-hilab', color: '#ef4444', params: '142B (MoE)', contextK: 128, specialties: ['MoE', 'algemeen'] },
  // Stability AI
  { id: 'stablelm-2-1.6b', name: 'StableLM 2 1.6B', provider: 'Stability AI', type: 'open-source', documentationUrl: 'https://huggingface.co/stabilityai', color: '#6366f1', params: '1.6B', contextK: 4, specialties: ['ultra licht', 'edge'] },
  // TII Falcon
  { id: 'falcon-7b',     name: 'Falcon 7B',    provider: 'TII', type: 'open-source', documentationUrl: 'https://huggingface.co/tiiuae', color: '#6366f1', params: '7.2B',  contextK: 4, specialties: ['instruct', 'multilingual'] },
  { id: 'falcon3-7b',    name: 'Falcon3 7B',   provider: 'TII', type: 'open-source', documentationUrl: 'https://huggingface.co/tiiuae', color: '#6366f1', params: '7.5B',  contextK: 32, specialties: ['instruct', 'updated'] },
  { id: 'falcon3-10b',   name: 'Falcon3 10B',  provider: 'TII', type: 'open-source', documentationUrl: 'https://huggingface.co/tiiuae', color: '#6366f1', params: '10.3B', contextK: 32, specialties: ['instruct', 'balanced'] },
  { id: 'falcon-40b',    name: 'Falcon 40B',   provider: 'TII', type: 'open-source', documentationUrl: 'https://huggingface.co/tiiuae', color: '#6366f1', params: '40B',   contextK: 2,  specialties: ['krachtig', 'instruct'] },
  { id: 'falcon-180b',   name: 'Falcon 180B',  provider: 'TII', type: 'open-source', documentationUrl: 'https://huggingface.co/tiiuae', color: '#6366f1', params: '180B',  contextK: 2,  specialties: ['large-scale', 'instruct'] },
  // Upstage
  { id: 'solar-10.7b',   name: 'SOLAR 10.7B',  provider: 'Upstage', type: 'open-source', documentationUrl: 'https://huggingface.co/upstage', color: '#6366f1', params: '10.7B', contextK: 4, specialties: ['hoge kwaliteit', 'instruct'] },
  // WizardLM
  { id: 'wizardlm-13b',   name: 'WizardLM 13B',   provider: 'WizardLM', type: 'open-source', documentationUrl: 'https://huggingface.co/WizardLMTeam', color: '#6366f1', params: '13B',   contextK: 4,  specialties: ['instructie', 'chat'] },
  { id: 'wizardcoder-15b', name: 'WizardCoder 15B', provider: 'WizardLM', type: 'open-source', documentationUrl: 'https://huggingface.co/WizardLMTeam', color: '#6366f1', params: '15.5B', contextK: 8,  specialties: ['code', 'instruct'] },
  // xAI
  { id: 'grok-1',        name: 'Grok-1 314B MoE', provider: 'xAI', type: 'open-source', documentationUrl: 'https://github.com/xai-org/grok-1', color: '#6366f1', params: '314B (MoE)', contextK: 8, specialties: ['MoE', 'algemeen', 'open weights'] },
  // Zhipu AI
  { id: 'glm-4-9b',      name: 'GLM-4 9B Chat',   provider: 'Zhipu AI', type: 'open-source', documentationUrl: 'https://huggingface.co/THUDM', color: '#ef4444', params: '9B', contextK: 128, specialties: ['meertalig', 'Chinees', 'instruct'] },
];

export const AI_MODELS: AIModelData[] = [
  ...CLOUD_MODELS,
  ...MISTRAL_MODELS,
  ...META_MODELS,
  ...GOOGLE_OS_MODELS,
  ...MICROSOFT_MODELS,
  ...IBM_MODELS,
  ...QWEN_MODELS,
  ...DEEPSEEK_MODELS,
  ...OTHER_OS_MODELS,
];

export function getModelById(id: string): AIModelData | undefined {
  return AI_MODELS.find((m) => m.id === id);
}

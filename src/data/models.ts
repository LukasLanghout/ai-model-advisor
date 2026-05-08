export interface AIModelData {
  id: string;
  name: string;
  provider: string;
  type: 'cloud' | 'open-source' | 'hybrid';
  documentationUrl: string;
  color: string;
}

// Expanded model database — inspired by llmfit (github.com/AlexsJones/llmfit)
export const AI_MODELS: AIModelData[] = [
  { id: 'claude-3-5-sonnet',  name: 'Claude 3.5 Sonnet',    provider: 'Anthropic',  type: 'cloud',       documentationUrl: 'https://docs.anthropic.com',                         color: '#d97706' },
  { id: 'claude-3-haiku',     name: 'Claude 3 Haiku',       provider: 'Anthropic',  type: 'cloud',       documentationUrl: 'https://docs.anthropic.com',                         color: '#d97706' },
  { id: 'gpt-4o',             name: 'GPT-4o',                provider: 'OpenAI',     type: 'cloud',       documentationUrl: 'https://platform.openai.com/docs',                   color: '#16a34a' },
  { id: 'gpt-4o-mini',        name: 'GPT-4o Mini',          provider: 'OpenAI',     type: 'cloud',       documentationUrl: 'https://platform.openai.com/docs',                   color: '#16a34a' },
  { id: 'gemini-1-5-pro',     name: 'Gemini 1.5 Pro',       provider: 'Google',     type: 'cloud',       documentationUrl: 'https://ai.google.dev/docs',                         color: '#2563eb' },
  { id: 'gemini-1-5-flash',   name: 'Gemini 1.5 Flash',     provider: 'Google',     type: 'cloud',       documentationUrl: 'https://ai.google.dev/docs',                         color: '#2563eb' },
  { id: 'llama-3-1-70b',      name: 'Llama 3.1 70B',        provider: 'Meta',       type: 'open-source', documentationUrl: 'https://llama.meta.com',                             color: '#7c3aed' },
  { id: 'llama-3-1-8b',       name: 'Llama 3.1 8B',         provider: 'Meta',       type: 'open-source', documentationUrl: 'https://llama.meta.com',                             color: '#7c3aed' },
  { id: 'llama-3-3-70b',      name: 'Llama 3.3 70B',        provider: 'Meta',       type: 'open-source', documentationUrl: 'https://llama.meta.com',                             color: '#7c3aed' },
  { id: 'deepseek-r1',        name: 'DeepSeek R1',          provider: 'DeepSeek',   type: 'open-source', documentationUrl: 'https://github.com/deepseek-ai/DeepSeek-R1',         color: '#0f766e' },
  { id: 'qwen-2-5-72b',       name: 'Qwen 2.5 72B',         provider: 'Alibaba',    type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen/Qwen2.5-72B-Instruct',   color: '#ea580c' },
  { id: 'qwen-2-5-coder',     name: 'Qwen 2.5 Coder 32B',  provider: 'Alibaba',    type: 'open-source', documentationUrl: 'https://huggingface.co/Qwen/Qwen2.5-Coder-32B',      color: '#ea580c' },
  { id: 'gemma-2-27b',        name: 'Gemma 2 27B',          provider: 'Google',     type: 'open-source', documentationUrl: 'https://huggingface.co/google/gemma-2-27b-it',       color: '#2563eb' },
  { id: 'mistral-large',      name: 'Mistral Large',        provider: 'Mistral AI', type: 'hybrid',      documentationUrl: 'https://docs.mistral.ai',                            color: '#0891b2' },
  { id: 'mistral-7b',         name: 'Mistral 7B / Mixtral', provider: 'Mistral AI', type: 'open-source', documentationUrl: 'https://docs.mistral.ai',                            color: '#0891b2' },
  { id: 'groq',               name: 'Groq (Llama/Mixtral)', provider: 'Groq',       type: 'cloud',       documentationUrl: 'https://console.groq.com/docs',                      color: '#dc2626' },
  { id: 'phi-3',              name: 'Phi-3.5 Mini',         provider: 'Microsoft',  type: 'open-source', documentationUrl: 'https://huggingface.co/microsoft/Phi-3.5-mini-instruct', color: '#0369a1' },
];

export function getModelById(id: string): AIModelData | undefined {
  return AI_MODELS.find((m) => m.id === id);
}

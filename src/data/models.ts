export interface AIModelData {
  id: string;
  name: string;
  provider: string;
  type: 'cloud' | 'open-source' | 'hybrid';
  documentationUrl: string;
  color: string;
}

export const AI_MODELS: AIModelData[] = [
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', type: 'cloud', documentationUrl: 'https://docs.anthropic.com', color: '#d97706' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', type: 'cloud', documentationUrl: 'https://docs.anthropic.com', color: '#d97706' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', type: 'cloud', documentationUrl: 'https://platform.openai.com/docs', color: '#16a34a' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', type: 'cloud', documentationUrl: 'https://platform.openai.com/docs', color: '#16a34a' },
  { id: 'gemini-1-5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', type: 'cloud', documentationUrl: 'https://ai.google.dev/docs', color: '#2563eb' },
  { id: 'gemini-1-5-flash', name: 'Gemini 1.5 Flash', provider: 'Google', type: 'cloud', documentationUrl: 'https://ai.google.dev/docs', color: '#2563eb' },
  { id: 'llama-3-1-70b', name: 'Llama 3.1 70B', provider: 'Meta', type: 'open-source', documentationUrl: 'https://llama.meta.com', color: '#7c3aed' },
  { id: 'llama-3-1-8b', name: 'Llama 3.1 8B', provider: 'Meta', type: 'open-source', documentationUrl: 'https://llama.meta.com', color: '#7c3aed' },
  { id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral AI', type: 'hybrid', documentationUrl: 'https://docs.mistral.ai', color: '#0891b2' },
  { id: 'mistral-7b', name: 'Mistral 7B', provider: 'Mistral AI', type: 'open-source', documentationUrl: 'https://docs.mistral.ai', color: '#0891b2' },
  { id: 'groq', name: 'Groq (Llama/Mixtral)', provider: 'Groq', type: 'cloud', documentationUrl: 'https://console.groq.com/docs', color: '#dc2626' },
  { id: 'phi-3', name: 'Phi-3 Mini/Medium', provider: 'Microsoft', type: 'open-source', documentationUrl: 'https://azure.microsoft.com/en-us/blog/introducing-phi-3', color: '#0369a1' },
];

export function getModelById(id: string): AIModelData | undefined {
  return AI_MODELS.find((m) => m.id === id);
}

export interface ModelPricing {
  inputPer1M: number;   // USD per 1M input tokens
  outputPer1M: number;  // USD per 1M output tokens
  freeTier?: string;
  groqModelId?: string; // Groq API model ID for playground
  groqAvailable: boolean;
}

// Pricing in USD/1M tokens (May 2026 estimates)
export const PRICING: Record<string, ModelPricing> = {
  'claude-3-5-sonnet': { inputPer1M: 3.00,  outputPer1M: 15.00, groqAvailable: false },
  'claude-3-haiku':    { inputPer1M: 0.25,  outputPer1M: 1.25,  groqAvailable: false },
  'gpt-4o':            { inputPer1M: 5.00,  outputPer1M: 15.00, groqAvailable: false },
  'gpt-4o-mini':       { inputPer1M: 0.15,  outputPer1M: 0.60,  groqAvailable: false },
  'gemini-1-5-pro':    { inputPer1M: 3.50,  outputPer1M: 10.50, groqAvailable: false },
  'gemini-1-5-flash':  { inputPer1M: 0.075, outputPer1M: 0.30,  groqAvailable: false },
  'llama-3-1-70b':     { inputPer1M: 0.59,  outputPer1M: 0.79,  groqModelId: 'llama-3.1-70b-versatile', groqAvailable: true },
  'llama-3-1-8b':      { inputPer1M: 0.05,  outputPer1M: 0.08,  groqModelId: 'llama-3.1-8b-instant',    groqAvailable: true, freeTier: 'Gratis self-hosted' },
  'llama-3-3-70b':     { inputPer1M: 0.59,  outputPer1M: 0.79,  groqModelId: 'llama-3.3-70b-versatile', groqAvailable: true },
  'deepseek-r1':       { inputPer1M: 0.55,  outputPer1M: 2.19,  groqModelId: 'deepseek-r1-distill-llama-70b', groqAvailable: true },
  'qwen-2-5-72b':      { inputPer1M: 0.35,  outputPer1M: 0.40,  groqAvailable: false, freeTier: 'Gratis self-hosted' },
  'qwen-2-5-coder':    { inputPer1M: 0.20,  outputPer1M: 0.20,  groqAvailable: false, freeTier: 'Gratis self-hosted' },
  'gemma-2-27b':       { inputPer1M: 0.00,  outputPer1M: 0.00,  groqModelId: 'gemma2-9b-it',            groqAvailable: true, freeTier: 'Gratis self-hosted' },
  'mistral-large':     { inputPer1M: 3.00,  outputPer1M: 9.00,  groqAvailable: false },
  'mistral-7b':        { inputPer1M: 0.25,  outputPer1M: 0.25,  groqModelId: 'mixtral-8x7b-32768',      groqAvailable: true, freeTier: 'Gratis self-hosted' },
  'groq':              { inputPer1M: 0.06,  outputPer1M: 0.06,  groqModelId: 'llama-3.3-70b-versatile', groqAvailable: true },
  'phi-3':             { inputPer1M: 0.00,  outputPer1M: 0.00,  groqAvailable: false, freeTier: 'Gratis (open source)' },
};

const EUR_RATE = 0.93; // USD → EUR

export function calcMonthlyCostEur(
  modelId: string,
  inputTokensPerMonth: number,
  outputTokensPerMonth: number
): number {
  const p = PRICING[modelId];
  if (!p) return 0;
  const usd =
    (inputTokensPerMonth / 1_000_000) * p.inputPer1M +
    (outputTokensPerMonth / 1_000_000) * p.outputPer1M;
  return usd * EUR_RATE;
}

export const PLAYGROUND_MODELS = [
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B',    inputPer1M: 0.59, outputPer1M: 0.79 },
  { id: 'llama-3.1-8b-instant',    name: 'Llama 3.1 8B',     inputPer1M: 0.05, outputPer1M: 0.08 },
  { id: 'mixtral-8x7b-32768',      name: 'Mixtral 8x7B',     inputPer1M: 0.24, outputPer1M: 0.24 },
];

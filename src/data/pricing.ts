export interface ModelPricing {
  inputPer1M: number;   // USD per 1M input tokens
  outputPer1M: number;  // USD per 1M output tokens
  freeTier?: string;
  groqModelId?: string;
  groqAvailable: boolean;
}

const FREE_SELF_HOSTED: ModelPricing = { inputPer1M: 0, outputPer1M: 0, groqAvailable: false, freeTier: 'Gratis self-hosted' };

// Pricing in USD/1M tokens (May 2026 estimates)
export const PRICING: Record<string, ModelPricing> = {
  // ── Cloud-only ─────────────────────────────────────────────────────────────
  'claude-3-5-sonnet': { inputPer1M: 3.00,  outputPer1M: 15.00, groqAvailable: false },
  'claude-3-haiku':    { inputPer1M: 0.25,  outputPer1M: 1.25,  groqAvailable: false },
  'gpt-4o':            { inputPer1M: 5.00,  outputPer1M: 15.00, groqAvailable: false },
  'gpt-4o-mini':       { inputPer1M: 0.15,  outputPer1M: 0.60,  groqAvailable: false },
  'gemini-1-5-pro':    { inputPer1M: 3.50,  outputPer1M: 10.50, groqAvailable: false },
  'gemini-1-5-flash':  { inputPer1M: 0.075, outputPer1M: 0.30,  groqAvailable: false },
  'groq':              { inputPer1M: 0.06,  outputPer1M: 0.06,  groqModelId: 'llama-3.3-70b-versatile', groqAvailable: true },

  // ── Mistral AI ──────────────────────────────────────────────────────────────
  'mistral-large':       { inputPer1M: 3.00,  outputPer1M: 9.00,  groqAvailable: false },
  'mistral-small-3.1':   { inputPer1M: 0.10,  outputPer1M: 0.30,  groqAvailable: false, freeTier: 'Gratis self-hosted' },
  'mistral-small-24b':   { inputPer1M: 0.10,  outputPer1M: 0.30,  groqAvailable: false, freeTier: 'Gratis self-hosted' },
  'mistral-nemo-12b':    { inputPer1M: 0.15,  outputPer1M: 0.15,  groqAvailable: false, freeTier: 'Gratis self-hosted' },
  'ministral-8b':        { inputPer1M: 0.10,  outputPer1M: 0.10,  groqAvailable: false, freeTier: 'Gratis self-hosted' },
  'mistral-7b':          { inputPer1M: 0.25,  outputPer1M: 0.25,  groqAvailable: false, freeTier: 'Gratis self-hosted' },
  'mixtral-8x22b':       { inputPer1M: 0.65,  outputPer1M: 0.65,  groqAvailable: false, freeTier: 'Gratis self-hosted' },

  // ── Meta Llama ──────────────────────────────────────────────────────────────
  'llama-3.2-1b':        { inputPer1M: 0.04,  outputPer1M: 0.04,  groqAvailable: false, freeTier: 'Gratis self-hosted (~1GB)' },
  'llama-3.2-3b':        { inputPer1M: 0.06,  outputPer1M: 0.06,  groqAvailable: false, freeTier: 'Gratis self-hosted (~2GB)' },
  'llama-3-1-8b':        { inputPer1M: 0.05,  outputPer1M: 0.08,  groqModelId: 'llama-3.1-8b-instant', groqAvailable: true, freeTier: 'Gratis self-hosted (~6GB)' },
  'llama-3.2-11b-vision': { inputPer1M: 0.18, outputPer1M: 0.18,  groqAvailable: false, freeTier: 'Gratis self-hosted (~8GB)' },
  'llama-3-1-70b':       { inputPer1M: 0.59,  outputPer1M: 0.79,  groqModelId: 'llama-3.1-70b-versatile', groqAvailable: true, freeTier: 'Gratis self-hosted (~48GB)' },
  'llama-3-3-70b':       { inputPer1M: 0.59,  outputPer1M: 0.79,  groqModelId: 'llama-3.3-70b-versatile', groqAvailable: true, freeTier: 'Gratis self-hosted (~48GB)' },
  'llama-3.1-405b':      { inputPer1M: 3.00,  outputPer1M: 3.00,  groqAvailable: false, freeTier: 'Gratis self-hosted (~250GB)' },
  'llama-4-scout':       { inputPer1M: 0.18,  outputPer1M: 0.59,  groqAvailable: false, freeTier: 'Gratis self-hosted (~80GB MoE)' },
  'llama-4-maverick':    { inputPer1M: 0.20,  outputPer1M: 0.85,  groqAvailable: false, freeTier: 'Gratis self-hosted (~250GB MoE)' },
  'codellama-7b':        FREE_SELF_HOSTED,
  'codellama-13b':       FREE_SELF_HOSTED,
  'codellama-34b':       FREE_SELF_HOSTED,

  // ── Google Gemma ────────────────────────────────────────────────────────────
  'gemma-3-1b':          FREE_SELF_HOSTED,
  'gemma-2-2b':          FREE_SELF_HOSTED,
  'gemma-3-4b':          FREE_SELF_HOSTED,
  'gemma-2-9b':          FREE_SELF_HOSTED,
  'gemma-3-12b':         FREE_SELF_HOSTED,
  'gemma-3-27b':         FREE_SELF_HOSTED,
  'gemma-2-27b':         { inputPer1M: 0.00,  outputPer1M: 0.00,  groqModelId: 'gemma2-9b-it', groqAvailable: true, freeTier: 'Gratis self-hosted' },

  // ── Microsoft ───────────────────────────────────────────────────────────────
  'phi-3':               { inputPer1M: 0.00,  outputPer1M: 0.00,  groqAvailable: false, freeTier: 'Gratis (open source)' },
  'phi-4-mini':          FREE_SELF_HOSTED,
  'phi-4':               FREE_SELF_HOSTED,
  'phi-3-medium':        FREE_SELF_HOSTED,
  'orca-2-7b':           FREE_SELF_HOSTED,
  'orca-2-13b':          FREE_SELF_HOSTED,

  // ── IBM Granite ─────────────────────────────────────────────────────────────
  'granite-4-micro':     FREE_SELF_HOSTED,
  'granite-4-tiny-moe':  FREE_SELF_HOSTED,
  'granite-3.1-8b':      FREE_SELF_HOSTED,
  'granite-4-small-moe': FREE_SELF_HOSTED,

  // ── Alibaba / Qwen ──────────────────────────────────────────────────────────
  'qwen3-0.6b':          FREE_SELF_HOSTED,
  'qwen3-1.7b':          FREE_SELF_HOSTED,
  'qwen2.5-coder-1.5b':  FREE_SELF_HOSTED,
  'qwen3.5-2b':          FREE_SELF_HOSTED,
  'qwen2.5-vl-3b':       FREE_SELF_HOSTED,
  'qwen3-4b':            FREE_SELF_HOSTED,
  'qwen3.5-4b':          FREE_SELF_HOSTED,
  'qwen2.5-7b':          FREE_SELF_HOSTED,
  'qwen2.5-coder-7b':    FREE_SELF_HOSTED,
  'qwen3-8b':            FREE_SELF_HOSTED,
  'qwen2.5-vl-7b':       FREE_SELF_HOSTED,
  'qwen3.5-9b':          FREE_SELF_HOSTED,
  'qwen2.5-14b':         FREE_SELF_HOSTED,
  'qwen3-14b':           FREE_SELF_HOSTED,
  'qwen2.5-coder-14b':   FREE_SELF_HOSTED,
  'qwen3.5-27b':         FREE_SELF_HOSTED,
  'qwen2.5-32b':         FREE_SELF_HOSTED,
  'qwen3-32b':           FREE_SELF_HOSTED,
  'qwen3-30b-moe':       FREE_SELF_HOSTED,
  'qwen3.5-35b-moe':     FREE_SELF_HOSTED,
  'qwen-2-5-72b':        { inputPer1M: 0.35,  outputPer1M: 0.40,  groqAvailable: false, freeTier: 'Gratis self-hosted' },
  'qwen-2-5-coder':      { inputPer1M: 0.20,  outputPer1M: 0.20,  groqAvailable: false, freeTier: 'Gratis self-hosted' },
  'qwen3.5-122b-moe':    FREE_SELF_HOSTED,
  'qwen3-235b-moe':      FREE_SELF_HOSTED,
  'qwen3.5-397b-moe':    FREE_SELF_HOSTED,
  'qwen3-coder-480b':    FREE_SELF_HOSTED,

  // ── DeepSeek ────────────────────────────────────────────────────────────────
  'deepseek-r1-7b':       { inputPer1M: 0.14,  outputPer1M: 0.28,  groqModelId: 'deepseek-r1-distill-llama-70b', groqAvailable: false, freeTier: 'Gratis self-hosted (~6GB)' },
  'deepseek-coder-v2-16b': FREE_SELF_HOSTED,
  'deepseek-r1-32b':      { inputPer1M: 0.55,  outputPer1M: 2.19,  groqAvailable: false, freeTier: 'Gratis self-hosted (~20GB)' },
  'deepseek-r1':          { inputPer1M: 0.55,  outputPer1M: 2.19,  groqModelId: 'deepseek-r1-distill-llama-70b', groqAvailable: true },
  'deepseek-v3':          { inputPer1M: 0.27,  outputPer1M: 1.10,  groqAvailable: false, freeTier: 'Gratis self-hosted (~400GB)' },

  // ── Other open-source ───────────────────────────────────────────────────────
  'yi-6b-chat':           FREE_SELF_HOSTED,
  'yi-34b-chat':          FREE_SELF_HOSTED,
  'olmo2-32b':            FREE_SELF_HOSTED,
  'ling-lite-16b':        FREE_SELF_HOSTED,
  'bge-large-en':         FREE_SELF_HOSTED,
  'ernie-4.5-300b':       FREE_SELF_HOSTED,
  'starcoder2-7b':        FREE_SELF_HOSTED,
  'starcoder2-15b':       FREE_SELF_HOSTED,
  'bloom-176b':           FREE_SELF_HOSTED,
  'command-r-35b':        { inputPer1M: 0.50,  outputPer1M: 1.50,  groqAvailable: false, freeTier: 'Gratis self-hosted' },
  'tinyllama-1.1b':       FREE_SELF_HOSTED,
  'zephyr-7b':            FREE_SELF_HOSTED,
  'vicuna-7b':            FREE_SELF_HOSTED,
  'vicuna-13b':           FREE_SELF_HOSTED,
  'longcat-flash-560b':   FREE_SELF_HOSTED,
  'kimi-k2':              FREE_SELF_HOSTED,
  'nomic-embed':          FREE_SELF_HOSTED,
  'nous-hermes-2-mixtral': FREE_SELF_HOSTED,
  'openchat-3.5':         FREE_SELF_HOSTED,
  'dots-llm1-142b':       FREE_SELF_HOSTED,
  'stablelm-2-1.6b':      FREE_SELF_HOSTED,
  'falcon-7b':            FREE_SELF_HOSTED,
  'falcon3-7b':           FREE_SELF_HOSTED,
  'falcon3-10b':          FREE_SELF_HOSTED,
  'falcon-40b':           FREE_SELF_HOSTED,
  'falcon-180b':          FREE_SELF_HOSTED,
  'solar-10.7b':          FREE_SELF_HOSTED,
  'wizardlm-13b':         FREE_SELF_HOSTED,
  'wizardcoder-15b':      FREE_SELF_HOSTED,
  'grok-1':               FREE_SELF_HOSTED,
  'glm-4-9b':             FREE_SELF_HOSTED,
};

const EUR_RATE = 0.93;

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
  { id: 'gemma2-9b-it',            name: 'Gemma 2 9B',       inputPer1M: 0.20, outputPer1M: 0.20 },
];

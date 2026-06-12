// ── Conversation ──────────────────────────────────────────
export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type TopicKey =
  | 'useCase'
  | 'scale'
  | 'latency'
  | 'budget'
  | 'privacy'
  | 'languages'
  | 'contextWindow';

export interface ChatResponse {
  type: 'question' | 'ready';
  question?: string;
  hint?: string;
  coveredTopics?: TopicKey[];
  summary?: string;
  scenario?: ExtractedScenario;
}

export interface ExtractedScenario {
  useCase: string;
  scale: string;
  latency: string;
  budget: string;
  privacy: string;
  languages: string[];
  contextWindow: string;
  description: string;
}

export interface UseCase {
  id: string;
  label: string;
  description: string;
  emoji: string;
}

// ── Recommendations ────────────────────────────────────────
export interface ModelRecommendation {
  modelId: string;
  modelName: string;
  provider: string;
  rank: number;
  score: number;
  reasoning: string;
  pros: string[];
  cons: string[];
  estimatedMonthlyCost: string;
  documentationUrl: string;
  type: 'cloud' | 'open-source' | 'hybrid';
  tradeOff?: string;
}

export interface DecisionFactor {
  factor: string;
  impact: string;
  led_to: string;
}

export interface RecommendationResult {
  recommendations: ModelRecommendation[];
  summary: string;
  keyConsiderations: string[];
  topThreeComparison?: string;
  decisionFactors?: DecisionFactor[];
}

// ── Playground ─────────────────────────────────────────────
export interface PlaygroundResult {
  modelId: string;
  modelName: string;
  output: string;
  latency: number;
  inputTokens: number;
  outputTokens: number;
  estimatedCostEur: number;
  error?: string;
}

export interface ImageGenResult {
  image?: string; // base64 data URL
  latency: number;
  error?: string;
}

// ── App state ──────────────────────────────────────────────
export type AppStep = 'intro' | 'conversation' | 'loading' | 'results' | 'explorer';

// ── Model Explorer ─────────────────────────────────────────
export interface ModelInfoResult {
  summary: string;
  strengths: string[];
  useCases: string[];
  limitations: string[];
  alternatives: string[];
  hfData?: {
    downloads: number;
    likes: number;
    tags: string[];
    inference: string;
  };
}

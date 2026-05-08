export type UseCase =
  | 'text-language'
  | 'code-development'
  | 'data-analysis'
  | 'image-vision'
  | 'automation-agents'
  | 'other';

export type Scale =
  | 'prototype'
  | 'small'
  | 'medium'
  | 'large'
  | 'enterprise';

export type Latency =
  | 'realtime'
  | 'interactive'
  | 'batch'
  | 'async';

export type Budget =
  | 'hobby'
  | 'small'
  | 'medium'
  | 'large'
  | 'self-hosted';

export type Privacy =
  | 'open'
  | 'business'
  | 'sensitive'
  | 'confidential';

export type Integration =
  | 'api'
  | 'on-premise'
  | 'edge'
  | 'hybrid';

export interface UserScenario {
  useCase: UseCase | null;
  scale: Scale | null;
  latency: Latency | null;
  budget: Budget | null;
  privacy: Privacy | null;
  integration: Integration | null;
}

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
}

export interface RecommendationResult {
  recommendations: ModelRecommendation[];
  summary: string;
  keyConsiderations: string[];
}

export type AppStep = 'intro' | 'questionnaire' | 'loading' | 'results';
export type QuestionStep = 'useCase' | 'scale' | 'latency' | 'budget' | 'privacy' | 'integration';

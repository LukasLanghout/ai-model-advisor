import { createClient } from '@supabase/supabase-js';
import type { ExtractedScenario } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

export async function saveScenario(sessionId: string, scenario: ExtractedScenario): Promise<void> {
  if (!supabase) return;
  await supabase.from('scenarios').insert({
    session_id: sessionId,
    use_case: scenario.useCase,
    scale: scenario.scale,
    latency: scenario.latency,
    budget: scenario.budget,
    privacy: scenario.privacy,
    languages: scenario.languages,
    description: scenario.description,
  });
}

export async function saveFeedback(
  sessionId: string,
  rating: number,
  topRecommendation: string,
  comment?: string
): Promise<void> {
  if (!supabase) return;
  await supabase.from('feedback').insert({
    session_id: sessionId,
    rating,
    top_recommendation: topRecommendation,
    comment,
  });
}

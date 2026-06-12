import { createClient } from '@supabase/supabase-js';
import type { ExtractedScenario } from '../types';

// Publishable key is veilig om te embedden — RLS beschermt de data (insert-only voor anon)
const DEFAULT_URL = 'https://ibtgllkulueoglqzawas.supabase.co';
const DEFAULT_KEY = 'sb_publishable_OKqxK1x4UbtaoREsdEneeA_82YJdrCq';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || DEFAULT_URL;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || DEFAULT_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export interface StudentFeedback {
  name?: string;
  screen: string;
  feature: string;
  rating: number;
  comment?: string;
}

export async function saveStudentFeedback(fb: StudentFeedback): Promise<{ error?: string }> {
  const { error } = await supabase.from('student_feedback').insert({
    name: fb.name?.trim() || null,
    screen: fb.screen,
    feature: fb.feature,
    rating: fb.rating,
    comment: fb.comment?.trim() || null,
  });
  return error ? { error: error.message } : {};
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

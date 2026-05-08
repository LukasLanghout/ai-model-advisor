import { useState } from 'react';
import type { AppStep, UserScenario, RecommendationResult } from './types';
import Header from './components/Layout/Header';
import IntroScreen from './components/IntroScreen';
import QuestionnaireFlow from './components/Questionnaire/QuestionnaireFlow';
import LoadingScreen from './components/LoadingScreen';
import RecommendationsView from './components/Results/RecommendationsView';
import { saveScenario } from './lib/supabase';

const emptyScenario: UserScenario = {
  useCase: null,
  scale: null,
  latency: null,
  budget: null,
  privacy: null,
  integration: null,
};

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function App() {
  const [appStep, setAppStep] = useState<AppStep>('intro');
  const [scenario, setScenario] = useState<UserScenario>(emptyScenario);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(generateSessionId);

  async function handleSubmit(finalScenario: UserScenario) {
    setScenario(finalScenario);
    setAppStep('loading');
    setError(null);

    await saveScenario(sessionId, finalScenario);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: finalScenario }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error((errData as { error?: string }).error ?? 'Verzoek mislukt');
      }

      const data: RecommendationResult = await res.json();
      setResult(data);
      setAppStep('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een onbekende fout opgetreden.');
      setAppStep('questionnaire');
    }
  }

  function handleRestart() {
    setScenario(emptyScenario);
    setResult(null);
    setError(null);
    setAppStep('intro');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {appStep === 'intro' && <IntroScreen onStart={() => setAppStep('questionnaire')} />}
        {appStep === 'questionnaire' && (
          <QuestionnaireFlow
            onSubmit={handleSubmit}
            initialScenario={scenario}
            apiError={error}
          />
        )}
        {appStep === 'loading' && <LoadingScreen />}
        {appStep === 'results' && result && (
          <RecommendationsView
            result={result}
            scenario={scenario}
            sessionId={sessionId}
            onRestart={handleRestart}
          />
        )}
      </main>
      <footer className="py-6 text-center text-sm text-slate-400 border-t border-slate-200">
        Gebouwd door{' '}
        <a
          href="https://github.com/LukasLanghout"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 hover:underline"
        >
          Lukas Langhout
        </a>{' '}
        · Aangedreven door Llama 3.3 via Groq
      </footer>
    </div>
  );
}

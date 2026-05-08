import { useState } from 'react';
import type { AppStep, ExtractedScenario, RecommendationResult } from './types';
import Header from './components/Layout/Header';
import IntroScreen from './components/IntroScreen';
import ConversationView from './components/Conversation/ConversationView';
import LoadingScreen from './components/LoadingScreen';
import RecommendationsView from './components/Results/RecommendationsView';

export default function App() {
  const [appStep, setAppStep] = useState<AppStep>('intro');
  const [scenario, setScenario] = useState<ExtractedScenario | null>(null);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleScenarioReady(extractedScenario: ExtractedScenario) {
    setScenario(extractedScenario);
    setAppStep('loading');
    setError(null);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: extractedScenario }),
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
      setAppStep('conversation');
    }
  }

  function handleRestart() {
    setScenario(null);
    setResult(null);
    setError(null);
    setAppStep('intro');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {appStep === 'intro' && (
          <IntroScreen onStart={() => setAppStep('conversation')} />
        )}
        {appStep === 'conversation' && (
          <div>
            {error && (
              <div className="max-w-2xl mx-auto px-4 pt-4">
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              </div>
            )}
            <ConversationView onReady={handleScenarioReady} />
          </div>
        )}
        {appStep === 'loading' && <LoadingScreen />}
        {appStep === 'results' && result && scenario && (
          <RecommendationsView
            result={result}
            scenario={scenario}
            onRestart={handleRestart}
          />
        )}
      </main>
      <footer className="no-print py-6 text-center text-sm text-slate-400 border-t border-slate-200">
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

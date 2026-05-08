import { useState } from 'react';
import { RotateCcw, Lightbulb, Star } from 'lucide-react';
import type { RecommendationResult, UserScenario } from '../../types';
import ModelCard from './ModelCard';
import { saveFeedback } from '../../lib/supabase';

interface Props {
  result: RecommendationResult;
  scenario: UserScenario;
  sessionId: string;
  onRestart: () => void;
}

export default function RecommendationsView({ result, sessionId, onRestart }: Props) {
  const [rating, setRating] = useState<number | null>(null);
  const [feedbackSaved, setFeedbackSaved] = useState(false);

  async function handleRating(r: number) {
    setRating(r);
    const topRec = result.recommendations[0]?.modelName ?? '';
    await saveFeedback(sessionId, r, topRec);
    setFeedbackSaved(true);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-slide-up">
      {/* Summary */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-6 sm:p-8 mb-8 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-200 mb-2">Jouw aanbeveling</p>
        <p className="text-base sm:text-lg leading-relaxed">{result.summary}</p>
      </div>

      {/* Key considerations */}
      {result.keyConsiderations?.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">Belangrijke overwegingen</span>
          </div>
          <ul className="space-y-1.5">
            {result.keyConsiderations.map((c) => (
              <li key={c} className="text-sm text-amber-800 flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      <h2 className="font-bold text-slate-900 text-lg mb-4">
        Aanbevolen modellen ({result.recommendations.length})
      </h2>
      <div className="space-y-4 mb-10">
        {result.recommendations.map((rec, i) => (
          <ModelCard key={rec.modelId} rec={rec} isTop={i === 0} />
        ))}
      </div>

      {/* Feedback */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 text-center">
        <p className="font-semibold text-slate-800 mb-1">Hoe nuttig was deze aanbeveling?</p>
        <p className="text-sm text-slate-500 mb-4">Jouw feedback helpt de tool verbeteren.</p>
        {feedbackSaved ? (
          <p className="text-sm text-green-600 font-medium">Bedankt voor je feedback!</p>
        ) : (
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRating(r)}
                className={`w-10 h-10 rounded-xl border-2 transition-all flex items-center justify-center ${
                  rating === r
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-slate-200 hover:border-brand-300'
                }`}
              >
                <Star
                  className={`w-5 h-5 ${rating !== null && r <= rating ? 'text-brand-500 fill-brand-500' : 'text-slate-300'}`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Restart */}
      <div className="text-center">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Opnieuw starten
        </button>
      </div>
    </div>
  );
}

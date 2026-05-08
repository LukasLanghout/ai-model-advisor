import { ExternalLink, CheckCircle, XCircle, Euro } from 'lucide-react';
import type { ModelRecommendation } from '../../types';

const TYPE_LABEL: Record<string, string> = {
  cloud: 'Cloud',
  'open-source': 'Open source',
  hybrid: 'Hybride',
};

const TYPE_COLOR: Record<string, string> = {
  cloud: 'bg-blue-100 text-blue-700',
  'open-source': 'bg-purple-100 text-purple-700',
  hybrid: 'bg-teal-100 text-teal-700',
};

interface Props {
  rec: ModelRecommendation;
  isTop: boolean;
}

export default function ModelCard({ rec, isTop }: Props) {
  const scorePercent = (rec.score / 10) * 100;

  return (
    <article
      aria-label={`${rec.modelName} — score ${rec.score} van 10${isTop ? ' (top keuze)' : ''}`}
      className={`bg-white rounded-2xl border p-6 transition-shadow hover:shadow-md ${
        isTop ? 'border-brand-400 shadow-sm ring-1 ring-brand-200' : 'border-slate-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {isTop && (
              <span className="px-2 py-0.5 rounded-full bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wide">
                Top keuze
              </span>
            )}
            <span className="text-xs text-slate-400 font-medium" aria-label={`Rang ${rec.rank}`}>
              #{rec.rank}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${TYPE_COLOR[rec.type] ?? 'bg-slate-100 text-slate-600'}`}>
              {TYPE_LABEL[rec.type] ?? rec.type}
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-lg leading-tight">{rec.modelName}</h3>
          <p className="text-sm text-slate-500">{rec.provider}</p>
        </div>
        {/* Score — visually prominent, accessible via article aria-label */}
        <div className="flex-shrink-0 text-right" aria-hidden="true">
          <div className="text-2xl font-bold text-brand-600">{rec.score.toFixed(1)}</div>
          <div className="text-[10px] text-slate-400">/ 10</div>
        </div>
      </div>

      {/* Score bar with accessible description */}
      <div
        role="progressbar"
        aria-valuenow={rec.score}
        aria-valuemin={0}
        aria-valuemax={10}
        aria-label={`Score: ${rec.score} van 10`}
        className="h-1.5 bg-slate-100 rounded-full mb-4"
      >
        <div
          className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all"
          style={{ width: `${scorePercent}%` }}
        />
      </div>

      {/* Reasoning */}
      <p className="text-sm text-slate-600 leading-relaxed mb-4">{rec.reasoning}</p>

      {/* Pros & Cons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Voordelen</p>
          <ul className="space-y-1" role="list">
            {rec.pros.map((p) => (
              <li key={p} className="flex items-start gap-1.5 text-xs text-slate-700">
                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Nadelen</p>
          <ul className="space-y-1" role="list">
            {rec.cons.map((c) => (
              <li key={c} className="flex items-start gap-1.5 text-xs text-slate-700">
                <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Trade-off note */}
      {rec.tradeOff && (
        <p className="text-xs text-brand-700 bg-brand-50 rounded-lg px-3 py-2 mb-4">
          💡 {rec.tradeOff}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Euro className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span>{rec.estimatedMonthlyCost}</span>
        </div>
        <a
          href={rec.documentationUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Documentatie voor ${rec.modelName} (opent in nieuw tabblad)`}
          className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium min-h-[44px] focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:rounded"
        >
          Documentatie
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

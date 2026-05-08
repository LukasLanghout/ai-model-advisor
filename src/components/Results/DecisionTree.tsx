import { ArrowRight } from 'lucide-react';
import type { DecisionFactor, ModelRecommendation } from '../../types';

interface Props {
  decisionFactors?: DecisionFactor[];
  topRecommendation: ModelRecommendation;
  summary: string;
}

const IMPACT_STYLE: Record<string, string> = {
  hoog: 'bg-red-50 border-red-200 text-red-700',
  medium: 'bg-amber-50 border-amber-200 text-amber-700',
  laag: 'bg-blue-50 border-blue-200 text-blue-600',
};

export default function DecisionTree({ decisionFactors, topRecommendation, summary }: Props) {
  const factors = decisionFactors ?? [];

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold text-slate-800 mb-1">Beslissingspad</h3>
        <p className="text-sm text-slate-500">
          Hoe jouw antwoorden hebben geleid tot de top aanbeveling.
        </p>
      </div>

      {/* Summary banner */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-200 mb-1">Conclusie</p>
        <p className="text-sm leading-relaxed">{summary}</p>
      </div>

      {/* Decision factors */}
      {factors.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Beslissende factoren</p>
          {factors.map((f, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 mt-0.5">
                {idx + 1}
              </div>
              <div className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-semibold text-slate-800">{f.factor}</span>
                  <span className={`text-xs px-2 py-0.5 rounded border font-medium ${IMPACT_STYLE[f.impact] ?? 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                    Impact: {f.impact}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <ArrowRight className="w-3 h-3 text-brand-400" />
                  {f.led_to}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top recommendation callout */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-5">
        <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">Top aanbeveling</p>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="font-bold text-slate-900 text-lg">{topRecommendation.modelName}</p>
            <p className="text-sm text-slate-500">{topRecommendation.provider} · Score: {topRecommendation.score}/10</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Geschatte kosten</p>
            <p className="font-semibold text-slate-800">{topRecommendation.estimatedMonthlyCost}</p>
          </div>
        </div>
        {topRecommendation.tradeOff && (
          <p className="text-xs text-green-700 mt-3 border-t border-green-200 pt-3">
            💡 {topRecommendation.tradeOff}
          </p>
        )}
      </div>
    </div>
  );
}

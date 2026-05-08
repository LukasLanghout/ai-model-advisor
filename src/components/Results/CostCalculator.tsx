import { useState } from 'react';
import { calcMonthlyCostEur, PRICING } from '../../data/pricing';
import type { ModelRecommendation } from '../../types';

interface Props {
  recommendations: ModelRecommendation[];
}

const PRESET_LABELS = [
  { label: 'Prototype', inputM: 0.1, outputM: 0.05 },
  { label: 'Klein (1K req/dag)', inputM: 2, outputM: 1 },
  { label: 'Medium (10K req/dag)', inputM: 20, outputM: 10 },
  { label: 'Groot (100K req/dag)', inputM: 200, outputM: 100 },
];

export default function CostCalculator({ recommendations }: Props) {
  const [inputM, setInputM] = useState(2);
  const [outputM, setOutputM] = useState(1);
  const [activePreset, setActivePreset] = useState(1);

  function applyPreset(idx: number) {
    setActivePreset(idx);
    setInputM(PRESET_LABELS[idx].inputM);
    setOutputM(PRESET_LABELS[idx].outputM);
  }

  const rows = recommendations.map((rec) => {
    const cost = calcMonthlyCostEur(rec.modelId, inputM * 1_000_000, outputM * 1_000_000);
    const pricing = PRICING[rec.modelId];
    const isFree = pricing?.freeTier != null && cost === 0;
    return { rec, cost, isFree, freeTier: pricing?.freeTier };
  }).sort((a, b) => a.cost - b.cost);

  const maxCost = Math.max(...rows.map((r) => r.cost), 0.01);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-slate-800 mb-1">Maandelijkse kostenraming</h3>
        <p className="text-sm text-slate-500">
          Pas het verwachte tokenvolume aan om de kosten per model te vergelijken.
        </p>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {PRESET_LABELS.map((p, i) => (
          <button
            key={p.label}
            type="button"
            onClick={() => applyPreset(i)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              activePreset === i
                ? 'bg-brand-600 text-white border-brand-600'
                : 'border-slate-200 text-slate-600 hover:border-brand-300'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Input tokens/maand: <span className="text-brand-600 font-semibold">{inputM}M</span>
          </label>
          <input
            type="range"
            min={0.1}
            max={500}
            step={0.1}
            value={inputM}
            onChange={(e) => { setInputM(Number(e.target.value)); setActivePreset(-1); }}
            className="w-full accent-brand-600"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Output tokens/maand: <span className="text-brand-600 font-semibold">{outputM}M</span>
          </label>
          <input
            type="range"
            min={0.05}
            max={250}
            step={0.05}
            value={outputM}
            onChange={(e) => { setOutputM(Number(e.target.value)); setActivePreset(-1); }}
            className="w-full accent-brand-600"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Model</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kosten/maand</th>
              <th className="hidden sm:table-cell px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vergelijking</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map(({ rec, cost, isFree, freeTier }, idx) => (
              <tr key={rec.modelId} className={idx === 0 ? 'bg-green-50' : ''}>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-800">{rec.modelName}</div>
                  <div className="text-xs text-slate-400">{rec.provider}</div>
                </td>
                <td className="px-4 py-3 text-right">
                  {isFree ? (
                    <div>
                      <span className="font-semibold text-green-600">Gratis</span>
                      <div className="text-xs text-slate-400">{freeTier}</div>
                    </div>
                  ) : (
                    <span className={`font-semibold ${idx === 0 ? 'text-green-700' : 'text-slate-800'}`}>
                      €{cost.toFixed(2)}
                    </span>
                  )}
                </td>
                <td className="hidden sm:table-cell px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${idx === 0 ? 'bg-green-500' : 'bg-brand-400'}`}
                        style={{ width: `${Math.min(100, (cost / maxCost) * 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400">
        * Prijzen zijn schattingen in EUR (koers 0.93). Self-hosted open source modellen tellen alleen serverkosten, niet weergegeven hier.
      </p>
    </div>
  );
}

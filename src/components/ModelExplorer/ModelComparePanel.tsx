import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { getModelById } from '../../data/models';
import { PRICING } from '../../data/pricing';
import { COMPLIANCE_DATA } from '../../data/compliance';

interface CompareResult {
  verdict: string;
  differences: string[];
  whenToPick: Array<{ model: string; when: string }>;
}

interface Props {
  modelIds: string[];
  onBack: () => void;
}

const GDPR_LABEL: Record<string, string> = {
  green: 'Veilig',
  yellow: 'Let op',
  red: 'Risico',
};
const GDPR_CLASS: Record<string, string> = {
  green: 'text-green-700 bg-green-50',
  yellow: 'text-amber-700 bg-amber-50',
  red: 'text-red-700 bg-red-50',
};
const DUTCH_LABEL: Record<string, string> = {
  excellent: 'Uitstekend',
  good: 'Goed',
  fair: 'Redelijk',
  basic: 'Basis',
};
const TRAINING_LABEL: Record<string, string> = {
  no: 'Nee',
  'opt-out': 'Opt-out',
  yes: 'Ja',
  unknown: 'Onbekend',
};

export default function ModelComparePanel({ modelIds, onBack }: Props) {
  const reduced = useReducedMotion();
  const models = modelIds
    .map((id) => getModelById(id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  const [analysis, setAnalysis] = useState<CompareResult | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(true);
  const [analysisError, setAnalysisError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setAnalysisLoading(true);
    setAnalysisError('');

    fetch('/api/compare-models', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        models: models.map((m) => ({
          id: m.id, name: m.name, provider: m.provider,
          params: m.params, contextK: m.contextK, specialties: m.specialties,
        })),
      }),
    })
      .then(async (r) => {
        const data = await r.json() as CompareResult & { error?: string };
        if (cancelled) return;
        if (!r.ok || data.error) {
          setAnalysisError(data.error ?? `HTTP ${r.status}`);
        } else {
          setAnalysis(data);
        }
      })
      .catch((err) => { if (!cancelled) setAnalysisError(String(err)); })
      .finally(() => { if (!cancelled) setAnalysisLoading(false); });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelIds.join(',')]);

  function fmtPrice(id: string): string {
    const p = PRICING[id];
    if (!p) return '—';
    if (p.inputPer1M === 0 && p.outputPer1M === 0) return p.freeTier ?? 'Gratis';
    return `$${p.inputPer1M.toFixed(2)} / $${p.outputPer1M.toFixed(2)} per 1M`;
  }

  const rows: Array<{ label: string; render: (id: string) => React.ReactNode }> = [
    { label: 'Provider',       render: (id) => getModelById(id)?.provider ?? '—' },
    { label: 'Type',           render: (id) => getModelById(id)?.type ?? '—' },
    { label: 'Parameters',     render: (id) => getModelById(id)?.params ?? '—' },
    { label: 'Contextvenster', render: (id) => { const k = getModelById(id)?.contextK; return k ? `${k}K tokens` : '—'; } },
    { label: 'Sterk in',       render: (id) => getModelById(id)?.specialties?.join(', ') ?? '—' },
    { label: 'Prijs (in/uit)', render: (id) => fmtPrice(id) },
    {
      label: 'AVG / GDPR',
      render: (id) => {
        const c = COMPLIANCE_DATA[id];
        if (!c) return '—';
        return (
          <span className={`inline-block text-xs px-2 py-0.5 rounded-md font-medium ${GDPR_CLASS[c.gdpr]}`}>
            {GDPR_LABEL[c.gdpr]}
          </span>
        );
      },
    },
    { label: 'Dataresidentie',     render: (id) => COMPLIANCE_DATA[id]?.dataResidency ?? '—' },
    { label: 'Traint op prompts',  render: (id) => { const t = COMPLIANCE_DATA[id]?.trainingOnPrompts; return t ? TRAINING_LABEL[t] : '—'; } },
    { label: 'Nederlands',         render: (id) => { const d = COMPLIANCE_DATA[id]?.dutchQuality; return d ? DUTCH_LABEL[d] : '—'; } },
    { label: 'Open source',        render: (id) => { const c = COMPLIANCE_DATA[id]; return c ? (c.openSource ? 'Ja' : 'Nee') : '—'; } },
  ];

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Terug naar zoeken"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Vergelijking: {models.map((m) => m.name).join(' vs. ')}
          </h2>
          <p className="text-sm text-slate-500">{models.length} modellen naast elkaar</p>
        </div>
      </div>

      {/* Vergelijkingstabel */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left font-medium text-slate-500 px-4 py-3 w-36 sm:w-44"> </th>
              {models.map((m) => (
                <th key={m.id} className="text-left font-semibold text-slate-900 px-4 py-3 min-w-[160px]">
                  {m.name}
                  <span className="block text-xs font-normal text-slate-400 font-mono">{m.id}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 text-slate-500 font-medium align-top">{row.label}</td>
                {models.map((m) => (
                  <td key={m.id} className="px-4 py-3 text-slate-700 align-top">
                    {row.render(m.id)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI-analyse */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <h3 className="font-semibold text-slate-800 text-sm">AI-analyse van de verschillen</h3>
          <span className="text-xs text-slate-400">via Llama 3.3 (Groq)</span>
        </div>

        {analysisLoading && (
          <div className="space-y-2 animate-pulse" aria-label="Analyse wordt geladen">
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-5/6" />
            <div className="h-3 bg-slate-100 rounded w-4/6" />
          </div>
        )}

        {analysisError && !analysisLoading && (
          <div className="flex items-start gap-2 text-red-600">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{analysisError}</p>
          </div>
        )}

        {analysis && !analysisLoading && (
          <div className="space-y-5">
            <p className="text-sm text-slate-700 leading-relaxed">{analysis.verdict}</p>

            {analysis.differences?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                  Belangrijkste verschillen
                </p>
                <ul className="space-y-1.5">
                  {analysis.differences.map((d) => (
                    <li key={d} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-brand-600 flex-shrink-0">·</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.whenToPick?.length > 0 && (
              <div className={`grid grid-cols-1 ${models.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3`}>
                {analysis.whenToPick.map((w) => (
                  <div key={w.model} className="border border-slate-200 rounded-md p-3">
                    <p className="text-sm font-medium text-slate-800 mb-1">{w.model}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{w.when}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {analysisLoading && (
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <Loader2 className="w-3 h-3 animate-spin" />
          Groq analyseert de verschillen…
        </p>
      )}
    </motion.div>
  );
}

import { useState, useEffect } from 'react';
import { Play, Loader2, Clock, Coins, AlertCircle, Cpu, TrendingUp, Search } from 'lucide-react';
import { PLAYGROUND_MODELS } from '../../data/pricing';
import type { PlaygroundResult } from '../../types';

// ── Types ──────────────────────────────────────────────────────────────────────
interface HFModelInfo {
  id: string;
  downloads: number;
  likes: number;
  gated: boolean;
  inference: string;
  tags: string[];
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function PlaygroundView() {
  const [prompt, setPrompt] = useState('');

  // Groq
  const [results, setResults]     = useState<PlaygroundResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // HuggingFace
  const [trendingModels, setTrendingModels]   = useState<HFModelInfo[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [hfModelInput, setHfModelInput]       = useState('');
  const [hfResult, setHfResult]               = useState<PlaygroundResult | null>(null);
  const [isRunningHf, setIsRunningHf]         = useState(false);

  // Load trending HF models on mount
  useEffect(() => {
    fetch('/api/hf-models?limit=12')
      .then(async (r) => {
        if (!r.ok) return [] as HFModelInfo[];
        return (await r.json()) as HFModelInfo[];
      })
      .then((models) => {
        const filtered = models.filter((m) => !m.gated).slice(0, 10);
        setTrendingModels(filtered);
        if (filtered.length > 0) setHfModelInput(filtered[0].id);
      })
      .catch(() => setTrendingModels([]))
      .finally(() => setTrendingLoading(false));
  }, []);

  // ── Groq runner ──────────────────────────────────────────
  async function runGroqPlayground() {
    if (!prompt.trim() || isRunning) return;
    setIsRunning(true);
    setResults([]);

    const responses = await Promise.all(
      PLAYGROUND_MODELS.map(async (model) => {
        try {
          const res = await fetch('/api/playground', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt,
              modelId:    model.id,
              modelName:  model.name,
              inputPer1M: model.inputPer1M,
              outputPer1M: model.outputPer1M,
              provider: 'groq',
            }),
          });
          if (!res.ok) {
            return {
              modelId: model.id, modelName: model.name,
              output: '', latency: 0, inputTokens: 0, outputTokens: 0,
              estimatedCostEur: 0, error: `HTTP ${res.status}`,
            } satisfies PlaygroundResult;
          }
          return (await res.json()) as PlaygroundResult;
        } catch (err) {
          return {
            modelId: model.id, modelName: model.name,
            output: '', latency: 0, inputTokens: 0, outputTokens: 0,
            estimatedCostEur: 0, error: String(err),
          } satisfies PlaygroundResult;
        }
      }),
    );

    setResults(responses);
    setIsRunning(false);
  }

  // ── HuggingFace runner ───────────────────────────────────
  async function runHfPlayground() {
    const modelId = hfModelInput.trim();
    if (!prompt.trim() || !modelId || isRunningHf) return;
    setIsRunningHf(true);
    setHfResult(null);

    try {
      const res = await fetch('/api/playground', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          modelId,
          modelName:  modelId.split('/').pop() ?? modelId,
          inputPer1M: 0,
          outputPer1M: 0,
          provider: 'huggingface',
        }),
      });
      setHfResult((await res.json()) as PlaygroundResult);
    } catch (err) {
      setHfResult({
        modelId,
        modelName: modelId.split('/').pop() ?? modelId,
        output: '', latency: 0, inputTokens: 0, outputTokens: 0,
        estimatedCostEur: 0, error: String(err),
      });
    } finally {
      setIsRunningHf(false);
    }
  }

  const fastest = results.length
    ? results.reduce((a, b) => (a.latency < b.latency ? a : b)).modelId
    : null;

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="font-semibold text-slate-800 mb-1">Live Playground</h3>
        <p className="text-sm text-slate-500">
          Test je prompt op Groq-modellen én elk HuggingFace-model. Vergelijk output, snelheid en kosten.
        </p>
      </div>

      {/* Shared prompt */}
      <div className="space-y-2">
        <label htmlFor="playground-prompt" className="block text-sm font-medium text-slate-700">
          Jouw prompt
        </label>
        <textarea
          id="playground-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="Schrijf hier je test prompt… Bijv. 'Vat de voor- en nadelen van microservices samen in 5 punten.'"
          className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none bg-slate-50"
        />
      </div>

      {/* ── Groq Section ── */}
      <div className="rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Cpu className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <span className="font-medium text-slate-800 text-sm">Groq Modellen</span>
            <span className="text-xs text-slate-400 hidden sm:inline">— ultra-lage latency inferentie</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {PLAYGROUND_MODELS.map((m) => (
              <span key={m.id} className="text-xs px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg">
                {m.name}
              </span>
            ))}
            <button
              type="button"
              onClick={runGroqPlayground}
              disabled={!prompt.trim() || isRunning}
              aria-label="Run alle Groq modellen"
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
            >
              {isRunning
                ? <><Loader2 className="w-4 h-4 animate-spin" />Bezig…</>
                : <><Play className="w-4 h-4" />Run alle</>}
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Skeleton */}
          {isRunning && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PLAYGROUND_MODELS.map((m) => <SkeletonCard key={m.id} name={m.name} />)}
            </div>
          )}

          {/* Results */}
          {results.length > 0 && !isRunning && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.map((result) => (
                <ResultCard key={result.modelId} result={result} highlight={result.modelId === fastest} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!results.length && !isRunning && (
            <p className="text-center text-sm text-slate-400 py-6">
              Voer een prompt in en klik "Run alle" om de 3 Groq-modellen te vergelijken.
            </p>
          )}
        </div>
      </div>

      {/* ── HuggingFace Section ── */}
      <div className="rounded-2xl border border-brand-200 overflow-hidden">
        <div className="px-5 py-4 bg-brand-50 border-b border-brand-100 flex items-center gap-2 flex-wrap">
          <TrendingUp className="w-4 h-4 text-brand-600 flex-shrink-0" />
          <span className="font-medium text-slate-800 text-sm">HuggingFace Explorer</span>
          <span className="text-xs text-slate-400 hidden sm:inline">— elk model testen via de HF Inference API</span>
        </div>

        <div className="p-5 space-y-4">
          {/* Trending pills */}
          <div>
            <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
              Trending · live via HF Hub
            </p>
            {trendingLoading ? (
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="h-7 w-32 bg-slate-100 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : trendingModels.length > 0 ? (
              <div className="flex gap-2 flex-wrap">
                {trendingModels.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setHfModelInput(m.id)}
                    title={m.id}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors truncate max-w-[200px] ${
                      hfModelInput === m.id
                        ? 'border-brand-500 bg-brand-50 text-brand-700 font-medium'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:bg-brand-50'
                    }`}
                  >
                    {m.id.split('/').pop()}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Trending modellen niet beschikbaar — vul handmatig een model ID in.
              </p>
            )}
          </div>

          {/* Model input + run button */}
          <div className="flex gap-2">
            <div className="flex-1 relative min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={hfModelInput}
                onChange={(e) => setHfModelInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runHfPlayground()}
                placeholder="bijv. meta-llama/Llama-3.3-70B-Instruct"
                aria-label="HuggingFace model ID"
                className="w-full text-sm border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white"
              />
            </div>
            <button
              type="button"
              onClick={runHfPlayground}
              disabled={!prompt.trim() || !hfModelInput.trim() || isRunningHf}
              aria-label="Run geselecteerd HuggingFace model"
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap"
            >
              {isRunningHf
                ? <><Loader2 className="w-4 h-4 animate-spin" />Bezig…</>
                : <><Play className="w-4 h-4" />Run model</>}
            </button>
          </div>

          {/* HF skeleton */}
          {isRunningHf && (
            <SkeletonCard name={hfModelInput.split('/').pop() ?? hfModelInput} />
          )}

          {/* HF result */}
          {hfResult && !isRunningHf && (
            <ResultCard result={hfResult} highlight={false} badge="🤗 HuggingFace" />
          )}

          {/* Hint */}
          <p className="text-xs text-slate-400 leading-relaxed">
            💡 Vereist{' '}
            <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">HUGGINGFACE_TOKEN</code>{' '}
            in Vercel env vars. Kies modellen met{' '}
            <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">inference: warm</code>{' '}
            voor directe respons zonder cold-start.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

interface ResultCardProps {
  result: PlaygroundResult;
  highlight: boolean;
  badge?: string;
}

function ResultCard({ result, highlight, badge }: ResultCardProps) {
  return (
    <div
      className={`bg-white border rounded-xl overflow-hidden flex flex-col ${
        highlight ? 'border-green-400 ring-1 ring-green-200' : 'border-slate-200'
      }`}
    >
      <div className="px-4 py-3 border-b border-slate-100 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{result.modelName}</p>
          {highlight && <span className="text-xs text-green-600 font-medium">⚡ Snelste</span>}
          {badge && <span className="text-xs text-brand-600 font-medium">{badge}</span>}
        </div>
      </div>

      {result.error ? (
        <div className="flex-1 p-4 flex items-start gap-2 text-red-600">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-xs break-words">{result.error}</p>
        </div>
      ) : (
        <div className="flex-1 p-4">
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap line-clamp-8">
            {result.output}
          </p>
        </div>
      )}

      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500 flex-wrap">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {result.latency}ms
        </span>
        <span className="flex items-center gap-1">
          <Coins className="w-3 h-3" />
          {result.estimatedCostEur > 0 ? `€${result.estimatedCostEur.toFixed(5)}` : 'gratis'}
        </span>
        {(result.inputTokens + result.outputTokens) > 0 && (
          <span>{result.inputTokens + result.outputTokens} tokens</span>
        )}
      </div>
    </div>
  );
}

function SkeletonCard({ name }: { name: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 animate-pulse">
      <div className="h-3 bg-slate-200 rounded w-1/2 mb-3" />
      <div className="space-y-2">
        <div className="h-2 bg-slate-100 rounded" />
        <div className="h-2 bg-slate-100 rounded w-5/6" />
        <div className="h-2 bg-slate-100 rounded w-4/6" />
      </div>
      <p className="text-xs text-slate-400 mt-3 truncate">{name} — aan het genereren…</p>
    </div>
  );
}

import { useState } from 'react';
import { Play, Loader2, Clock, Coins, AlertCircle } from 'lucide-react';
import { PLAYGROUND_MODELS } from '../../data/pricing';
import type { PlaygroundResult } from '../../types';

export default function PlaygroundView() {
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState<PlaygroundResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  async function runPlayground() {
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
              modelId: model.id,
              modelName: model.name,
              inputPer1M: model.inputPer1M,
              outputPer1M: model.outputPer1M,
            }),
          });
          if (!res.ok) {
            return {
              modelId: model.id,
              modelName: model.name,
              output: '',
              latency: 0,
              inputTokens: 0,
              outputTokens: 0,
              estimatedCostEur: 0,
              error: `HTTP ${res.status}`,
            } satisfies PlaygroundResult;
          }
          return (await res.json()) as PlaygroundResult;
        } catch (err) {
          return {
            modelId: model.id,
            modelName: model.name,
            output: '',
            latency: 0,
            inputTokens: 0,
            outputTokens: 0,
            estimatedCostEur: 0,
            error: String(err),
          } satisfies PlaygroundResult;
        }
      })
    );

    setResults(responses);
    setIsRunning(false);
  }

  const fastest = results.length
    ? results.reduce((a, b) => (a.latency < b.latency ? a : b)).modelId
    : null;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold text-slate-800 mb-1">Live Playground</h3>
        <p className="text-sm text-slate-500">
          Test dezelfde prompt gelijktijdig op 3 Groq-modellen. Vergelijk output, snelheid en kosten.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">Jouw prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="Schrijf hier je test prompt... Bijv. 'Vat de voor- en nadelen van microservices samen in 5 punten.'"
          className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none bg-slate-50"
        />
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {PLAYGROUND_MODELS.map((m) => (
              <span key={m.id} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">
                {m.name}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={runPlayground}
            disabled={!prompt.trim() || isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Bezig...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run alle modellen
              </>
            )}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {results.map((result) => (
            <div
              key={result.modelId}
              className={`bg-white border rounded-xl overflow-hidden flex flex-col ${
                result.modelId === fastest ? 'border-green-400 ring-1 ring-green-200' : 'border-slate-200'
              }`}
            >
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{result.modelName}</p>
                  {result.modelId === fastest && (
                    <span className="text-xs text-green-600 font-medium">⚡ Snelste</span>
                  )}
                </div>
              </div>

              {result.error ? (
                <div className="flex-1 p-4 flex items-start gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-xs">{result.error}</p>
                </div>
              ) : (
                <div className="flex-1 p-4">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap line-clamp-6">
                    {result.output}
                  </p>
                </div>
              )}

              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {result.latency}ms
                </span>
                <span className="flex items-center gap-1">
                  <Coins className="w-3 h-3" />
                  €{result.estimatedCostEur.toFixed(5)}
                </span>
                <span>
                  {result.inputTokens + result.outputTokens} tokens
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isRunning && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLAYGROUND_MODELS.map((m) => (
            <div key={m.id} className="bg-white border border-slate-200 rounded-xl p-4 animate-pulse">
              <div className="h-3 bg-slate-200 rounded w-1/2 mb-3" />
              <div className="space-y-2">
                <div className="h-2 bg-slate-100 rounded" />
                <div className="h-2 bg-slate-100 rounded w-5/6" />
                <div className="h-2 bg-slate-100 rounded w-4/6" />
              </div>
              <p className="text-xs text-slate-400 mt-3">{m.name} — aan het genereren...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

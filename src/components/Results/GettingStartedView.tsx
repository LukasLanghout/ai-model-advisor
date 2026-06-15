import { useState, useEffect } from 'react';
import { Loader2, Copy, Check, ExternalLink, Key, Terminal, Code2, MessageSquare, AlertCircle, Download } from 'lucide-react';
import type { ModelRecommendation, GettingStartedResult } from '../../types';

interface Props {
  topRec: ModelRecommendation;
  useCase: string;
  scenario: string;
}

export default function GettingStartedView({ topRec, useCase, scenario }: Props) {
  const [data, setData]       = useState<GettingStartedResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [copied, setCopied]   = useState<'prompt' | 'code' | 'test' | null>(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('/api/getting-started', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        modelId: topRec.modelId,
        modelName: topRec.modelName,
        provider: topRec.provider,
        type: topRec.type,
        useCase,
        scenario,
      }),
    })
      .then(async (r) => {
        const json = await r.json() as GettingStartedResult & { error?: string };
        if (!r.ok || json.error) throw new Error(json.error ?? `HTTP ${r.status}`);
        setData(json);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [topRec.modelId]);

  function copyText(text: string, key: 'prompt' | 'code' | 'test') {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  if (loading) {
    return (
      <div className="space-y-4 py-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
          Stappenplan wordt gegenereerd voor {topRec.modelName}…
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse space-y-2">
            <div className="h-3 bg-slate-100 rounded w-1/3" />
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-2 text-red-600 py-4 text-sm">
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">

      {/* ── Stap 1: API-toegang ── */}
      <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <Key className="w-4 h-4 text-brand-600" />
          <h3 className="font-semibold text-slate-800 text-sm">Stap 1 — API-toegang aanvragen bij {topRec.provider}</h3>
        </div>
        <div className="px-5 py-4">
          <ol className="space-y-3">
            {data.apiKeySteps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-700">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <a
            href={data.apiKeyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-brand-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            API-sleutel aanvragen
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* ── Stap 2: Lokaal installeren (open-source) ── */}
      {data.localSetupSteps && (
        <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
            <Download className="w-4 h-4 text-brand-600" />
            <h3 className="font-semibold text-slate-800 text-sm">Stap 2 — Lokaal installeren via Ollama (aanbevolen)</h3>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs text-slate-500 mb-3">
              Ollama laat je open-source modellen lokaal draaien — geen API-key nodig, volledig privé.
            </p>
            <ol className="space-y-3">
              {data.localSetupSteps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            {data.ollamaModelName && (
              <div className="mt-4 bg-slate-900 rounded-lg px-4 py-3 font-mono text-sm text-green-400 flex items-center justify-between gap-3">
                <span>$ ollama pull {data.ollamaModelName}</span>
                <button
                  type="button"
                  onClick={() => copyText(`ollama pull ${data.ollamaModelName}`, 'test')}
                  className="flex-shrink-0 text-slate-400 hover:text-white transition-colors"
                  aria-label="Kopieer commando"
                >
                  {copied === 'test' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}
            <a
              href="https://ollama.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-brand-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              Ollama downloaden
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      )}

      {/* ── Stap 3: Startprompt ── */}
      <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-600" />
            <h3 className="font-semibold text-slate-800 text-sm">
              Stap {data.localSetupSteps ? '3' : '2'} — Kant-en-klare startprompt voor jouw use case
            </h3>
          </div>
          <button
            type="button"
            onClick={() => copyText(data.starterPrompt, 'prompt')}
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-slate-200 rounded-md text-slate-600 hover:border-brand-300 hover:text-brand-600 transition-colors"
          >
            {copied === 'prompt' ? <><Check className="w-3.5 h-3.5 text-green-500" />Gekopieerd!</> : <><Copy className="w-3.5 h-3.5" />Kopiëren</>}
          </button>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-slate-400 mb-2">Gebruik dit als systeemprompt om het model direct op jouw situatie in te stellen:</p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {data.starterPrompt}
          </div>
        </div>
      </section>

      {/* ── Stap 4: Eerste testprompt ── */}
      <section className="bg-amber-50 border border-amber-200 rounded-lg px-5 py-4">
        <div className="flex items-start gap-2">
          <Terminal className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800 mb-1">Eerste bericht om te versturen</p>
            <p className="text-sm text-amber-700 leading-relaxed">{data.firstTestPrompt}</p>
          </div>
          <button
            type="button"
            onClick={() => copyText(data.firstTestPrompt, 'test')}
            className="flex-shrink-0 text-amber-500 hover:text-amber-700 transition-colors"
            aria-label="Kopieer eerste testprompt"
          >
            {copied === 'test' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </section>

      {/* ── Stap 5: Code snippet ── */}
      <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-brand-600" />
            <h3 className="font-semibold text-slate-800 text-sm">
              Stap {data.localSetupSteps ? '4' : '3'} — Python code snippet om direct mee te bouwen
            </h3>
          </div>
          <button
            type="button"
            onClick={() => copyText(data.quickStartCode, 'code')}
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-slate-200 rounded-md text-slate-600 hover:border-brand-300 hover:text-brand-600 transition-colors"
          >
            {copied === 'code' ? <><Check className="w-3.5 h-3.5 text-green-500" />Gekopieerd!</> : <><Copy className="w-3.5 h-3.5" />Kopiëren</>}
          </button>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-slate-400 mb-2">Vervang <code className="bg-slate-100 px-1 rounded">YOUR_API_KEY</code> door jouw eigen sleutel uit stap 1:</p>
          <pre className="bg-slate-900 text-slate-100 rounded-lg px-4 py-4 text-xs leading-relaxed overflow-x-auto font-mono whitespace-pre">
            {data.quickStartCode}
          </pre>
        </div>
      </section>

    </div>
  );
}

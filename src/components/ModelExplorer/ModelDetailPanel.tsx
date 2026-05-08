import { useEffect, useState } from 'react';
import {
  ArrowLeft, ExternalLink, Loader2, CheckCircle2, XCircle,
  AlertCircle, Download, Heart, Zap, Shield, Coins, BookOpen,
} from 'lucide-react';
import { AI_MODELS } from '../../data/models';
import { PRICING } from '../../data/pricing';
import { COMPLIANCE_DATA } from '../../data/compliance';
import type { ModelInfoResult } from '../../types';

interface Props {
  modelId: string;
  modelName: string;
  onBack: () => void;
}

const GDPR_COLOR: Record<string, string> = {
  green:  'bg-green-100 text-green-700 border-green-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  red:    'bg-red-100 text-red-600 border-red-200',
};
const GDPR_LABEL: Record<string, string> = {
  green: '✅ GDPR-compliant', yellow: '⚠️ Attentiepunten', red: '🔴 Risico',
};

export default function ModelDetailPanel({ modelId, modelName, onBack }: Props) {
  const [info, setInfo]       = useState<ModelInfoResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const staticModel    = AI_MODELS.find((m) => m.id === modelId);
  const pricing        = PRICING[modelId];
  const compliance     = COMPLIANCE_DATA[modelId];

  useEffect(() => {
    setLoading(true);
    setError(null);
    setInfo(null);

    fetch('/api/model-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelId, modelName }),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return (await r.json()) as ModelInfoResult;
      })
      .then(setInfo)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [modelId, modelName]);

  const hfUrl = `https://huggingface.co/${modelId}`;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug naar zoekresultaten
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{modelName}</h2>
            <p className="text-sm text-slate-500 mt-0.5 font-mono">{modelId}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {staticModel && (
                <>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                    {staticModel.provider}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    staticModel.type === 'open-source'
                      ? 'bg-green-100 text-green-700'
                      : staticModel.type === 'cloud'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {staticModel.type === 'open-source' ? 'Open Source' : staticModel.type === 'cloud' ? 'Cloud' : 'Hybrid'}
                  </span>
                  {staticModel.params && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 font-medium">
                      {staticModel.params} parameters
                    </span>
                  )}
                  {staticModel.contextK && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                      {staticModel.contextK >= 1000
                        ? `${staticModel.contextK / 1000}M`
                        : `${staticModel.contextK}K`} context
                    </span>
                  )}
                </>
              )}
              {info?.hfData && (
                <>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 font-medium flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {info.hfData.downloads >= 1_000_000
                      ? `${(info.hfData.downloads / 1_000_000).toFixed(1)}M`
                      : info.hfData.downloads >= 1000
                      ? `${Math.round(info.hfData.downloads / 1000)}K`
                      : info.hfData.downloads} downloads
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-medium flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {info.hfData.likes} likes
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {staticModel?.documentationUrl && (
              <a
                href={staticModel.documentationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:border-brand-300 hover:text-brand-600 transition-colors"
                aria-label={`Documentatie voor ${modelName}`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Documentatie
              </a>
            )}
            <a
              href={hfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:border-brand-300 hover:text-brand-600 transition-colors"
              aria-label={`${modelName} op HuggingFace`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              HuggingFace
            </a>
          </div>
        </div>
      </div>

      {/* Groq Analysis */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand-600" />
          Analyse door Groq
        </h3>

        {loading && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
              Groq analyseert {modelName}…
            </div>
            <div className="space-y-2 animate-pulse">
              <div className="h-3 bg-slate-100 rounded w-full" />
              <div className="h-3 bg-slate-100 rounded w-5/6" />
              <div className="h-3 bg-slate-100 rounded w-4/6" />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        {info && !loading && (
          <div className="space-y-5">
            {/* Summary */}
            <p className="text-sm text-slate-700 leading-relaxed">{info.summary}</p>

            {/* Three columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Sterktes
                </h4>
                <ul className="space-y-1.5">
                  {info.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-brand-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  Best voor
                </h4>
                <ul className="space-y-1.5">
                  {info.useCases.map((u, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="text-brand-500 mt-0.5 flex-shrink-0">•</span>
                      {u}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  Beperkingen
                </h4>
                <ul className="space-y-1.5">
                  {info.limitations.map((l, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Alternatives */}
            {info.alternatives.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Vergelijkbare alternatieven</p>
                <div className="flex flex-wrap gap-2">
                  {info.alternatives.map((alt) => (
                    <span key={alt} className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200">
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pricing + Compliance side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-sm">
            <Coins className="w-4 h-4 text-brand-600" />
            Kosten
          </h3>
          {pricing ? (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <dt className="text-slate-500">Input per 1M tokens</dt>
                <dd className="font-medium text-slate-800">
                  {pricing.inputPer1M === 0 ? 'Gratis' : `$${pricing.inputPer1M.toFixed(3)}`}
                </dd>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <dt className="text-slate-500">Output per 1M tokens</dt>
                <dd className="font-medium text-slate-800">
                  {pricing.outputPer1M === 0 ? 'Gratis' : `$${pricing.outputPer1M.toFixed(3)}`}
                </dd>
              </div>
              {pricing.freeTier && (
                <div className="flex justify-between items-start py-1.5">
                  <dt className="text-slate-500">Free tier</dt>
                  <dd className="font-medium text-green-600 text-right max-w-[55%]">{pricing.freeTier}</dd>
                </div>
              )}
              {pricing.groqAvailable && (
                <div className="mt-2 text-xs text-brand-700 bg-brand-50 px-3 py-2 rounded-lg">
                  ⚡ Beschikbaar via Groq (ultra-lage latency)
                </div>
              )}
            </dl>
          ) : (
            <p className="text-sm text-slate-400">Geen prijsdata beschikbaar in onze database.</p>
          )}
        </div>

        {/* Compliance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-brand-600" />
            Privacy &amp; Compliance
          </h3>
          {compliance ? (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between items-start py-1.5 border-b border-slate-100">
                <dt className="text-slate-500">GDPR-status</dt>
                <dd>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${GDPR_COLOR[compliance.gdpr]}`}>
                    {GDPR_LABEL[compliance.gdpr]}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between items-start py-1.5 border-b border-slate-100">
                <dt className="text-slate-500">Dataresidentie</dt>
                <dd className="font-medium text-slate-700 text-right max-w-[55%] text-xs leading-relaxed">{compliance.dataResidency}</dd>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <dt className="text-slate-500">Training op prompts</dt>
                <dd className="font-medium text-slate-700">
                  {compliance.trainingOnPrompts === 'no' ? '❌ Nee'
                   : compliance.trainingOnPrompts === 'yes' ? '✅ Ja'
                   : compliance.trainingOnPrompts === 'opt-out' ? '⚠️ Opt-out'
                   : '❓ Onbekend'}
                </dd>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <dt className="text-slate-500">DPA beschikbaar</dt>
                <dd className="font-medium text-slate-700">{compliance.dpaAvailable ? '✅ Ja' : '❌ Nee'}</dd>
              </div>
              {compliance.gdprNote && (
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{compliance.gdprNote}</p>
              )}
            </dl>
          ) : (
            <p className="text-sm text-slate-400">Geen compliance-data beschikbaar in onze database.</p>
          )}
        </div>
      </div>

      {/* HF tags */}
      {info?.hfData?.tags && info.hfData.tags.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">HuggingFace tags</p>
          <div className="flex flex-wrap gap-2">
            {info.hfData.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

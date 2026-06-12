import { CheckCircle2, XCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { COMPLIANCE_DATA } from '../../data/compliance';
import type { ModelRecommendation } from '../../types';

interface Props {
  recommendations: ModelRecommendation[];
}

const GDPR_BADGE: Record<string, { label: string; className: string }> = {
  green: { label: 'Groen', className: 'bg-green-100 text-green-700 border-green-200' },
  yellow: { label: 'Geel', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  red: { label: 'Rood', className: 'bg-red-100 text-red-700 border-red-200' },
};

const TRAINING_ICON = {
  no: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  'opt-out': <AlertCircle className="w-4 h-4 text-amber-500" />,
  yes: <XCircle className="w-4 h-4 text-red-500" />,
  unknown: <HelpCircle className="w-4 h-4 text-slate-400" />,
};

const TRAINING_LABEL = {
  no: 'Nee',
  'opt-out': 'Opt-out',
  yes: 'Ja',
  unknown: 'Onbekend',
};

const LOCKIN_BADGE: Record<string, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
};

const DUTCH_BADGE: Record<string, { label: string; className: string }> = {
  excellent: { label: 'Uitstekend', className: 'text-green-700' },
  good: { label: 'Goed', className: 'text-brand-600' },
  fair: { label: 'Redelijk', className: 'text-amber-600' },
  basic: { label: 'Basis', className: 'text-slate-400' },
};

export default function ComplianceTable({ recommendations }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold text-slate-800 mb-1">Privacy & Compliance</h3>
        <p className="text-sm text-slate-500">
          GDPR-status, dataresidentie en trainingsbeleid per aanbevolen model.
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => {
          const c = COMPLIANCE_DATA[rec.modelId];
          if (!c) return null;
          const gdpr = GDPR_BADGE[c.gdpr];
          const dutch = DUTCH_BADGE[c.dutchQuality];

          return (
            <div key={rec.modelId} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h4 className="font-semibold text-slate-900">{rec.modelName}</h4>
                  <p className="text-xs text-slate-400">{rec.provider}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${gdpr.className}`}>
                    GDPR: {gdpr.label}
                  </span>
                  {c.openSource && (
                    <span className="text-xs px-2.5 py-1 rounded-full border bg-blue-50 text-blue-700 border-blue-200 font-medium">
                      Open source
                    </span>
                  )}
                  {c.dpaAvailable && (
                    <span className="text-xs px-2.5 py-1 rounded-full border bg-slate-50 text-slate-600 border-slate-200">
                      DPA ✓
                    </span>
                  )}
                </div>
              </div>

              <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Dataresidentie</p>
                  <p className="text-slate-700">{c.dataResidency}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Training op jouw data</p>
                  <div className="flex items-center gap-1.5">
                    {TRAINING_ICON[c.trainingOnPrompts]}
                    <span className="text-slate-700">{TRAINING_LABEL[c.trainingOnPrompts]}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{c.trainingNote}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Vendor lock-in</p>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${LOCKIN_BADGE[c.vendorLockIn]}`}>
                    {c.vendorLockIn === 'low' ? 'Laag' : c.vendorLockIn === 'medium' ? 'Gemiddeld' : 'Hoog'}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nederlands kwaliteit</p>
                  <span className={`text-sm font-medium ${dutch.className}`}>{dutch.label}</span>
                </div>
                {c.certifications.length > 0 && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Certificeringen</p>
                    <div className="flex flex-wrap gap-1.5">
                      {c.certifications.map((cert) => (
                        <span key={cert} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
                <p className="text-xs text-slate-500">{c.gdprNote}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-slate-400 space-y-1">
        <p><span className="text-green-600 font-medium">Groen</span> = Sterkste GDPR-positie (EU/self-hosted). <span className="text-amber-600 font-medium">Geel</span> = DPA beschikbaar, servers buiten EU. <span className="text-red-600 font-medium">Rood</span> = Hoge risico's (bijv. Chinese wetgeving).</p>
      </div>
    </div>
  );
}

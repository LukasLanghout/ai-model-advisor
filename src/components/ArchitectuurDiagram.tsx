type System = 'browser' | 'vercel' | 'groq' | 'huggingface' | 'supabase';

const SYSTEMS: Record<System, { label: string; bg: string; text: string; dot: string }> = {
  browser:      { label: 'Browser / React',  bg: 'bg-slate-800',   text: 'text-white',      dot: 'bg-slate-800'   },
  vercel:       { label: 'Vercel Edge',       bg: 'bg-sky-400',     text: 'text-slate-900',  dot: 'bg-sky-400'     },
  groq:         { label: 'Groq API',          bg: 'bg-violet-500',  text: 'text-white',      dot: 'bg-violet-500'  },
  huggingface:  { label: 'HuggingFace',       bg: 'bg-teal-700',   text: 'text-white',      dot: 'bg-teal-700'    },
  supabase:     { label: 'Supabase',          bg: 'bg-emerald-600', text: 'text-white',      dot: 'bg-emerald-600' },
};

type Step = { system: System; label: string; sub?: string };

type FlowDef = {
  id: string;
  label: string;
  accent: string;
  border: string;
  bg: string;
  steps: Step[];
};

const FLOWS: FlowDef[] = [
  {
    id: 'recommend',
    label: 'Aanbeveling',
    accent: 'text-emerald-700',
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    steps: [
      { system: 'browser',     label: 'App start',               sub: 'Initieert UI' },
      { system: 'supabase',    label: 'Laad modellen & gidsen',  sub: 'Database opstart' },
      { system: 'browser',     label: 'Use case kiezen',         sub: 'Gebruiker selecteert scenario' },
      { system: 'vercel',      label: 'POST /api/recommend',     sub: 'Scenario doorsturen' },
      { system: 'supabase',    label: 'Use-case gidsen',         sub: 'Context & metadata ophalen' },
      { system: 'groq',        label: 'Model ranking',           sub: 'Llama 3.3 70B scoort 111 modellen' },
      { system: 'browser',     label: 'Modelaanbeveling tonen',  sub: 'Top 3–5 resultaten' },
    ],
  },
  {
    id: 'chat',
    label: 'Chat',
    accent: 'text-blue-700',
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    steps: [
      { system: 'browser',  label: 'Vraag stellen',        sub: 'Gebruiker typt chatvraag' },
      { system: 'vercel',   label: 'POST /api/chat',       sub: 'Verzoek doorsturen' },
      { system: 'groq',     label: 'Prompt bouwen',        sub: 'Contextrijke prompt samenstellen' },
      { system: 'groq',     label: 'Streaming antwoord',   sub: 'Realtime tokens genereren' },
      { system: 'browser',  label: 'Chatantwoord tonen',   sub: 'Streamed weergave' },
    ],
  },
  {
    id: 'models',
    label: 'Model Discovery',
    accent: 'text-teal-700',
    border: 'border-teal-200',
    bg: 'bg-teal-50',
    steps: [
      { system: 'browser',      label: 'Model discovery',      sub: 'Trending modellen bekijken' },
      { system: 'vercel',       label: 'GET /api/hf-models',   sub: 'Doorsturen naar HuggingFace' },
      { system: 'huggingface',  label: 'Trending ophalen',     sub: 'HuggingFace zoekt topmodellen' },
      { system: 'browser',      label: 'Resultaten tonen',     sub: 'Lijst met trending modellen' },
    ],
  },
  {
    id: 'image',
    label: 'Afbeelding genereren',
    accent: 'text-orange-700',
    border: 'border-orange-200',
    bg: 'bg-orange-50',
    steps: [
      { system: 'browser',      label: 'Image request',        sub: 'Gebruiker vraagt afbeelding' },
      { system: 'vercel',       label: 'POST /api/image-gen',  sub: 'Inferentie-pipeline starten' },
      { system: 'huggingface',  label: 'FLUX.1 / SD3',         sub: 'Afbeelding genereren' },
      { system: 'browser',      label: 'Afbeelding tonen',     sub: 'Resultaat weergeven' },
    ],
  },
];

function StepNode({ step, isLast }: { step: Step; isLast: boolean }) {
  const s = SYSTEMS[step.system];
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <div className={`rounded-xl ${s.bg} ${s.text} px-4 py-3 min-w-[130px] max-w-[180px]`}>
        <div className="text-[10px] font-semibold opacity-70 uppercase tracking-wide mb-1">{s.label}</div>
        <div className="font-semibold text-sm leading-tight">{step.label}</div>
        {step.sub && <div className="text-[11px] opacity-75 mt-1 leading-tight">{step.sub}</div>}
      </div>
      {!isLast && (
        <div className="flex-shrink-0 text-slate-400 font-bold text-xl select-none">→</div>
      )}
    </div>
  );
}

export default function ArchitectuurDiagram() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 space-y-8">

      {/* Legend */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Systemen</p>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(SYSTEMS) as [System, typeof SYSTEMS[System]][]).map(([key, s]) => (
            <div key={key} className={`flex items-center gap-1.5 rounded-full px-3 py-1 ${s.bg} ${s.text} text-xs font-semibold`}>
              {s.label}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Flows */}
      <div className="space-y-6">
        {FLOWS.map((flow) => (
          <div key={flow.id} className={`rounded-2xl border ${flow.border} ${flow.bg} p-5`}>
            <p className={`text-sm font-bold mb-4 ${flow.accent}`}>{flow.label}</p>
            <div className="overflow-x-auto pb-1">
              <div className="flex items-center gap-0 min-w-max">
                {flow.steps.map((step, i) => (
                  <StepNode key={i} step={step} isLast={i === flow.steps.length - 1} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Result */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-bold text-slate-900 mb-3">Eindresultaat</p>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          {[
            { label: 'Chatantwoord',          color: 'bg-blue-100 text-blue-800 border-blue-200' },
            { label: 'Modelaanbeveling',       color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
            { label: 'Trending modellen',      color: 'bg-teal-100 text-teal-800 border-teal-200' },
            { label: 'Gegenereerde afbeelding', color: 'bg-orange-100 text-orange-800 border-orange-200' },
          ].map((r) => (
            <div key={r.label} className={`rounded-xl border px-3 py-2 text-sm font-semibold text-center ${r.color}`}>
              {r.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

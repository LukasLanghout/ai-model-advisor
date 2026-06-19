import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const TABS = [
  { id: 'logica',  label: 'Redeneerlogica' },
  { id: 'prompt',  label: 'Volledige prompt (api/recommend.ts)' },
] as const;

type TabId = (typeof TABS)[number]['id'];

const RULES = [
  {
    title: 'Privacy-filter (harde eis)', color: 'border-red-500',
    bg: 'bg-red-50', ifLine: 'ALS privacy = on-premise / strikt',
    then: ['Alleen modellen met green privacy-status', 'Cloud-only (OpenAI, Anthropic) worden uitgesloten'],
    ok: 'Mistral EU · Llama self-hosted · open-source modellen',
  },
  {
    title: 'Chinese providers (GDPR-risico)', color: 'border-red-600',
    bg: 'bg-red-50', ifLine: 'ALS Qwen / DeepSeek / ERNIE via cloud',
    then: ['Waarschuwing: self-hosting verplicht voor GDPR', 'Worden niet aangeraden als cloud-optie'],
    ok: 'Wel aanbevolen als self-hosted open-source',
  },
  {
    title: 'Budget-filter', color: 'border-amber-500',
    bg: 'bg-amber-50', ifLine: 'ALS budget = hobby / klein',
    then: ['Prioriteer gratis self-hosted of goedkope cloud', 'Altijd minstens 1 gratis optie in top 3–5'],
    ok: 'Groq gratis · Llama self-hosted · Mistral gratis',
  },
  {
    title: 'Latency-filter', color: 'border-sky-500',
    bg: 'bg-sky-50', ifLine: 'ALS latency = real-time (<1s)',
    then: ['Prioriteer Groq (300+ tokens/s)', 'Of kleine modellen (7B–8B)'],
    ok: 'Groq API · Llama 3.1 8B · Mistral 7B',
  },
  {
    title: 'Nederlands vereist', color: 'border-emerald-500',
    bg: 'bg-emerald-50', ifLine: 'ALS talen bevat Nederlands',
    then: ['Voorkeur voor modellen met sterk Nederlands', 'GPT-4o · Qwen2.5 · BLOOM · Mistral'],
    ok: 'GPT-4o · Mistral Large · Qwen2.5 72B (self-hosted)',
  },
  {
    title: 'Code-use case', color: 'border-violet-500',
    bg: 'bg-violet-50', ifLine: 'ALS use case = code / development',
    then: ['Prioriteer gespecialiseerde code-modellen'],
    ok: 'Qwen2.5 Coder · CodeLlama · StarCoder2 · DeepSeek Coder · Phi-4',
  },
  {
    title: 'RAG / embeddings', color: 'border-orange-500',
    bg: 'bg-orange-50', ifLine: 'ALS use case = RAG / vector search',
    then: ['Overweeg embedding-model als aanvulling', 'Command R als RAG-specialist'],
    ok: 'nomic-embed · BGE Large · Cohere Command R',
  },
  {
    title: 'MoE-modellen', color: 'border-slate-400',
    bg: 'bg-slate-50', ifLine: 'ALS model = Mixture of Experts',
    then: ['Vermeld: efficiënt in berekening', 'Maar: meer RAM nodig dan params suggereren'],
    ok: 'bijv. Mixtral 8x22B: 140B params maar ~80GB VRAM',
  },
];

const PROMPT_TEXT = `SYSTEEMPROMPT (role: system):
"Je bent een expert AI consultant. Stuur uitsluitend geldig JSON terug zonder extra tekst of markdown."

USER PROMPT:
Je bent een expert AI consultant. Analyseer het onderstaande gebruikersscenario
en geef de beste AI model aanbevelingen uit de gegeven database van 111 modellen.

Gebruikersscenario (verzameld via een discovery-gesprek):
- Use case:           {scenario.useCase}
- Schaal/volume:      {scenario.scale}
- Latency vereiste:   {scenario.latency}
- Budget:             {scenario.budget}
- Privacy/compliance: {scenario.privacy}
- Talen:              {scenario.languages}
- Context behoefte:   {scenario.contextWindow}

Volledige beschrijving: {scenario.description}

[111 modellen database]
Formaat: id | naam | params | context | sterke punten | kosten | VRAM | privacy

claude-3-5-sonnet | Claude 3.5 Sonnet | ~200B | 200K | Redeneren+codering | $3/$15/1M | nvt  | yellow (VS, DPA)
gpt-4o            | GPT-4o            | ~200B | 128K | Multimodaal         | $5/$15/1M | nvt  | yellow (VS)
mistral-large     | Mistral Large 123B| 123B  | 128K | EU-cloud, meertalig | $3/$9/1M  | ~70GB | green (EU)
llama-3-3-70b     | Llama 3.3 70B     | 70.6B | 128K | On-premise          | gratis/Groq| ~48GB | green
... [107 modellen meer] ...

Selectieregels:
- Bij privacy "on-premise/strikt": ALLEEN modellen met "green" privacy
- Bij Chinese cloud-modellen: vermeld dat self-hosting verplicht is voor GDPR
- Bij budget "hobby/klein": prioriteer gratis self-hosted of goedkope cloud
- Bij latency "real-time": prioriteer groq, kleine modellen, of Mistral-snel
- Bij Nederlandse taal: voorkeur voor gpt-4o, Qwen2.5 (self-hosted), BLOOM, Mistral
- Bij code: voorkeur voor qwen-2-5-coder, codellama, starcoder2, deepseek-coder, phi-4
- Bij RAG/embeddings: overweeg bge-large-en of nomic-embed als aanvulling
- Bij MoE-modellen: vermeld dat MoE efficiënt is maar meer RAM nodig heeft dan params suggereren

Output JSON-structuur:
{
  "summary": "Beknopte samenvatting (2-3 zinnen) over waarom deze modellen zijn gekozen",
  "keyConsiderations": ["overweging 1", "overweging 2", "overweging 3"],
  "topThreeComparison": "Vergelijking top 3 in 2-3 zinnen: wanneer kies je welk?",
  "decisionFactors": [
    { "factor": "Privacy vereiste", "impact": "hoog", "led_to": "Alleen EU/on-premise modellen meegenomen" }
  ],
  "recommendations": [
    {
      "modelId": "exacte id uit de lijst",
      "modelName": "naam",
      "provider": "provider",
      "rank": 1,
      "score": 9.2,
      "reasoning": "Waarom dit model past (2-3 zinnen, specifiek voor dit scenario)",
      "pros": ["voordeel 1", "voordeel 2", "voordeel 3"],
      "cons": ["nadeel 1", "nadeel 2"],
      "estimatedMonthlyCost": "~€0 (self-hosted) of ~€50-200/maand",
      "documentationUrl": "https://...",
      "type": "cloud | open-source | hybrid",
      "tradeOff": "Beste keuze als X belangrijker is dan Y"
    }
  ]
}

Geef 3-5 aanbevelingen, inclusief ten minste één budgetvriendelijke optie als het budget niet unlimited is.`;

export default function ArchitectuurPage() {
  const [activeTab, setActiveTab] = useState<TabId>('logica');
  const [copied, setCopied] = useState(false);

  function copyPrompt() {
    navigator.clipboard.writeText(PROMPT_TEXT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Redeneerlogica & Systeemprompt</h1>
        <p className="text-sm text-slate-500 mt-1">Hoe de webapp een AI-model kiest — <code className="bg-slate-100 px-1 rounded text-xs">api/recommend.ts</code></p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB 1: Logica ── */}
      {activeTab === 'logica' && (
        <div className="space-y-4">

          {/* Input box */}
          <div className="bg-teal-50 border border-teal-300 rounded-xl p-4 text-center">
            <p className="text-sm font-bold text-teal-800">Discovery-gesprek (7 vragen via /api/chat)</p>
            <p className="text-xs text-teal-600 mt-1">use case · schaal · snelheid · budget · privacy · talen · contextvenster</p>
          </div>

          <div className="text-center text-slate-400 text-lg">↓</div>

          {/* Signals */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { label: 'Privacy', sub: 'on-premise / EU / cloud', cls: 'bg-red-50 border-red-200 text-red-700' },
              { label: 'Budget', sub: '€0 · €50 · €200 · onbeperkt', cls: 'bg-amber-50 border-amber-200 text-amber-700' },
              { label: 'Snelheid', sub: '<1s · 1-5s · batch', cls: 'bg-sky-50 border-sky-200 text-sky-700' },
              { label: 'Use case', sub: 'code · RAG · chat · beeld', cls: 'bg-violet-50 border-violet-200 text-violet-700' },
              { label: 'Taal', sub: 'Nederlands vereist?', cls: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
              { label: 'Schaal', sub: 'tokens per maand', cls: 'bg-orange-50 border-orange-200 text-orange-700' },
            ].map((s) => (
              <div key={s.label} className={`rounded-lg px-3 py-2 border text-center ${s.cls}`}>
                <p className="text-sm font-semibold">{s.label}</p>
                <p className="text-xs opacity-75 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="text-center text-slate-400 text-sm">↓ selectieregels</div>

          {/* Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RULES.map((rule) => (
              <div key={rule.title} className={`rounded-lg p-3 border-l-4 ${rule.bg} ${rule.color}`}>
                <p className="text-sm font-bold text-slate-800 mb-1.5">{rule.title}</p>
                <p className="text-xs text-amber-700 italic mb-1">{rule.ifLine}</p>
                {rule.then.map((t) => (
                  <p key={t} className="text-xs text-slate-700 leading-relaxed">→ {t}</p>
                ))}
                <p className="text-xs text-emerald-700 mt-1.5">{rule.ok}</p>
              </div>
            ))}
          </div>

          <div className="text-center text-slate-400 text-sm">↓ Groq Llama 3.3 70B scoort alle 111 modellen</div>

          {/* Output cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { rank: '#1 — Top keuze', name: 'Beste match', why: 'Hoogste score op alle criteria' },
              { rank: '#2 — Alternatief', name: 'Tweede keuze', why: 'Anders budget / type / provider' },
              { rank: '#3–5 — Overig', name: 'Budgetvriendelijk', why: 'Altijd 1 gratis/goedkope optie' },
            ].map((c) => (
              <div key={c.rank} className="bg-slate-900 rounded-xl p-3 text-center">
                <p className="text-xs font-bold text-teal-400 mb-1">{c.rank}</p>
                <p className="text-xs font-semibold text-slate-200">{c.name}</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{c.why}</p>
              </div>
            ))}
          </div>

          {/* Score info */}
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-xs text-teal-800 leading-relaxed">
            <strong>Score (0–10)</strong> per model op basis van: privacy-match · budget-fit · latency-geschiktheid ·
            use case-specialisatie · taal · contextvenster · kosten · open-source bonus bij on-premise eis.<br />
            Elke aanbeveling bevat: redenering · voor/nadelen · geschatte maandkosten · trade-off toelichting.
          </div>
        </div>
      )}

      {/* ── TAB 2: Prompt ── */}
      {activeTab === 'prompt' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'llama-3.3-70b-versatile', cls: 'bg-blue-100 text-blue-800' },
                { label: 'max_tokens: 2048', cls: 'bg-purple-100 text-purple-800' },
                { label: 'temperature: 0.3', cls: 'bg-amber-100 text-amber-800' },
                { label: 'json_object', cls: 'bg-emerald-100 text-emerald-800' },
              ].map((tag) => (
                <span key={tag.label} className={`text-xs px-2.5 py-1 rounded-full font-semibold ${tag.cls}`}>
                  {tag.label}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={copyPrompt}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border rounded-md font-medium transition-colors ${
                copied
                  ? 'border-emerald-300 text-emerald-600 bg-emerald-50'
                  : 'border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600'
              }`}
            >
              {copied ? <><Check className="w-3.5 h-3.5" />Gekopieerd!</> : <><Copy className="w-3.5 h-3.5" />Kopieer</>}
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl overflow-auto max-h-[600px]">
            <pre className="p-5 text-xs font-mono leading-relaxed whitespace-pre text-slate-200">
{``}
              <span className="text-teal-400">{'// SYSTEEMPROMPT (role: system)'}</span>
              {'\n'}
              <span className="text-emerald-400">{'"Je bent een expert AI consultant. Stuur uitsluitend geldig JSON terug."'}</span>
              {'\n\n'}
              <span className="text-teal-400">{'// USER PROMPT'}</span>
              {'\n'}
              <span className="text-slate-200">{'Je bent een expert AI consultant. Analyseer het onderstaande\ngebruikersscenario en geef de beste AI model aanbevelingen\nuit de gegeven database van 111 modellen.'}</span>
              {'\n\n'}
              <span className="text-amber-400">{'Gebruikersscenario:'}</span>
              {'\n'}
              <span className="text-slate-200">{'- Use case:           '}</span><span className="text-emerald-400">{'{scenario.useCase}'}</span>
              {'\n'}
              <span className="text-slate-200">{'- Schaal/volume:      '}</span><span className="text-emerald-400">{'{scenario.scale}'}</span>
              {'\n'}
              <span className="text-slate-200">{'- Latency vereiste:   '}</span><span className="text-emerald-400">{'{scenario.latency}'}</span>
              {'\n'}
              <span className="text-slate-200">{'- Budget:             '}</span><span className="text-emerald-400">{'{scenario.budget}'}</span>
              {'\n'}
              <span className="text-slate-200">{'- Privacy/compliance: '}</span><span className="text-emerald-400">{'{scenario.privacy}'}</span>
              {'\n'}
              <span className="text-slate-200">{'- Talen:              '}</span><span className="text-emerald-400">{'{scenario.languages}'}</span>
              {'\n'}
              <span className="text-slate-200">{'- Context behoefte:   '}</span><span className="text-emerald-400">{'{scenario.contextWindow}'}</span>
              {'\n\n'}
              <span className="text-slate-500">{'// 111 modellen — id | naam | params | context | kosten | VRAM | privacy'}</span>
              {'\n'}
              <span className="text-sky-400">{'claude-3-5-sonnet | Claude 3.5 Sonnet | ~200B | 200K | $3/$15/1M | nvt  | yellow\ngpt-4o            | GPT-4o            | ~200B | 128K | $5/$15/1M | nvt  | yellow\nmistral-large     | Mistral Large 123B| 123B  | 128K | $3/$9/1M  | 70GB | green (EU)\nllama-3-3-70b     | Llama 3.3 70B     | 70.6B | 128K | gratis    | 48GB | green\n'}</span>
              <span className="text-slate-500">{'... [107 modellen meer] ...'}</span>
              {'\n\n'}
              <span className="text-amber-400">{'Selectieregels:'}</span>
              {'\n'}
              <span className="text-slate-200">{'- Bij privacy on-premise/strikt: ALLEEN green privacy modellen\n- Bij Chinese cloud: self-hosting verplicht voor GDPR\n- Bij budget hobby/klein: gratis self-hosted of goedkope cloud\n- Bij real-time latency: groq, kleine modellen, Mistral-snel\n- Bij Nederlands: gpt-4o, Qwen2.5 (self-hosted), BLOOM, Mistral\n- Bij code: qwen-2-5-coder, codellama, starcoder2, deepseek-coder, phi-4\n- Bij RAG: bge-large-en of nomic-embed als aanvulling\n- Bij MoE: meer RAM nodig dan params suggereren'}</span>
              {'\n\n'}
              <span className="text-amber-400">{'Output JSON:'}</span>
              {'\n'}
              <span className="text-violet-400">{'{\n  "summary":            "...",\n  "keyConsiderations":  ["..."],\n  "topThreeComparison": "...",\n  "decisionFactors":    [{ "factor":"...", "impact":"hoog" }],\n  "recommendations": [{\n    "modelId": "...", "rank": 1, "score": 9.2,\n    "reasoning": "...", "pros": ["..."], "cons": ["..."],\n    "estimatedMonthlyCost": "~€0 of ~€50-200/maand",\n    "type": "cloud | open-source | hybrid",\n    "tradeOff": "..."\n  }]\n}'}</span>
              {'\n\n'}
              <span className="text-slate-200">{'Geef 3-5 aanbevelingen, inclusief 1 budgetvriendelijke optie.'}</span>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

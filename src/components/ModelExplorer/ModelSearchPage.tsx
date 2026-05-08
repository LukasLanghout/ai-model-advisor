import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Search, X, Loader2, TrendingUp, Database, ArrowRight } from 'lucide-react';
import { AI_MODELS, type AIModelData } from '../../data/models';
import ModelDetailPanel from './ModelDetailPanel';

// ── Types ──────────────────────────────────────────────────
interface HFResult {
  id: string;
  downloads: number;
  likes: number;
  inference: string;
  tags: string[];
}

interface SearchModel {
  id: string;
  name: string;
  provider: string;
  type: string;
  params?: string;
  contextK?: number;
  source: 'local' | 'huggingface';
  downloads?: number;
  likes?: number;
  tags?: string[];
}

// ── Helpers ────────────────────────────────────────────────
function toSearchModel(m: AIModelData): SearchModel {
  return {
    id: m.id, name: m.name, provider: m.provider,
    type: m.type, params: m.params, contextK: m.contextK,
    source: 'local',
  };
}

function filterLocal(query: string): SearchModel[] {
  const q = query.toLowerCase();
  return AI_MODELS
    .filter((m) =>
      m.name.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      m.provider.toLowerCase().includes(q) ||
      m.specialties?.some((s) => s.toLowerCase().includes(q)),
    )
    .map(toSearchModel);
}

// ── Animation variants ─────────────────────────────────────
const gridContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
const gridItem = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' as const } },
};

// ── Main Component ─────────────────────────────────────────
export default function ModelSearchPage() {
  const [query, setQuery]               = useState('');
  const [localResults, setLocalResults] = useState<SearchModel[]>(AI_MODELS.map(toSearchModel));
  const [hfResults, setHfResults]       = useState<SearchModel[]>([]);
  const [hfLoading, setHfLoading]       = useState(false);
  const [selectedModel, setSelectedModel] = useState<{ id: string; name: string } | null>(null);
  const inputRef                         = useRef<HTMLInputElement>(null);
  const reduced                          = useReducedMotion();
  const debounceRef                      = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-focus search on mount
  useEffect(() => { inputRef.current?.focus(); }, []);

  // Search logic
  useEffect(() => {
    const q = query.trim();

    // Local search: instant
    setLocalResults(q ? filterLocal(q) : AI_MODELS.map(toSearchModel));

    // HF search: debounced, only when 3+ chars
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length >= 3) {
      setHfLoading(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/hf-models?search=${encodeURIComponent(q)}&limit=8&warm=false`);
          if (!res.ok) throw new Error('HF API fout');
          const data = (await res.json()) as HFResult[];
          const localIds = new Set(AI_MODELS.map((m) => m.id));
          const extras = data
            .filter((m) => !localIds.has(m.id) && !m.id.includes('GGUF'))
            .slice(0, 6)
            .map((m): SearchModel => ({
              id: m.id,
              name: m.id.split('/').pop() ?? m.id,
              provider: m.id.split('/')[0] ?? 'HuggingFace',
              type: 'open-source',
              source: 'huggingface',
              downloads: m.downloads,
              likes: m.likes,
              tags: m.tags,
            }));
          setHfResults(extras);
        } catch {
          setHfResults([]);
        } finally {
          setHfLoading(false);
        }
      }, 450);
    } else {
      setHfResults([]);
      setHfLoading(false);
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Back from detail panel: reset selected model
  function handleBack() {
    setSelectedModel(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  // ── Detail view ──────────────────────────────────────────
  if (selectedModel) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <ModelDetailPanel
          modelId={selectedModel.id}
          modelName={selectedModel.name}
          onBack={handleBack}
        />
      </div>
    );
  }

  // ── Search view ──────────────────────────────────────────
  const totalResults = localResults.length + hfResults.length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Model Explorer</h2>
        <p className="text-sm text-slate-500">
          Zoek door {AI_MODELS.length} modellen in onze database of elk model op HuggingFace.
          Klik een model voor een Groq-analyse, specs, kosten en compliance.
        </p>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Zoek op naam, provider of use case… bijv. 'Llama', 'code', 'Mistral'"
          aria-label="Zoek naar AI modellen"
          className="w-full text-sm border border-slate-200 rounded-2xl pl-12 pr-10 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white shadow-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-full"
            aria-label="Zoekopdracht wissen"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Result count */}
      {query.trim() && (
        <p className="text-xs text-slate-400" aria-live="polite">
          {totalResults === 0 ? 'Geen resultaten' : `${totalResults} ${totalResults === 1 ? 'model' : 'modellen'} gevonden`}
          {hfLoading && <span className="ml-2 inline-flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />HuggingFace doorzoeken…</span>}
        </p>
      )}

      {/* Local results */}
      {localResults.length > 0 && (
        <section>
          {query.trim() && hfResults.length > 0 && (
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              Onze database
            </h3>
          )}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            key={query}
            variants={reduced ? undefined : gridContainer}
            initial={reduced ? false : 'hidden'}
            animate="show"
          >
            {localResults.slice(0, query.trim() ? 20 : 24).map((m) => (
              <motion.div key={m.id} variants={reduced ? undefined : gridItem}>
                <ModelCard model={m} onSelect={setSelectedModel} />
              </motion.div>
            ))}
          </motion.div>
          {!query.trim() && AI_MODELS.length > 24 && (
            <p className="text-xs text-center text-slate-400 mt-3">
              Typ een zoekopdracht om alle {AI_MODELS.length} modellen te doorzoeken.
            </p>
          )}
        </section>
      )}

      {/* HF results */}
      {hfResults.length > 0 && (
        <section>
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            Meer op HuggingFace
          </h3>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            variants={reduced ? undefined : gridContainer}
            initial={reduced ? false : 'hidden'}
            animate="show"
          >
            {hfResults.map((m) => (
              <motion.div key={m.id} variants={reduced ? undefined : gridItem}>
                <ModelCard model={m} onSelect={setSelectedModel} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Empty state */}
      {query.trim() && !hfLoading && totalResults === 0 && (
        <div className="text-center py-12 text-slate-400">
          <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Geen modellen gevonden voor &ldquo;{query}&rdquo;</p>
          <p className="text-xs mt-1">Probeer een andere naam of provider.</p>
        </div>
      )}
    </div>
  );
}

// ── Model Card ─────────────────────────────────────────────
interface ModelCardProps {
  model: SearchModel;
  onSelect: (m: { id: string; name: string }) => void;
}

function ModelCard({ model, onSelect }: ModelCardProps) {
  const reduced = useReducedMotion();
  const typeColor =
    model.type === 'open-source' ? 'bg-green-50 text-green-700 border-green-200' :
    model.type === 'cloud'       ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                   'bg-purple-50 text-purple-700 border-purple-200';

  return (
    <motion.button
      type="button"
      onClick={() => onSelect({ id: model.id, name: model.name })}
      whileHover={reduced ? {} : { y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}
      whileTap={reduced ? {} : { scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-brand-300 transition-colors group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-brand-600 transition-colors">
            {model.name}
          </p>
          <p className="text-xs text-slate-400 font-mono truncate mt-0.5">{model.id}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 flex-shrink-0 mt-0.5 transition-colors" />
      </div>

      <div className="flex flex-wrap gap-1.5 mt-2.5">
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
          {model.provider}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColor}`}>
          {model.type === 'open-source' ? 'Open Source' : model.type === 'cloud' ? 'Cloud' : 'Hybrid'}
        </span>
        {model.params && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-600">
            {model.params}
          </span>
        )}
        {model.source === 'huggingface' && model.downloads !== undefined && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">
            {model.downloads >= 1_000_000
              ? `${(model.downloads / 1_000_000).toFixed(1)}M ↓`
              : `${Math.round(model.downloads / 1000)}K ↓`}
          </span>
        )}
      </div>
    </motion.button>
  );
}

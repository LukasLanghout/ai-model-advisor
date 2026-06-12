import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Search, X, Loader2, TrendingUp, Database, ArrowRight, Plus, Check, Columns3 } from 'lucide-react';
import { AI_MODELS, type AIModelData } from '../../data/models';
import ModelDetailPanel from './ModelDetailPanel';
import ModelComparePanel from './ModelComparePanel';

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

const MAX_COMPARE = 3;

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
  const [compareIds, setCompareIds]     = useState<string[]>([]);
  const [comparing, setComparing]       = useState(false);
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

  function toggleCompare(id: string) {
    setCompareIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < MAX_COMPARE ? [...prev, id] : prev,
    );
  }

  // Back from detail panel: reset selected model
  function handleBack() {
    setSelectedModel(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  // ── Compare view ─────────────────────────────────────────
  if (comparing && compareIds.length >= 2) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <ModelComparePanel
          modelIds={compareIds}
          onBack={() => setComparing(false)}
        />
      </div>
    );
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
  const compareNames = compareIds
    .map((id) => AI_MODELS.find((m) => m.id === id)?.name ?? id);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in pb-28">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Model Explorer</h2>
        <p className="text-sm text-slate-500">
          Zoek door {AI_MODELS.length} modellen in onze database of elk model op HuggingFace.
          Klik een model voor analyse, of selecteer er 2-3 met de plus-knop om ze naast elkaar te vergelijken.
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
          className="w-full text-sm border border-slate-200 rounded-lg pl-12 pr-10 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white shadow-sm"
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
                <ModelCard
                  model={m}
                  onSelect={setSelectedModel}
                  compareSelected={compareIds.includes(m.id)}
                  compareFull={compareIds.length >= MAX_COMPARE}
                  onToggleCompare={toggleCompare}
                />
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

      {/* Vergelijk-balk */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[calc(100vw-2.5rem)] max-w-xl"
          >
            <div className="bg-slate-900 text-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-3">
              <Columns3 className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <p className="text-sm flex-1 min-w-0 truncate">
                {compareNames.join(' · ')}
                <span className="text-slate-400"> ({compareIds.length}/{MAX_COMPARE})</span>
              </p>
              <button
                type="button"
                onClick={() => setCompareIds([])}
                className="text-xs text-slate-400 hover:text-white transition-colors flex-shrink-0"
              >
                Wissen
              </button>
              <button
                type="button"
                onClick={() => setComparing(true)}
                disabled={compareIds.length < 2}
                className="px-4 py-1.5 bg-white text-slate-900 text-sm font-medium rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors flex-shrink-0"
              >
                Vergelijk{compareIds.length < 2 ? ' (kies nog 1)' : ` (${compareIds.length})`}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Model Card ─────────────────────────────────────────────
interface ModelCardProps {
  model: SearchModel;
  onSelect: (m: { id: string; name: string }) => void;
  compareSelected?: boolean;
  compareFull?: boolean;
  onToggleCompare?: (id: string) => void;
}

function ModelCard({ model, onSelect, compareSelected, compareFull, onToggleCompare }: ModelCardProps) {
  const reduced = useReducedMotion();
  const canToggle = Boolean(onToggleCompare) && (compareSelected || !compareFull);

  return (
    <motion.div
      whileHover={reduced ? {} : { y: -1 }}
      transition={{ duration: 0.12 }}
      className={`relative bg-white border rounded-lg transition-all group ${
        compareSelected ? 'border-brand-500 ring-1 ring-brand-200' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect({ id: model.id, name: model.name })}
        className="w-full text-left p-4"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 pr-7">
            <p className="text-sm font-medium text-slate-800 truncate">
              {model.name}
            </p>
            <p className="text-xs text-slate-400 font-mono truncate mt-0.5">{model.id}</p>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 flex-shrink-0 mt-0.5 transition-colors" />
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2.5">
          <span className="text-xs text-slate-400">{model.provider}</span>
          {model.params && (
            <span className="text-xs text-slate-400">· {model.params}</span>
          )}
          {model.source === 'huggingface' && model.downloads !== undefined && (
            <span className="text-xs text-slate-400">
              · {model.downloads >= 1_000_000
                ? `${(model.downloads / 1_000_000).toFixed(1)}M ↓`
                : `${Math.round(model.downloads / 1000)}K ↓`}
            </span>
          )}
        </div>
      </button>

      {/* Vergelijk-toggle — alleen voor modellen uit onze database */}
      {onToggleCompare && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); if (canToggle) onToggleCompare(model.id); }}
          disabled={!canToggle}
          aria-pressed={compareSelected}
          aria-label={compareSelected ? `${model.name} uit vergelijking halen` : `${model.name} toevoegen aan vergelijking`}
          title={compareSelected ? 'Uit vergelijking halen' : compareFull ? 'Maximaal 3 modellen' : 'Toevoegen aan vergelijking'}
          className={`absolute bottom-3 right-3 p-1.5 rounded-md border transition-colors ${
            compareSelected
              ? 'bg-brand-600 border-brand-600 text-white'
              : canToggle
                ? 'bg-white border-slate-200 text-slate-400 hover:border-brand-400 hover:text-brand-600'
                : 'bg-white border-slate-100 text-slate-200 cursor-not-allowed'
          }`}
        >
          {compareSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </button>
      )}
    </motion.div>
  );
}

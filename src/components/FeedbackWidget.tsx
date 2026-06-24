import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MessageSquarePlus, X, Star, Loader2, Check } from 'lucide-react';
import { saveStudentFeedback } from '../lib/supabase';
import type { AppStep } from '../types';

// Per scherm: een label en de functies die op dat scherm te zien zijn
const SCREEN_CONFIG: Record<AppStep, { label: string; features: string[] }> = {
  intro: {
    label: 'Startscherm',
    features: [
      'Uitleg & introductie',
      'Overzicht van features',
      'Modellen-overzicht (106 modellen)',
      'Start-knop & eerste indruk',
      'Design & layout',
    ],
  },
  conversation: {
    label: 'Adviesgesprek',
    features: [
      'Kwaliteit van de AI-vragen',
      'Voorbeeld-templates',
      'Onderwerp-voortgang (checklist)',
      'Chatervaring & snelheid',
      'Design & layout',
    ],
  },
  loading: {
    label: 'Laadscherm',
    features: [
      'Wachttijd & duidelijkheid',
      'Design & animatie',
    ],
  },
  results: {
    label: 'Resultaten',
    features: [
      'Aanbevelingen & onderbouwing',
      'Vergelijking top 3',
      'Kosten-calculator',
      'Playground — tekst',
      'Playground — afbeeldingen',
      'Compliance-tabel (AVG)',
      'Beslisboom',
      'PDF-export',
      'Design & layout',
    ],
  },
  explorer: {
    label: 'Model Explorer',
    features: [
      'Zoeken & filteren',
      'HuggingFace-zoekresultaten',
      'Modeldetails & AI-analyse',
      'Prijzen & compliance-info',
      'Design & layout',
    ],
  },
  architectuur: {
    label: 'Architectuuroverzicht',
    features: [
      'Redeneerlogica & selectieregels',
      'Systeemprompt weergave',
      'Design & layout',
    ],
  },
};

interface Draft {
  feature: string;
  rating: number;
  comment: string;
}

type Status = 'idle' | 'sending' | 'done' | 'error';

interface Props {
  screen: AppStep;
}

export default function FeedbackWidget({ screen }: Props) {
  const reduced = useReducedMotion();
  const config = SCREEN_CONFIG[screen];

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(() => localStorage.getItem('fb-name') ?? '');
  // Concepten per scherm bewaard — wisselen van scherm gooit niets weg
  const [drafts, setDrafts] = useState<Partial<Record<AppStep, Draft>>>({});
  const [hoverRating, setHoverRating] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const draft: Draft = drafts[screen] ?? { feature: config.features[0], rating: 0, comment: '' };

  function updateDraft(patch: Partial<Draft>) {
    setDrafts((prev) => ({ ...prev, [screen]: { ...draft, ...patch } }));
  }

  // Naam onthouden voor volgende keer
  useEffect(() => {
    localStorage.setItem('fb-name', name);
  }, [name]);

  // Succes/fout-status resetten zodra de gebruiker naar een ander scherm gaat
  useEffect(() => {
    setStatus('idle');
    setErrorMsg('');
  }, [screen]);

  async function submit() {
    if (draft.rating === 0 || status === 'sending') return;
    setStatus('sending');
    setErrorMsg('');

    const { error } = await saveStudentFeedback({
      name,
      screen: config.label,
      feature: draft.feature,
      rating: draft.rating,
      comment: draft.comment,
    });

    if (error) {
      setStatus('error');
      setErrorMsg(error);
    } else {
      setStatus('done');
      // Concept van dit scherm wissen; andere schermen blijven bewaard
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[screen];
        return next;
      });
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => setStatus('idle'), 300);
      }, 1800);
    }
  }

  return (
    <>
      {/* Zwevende knop */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Feedback geven over ${config.label}`}
        className={`no-print fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-700 text-white text-sm font-medium rounded-md shadow-md transition-colors ${
          open ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <MessageSquarePlus className="w-4 h-4" />
        <span className="hidden sm:inline">Feedback</span>
      </button>

      {/* Paneel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="no-print fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden"
            role="dialog"
            aria-label={`Feedback over ${config.label}`}
          >
            {/* Header */}
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 text-sm">
                  Feedback: <span className="text-brand-600">{config.label}</span>
                </p>
                <p className="text-xs text-slate-400">Je beoordeelt het scherm waar je nu bent</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Sluiten"
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {status === 'done' ? (
              <div className="p-8 flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <p className="font-medium text-slate-800 text-sm">Bedankt voor je feedback!</p>
                <p className="text-xs text-slate-400">
                  Je kunt op elk scherm opnieuw feedback geven.
                </p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {/* Functie op dit scherm */}
                <div>
                  <label htmlFor="fb-feature" className="block text-xs font-medium text-slate-600 mb-1.5">
                    Over welke functie van dit scherm gaat het?
                  </label>
                  <select
                    id="fb-feature"
                    value={draft.feature}
                    onChange={(e) => updateDraft({ feature: e.target.value })}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  >
                    {config.features.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <p className="text-xs font-medium text-slate-600 mb-1.5">Beoordeling</p>
                  <div className="flex gap-1" role="radiogroup" aria-label="Beoordeling van 1 tot 5 sterren">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        role="radio"
                        aria-checked={draft.rating === n}
                        aria-label={`${n} ster${n > 1 ? 'ren' : ''}`}
                        onClick={() => updateDraft({ rating: n })}
                        onMouseEnter={() => setHoverRating(n)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            n <= (hoverRating || draft.rating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toelichting */}
                <div>
                  <label htmlFor="fb-comment" className="block text-xs font-medium text-slate-600 mb-1.5">
                    Toelichting <span className="text-slate-400 font-normal">(optioneel)</span>
                  </label>
                  <textarea
                    id="fb-comment"
                    value={draft.comment}
                    onChange={(e) => updateDraft({ comment: e.target.value })}
                    rows={3}
                    maxLength={1000}
                    placeholder="Wat werkt goed? Wat kan beter?"
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Naam */}
                <div>
                  <label htmlFor="fb-name" className="block text-xs font-medium text-slate-600 mb-1.5">
                    Je naam <span className="text-slate-400 font-normal">(optioneel, wordt onthouden)</span>
                  </label>
                  <input
                    id="fb-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    placeholder="Anoniem mag ook"
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    Versturen mislukt: {errorMsg}
                  </p>
                )}

                <button
                  type="button"
                  onClick={submit}
                  disabled={draft.rating === 0 || status === 'sending'}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {status === 'sending'
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Versturen…</>
                    : 'Verstuur feedback'}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

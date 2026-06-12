import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MessageSquarePlus, X, Star, Loader2, Check } from 'lucide-react';
import { saveStudentFeedback } from '../lib/supabase';

const FEATURES = [
  'Adviesgesprek (AI-vragen)',
  'Aanbevelingen & vergelijking',
  'Kosten-calculator',
  'Playground — tekst',
  'Playground — afbeeldingen',
  'Model Explorer (zoeken)',
  'Design & gebruiksgemak',
  'Algemeen / overig',
];

type Status = 'idle' | 'sending' | 'done' | 'error';

export default function FeedbackWidget() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [feature, setFeature] = useState(FEATURES[0]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function submit() {
    if (rating === 0 || status === 'sending') return;
    setStatus('sending');
    setErrorMsg('');

    const { error } = await saveStudentFeedback({ name, feature, rating, comment });

    if (error) {
      setStatus('error');
      setErrorMsg(error);
    } else {
      setStatus('done');
      setTimeout(() => {
        setOpen(false);
        // Reset voor een volgende inzending, ná de sluit-animatie
        setTimeout(() => {
          setStatus('idle');
          setRating(0);
          setComment('');
          setFeature(FEATURES[0]);
        }, 300);
      }, 1800);
    }
  }

  return (
    <>
      {/* Zwevende knop */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Feedback geven"
        className={`no-print fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-700 text-white text-sm font-medium rounded-full shadow-lg transition-colors ${
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
            className="no-print fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
            role="dialog"
            aria-label="Feedback formulier"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 text-sm">Wat vind jij ervan?</p>
                <p className="text-xs text-slate-400">Jouw feedback helpt de app verbeteren</p>
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
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {/* Functie */}
                <div>
                  <label htmlFor="fb-feature" className="block text-xs font-medium text-slate-600 mb-1.5">
                    Over welke functie gaat het?
                  </label>
                  <select
                    id="fb-feature"
                    value={feature}
                    onChange={(e) => setFeature(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  >
                    {FEATURES.map((f) => (
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
                        aria-checked={rating === n}
                        aria-label={`${n} ster${n > 1 ? 'ren' : ''}`}
                        onClick={() => setRating(n)}
                        onMouseEnter={() => setHoverRating(n)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            n <= (hoverRating || rating)
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
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    maxLength={1000}
                    placeholder="Wat werkt goed? Wat kan beter?"
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Naam */}
                <div>
                  <label htmlFor="fb-name" className="block text-xs font-medium text-slate-600 mb-1.5">
                    Je naam <span className="text-slate-400 font-normal">(optioneel)</span>
                  </label>
                  <input
                    id="fb-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    placeholder="Anoniem mag ook"
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
                  disabled={rating === 0 || status === 'sending'}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
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

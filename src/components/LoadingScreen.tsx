import { Brain } from 'lucide-react';

export default function LoadingScreen() {
  return (
    /* role="status" + aria-live so screen readers announce the loading state */
    <div
      role="status"
      aria-live="polite"
      aria-label="Aanbevelingen worden geladen"
      className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in"
    >
      <div className="relative mb-6">
        <div
          className="w-16 h-16 rounded-lg bg-brand-600 flex items-center justify-center"
          aria-hidden="true"
        >
          <Brain className="w-8 h-8 text-white" />
        </div>
        <span
          className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"
          aria-hidden="true"
        />
      </div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        Llama 3.3 analyseert jouw scenario…
      </h2>
      <p className="text-slate-500 text-sm">Via Groq — normaal binnen 3–5 seconden.</p>

      <div className="mt-8 flex gap-2" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

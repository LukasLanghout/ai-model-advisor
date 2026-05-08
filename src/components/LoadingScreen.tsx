import { Brain } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping" />
      </div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">Claude analyseert jouw scenario…</h2>
      <p className="text-slate-500 text-sm">Dit duurt normaal 5–10 seconden.</p>

      <div className="mt-8 flex gap-2">
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

import { Brain } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-600">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-semibold text-slate-900 text-base leading-tight block">
            AI Model Advisor
          </span>
          <span className="text-xs text-slate-400 leading-tight block">
            Vind het juiste model voor jouw use case
          </span>
        </div>
      </div>
    </header>
  );
}

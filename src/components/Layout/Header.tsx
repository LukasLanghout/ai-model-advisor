import { Brain, Search, Layout } from 'lucide-react';

interface Props {
  onExplorer: () => void;
  explorerActive?: boolean;
}

export default function Header({ onExplorer, explorerActive }: Props) {
  return (
    <>
      {/* Skip-to-content link — visible on focus for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-2 focus-visible:left-2 focus-visible:z-50 focus-visible:px-4 focus-visible:py-2 focus-visible:bg-brand-600 focus-visible:text-white focus-visible:rounded-lg focus-visible:text-sm focus-visible:font-medium"
      >
        Naar hoofdinhoud
      </a>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10" role="banner">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 flex-shrink-0"
              aria-hidden="true"
            >
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-slate-900 text-base leading-tight block truncate">
                AI Model Advisor
              </span>
              <span className="text-xs text-slate-400 leading-tight block hidden sm:block">
                Vind het juiste model voor jouw use case
              </span>
            </div>
          </a>

          {/* Nav */}
          <div className="flex items-center gap-2">
            <a
              href="/architectuuroverzicht"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-colors text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            >
              <Layout className="w-4 h-4" />
              <span className="hidden sm:inline">Architectuur</span>
            </a>
            <button
              type="button"
              onClick={onExplorer}
              aria-pressed={explorerActive}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                explorerActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Model Explorer</span>
              <span className="sm:hidden">Explorer</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

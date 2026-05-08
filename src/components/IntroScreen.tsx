import { ArrowRight, Zap, Shield, TrendingUp, CheckCircle } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: Props) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 animate-fade-in">
      {/* Hero */}
      <div className="text-center mb-16">
        <span className="inline-block px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-medium mb-4">
          Persoonlijk project · Lukas Langhout
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-5 leading-tight">
          Welk AI-model past<br />
          <span className="text-brand-600">bij jouw situatie?</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
          Beantwoord 6 gerichte vragen over je use case, schaal, budget en privacyvereisten.
          Claude analyseert je situatie en geeft aanbevelingen met uitleg.
        </p>
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors shadow-sm text-base"
        >
          Start de adviseur
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        {[
          { icon: Zap, title: 'Snel advies', desc: 'In minder dan 2 minuten een onderbouwde aanbeveling op maat.' },
          { icon: TrendingUp, title: 'Vergelijk modellen', desc: 'Kosten, prestaties en risico\'s naast elkaar voor jouw specifieke context.' },
          { icon: Shield, title: 'Privacy & compliance', desc: 'Rekening houdend met GDPR, on-premise en EU-cloud vereisten.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
              <Icon className="w-5 h-5 text-brand-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
            <p className="text-sm text-slate-500">{desc}</p>
          </div>
        ))}
      </div>

      {/* Models covered */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <h2 className="font-semibold text-slate-900 mb-4">Modellen die worden vergeleken</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            'Claude 3.5 Sonnet', 'Claude 3 Haiku', 'GPT-4o', 'GPT-4o Mini',
            'Gemini 1.5 Pro', 'Gemini 1.5 Flash', 'Llama 3.1 70B', 'Llama 3.1 8B',
            'Mistral Large', 'Mistral 7B', 'Groq', 'Phi-3',
          ].map((model) => (
            <div key={model} className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0" />
              {model}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

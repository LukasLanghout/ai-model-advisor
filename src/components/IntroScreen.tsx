import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, MessageSquare, TrendingUp, Shield, Zap, FlaskConical, FileDown } from 'lucide-react';

interface Props {
  onStart: () => void;
}

const cardContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};
const cardItem = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

export default function IntroScreen({ onStart }: Props) {
  const reduced = useReducedMotion();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      {/* Hero */}
      <motion.div
        className="text-center mb-16"
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium mb-4 tracking-wide">
          Persoonlijk project · Lukas Langhout
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-5 leading-tight">
          Welk AI-model past<br />
          <span className="text-brand-600">bij jouw situatie?</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
          Voer een kort discovery-gesprek. Llama 3.3 via Groq analyseert je context en geeft
          onderbouwde aanbevelingen met kostenraming, compliance-check en live playground.
        </p>
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors text-sm"
        >
          Start het gesprek
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Feature cards — staggered reveal */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16"
        variants={cardContainer}
        initial={reduced ? false : 'hidden'}
        animate="show"
      >
        {[
          { icon: MessageSquare, title: 'Conversational intake',  desc: 'AI stelt gerichte follow-up vragen over je use case, schaal, budget en privacy.' },
          { icon: TrendingUp,    title: 'Kostenraming',           desc: 'Bereken maandelijkse kosten per model op basis van jouw tokenvolume.' },
          { icon: Shield,        title: 'Compliance check',       desc: 'GDPR-status, dataresidentie en trainingsbeleid per model.' },
          { icon: Zap,           title: 'Live playground',        desc: 'Test je prompt side-by-side op 3 Groq-modellen met latency en kosten.' },
          { icon: FlaskConical,  title: 'Beslissingspad',         desc: 'Zie welke factoren de aanbeveling hebben bepaald.' },
          { icon: FileDown,      title: 'PDF export',             desc: 'Exporteer het adviesrapport als PDF voor je team of opdrachtgever.' },
        ].map(({ icon: Icon, title, desc }) => (
          <motion.div
            key={title}
            variants={cardItem}
            className="bg-white rounded-xl border border-slate-200 p-5"
          >
            <Icon className="w-4 h-4 text-slate-400 mb-3" />
            <h3 className="font-medium text-slate-800 mb-1 text-sm">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Models covered — scroll-triggered */}
      <motion.div
        className="bg-white rounded-xl border border-slate-200 p-8"
        initial={reduced ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <h2 className="font-medium text-slate-800 mb-1">106 modellen vergeleken</h2>
        <p className="text-sm text-slate-400 mb-5">Van ultra-lichte edge-modellen tot state-of-the-art MoE (Mixture of Experts).</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4">
          {[
            'Claude 3.5 Sonnet', 'GPT-4o', 'Gemini 1.5 Pro',
            'Llama 3.3 70B', 'Llama 4 Scout', 'Llama 4 Maverick',
            'Mistral Large', 'Mixtral 8x22B', 'Mistral Small 3.1',
            'DeepSeek R1 671B', 'DeepSeek V3', 'DeepSeek-R1 7B',
            'Qwen3 235B MoE', 'Qwen3 Coder 480B', 'Qwen2.5 72B',
            'Gemma 3 27B', 'Phi-4 14B', 'Granite 4.0',
            'StarCoder2 15B', 'Falcon3 10B', 'BLOOM 176B',
            'Command R 35B', 'Kimi K2 1T', '+ meer...',
          ].map((model) => (
            <div key={model} className="text-sm text-slate-500">
              {model}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

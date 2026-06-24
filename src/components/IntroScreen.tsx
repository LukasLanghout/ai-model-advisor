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
      {/* Hero — links uitgelijnd, redactioneel in plaats van template-gecentreerd */}
      <motion.div
        className="max-w-2xl mb-16 border-l-2 border-brand-600 pl-6 sm:pl-8"
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">
          Persoonlijk project — Lukas Langhout
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
          Welk AI-model past bij jouw situatie?
        </h1>
        <p className="text-base text-slate-500 mb-7 leading-relaxed">
          Voer een kort discovery-gesprek. Llama 3.3 via Groq analyseert je context en geeft
          onderbouwde aanbevelingen met kostenraming, compliance-check en live playground.
        </p>
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-brand-700 text-white font-medium rounded-md transition-colors text-sm"
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
            className="bg-white rounded-lg border border-slate-200 p-5"
          >
            <Icon className="w-4 h-4 text-slate-400 mb-3" />
            <h3 className="font-medium text-slate-800 mb-1 text-sm">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Models covered — scroll-triggered */}
      <motion.div
        className="bg-white rounded-lg border border-slate-200 p-8"
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

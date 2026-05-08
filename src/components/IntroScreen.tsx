import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, MessageSquare, TrendingUp, Shield, Zap, FlaskConical, FileDown } from 'lucide-react';

interface Props {
  onStart: () => void;
}

const cardContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
};
const cardItem = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

export default function IntroScreen({ onStart }: Props) {
  const reduced = useReducedMotion();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      {/* Hero */}
      <motion.div
        className="text-center mb-16"
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <span className="inline-block px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-medium mb-4">
          Persoonlijk project · Lukas Langhout
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-5 leading-tight">
          Welk AI-model past<br />
          <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
            bij jouw situatie?
          </span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
          Voer een kort discovery-gesprek. Llama 3.3 via Groq analyseert je context en geeft
          onderbouwde aanbevelingen met kostenraming, compliance-check en live playground.
        </p>
        <motion.button
          onClick={onStart}
          whileHover={reduced ? {} : { scale: 1.03, y: -1 }}
          whileTap={reduced ? {} : { scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-sm text-base"
        >
          Start het gesprek
          <ArrowRight className="w-5 h-5" />
        </motion.button>
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
            whileHover={reduced ? {} : { y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
            transition={{ duration: 0.18 }}
            className="bg-white rounded-2xl border border-slate-200 p-6"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
              <Icon className="w-5 h-5 text-brand-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
            <p className="text-sm text-slate-500">{desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Models covered — scroll-triggered */}
      <motion.div
        className="bg-gradient-to-br from-white to-brand-50/30 rounded-2xl border border-slate-200 p-8"
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <h2 className="font-semibold text-slate-900 mb-1">106 modellen vergeleken</h2>
        <p className="text-sm text-slate-400 mb-4">Van ultra-lichte edge-modellen tot state-of-the-art MoE — alle llmfit-modellen inbegrepen.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
            <div key={model} className="flex items-center gap-2 text-sm text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
              {model}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

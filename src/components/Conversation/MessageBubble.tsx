import { motion, useReducedMotion } from 'framer-motion';
import type { ConversationMessage } from '../../types';

interface Props {
  message: ConversationMessage;
}

export default function MessageBubble({ message }: Props) {
  const isUser  = message.role === 'user';
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={reduced ? false : { opacity: 0, x: isUser ? 16 : -16, y: 6 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
          AI
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-brand-600 text-white rounded-br-sm shadow-sm'
            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
}

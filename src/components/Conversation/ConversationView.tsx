import { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import type { ConversationMessage, ChatResponse, TopicKey, ExtractedScenario } from '../../types';
import MessageBubble from './MessageBubble';
import TopicProgress from './TopicProgress';
import TemplateSelector from './TemplateSelector';

interface Props {
  onReady: (scenario: ExtractedScenario) => void;
}

export default function ConversationView({ onReady }: Props) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [coveredTopics, setCoveredTopics] = useState<TopicKey[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    startConversation();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  async function startConversation() {
    setIsLoading(true);
    try {
      const response = await callChat([]);
      if (response.type === 'question' && response.question) {
        setMessages([{ role: 'assistant', content: response.question }]);
        setCoveredTopics(response.coveredTopics ?? []);
        setHint(response.hint ?? null);
        setStarted(true);
      }
    } catch {
      setMessages([{
        role: 'assistant',
        content: 'Hoi! Vertel me over je project. Wat wil je bouwen of oplossen met AI?',
      }]);
      setStarted(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function callChat(msgs: ConversationMessage[]): Promise<ChatResponse> {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: msgs }),
    });
    if (!res.ok) throw new Error('Chat API fout');
    return res.json();
  }

  async function handleSend(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    if (!text || isLoading) return;

    const userMessage: ConversationMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setHint(null);
    setIsLoading(true);

    try {
      const response = await callChat(newMessages);

      if (response.type === 'ready' && response.scenario) {
        setMessages([...newMessages, {
          role: 'assistant',
          content: response.summary ?? 'Ik heb genoeg informatie verzameld. Ik genereer nu je aanbevelingen...',
        }]);
        setCoveredTopics(response.coveredTopics ?? []);
        setTimeout(() => onReady(response.scenario!), 800);
      } else if (response.type === 'question' && response.question) {
        setMessages([...newMessages, { role: 'assistant', content: response.question }]);
        setCoveredTopics(response.coveredTopics ?? []);
        setHint(response.hint ?? null);
      }
    } catch {
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'Er ging iets mis. Probeer het opnieuw.',
      }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleTemplate(message: string) {
    handleSend(message);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Discovery gesprek</h2>
        <p className="text-sm text-slate-500">
          Beantwoord de vragen om een passende AI aanbeveling te ontvangen.
        </p>
      </div>

      <TopicProgress covered={coveredTopics} />

      <div className="mt-4 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col" style={{ height: '420px' }}>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!started && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Even wachten...
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}
          {isLoading && messages.length > 0 && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                AI
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {hint && (
          <div className="px-4 py-2 bg-amber-50 border-t border-amber-100 text-xs text-amber-700">
            💡 {hint}
          </div>
        )}

        <div className="border-t border-slate-200 p-3 flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Typ je antwoord... (Enter om te versturen)"
            rows={2}
            disabled={isLoading || !started}
            className="flex-1 resize-none text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50 bg-slate-50"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim() || !started}
            className="flex-shrink-0 w-9 h-9 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {started && messages.length <= 1 && (
        <div className="mt-4">
          <TemplateSelector onSelect={handleTemplate} />
        </div>
      )}
    </div>
  );
}

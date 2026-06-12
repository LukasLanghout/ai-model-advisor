import { CheckCircle2, Circle } from 'lucide-react';
import type { TopicKey } from '../../types';

const TOPIC_LABELS: Record<TopicKey, string> = {
  useCase: 'Use case',
  scale: 'Volume',
  latency: 'Snelheid',
  budget: 'Budget',
  privacy: 'Privacy',
  languages: 'Talen',
  contextWindow: 'Context',
};

interface Props {
  covered: TopicKey[];
}

export default function TopicProgress({ covered }: Props) {
  const allTopics = Object.keys(TOPIC_LABELS) as TopicKey[];
  const coveredSet = new Set(covered);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <p
        className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3"
        id="topic-progress-label"
      >
        Onderwerpen ({covered.length}/{allTopics.length})
      </p>
      {/* role="list" + aria-labelledby for screen reader context */}
      <ul
        role="list"
        aria-labelledby="topic-progress-label"
        className="flex flex-wrap gap-2"
      >
        {allTopics.map((topic) => {
          const done = coveredSet.has(topic);
          return (
            <li
              key={topic}
              aria-label={`${TOPIC_LABELS[topic]}: ${done ? 'besproken' : 'nog niet besproken'}`}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-colors ${
                done
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-slate-50 text-slate-400 border border-slate-200'
              }`}
            >
              {done ? (
                <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
              ) : (
                <Circle className="w-3 h-3" aria-hidden="true" />
              )}
              {TOPIC_LABELS[topic]}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

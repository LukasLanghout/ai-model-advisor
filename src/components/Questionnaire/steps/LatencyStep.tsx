import { Zap, MessageCircle, FileText, Clock } from 'lucide-react';
import OptionCard from '../OptionCard';
import type { Latency } from '../../../types';

interface Props {
  value: Latency | null;
  onChange: (v: Latency) => void;
}

const OPTIONS = [
  { value: 'realtime' as Latency, icon: Zap, label: 'Real-time (< 1 sec)', description: 'Live chat, autocomplete, typeahead — gebruiker wacht terwijl hij typt' },
  { value: 'interactive' as Latency, icon: MessageCircle, label: 'Interactief (1–5 sec)', description: 'Conversaties, vraag-antwoord — kleine pauze is acceptabel' },
  { value: 'batch' as Latency, icon: FileText, label: 'Batch (5–30 sec)', description: 'Rapporten, analyses, samenvatting — gebruiker wacht bewust' },
  { value: 'async' as Latency, icon: Clock, label: 'Asynchroon (minuten+)', description: 'Achtergrondtaken, lange documenten, overnight verwerking' },
];

export default function LatencyStep({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Hoe snel moet het antwoord komen?</h2>
      <p className="text-slate-500 text-sm mb-6">Latency beïnvloedt sterk welke modellen en platformen geschikt zijn.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            {...opt}
            selected={value === opt.value}
            onSelect={(v) => onChange(v as Latency)}
          />
        ))}
      </div>
    </div>
  );
}

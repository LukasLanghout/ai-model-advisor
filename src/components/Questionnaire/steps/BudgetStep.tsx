import { Coffee, CreditCard, Briefcase, TrendingUp, Server } from 'lucide-react';
import OptionCard from '../OptionCard';
import type { Budget } from '../../../types';

interface Props {
  value: Budget | null;
  onChange: (v: Budget) => void;
}

const OPTIONS = [
  { value: 'hobby' as Budget, icon: Coffee, label: '< €50/maand', description: 'Hobby of persoonlijk project — gratis tiers en goedkope opties' },
  { value: 'small' as Budget, icon: CreditCard, label: '€50–€500/maand', description: 'Klein bedrijf of start-up — balans tussen kwaliteit en kosten' },
  { value: 'medium' as Budget, icon: Briefcase, label: '€500–€5.000/maand', description: 'Groeiend bedrijf — kwaliteit is belangrijker dan kosten besparen' },
  { value: 'large' as Budget, icon: TrendingUp, label: '> €5.000/maand', description: 'Enterprise — beste kwaliteit, SLA\'s en ondersteuning gewenst' },
  { value: 'self-hosted' as Budget, icon: Server, label: 'Self-hosted voorkeur', description: 'Voorkeur voor eigen hardware — open-source modellen on-premise draaien' },
];

export default function BudgetStep({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Wat is je maandbudget voor AI?</h2>
      <p className="text-slate-500 text-sm mb-6">Inclusief API-kosten of cloud compute als je self-hosted gaat.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            {...opt}
            selected={value === opt.value}
            onSelect={(v) => onChange(v as Budget)}
          />
        ))}
      </div>
    </div>
  );
}

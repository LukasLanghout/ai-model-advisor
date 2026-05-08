import { Webhook, HardDrive, Smartphone, Layers } from 'lucide-react';
import OptionCard from '../OptionCard';
import type { Integration } from '../../../types';

interface Props {
  value: Integration | null;
  onChange: (v: Integration) => void;
}

const OPTIONS = [
  { value: 'api' as Integration, icon: Webhook, label: 'REST API (cloud)', description: 'Standaard API-integratie vanuit je applicatie naar een cloud-provider' },
  { value: 'on-premise' as Integration, icon: HardDrive, label: 'On-premise', description: 'Model draait op eigen servers — volledige controle over data en infrastructuur' },
  { value: 'edge' as Integration, icon: Smartphone, label: 'Edge / Mobiel', description: 'Model draait lokaal op device — lichte modellen, offline werking' },
  { value: 'hybrid' as Integration, icon: Layers, label: 'Hybride', description: 'Combinatie van cloud en lokaal, bijv. gevoelige data lokaal, rest via API' },
];

export default function IntegrationStep({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Hoe wil je het model integreren?</h2>
      <p className="text-slate-500 text-sm mb-6">Dit bepaalt of cloud-only of self-hostbare modellen de voorkeur hebben.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            {...opt}
            selected={value === opt.value}
            onSelect={(v) => onChange(v as Integration)}
          />
        ))}
      </div>
    </div>
  );
}

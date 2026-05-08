import { Globe, FileCheck, ShieldAlert, Lock } from 'lucide-react';
import OptionCard from '../OptionCard';
import type { Privacy } from '../../../types';

interface Props {
  value: Privacy | null;
  onChange: (v: Privacy) => void;
}

const OPTIONS = [
  { value: 'open' as Privacy, icon: Globe, label: 'Geen beperkingen', description: 'Openbare data of niet-gevoelige informatie — elke cloud provider is prima' },
  { value: 'business' as Privacy, icon: FileCheck, label: 'Zakelijk gevoelig', description: 'Bedrijfsdata — cloud mag mits verwerkersovereenkomst (AVG/GDPR)' },
  { value: 'sensitive' as Privacy, icon: ShieldAlert, label: 'Sterk gevoelig', description: 'Persoonsgegevens of medische data — EU-cloud is vereist (bijv. Azure EU, AWS Frankfurt)' },
  { value: 'confidential' as Privacy, icon: Lock, label: 'Strikt vertrouwelijk', description: 'Data mag de organisatie niet verlaten — only on-premise of air-gapped' },
];

export default function PrivacyStep({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Hoe gevoelig zijn de data die verwerkt worden?</h2>
      <p className="text-slate-500 text-sm mb-6">Privacy-vereisten sluiten bepaalde modellen en platformen direct uit.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            {...opt}
            selected={value === opt.value}
            onSelect={(v) => onChange(v as Privacy)}
          />
        ))}
      </div>
    </div>
  );
}

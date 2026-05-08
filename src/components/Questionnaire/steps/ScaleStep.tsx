import { FlaskConical, Laptop, Building2, Building, Globe } from 'lucide-react';
import OptionCard from '../OptionCard';
import type { Scale } from '../../../types';

interface Props {
  value: Scale | null;
  onChange: (v: Scale) => void;
}

const OPTIONS = [
  { value: 'prototype' as Scale, icon: FlaskConical, label: 'Prototype / intern', description: '< 100 requests/dag — proof of concept of intern gebruik' },
  { value: 'small' as Scale, icon: Laptop, label: 'Kleine applicatie', description: '100–1.000 requests/dag — start-up of klein SaaS-product' },
  { value: 'medium' as Scale, icon: Building2, label: 'Middelgrote applicatie', description: '1.000–10.000 requests/dag — groeiende applicatie' },
  { value: 'large' as Scale, icon: Building, label: 'Grote applicatie', description: '10.000–100.000 requests/dag — productie op schaal' },
  { value: 'enterprise' as Scale, icon: Globe, label: 'Enterprise schaal', description: '> 100.000 requests/dag — enterprise of hoog volume platform' },
];

export default function ScaleStep({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Hoeveel requests verwacht je per dag?</h2>
      <p className="text-slate-500 text-sm mb-6">Dit bepaalt mede de kosten en of rate-limits een risico vormen.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            {...opt}
            selected={value === opt.value}
            onSelect={(v) => onChange(v as Scale)}
          />
        ))}
      </div>
    </div>
  );
}

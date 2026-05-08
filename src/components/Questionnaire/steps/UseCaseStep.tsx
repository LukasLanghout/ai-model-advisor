import { MessageSquare, Code2, BarChart3, Image, Bot, HelpCircle } from 'lucide-react';
import OptionCard from '../OptionCard';
import type { UseCase } from '../../../types';

interface Props {
  value: UseCase | null;
  onChange: (v: UseCase) => void;
}

const OPTIONS = [
  { value: 'text-language' as UseCase, icon: MessageSquare, label: 'Tekst & Taal', description: 'Chatbot, samenvatting, vertaling, contentgeneratie, schrijfassistent' },
  { value: 'code-development' as UseCase, icon: Code2, label: 'Code & Development', description: 'Code genereren, code review, debugging, technische documentatie' },
  { value: 'data-analysis' as UseCase, icon: BarChart3, label: 'Data-analyse & Inzichten', description: 'Analyse van gestructureerde data, rapportages, inzichten uit documenten' },
  { value: 'image-vision' as UseCase, icon: Image, label: 'Beeld & Vision', description: 'Afbeelding classificatie, OCR, visuele analyse, beschrijvingen' },
  { value: 'automation-agents' as UseCase, icon: Bot, label: 'Automatisering & Agents', description: 'Multi-step taken, workflows, autonome agents, tool-gebruik' },
  { value: 'other' as UseCase, icon: HelpCircle, label: 'Anders / Combinatie', description: 'Combinatie van bovenstaande of een specifieke use case die niet past' },
];

export default function UseCaseStep({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Wat wil je bereiken met AI?</h2>
      <p className="text-slate-500 text-sm mb-6">Kies de categorie die het beste past bij jouw hoofdtoepassing.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            {...opt}
            selected={value === opt.value}
            onSelect={(v) => onChange(v as UseCase)}
          />
        ))}
      </div>
    </div>
  );
}

import type { LucideIcon } from 'lucide-react';

interface Props {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
  selected: boolean;
  onSelect: (value: string) => void;
}

export default function OptionCard({ value, label, description, icon: Icon, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        selected
          ? 'border-brand-500 bg-brand-50 shadow-sm'
          : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
            selected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <div className={`font-medium text-sm ${selected ? 'text-brand-700' : 'text-slate-800'}`}>
            {label}
          </div>
          <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</div>
        </div>
      </div>
    </button>
  );
}

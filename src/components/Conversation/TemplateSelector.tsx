import { ShoppingCart, Heart, Megaphone, Code2 } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'mkb-webshop',
    icon: ShoppingCart,
    title: 'MKB Webshop',
    description: 'Klantenservice chatbot voor een Nederlandse webshop met ~500 vragen/dag',
    message: 'Ik heb een Nederlandse webshop met zo\'n 500 klantvragen per dag. Ik wil een chatbot bouwen voor klantenservice — retourvragen, orderstatus, productadvies. Budget is beperkt tot €200/maand. Privacy is niet kritisch.',
  },
  {
    id: 'zorginstelling',
    icon: Heart,
    title: 'Zorginstelling',
    description: 'Medische documentatie of patiëntcommunicatie, privacy-gevoelig',
    message: 'Ik werk bij een zorginstelling in Nederland. We willen AI inzetten voor het samenvatten van medische dossiers en rapportages. Privacy is cruciaal — de data mag absoluut niet buiten onze eigen servers. We kunnen servers in huis hosten.',
  },
  {
    id: 'marketing',
    icon: Megaphone,
    title: 'Marketing & Content',
    description: 'Contentgeneratie, campagnes, meertalige teksten',
    message: 'Ik ben een marketingbureau. We willen AI inzetten voor het schrijven van advertentieteksten, social media content en e-mail campagnes. Zowel Nederlands als Engels. We verwerken geen privacygevoelige data en willen maximale kwaliteit.',
  },
  {
    id: 'software-dev',
    icon: Code2,
    title: 'Software Development',
    description: 'Code genereren, reviews, documentatie voor een dev team',
    message: 'Ik leid een klein software team van 5 developers. We willen AI inzetten voor code completion, pull request reviews en het schrijven van documentatie. We werken met TypeScript en Python. Budget is €500/maand, latency mag iets hoger zijn.',
  },
];

interface Props {
  onSelect: (message: string) => void;
}

export default function TemplateSelector({ onSelect }: Props) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
        Of kies een template om snel te starten
      </p>
      <div className="grid grid-cols-2 gap-2">
        {TEMPLATES.map(({ id, icon: Icon, title, description, message }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(message)}
            className="text-left bg-white border border-slate-200 hover:border-brand-300 hover:bg-brand-50 rounded-xl p-3 transition-all group"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-brand-50 group-hover:bg-brand-100 flex items-center justify-center flex-shrink-0 transition-colors">
                <Icon className="w-3.5 h-3.5 text-brand-600" />
              </div>
              <span className="text-xs font-semibold text-slate-800">{title}</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

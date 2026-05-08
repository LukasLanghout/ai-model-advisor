import { useState } from 'react';
import { RotateCcw, Lightbulb, Download } from 'lucide-react';
import type { RecommendationResult, ExtractedScenario } from '../../types';
import ModelCard from './ModelCard';
import CostCalculator from './CostCalculator';
import PlaygroundView from './PlaygroundView';
import ComplianceTable from './ComplianceTable';
import DecisionTree from './DecisionTree';

interface Props {
  result: RecommendationResult;
  scenario: ExtractedScenario;
  onRestart: () => void;
}

const TABS = [
  { id: 'aanbevelingen', label: 'Aanbevelingen' },
  { id: 'beslissing', label: 'Beslissingspad' },
  { id: 'kosten', label: 'Kosten' },
  { id: 'playground', label: 'Playground' },
  { id: 'compliance', label: 'Compliance' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function RecommendationsView({ result, onRestart }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('aanbevelingen');

  function handlePrint() {
    window.print();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-slide-up print-container">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Jouw AI aanbeveling</h2>
          <p className="text-sm text-slate-500 mt-1">Op basis van je discovery gesprek</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="no-print inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            PDF exporteren
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="no-print inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Opnieuw
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-6 sm:p-8 mb-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-200 mb-2">Samenvatting</p>
        <p className="text-base sm:text-lg leading-relaxed">{result.summary}</p>
      </div>

      {/* Key considerations */}
      {result.keyConsiderations?.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">Belangrijke overwegingen</span>
          </div>
          <ul className="space-y-1.5">
            {result.keyConsiderations.map((c) => (
              <li key={c} className="text-sm text-amber-800 flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tabs */}
      <div className="no-print border-b border-slate-200 mb-6">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="min-h-[400px]">
        {activeTab === 'aanbevelingen' && (
          <div className="space-y-4">
            {result.topThreeComparison && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Top 3 vergelijking: </span>
                {result.topThreeComparison}
              </div>
            )}
            {result.recommendations.map((rec, i) => (
              <ModelCard key={rec.modelId} rec={rec} isTop={i === 0} />
            ))}
          </div>
        )}

        {activeTab === 'beslissing' && (
          <DecisionTree
            decisionFactors={result.decisionFactors}
            topRecommendation={result.recommendations[0]}
            summary={result.summary}
          />
        )}

        {activeTab === 'kosten' && (
          <CostCalculator recommendations={result.recommendations} />
        )}

        {activeTab === 'playground' && (
          <PlaygroundView />
        )}

        {activeTab === 'compliance' && (
          <ComplianceTable recommendations={result.recommendations} />
        )}
      </div>

      {/* Print-only: show all sections */}
      <div className="print-only hidden">
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4">Aanbevelingen</h3>
          {result.recommendations.map((rec, i) => (
            <ModelCard key={rec.modelId} rec={rec} isTop={i === 0} />
          ))}
        </div>
      </div>
    </div>
  );
}

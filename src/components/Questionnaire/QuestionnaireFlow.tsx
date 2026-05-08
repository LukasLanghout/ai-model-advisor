import { useState } from 'react';
import type { UserScenario, QuestionStep } from '../../types';
import StepIndicator from './StepIndicator';
import UseCaseStep from './steps/UseCaseStep';
import ScaleStep from './steps/ScaleStep';
import LatencyStep from './steps/LatencyStep';
import BudgetStep from './steps/BudgetStep';
import PrivacyStep from './steps/PrivacyStep';
import IntegrationStep from './steps/IntegrationStep';
import { ArrowLeft, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

const STEP_ORDER: QuestionStep[] = ['useCase', 'scale', 'latency', 'budget', 'privacy', 'integration'];

interface Props {
  onSubmit: (scenario: UserScenario) => void;
  initialScenario: UserScenario;
  apiError: string | null;
}

export default function QuestionnaireFlow({ onSubmit, initialScenario, apiError }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [scenario, setScenario] = useState<UserScenario>(initialScenario);

  const currentStep = STEP_ORDER[stepIndex];
  const isLast = stepIndex === STEP_ORDER.length - 1;
  const currentValue = scenario[currentStep];

  function handleChange(field: QuestionStep, value: string) {
    setScenario((prev) => ({ ...prev, [field]: value }));
  }

  function handleNext() {
    if (isLast) {
      onSubmit(scenario);
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  function handleBack() {
    setStepIndex((i) => i - 1);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-slide-up">
      <StepIndicator currentStep={stepIndex} />

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-6">
        {currentStep === 'useCase' && (
          <UseCaseStep value={scenario.useCase} onChange={(v) => handleChange('useCase', v)} />
        )}
        {currentStep === 'scale' && (
          <ScaleStep value={scenario.scale} onChange={(v) => handleChange('scale', v)} />
        )}
        {currentStep === 'latency' && (
          <LatencyStep value={scenario.latency} onChange={(v) => handleChange('latency', v)} />
        )}
        {currentStep === 'budget' && (
          <BudgetStep value={scenario.budget} onChange={(v) => handleChange('budget', v)} />
        )}
        {currentStep === 'privacy' && (
          <PrivacyStep value={scenario.privacy} onChange={(v) => handleChange('privacy', v)} />
        )}
        {currentStep === 'integration' && (
          <IntegrationStep value={scenario.integration} onChange={(v) => handleChange('integration', v)} />
        )}
      </div>

      {apiError && (
        <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-xl mb-6 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {apiError}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={stepIndex === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Vorige
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!currentValue}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {isLast ? (
            <>
              <Sparkles className="w-4 h-4" />
              Genereer aanbeveling
            </>
          ) : (
            <>
              Volgende
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

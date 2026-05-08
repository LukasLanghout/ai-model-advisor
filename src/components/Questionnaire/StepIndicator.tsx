const STEPS = ['Use case', 'Schaal', 'Snelheid', 'Budget', 'Privacy', 'Integratie'];

interface Props {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: Props) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-col items-center flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                i < currentStep
                  ? 'bg-brand-600 text-white'
                  : i === currentStep
                  ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                  : 'bg-slate-200 text-slate-400'
              }`}
            >
              {i < currentStep ? '✓' : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className="absolute" />
            )}
          </div>
        ))}
      </div>
      <div className="relative h-1.5 bg-slate-200 rounded-full">
        <div
          className="absolute left-0 top-0 h-full bg-brand-600 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        {STEPS.map((label, i) => (
          <span
            key={label}
            className={`text-[10px] text-center flex-1 hidden sm:block ${
              i === currentStep ? 'text-brand-600 font-medium' : 'text-slate-400'
            }`}
          >
            {label}
          </span>
        ))}
      </div>
      <p className="text-sm text-slate-500 mt-2 sm:hidden">
        Stap {currentStep + 1} van {STEPS.length}: <span className="font-medium text-slate-700">{STEPS[currentStep]}</span>
      </p>
    </div>
  );
}

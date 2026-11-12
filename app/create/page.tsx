'use client';

import { useEffect, useState } from 'react';
import { WizardProvider, useWizard } from '@/context/WizardContext';
import { stepComplete } from '@/lib/wizard';
import { motion, AnimatePresence } from 'framer-motion';
import StepDetails  from '@/components/wizard/StepDetails';
import StepPhotos   from '@/components/wizard/StepPhotos';
import StepMessage  from '@/components/wizard/StepMessage';
import StepNote     from '@/components/wizard/StepNote';
import StepStyle    from '@/components/wizard/StepStyle';
import StepPreview  from '@/components/wizard/StepPreview';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CreatePage() {
  return (
    <WizardProvider>
      <WizardShell />
    </WizardProvider>
  );
}

const STEPS = [
  { label: 'Details',  icon: '🎂' },
  { label: 'Photos',   icon: '📸' },
  { label: 'Balloons', icon: '🎈' },
  { label: 'Letter',   icon: '💌' },
  { label: 'Style',    icon: '🎵' },
  { label: 'Preview',  icon: '🎬' },
];

function WizardShell() {
  const { step, totalSteps, setStep, formData } = useWizard();
  const wide = step === totalSteps;

  // furthest step reached – used to flag steps that were skipped while still incomplete
  const [maxStep, setMaxStep] = useState(1);
  useEffect(() => setMaxStep(m => Math.max(m, step)), [step]);
  const complete = stepComplete(formData, maxStep);

  return (
    <div className="min-h-screen pt-6 pb-16 px-4 md:px-6">

      {/* ── Header Bar ── */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl group-hover:animate-bounce-soft">🎂</span>
            <span className="font-dancing text-xl font-bold gradient-text">BirthdayBliss</span>
          </Link>
          <span className="text-sm text-white/50 font-semibold">
            Step {step} of {totalSteps}
          </span>
        </div>

        {/* Progress steps */}
        <ol className="flex items-center gap-0 mb-3" aria-label="Progress">
          {STEPS.map((s, i) => {
            const isActive  = i + 1 === step;
            const isDone    = complete[i];
            // jumped past this step but it still needs something
            const needsWork = !isDone && !isActive && i + 1 < maxStep;
            return (
              <li key={s.label} className="flex items-center flex-1 last:flex-none">
                <button
                  type="button"
                  onClick={() => setStep(i + 1)}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`${s.label}${isDone ? ' (done)' : needsWork ? ' (needs attention)' : ''}`}
                  title={s.label}
                  className="group flex flex-col items-center gap-1 cursor-pointer"
                >
                  <div
                    className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 group-hover:scale-110 group-active:scale-95',
                      isActive
                        ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-glow-pink step-dot-active scale-110'
                        : isDone
                        ? 'bg-gradient-to-br from-rose-500/60 to-pink-600/60 text-white/90'
                        : needsWork
                        ? 'bg-amber-400/20 text-amber-200 ring-1 ring-amber-300/60'
                        : 'bg-white/10 text-white/60 group-hover:bg-white/20 group-hover:text-white'
                    )}
                  >
                    {isDone && !isActive ? '✓' : needsWork ? '!' : s.icon}
                  </div>
                  <span className={cn(
                    'text-xs font-semibold hidden sm:block whitespace-nowrap transition-colors',
                    isActive ? 'text-rose-300' : isDone ? 'text-white/60' : needsWork ? 'text-amber-200/80' : 'text-white/40 group-hover:text-white/70'
                  )}>
                    {s.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-1.5 rounded-full bg-white/10 overflow-hidden mb-4 sm:mb-5">
                    <motion.div
                      className="h-full bg-gradient-to-r from-rose-500 to-pink-600"
                      initial={{ width: '0%' }}
                      animate={{ width: isDone ? '100%' : '0%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* ── Step Panel ── */}
      <div className={cn('mx-auto transition-[max-width] duration-500', wide ? 'max-w-5xl' : 'max-w-3xl')}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0,  scale: 1    }}
            exit={{    opacity: 0, x: -40, scale: 0.98 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 1 && <StepDetails />}
            {step === 2 && <StepPhotos  />}
            {step === 3 && <StepMessage />}
            {step === 4 && <StepNote    />}
            {step === 5 && <StepStyle   />}
            {step === 6 && <StepPreview />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

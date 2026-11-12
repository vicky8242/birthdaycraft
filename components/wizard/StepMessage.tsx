'use client';

import { useState } from 'react';
import { useWizard } from '@/context/WizardContext';
import { StepNav } from '@/components/ui';
import { BALLOON_PRESETS, COMPLIMENT_SUGGESTIONS, MIN_COMPLIMENTS, MAX_COMPLIMENTS } from '@/lib/types';
import { BALLOON_COLORS } from '@/components/experience/art';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

/** Step 3 – the words hidden in the balloons + the notes floating around the rose bouquet */
export default function StepMessage() {
  const { formData, update, setBalloonWord, setCompliment, nextStep, prevStep } = useWizard();
  const [focus, setFocus] = useState(0);

  function handleNext() {
    if (formData.balloonWords.some(w => !w.trim())) {
      toast.error('Give every balloon a word or two 🎈');
      return;
    }
    if (formData.compliments.slice(0, MIN_COMPLIMENTS).some(c => !c.trim())) {
      toast.error('Fill in the first 3 sweet notes for the roses 🌹');
      return;
    }
    // drop any extra notes that were added but left empty
    if (formData.compliments.some(c => !c.trim())) {
      update({ compliments: formData.compliments.filter(c => c.trim()) });
    }
    nextStep();
  }

  return (
    <div className="step-card">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 6, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 1.5 }}
          className="text-5xl mb-3"
        >
          🎈
        </motion.div>
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-2">
          Balloons &amp; Roses
        </h2>
        <p className="text-white/60">Two little games they&apos;ll play before reading your letter 💕</p>
      </div>

      <div className="space-y-10">
        {/* ── Balloons ── */}
        <section aria-labelledby="balloons-h">
          <h3 id="balloons-h" className="text-sm font-bold text-white flex items-center gap-2 mb-1">
            <span>🎈</span> The secret sentence
          </h3>
          <p className="text-white/55 text-xs mb-4">
            They pop 4 balloons — each one reveals a piece of this sentence.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {formData.balloonWords.map((w, i) => (
              <label key={i} className="relative block">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ring-2 ring-white/40"
                  style={{ background: BALLOON_COLORS[i].dark }}
                  aria-hidden="true"
                />
                <span className="sr-only">Balloon {i + 1}</span>
                <input
                  value={w}
                  onChange={e => setBalloonWord(i, e.target.value)}
                  maxLength={24}
                  placeholder={['You', 'are', 'my', 'sunshine ☀️'][i]}
                  className="glass-input w-full pl-10 pr-3 py-3 text-base"
                />
              </label>
            ))}
          </div>

          {/* live sentence */}
          <div className="rounded-2xl bg-white/[0.06] border border-white/10 px-4 py-3 text-center mb-4">
            <span className="text-[0.65rem] uppercase tracking-widest text-white/40 font-bold block mb-0.5">They will read</span>
            <span className="font-dancing text-2xl text-rose-300">
              {formData.balloonWords.map(w => w.trim()).filter(Boolean).join(' ') || '…'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {BALLOON_PRESETS.map(p => {
              const active = p.join('|') === formData.balloonWords.join('|');
              return (
                <button
                  key={p.join('|')}
                  type="button"
                  onClick={() => update({ balloonWords: [...p] })}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                    active
                      ? 'bg-rose-500/30 border-rose-400/60 text-white'
                      : 'border-white/15 text-white/60 hover:border-rose-400/40 hover:text-white'
                  )}
                >
                  {p.join(' ')}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Roses ── */}
        <section aria-labelledby="roses-h">
          <h3 id="roses-h" className="text-sm font-bold text-white flex items-center gap-2 mb-1">
            <span>🌹</span> Notes around the rose bouquet
          </h3>
          <p className="text-white/55 text-xs mb-4">
            Short, sweet lines that float around the roses — 3 to {MAX_COMPLIMENTS} of them. Tap a suggestion to use it.
          </p>

          <div className="space-y-3 mb-4">
            {formData.compliments.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={c}
                  onChange={e => setCompliment(i, e.target.value)}
                  onFocus={() => setFocus(i)}
                  maxLength={60}
                  aria-label={`Rose note ${i + 1}`}
                  placeholder={
                    ['Forever yours 🤍', 'You make my world beautiful', 'You are my sunshine ☀️'][i] ?? 'Another sweet line 💕'
                  }
                  className="glass-input w-full px-4 py-3 text-base"
                />
                {i >= MIN_COMPLIMENTS && (
                  <button
                    type="button"
                    onClick={() => {
                      update({ compliments: formData.compliments.filter((_, j) => j !== i) });
                      setFocus(0);
                    }}
                    aria-label={`Remove rose note ${i + 1}`}
                    className="shrink-0 w-10 h-10 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-rose-400/50 transition-all"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {formData.compliments.length < MAX_COMPLIMENTS && (
              <button
                type="button"
                onClick={() => {
                  update({ compliments: [...formData.compliments, ''] });
                  setFocus(formData.compliments.length);
                }}
                className="w-full rounded-2xl border border-dashed border-white/20 py-3 text-sm font-semibold text-white/60 hover:text-white hover:border-rose-400/50 hover:bg-white/5 transition-all"
              >
                ＋ Add another note ({formData.compliments.length}/{MAX_COMPLIMENTS})
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {COMPLIMENT_SUGGESTIONS.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => { setCompliment(focus, s); setFocus(f => (f + 1) % formData.compliments.length); }}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border border-white/15 text-white/60 hover:border-rose-400/40 hover:text-white hover:bg-white/5 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </section>
      </div>

      <StepNav onBack={prevStep} onNext={handleNext} nextLabel="Write the Letter" />
    </div>
  );
}

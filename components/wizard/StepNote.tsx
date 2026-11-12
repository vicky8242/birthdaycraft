'use client';

import { useEffect, useState } from 'react';
import { useWizard } from '@/context/WizardContext';
import { closingTemplate, isTemplate, letterTemplate } from '@/lib/templates';
import { Textarea, StepNav, OptionalBadge } from '@/components/ui';
import { QUALITY_OPTIONS, SIGNOFF_OPTIONS } from '@/lib/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

/** Step 4 – the letter, memory, qualities and the closing note */
export default function StepNote() {
  const { formData, update, toggleQuality, nextStep, prevStep } = useWizard();
  const [idea, setIdea] = useState(0);
  const rel = formData.relationship;

  // Pre-fill a starter letter + closing note the first time this step opens.
  // Everything stays editable; once seeded we never refill, so clearing a field sticks.
  useEffect(() => {
    if (formData.notesSeeded) return;
    update({
      notesSeeded: true,
      message:   formData.message.trim()   ? formData.message   : letterTemplate(rel, 0),
      finalNote: formData.finalNote.trim() ? formData.finalNote : closingTemplate(rel, 0),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.notesSeeded]);

  /** Swap in another starter text – asks first if it would overwrite something the user wrote. */
  function suggest(kind: 'letter' | 'closing') {
    const field = kind === 'letter' ? 'message' : 'finalNote';
    const current = formData[field];
    if (current.trim() && !isTemplate(current, kind) && !window.confirm('Replace what you wrote with a new suggestion?')) return;
    const next = idea + 1;
    setIdea(next);
    update({ [field]: kind === 'letter' ? letterTemplate(rel, next) : closingTemplate(rel, next) });
  }

  function handleNext() {
    if (!formData.message.trim()) { toast.error('Please write your birthday letter 💌'); return; }
    if (!formData.finalNote.trim()) { toast.error('Please write a closing note 📝'); return; }
    nextStep();
  }

  return (
    <div className="step-card">
      <div className="text-center mb-10">
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          className="text-5xl mb-3"
        >
          💌
        </motion.div>
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-2">Your Letter</h2>
        <p className="text-white/60">Write what you feel — make it personal and sincere 💕</p>
      </div>

      <div className="space-y-8">
        <Textarea
          label="Birthday letter"
          icon="💬"
          placeholder={`Every moment with you feels like a celebration. You light up every room you walk into, and I feel so lucky to have you in my life…`}
          value={formData.message}
          onChange={e => update({ message: e.target.value })}
          rows={6}
          maxLength={600}
          maxChars={600}
          hint="Appears on a handwritten-style letter, word by word ✍️"
        />
        <IdeaBar
          kind="letter"
          text={formData.message}
          onAnother={() => suggest('letter')}
          onClear={() => update({ message: '' })}
        />

        <Textarea
          label={<>A memory you treasure <OptionalBadge /></>}
          icon="✨"
          placeholder={`That rainy evening when we shared one umbrella and one plate of momos 🥟`}
          value={formData.favoriteMemory}
          onChange={e => update({ favoriteMemory: e.target.value })}
          rows={2}
          maxLength={300}
          maxChars={300}
          hint="Shown with your photos (or as a P.S. if there are none)"
        />

        {/* qualities */}
        <div>
          <label className="text-sm font-semibold text-white/80 flex items-center gap-2 mb-3">
            <span>🌸</span> What makes them special <OptionalBadge />
          </label>
          <div className="flex flex-wrap gap-2">
            {QUALITY_OPTIONS.map(q => {
              const selected = formData.qualities.includes(q);
              return (
                <motion.button
                  key={q}
                  type="button"
                  onClick={() => toggleQuality(q)}
                  whileTap={{ scale: 0.92 }}
                  aria-pressed={selected}
                  className={cn(
                    'px-3.5 py-2 rounded-full text-sm font-semibold border transition-all duration-200',
                    selected
                      ? 'bg-gradient-to-r from-rose-500/40 to-purple-500/40 border-rose-400/60 text-white shadow-[0_0_12px_rgba(244,63,122,0.3)]'
                      : 'border-white/15 text-white/60 hover:border-rose-400/40 hover:text-white hover:bg-white/5'
                  )}
                >
                  {q}
                </motion.button>
              );
            })}
          </div>
        </div>

        <hr className="border-white/10" />

        <Textarea
          label="Closing note — the very last thing they read"
          icon="📝"
          placeholder={`No matter where life takes us, I'll always be here cheering for you. Happy Birthday, my love. 🌹`}
          value={formData.finalNote}
          onChange={e => update({ finalNote: e.target.value })}
          rows={4}
          maxLength={600}
          maxChars={600}
        />
        <IdeaBar
          kind="closing"
          text={formData.finalNote}
          onAnother={() => suggest('closing')}
          onClear={() => update({ finalNote: '' })}
        />

        {/* Sign-off */}
        <div>
          <label className="text-sm font-semibold text-white/80 flex items-center gap-2 mb-3">
            <span>✍️</span> Sign-off <OptionalBadge />
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {SIGNOFF_OPTIONS.map(s => {
              const active = formData.signoff === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => update({ signoff: s })}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200',
                    active
                      ? 'bg-gradient-to-r from-rose-500 to-pink-600 border-transparent text-white shadow-glow-pink'
                      : 'border-white/15 text-white/60 hover:border-rose-400/40 hover:text-white'
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
          <input
            type="text"
            placeholder="Or write your own sign-off…"
            value={formData.signoff}
            onChange={e => update({ signoff: e.target.value })}
            maxLength={50}
            aria-label="Custom sign-off"
            className="glass-input w-full px-4 py-3 text-sm"
          />
        </div>
      </div>

      <StepNav onBack={prevStep} onNext={handleNext} nextLabel="Style & Music" nextIcon="🎵" />
    </div>
  );
}

/** Small helper row under a pre-filled field: tells the user it's a starting point and lets them swap/clear it. */
function IdeaBar({ kind, text, onAnother, onClear }: {
  kind: 'letter' | 'closing'; text: string; onAnother: () => void; onClear: () => void;
}) {
  const starter = isTemplate(text, kind);
  return (
    <div className="-mt-5 flex flex-wrap items-center gap-2 text-xs">
      <span className={starter ? 'text-amber-300/90' : 'text-white/40'}>
        {starter ? '✏️ Pre-filled for you – edit it to make it yours' : 'Need a hand?'}
      </span>
      <button type="button" onClick={onAnother}
        className="px-2.5 py-1 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-rose-400/50 transition-all">
        ↻ Another idea
      </button>
      {text.trim() && (
        <button type="button" onClick={onClear}
          className="px-2.5 py-1 rounded-full border border-white/15 text-white/50 hover:text-white hover:border-rose-400/50 transition-all">
          ✕ Start blank
        </button>
      )}
    </div>
  );
}

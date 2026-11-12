'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWizard } from '@/context/WizardContext';
import { Button } from '@/components/ui';
import { SYNTH_OPTIONS, THEME_CONFIGS } from '@/lib/types';
import { useSongs } from '@/lib/songs';
import { formToExperience } from '@/lib/experience';
import { PRICE_LABEL } from '@/lib/config';
import { getMissing } from '@/lib/wizard';
import { usePaymentsLive } from '@/lib/payments';
import Experience from '@/components/experience/Experience';
import PhoneFrame from '@/components/experience/PhoneFrame';
import PaymentModal from '@/components/payment/PaymentModal';

/** Step 6 – FREE, unlimited preview of the real experience. Payment only unlocks the share link. */
export default function StepPreview() {
  const { formData, setStep, prevStep } = useWizard();
  const [run, setRun] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const free = usePaymentsLive() === false;

  const data  = useMemo(() => formToExperience(formData), [formData]);
  const theme = THEME_CONFIGS[formData.themeColor];
  const songs = useSongs();
  const song  = songs?.find(s => s.id === formData.musicTrack);
  const synth = SYNTH_OPTIONS.find(m => m.id === formData.musicTrack);
  const music = synth ?? (song ? { emoji: song.emoji, label: song.title } : undefined);
  const name  = data.nickname || data.name || 'them';
  const missing = useMemo(() => getMissing(formData), [formData]);

  const summary = [
    { icon: '🎁', label: 'For',    val: data.name },
    { icon: '💝', label: 'From',   val: data.sender },
    { icon: '📸', label: 'Photos', val: data.photos.length ? `${data.photos.length} polaroid${data.photos.length > 1 ? 's' : ''}` : 'None' },
    { icon: '🎈', label: 'Balloons', val: data.balloonWords.join(' ') },
    { icon: '🎨', label: 'Theme',  val: theme.label },
    { icon: '🎵', label: 'Music',  val: music ? `${music.emoji} ${music.label}` : '—' },
  ];

  return (
    <div className="step-card !p-5 md:!p-10">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3 animate-bounce-soft">🎬</div>
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-2">Your surprise is ready!</h2>
        <p className="text-white/60 text-sm md:text-base max-w-lg mx-auto">
          This is <strong className="text-rose-300">exactly</strong> what {name} will see. Tap through it —
          play with the balloons, blow the candle 🕯️. Previewing is free, as many times as you like.
        </p>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,22rem)_1fr] gap-10 items-start">
        {/* phone */}
        <div className="flex flex-col items-center gap-4">
          <PhoneFrame glow={theme.glow}>
            <Experience key={run} data={data} mode="preview" />
          </PhoneFrame>
          <button
            type="button"
            onClick={() => setRun(r => r + 1)}
            className="text-sm font-semibold text-white/60 hover:text-white transition-colors flex items-center gap-2"
          >
            <span aria-hidden="true">↻</span> Restart preview
          </button>
          <p className="text-xs text-white/40 text-center max-w-[16rem]">
            🔊 Turn your sound on. The candle uses your microphone only while you blow — nothing is recorded.
          </p>
        </div>

        {/* summary + pay */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {summary.map(d => (
              <div key={d.label} className="bg-white/[0.05] border border-white/10 rounded-2xl px-4 py-3 min-w-0">
                <div className="text-[0.65rem] text-white/40 font-bold uppercase tracking-wider mb-1">{d.icon} {d.label}</div>
                <div className="font-bold text-sm text-white truncate">{d.val}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-rose-400/25 bg-rose-500/[0.06] p-5">
            <h3 className="font-bold text-white mb-1">
              {free ? 'Love it? Get your share link — free for now 🎁' : `Love it? Get the share link for ${PRICE_LABEL}`}
            </h3>
            <p className="text-white/55 text-sm leading-relaxed mb-4">
              {free
                ? 'No payment needed right now. You get a private link to send on WhatsApp, SMS or email.'
                : "You only pay when you're happy. After payment you get a private link to send on WhatsApp, SMS or email."}
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-white/75 mb-5">
              {['🔗 Private link, works for ever', '📱 Opens on any phone', '🎶 Music, photos & games included', '✏️ Nothing extra to pay'].map(f => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            {missing.length > 0 && (
              <div className="mb-4 rounded-xl border border-amber-300/30 bg-amber-400/10 p-4" role="alert">
                <p className="text-amber-200 font-bold text-sm mb-2">✋ Almost there — a few things are still empty:</p>
                <ul className="space-y-1.5">
                  {missing.map(m => (
                    <li key={m.label}>
                      <button
                        type="button"
                        onClick={() => setStep(m.step)}
                        className="text-sm text-white/80 hover:text-white underline underline-offset-2 text-left"
                      >
                        {m.label} →
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Button
              onClick={() => setShowPayment(true)}
              disabled={missing.length > 0}
              size="lg"
              className="w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:saturate-50"
            >
              {free ? '🔗 Get my share link' : <>💳 Pay {PRICE_LABEL} &amp; get my link</>}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <button onClick={prevStep} className="text-white/60 hover:text-white font-semibold transition-colors">← Edit style</button>
            <button onClick={() => setStep(3)} className="text-white/60 hover:text-white font-semibold transition-colors">🎈 Edit balloons</button>
            <button onClick={() => setStep(4)} className="text-white/60 hover:text-white font-semibold transition-colors">💌 Edit letter</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPayment && <PaymentModal free={free} onClose={() => setShowPayment(false)} />}
      </AnimatePresence>
    </div>
  );
}

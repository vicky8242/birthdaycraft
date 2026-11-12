'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CandleCake } from '../art';
import { BurstHost, useBursts } from '../fx';
import { SceneProps, SceneWrap, XpButton } from '../ui';
import { useBlowDetector } from '@/hooks/useBlowDetector';
import { displayName } from '@/lib/experience';
import { sfx } from '@/lib/sfx';

type Phase = 'ready' | 'wish' | 'blow' | 'out';

export default function CandleScene({ data, next, duckMusic }: SceneProps) {
  const fx = useBursts();
  const [phase, setPhase] = useState<Phase>('ready');
  const [showTap, setShowTap] = useState(false);
  const phaseRef = useRef<Phase>('ready');
  phaseRef.current = phase;

  const blowOut = () => {
    if (phaseRef.current === 'out') return;
    setPhase('out');
    duckMusic(false);
    sfx.whoosh();
    window.setTimeout(() => { sfx.yay(); fx.fireFrac(0.5, 0.4, 'confetti', 34); }, 650);
    window.setTimeout(() => fx.fireFrac(0.5, 0.5, 'hearts', 22), 1100);
  };

  const mic = useBlowDetector({ onBlow: blowOut, isArmed: () => phaseRef.current === 'blow' });

  // restore music volume if the scene is left mid-way
  useEffect(() => () => duckMusic(false), [duckMusic]);

  // wish → blow transition
  useEffect(() => {
    if (phase !== 'wish') return;
    const t = window.setTimeout(() => setPhase('blow'), 3600);
    return () => window.clearTimeout(t);
  }, [phase]);

  // offer a tap fallback if blowing isn't picked up
  useEffect(() => {
    if (phase !== 'blow') return;
    const t = window.setTimeout(() => setShowTap(true), 9000);
    return () => window.clearTimeout(t);
  }, [phase]);

  function begin() {
    setPhase('wish');
    duckMusic(true);
    sfx.sparkle();
    mic.start();               // requests permission inside the click gesture
  }

  function tapBlow() {
    mic.cancel();
    blowOut();
  }

  const micBlocked = mic.status === 'denied' || mic.status === 'unsupported';
  const dim = phase === 'wish' ? 0.82 : phase === 'blow' ? 0.4 : 0;

  return (
    <SceneWrap className="!px-4">
      <BurstHost ctl={fx} />

      {/* dim the room (above the card, below the wish text & top bar) */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 45%, rgba(80,40,54,.55), rgba(48,22,36,.95))' }}
        animate={{ opacity: dim }}
        transition={{ duration: 1.1 }}
      />

      <div className="xp-card relative z-20 w-full max-w-[24rem] flex-1 min-h-0 flex flex-col items-center px-5 pt-5 pb-5">
        <h2 className="font-display text-[1.55rem] leading-tight xp-ink text-center">
          {phase === 'out' ? `Wish made, ${displayName(data)} 🤍` : `Blow the candle, ${displayName(data)}`}
        </h2>

        <div className="relative flex-1 min-h-0 w-full flex items-center justify-center py-2">
          <CandleCake lit={phase !== 'out'} flicker={phase === 'blow' ? mic.level : 0} className="h-full w-full max-w-[17rem]" />

          {/* smoke */}
          {phase === 'out' && (
            <div className="absolute left-1/2 top-[24%] -translate-x-1/2 pointer-events-none" aria-hidden="true">
              {[0, 1, 2, 3].map(i => (
                <span key={i} className="xp-smoke" style={{ animationDelay: `${i * 0.35}s`, left: `${(i - 1.5) * 7}px` }} />
              ))}
            </div>
          )}
        </div>

        <div className="w-full text-center min-h-[5.2rem] flex flex-col items-center justify-end gap-2">
          <AnimatePresence mode="wait">
            {phase === 'ready' && (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full flex flex-col items-center gap-2">
                <button onClick={begin} className="xp-btn-outline w-full">
                  <span aria-hidden="true">💨</span> Blow into the mic
                </button>
                <button onClick={() => { setPhase('wish'); duckMusic(true); }} className="font-cute text-xs font-bold xp-ink-soft underline underline-offset-2">
                  no mic? tap to blow instead
                </button>
              </motion.div>
            )}

            {phase === 'blow' && (
              <motion.div key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex flex-col items-center gap-2">
                <p className="font-cute font-extrabold text-lg xp-strong">
                  {micBlocked ? 'Mic is off — no worries!' : 'Now blow! 💨'}
                </p>
                {!micBlocked && (
                  <div className="w-full max-w-[14rem] h-2.5 rounded-full bg-white/60 overflow-hidden" aria-hidden="true">
                    <motion.div className="h-full rounded-full" style={{ background: 'var(--strong)' }} animate={{ width: `${Math.round(mic.level * 100)}%` }} transition={{ duration: 0.08 }} />
                  </div>
                )}
                {(micBlocked || showTap || mic.status === 'idle') && (
                  <XpButton variant="white" onClick={tapBlow} className="!py-2 !text-sm">
                    Tap to blow 🌬️
                  </XpButton>
                )}
              </motion.div>
            )}

            {phase === 'out' && (
              <motion.div key="o" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }} className="w-full flex flex-col items-center gap-2">
                <p className="font-hand font-bold text-2xl xp-strong">May every wish come true ✨</p>
                <XpButton onClick={next} className="w-full max-w-[16rem]">Surprise inside 🌹</XpButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* eyes-closed overlay */}
      <AnimatePresence>
        {phase === 'wish' && (
          <motion.div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center text-center px-8 pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
          >
            <p className="font-display italic text-[2rem] leading-tight text-white drop-shadow">
              Close your eyes<br />&amp; make a wish
            </p>
            <motion.p
              className="mt-10 font-hand font-bold text-xl"
              style={{ color: 'var(--soft)' }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              Make a wish…
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneWrap>
  );
}

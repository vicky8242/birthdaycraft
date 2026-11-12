'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Balloon, BALLOON_COLORS } from '../art';
import { BurstHost, useBursts } from '../fx';
import { SceneProps, SceneWrap, XpButton } from '../ui';
import { sfx } from '@/lib/sfx';

export default function BalloonScene({ data, next }: SceneProps) {
  const fx = useBursts();
  const [popped, setPopped] = useState<boolean[]>([false, false, false, false]);
  const [finale, setFinale] = useState(false);
  const count = popped.filter(Boolean).length;
  const all   = count === 4;

  function pop(i: number, e: React.MouseEvent<HTMLButtonElement>) {
    if (popped[i]) return;
    sfx.pop();
    fx.fireAt(e, 'confetti', 20);
    setPopped(p => p.map((v, j) => (j === i ? true : v)));
  }

  useEffect(() => {
    if (!all) return;
    const t1 = window.setTimeout(() => { sfx.yay(); fx.fireFrac(0.5, 0.35, 'hearts', 30); setFinale(true); }, 1300);
    return () => window.clearTimeout(t1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all]);

  return (
    <SceneWrap>
      <BurstHost ctl={fx} />

      {/* progress chip (sits left of the sound button) */}
      <div className="absolute top-4 right-[4.6rem] z-30 xp-chip" aria-live="polite">
        {count}/4 popped
      </div>

      <AnimatePresence mode="wait">
        {!finale ? (
          <motion.div
            key="game"
            className="flex flex-col items-center w-full flex-1 min-h-0"
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="font-cute font-extrabold text-[1.7rem] leading-tight xp-strong text-center mb-1">
              {all ? 'Aww, look what it says… 💌' : 'Pop all 4 balloons'}
            </h2>
            <p className="font-cute text-sm font-semibold xp-ink-soft mb-2">
              {all ? '' : 'Tap each balloon — every one hides a secret ✨'}
            </p>

            <div className="grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-2 w-full max-w-[21rem] flex-1 min-h-0">
              {data.balloonWords.map((word, i) => (
                <div key={i} className="relative flex items-center justify-center min-h-0">
                  <AnimatePresence>
                    {!popped[i] && (
                      <motion.button
                        key="b"
                        aria-label={`Pop balloon ${i + 1}`}
                        onClick={e => pop(i, e)}
                        className="xp-balloon relative h-full w-full flex items-center justify-center cursor-pointer"
                        style={{ animationDelay: `${i * 0.45}s` }}
                        initial={{ scale: 0, y: 40, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 1.9, opacity: 0, filter: 'blur(6px)' }}
                        transition={{ type: 'spring', bounce: 0.4, delay: 0.15 + i * 0.12 }}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Balloon palette={BALLOON_COLORS[i]} className="h-full w-auto max-w-full" />
                        <span className="xp-hand-hint" aria-hidden="true">👆</span>
                      </motion.button>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {popped[i] && (
                      <motion.span
                        key="w"
                        className="absolute inset-x-0 text-center font-hand font-bold text-[1.9rem] leading-none xp-ink px-1 break-words"
                        initial={{ opacity: 0, scale: 0.3, y: 20, rotate: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0, rotate: i % 2 ? 3 : -3 }}
                        transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                      >
                        {word}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="sentence"
            className="flex flex-col items-center justify-center w-full flex-1 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-cute font-bold text-sm tracking-[0.2em] uppercase xp-ink-soft mb-4">It says</p>
            <p className="font-hand font-bold xp-title xp-strong leading-[1.1] mb-8">
              {data.balloonWords.map((w, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.3em]"
                  initial={{ opacity: 0, y: 24, scale: 0.6 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.28, type: 'spring', bounce: 0.5 }}
                >
                  {w}
                </motion.span>
              ))}
            </p>
            <XpButton onClick={next} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
              Make a wish 🕯️
            </XpButton>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneWrap>
  );
}

'use client';

import { motion } from 'framer-motion';
import { SceneProps, SceneWrap, RevealWords, XpButton } from '../ui';
import { displayName } from '@/lib/experience';

export default function LetterScene({ data, next }: SceneProps) {
  const words    = data.message.split(/\s+/).filter(Boolean).length;
  const step     = Math.min(0.07, 4.5 / Math.max(words, 1));
  const total    = words * step + 0.6;
  const showMemory = data.memory && data.photos.length === 0;

  return (
    <SceneWrap>
      <motion.h2
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="font-hand font-bold text-[2.1rem] leading-none xp-ink text-center"
      >
        A letter for you 💌
      </motion.h2>

      <motion.div
        className="xp-paper relative w-full max-w-[24rem] flex-1 min-h-0 mt-4 mb-4"
        initial={{ opacity: 0, y: 40, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -0.6 }}
        transition={{ type: 'spring', bounce: 0.3, duration: 0.9 }}
      >
        <span className="xp-tape" aria-hidden="true" />
        <div className="xp-scroll h-full overflow-y-auto px-6 pt-7 pb-6">
          <p className="font-hand font-bold text-[1.35rem] xp-strong mb-2">Dear {displayName(data)},</p>

          <p className="font-hand font-semibold text-[1.4rem] leading-[1.45] xp-ink whitespace-pre-line">
            <RevealWords text={data.message} delay={0.5} step={step} />
          </p>

          {showMemory && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: total }}
              className="font-hand font-semibold text-[1.25rem] leading-snug xp-ink-soft italic mt-4"
            >
              P.S. {data.memory}
            </motion.p>
          )}

          {data.qualities.length > 0 && (
            <div className="mt-5">
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: total + 0.2 }}
                className="font-cute text-[0.7rem] font-extrabold tracking-widest uppercase xp-ink-soft mb-2"
              >
                Why you&apos;re so special
              </motion.p>
              <div className="flex flex-wrap gap-2">
                {data.qualities.map((q, i) => (
                  <motion.span
                    key={q}
                    className="xp-chip-soft"
                    initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: total + 0.4 + i * 0.12, type: 'spring', bounce: 0.5 }}
                  >
                    {q}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <XpButton onClick={next} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="w-full max-w-[16rem]">
        One last thing 🎁
      </XpButton>
    </SceneWrap>
  );
}

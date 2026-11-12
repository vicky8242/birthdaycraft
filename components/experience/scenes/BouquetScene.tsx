'use client';

import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Bouquet, HeartTree } from '../art';
import { BurstHost, FloatingHearts, useBursts } from '../fx';
import { SceneProps, SceneWrap, XpButton } from '../ui';
import { sfx } from '@/lib/sfx';

// where each compliment bubble floats when there are 3 (matches the reference layout)
const SPOTS_3 = [
  { left: '1%',   top: '5%'  },
  { right: '1%',  top: '1%'  },
  { left: '0%',   top: '21%' },
] as const;

/** 4–6 notes: smaller bubbles in two tidy columns above the roses, bouquet shifts down a bit. */
function compactSpot(i: number, n: number): CSSProperties {
  const row = Math.floor(i / 2);
  const top = `${1 + row * 15 + (i % 2 ? 3 : 0)}%`;
  if (n % 2 === 1 && i === n - 1) return { left: '29%', top };   // lone last note sits in the middle
  return i % 2 ? { right: '1%', top } : { left: '1%', top };
}
export default function BouquetScene({ data, next }: SceneProps) {
  const fx = useBursts();
  const notes = data.compliments.slice(0, 6);
  const compact = notes.length > 3;
  const rows = Math.ceil(notes.length / 2);
  // with 4+ notes the bouquet moves down (and shrinks) to make room for the bubbles
  const bouquetTop = compact ? 19 + (rows - 1) * 10 : 19;
  const bouquetH = compact ? 88 - bouquetTop : 62;

  return (
    <SceneWrap className="!pt-[4.2rem]">
      <BurstHost ctl={fx} />
      <FloatingHearts count={9} color="#F58BB0" />

      <motion.h2
        initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="font-hand font-bold text-[2.2rem] leading-none xp-ink text-center relative z-20"
      >
        Your Rose Bouquet 🌹
      </motion.h2>

      <div className="relative flex-1 min-h-0 w-full max-w-[24rem] mt-2">
        {/* trees */}
        <HeartTree className="absolute bottom-0 -left-[4%] h-[42%] w-auto" />
        <HeartTree className="absolute bottom-0 -right-[4%] h-[42%] w-auto" flip />

        {/* bouquet – the wrapper is a plain centred box (framer owns `transform`, so no translate classes here) */}
        <div className="absolute inset-x-[16%] z-10" style={{ top: `${bouquetTop}%`, height: `${bouquetH}%` }}>
          <motion.div
            className="h-full w-full"
            initial={{ scale: 0, rotate: -12, y: 80 }}
            animate={{ scale: 1, rotate: 0, y: 0 }}
            transition={{ type: 'spring', bounce: 0.4, duration: 1.2, delay: 0.35 }}
            onAnimationComplete={() => fx.fireFrac(0.5, 0.4, 'sparkle', 18)}
          >
            <motion.div
              className="h-full w-full"
              animate={{ rotate: [-1.5, 1.5, -1.5], y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Bouquet className="h-full w-full drop-shadow-[0_14px_16px_rgba(120,20,50,.22)]" />
            </motion.div>
          </motion.div>
        </div>

        {/* compliments */}
        {notes.map((text, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={e => { sfx.boing(); fx.fireAt(e, 'hearts', 14); }}
            className={`xp-bubble absolute z-20 text-left ${compact ? 'xp-bubble-sm max-w-[48%]' : 'max-w-[46%]'}`}
            style={compact ? compactSpot(i, notes.length) : SPOTS_3[i]}
            initial={{ opacity: 0, scale: 0.4, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.3 + i * 0.6, type: 'spring', bounce: 0.55 }}
            whileTap={{ scale: 0.92 }}
          >
            <span className="block xp-bob-soft" style={{ animationDelay: `${i * 0.5}s` }}>{text}</span>
          </motion.button>
        ))}
      </div>

      <XpButton
        onClick={next}
        className="mt-3 w-full max-w-[16rem] relative z-20"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 + notes.length * 0.6 }}
      >
        Open my letter 💌
      </XpButton>
    </SceneWrap>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Envelope } from '../art';
import { BurstHost, useBursts } from '../fx';
import { SceneProps, SceneWrap, XpButton } from '../ui';
import { displayName } from '@/lib/experience';
import { sfx } from '@/lib/sfx';

/** First tap – required so browsers allow music + microphone. */
export default function GateScene({ data, next, startMusic }: SceneProps) {
  const [open, setOpen] = useState(false);
  const fx = useBursts();

  function openIt(e: React.MouseEvent<HTMLButtonElement>) {
    if (open) return;
    setOpen(true);
    startMusic();
    sfx.sparkle();
    fx.fireAt(e, 'hearts', 18);
    window.setTimeout(() => fx.fireFrac(0.5, 0.45, 'sparkle', 20), 500);
    window.setTimeout(next, 1700);
  }

  return (
    <SceneWrap className="justify-between">
      <BurstHost ctl={fx} />

      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="font-cute font-bold text-sm tracking-[0.2em] uppercase xp-ink-soft"
        >
          A little surprise for
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, type: 'spring', bounce: 0.4 }}
          className="font-hand font-bold xp-title xp-ink break-words"
        >
          {displayName(data)} 💕
        </motion.h1>
      </div>

      <motion.div
        className="flex-1 min-h-0 w-full max-w-[19rem] flex items-center justify-center py-3"
        animate={open ? {} : { y: [0, -10, 0], rotate: [-1.5, 1.5, -1.5] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Envelope open={open} className="h-full w-full" />
      </motion.div>

      <div className="text-center w-full">
        <XpButton onClick={openIt} disabled={open} className="w-full max-w-[16rem]">
          {open ? 'Opening… 💌' : 'Tap to open ✨'}
        </XpButton>
        <p className="mt-3 font-cute text-xs font-semibold xp-ink-soft">
          🔊 Turn your sound on · from {data.sender}
        </p>
      </div>
    </SceneWrap>
  );
}

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SceneProps, SceneWrap, XpButton } from '../ui';
import { BurstHost, ConfettiRain, FloatingHearts, useBursts } from '../fx';
import { displayName } from '@/lib/experience';
import { sfx } from '@/lib/sfx';

export default function FinaleScene({ data, mode, restart }: SceneProps) {
  const fx = useBursts();

  useEffect(() => {
    sfx.yay();
    const a = window.setTimeout(() => fx.fireFrac(0.25, 0.3, 'confetti', 30), 300);
    const b = window.setTimeout(() => fx.fireFrac(0.75, 0.3, 'confetti', 30), 700);
    const c = window.setTimeout(() => fx.fireFrac(0.5, 0.2, 'hearts', 26), 1100);
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SceneWrap className="justify-between">
      <BurstHost ctl={fx} />
      <ConfettiRain />
      <FloatingHearts count={10} color="#F37AA3" />

      <div className="text-center relative z-10">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.6, delay: 0.2 }}
          className="text-6xl xp-heartbeat inline-block" aria-hidden="true"
        >
          🎂
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="font-hand font-bold xp-title xp-ink leading-[1.05] mt-1"
        >
          Happy Birthday,<br /><span className="xp-strong">{displayName(data)}!</span>
        </motion.h2>
      </div>

      <motion.div
        className="xp-card relative z-10 w-full max-w-[24rem] px-6 py-6 text-center max-h-[46%] overflow-y-auto xp-scroll"
        initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.9, duration: 0.7 }}
      >
        <p className="font-hand font-semibold text-[1.4rem] leading-snug xp-ink whitespace-pre-line">{data.finalNote}</p>
        <p className="font-hand font-bold text-[1.7rem] xp-strong mt-4 leading-none">{data.signoff}</p>
        <p className="font-cute font-bold text-sm xp-ink-soft mt-1">— {data.sender}</p>
      </motion.div>

      <motion.div
        className="relative z-10 w-full flex flex-col items-center gap-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
      >
        <XpButton onClick={restart} className="w-full max-w-[16rem]">Replay the magic ✨</XpButton>
        {mode === 'page' && (
          <Link href="/create" className="font-cute text-sm font-bold xp-strong underline underline-offset-4 py-1">
            Make one for someone you love 💝
          </Link>
        )}
      </motion.div>
    </SceneWrap>
  );
}

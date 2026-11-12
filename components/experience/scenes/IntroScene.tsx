'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CuteDuo } from '../art';
import { BurstHost, useBursts } from '../fx';
import { SceneProps, SceneWrap, RevealWords, XpButton } from '../ui';
import { displayName, introTitle } from '@/lib/experience';
import { sfx } from '@/lib/sfx';

const NO_LABELS = ['No', 'No?', 'Are you sure? 🥺', 'Pleaseee 🥹', 'Last chance 💔', 'Okay fine… 😭'];

export default function IntroScene({ data, next }: SceneProps) {
  const fx     = useBursts();
  const noRef  = useRef<HTMLButtonElement>(null);
  const yesRef = useRef<HTMLButtonElement>(null);
  const base   = useRef<{ left: number; top: number } | null>(null);
  const last   = useRef(0);

  const [off,   setOff]   = useState({ x: 0, y: 0, rot: -6 });
  const [tries, setTries] = useState(0);
  const [said,  setSaid]  = useState(false);

  const surrendered = tries >= NO_LABELS.length - 1;

  function dodge() {
    const now = Date.now();
    if (now - last.current < 260 || surrendered) return;
    last.current = now;

    const root = fx.rootRef.current, no = noRef.current, yes = yesRef.current;
    if (!root || !no || !yes) return;
    const rr = root.getBoundingClientRect();
    const nr = no.getBoundingClientRect();
    const yr = yes.getBoundingClientRect();
    if (!base.current) base.current = { left: nr.left - off.x, top: nr.top - off.y };

    const pad = 14, w = nr.width, h = nr.height;
    const minX = rr.left + pad, maxX = rr.right - w - pad;
    const minY = rr.top + rr.height * 0.6, maxY = rr.bottom - h - pad;

    let nx = minX, ny = minY, ok = false;
    for (let i = 0; i < 18 && !ok; i++) {
      nx = minX + Math.random() * Math.max(1, maxX - minX);
      ny = minY + Math.random() * Math.max(1, maxY - minY);
      const far = Math.hypot(nx - nr.left, ny - nr.top) > 90;
      const hitsYes = nx < yr.right + 12 && nx + w > yr.left - 12 && ny < yr.bottom + 12 && ny + h > yr.top - 12;
      ok = far && !hitsYes;
    }
    setOff({ x: nx - base.current.left, y: ny - base.current.top, rot: (Math.random() - 0.5) * 26 });
    setTries(t => t + 1);
    sfx.boing();
  }

  function yes(e: React.MouseEvent<HTMLButtonElement>, sorry = false) {
    if (said) return;
    setSaid(true);
    sfx.yay();
    fx.fireAt(e, 'hearts', 26);
    window.setTimeout(() => fx.fireFrac(0.5, 0.3, 'confetti', 30), 150);
    window.setTimeout(next, sorry ? 1100 : 900);
  }

  const noLabel = NO_LABELS[Math.min(tries, NO_LABELS.length - 1)];

  return (
    <SceneWrap className="justify-between">
      <BurstHost ctl={fx} />

      <div className="text-center">
        <h1 className="font-hand font-bold xp-title xp-ink leading-[1.05]">
          <RevealWords text={introTitle(data)} />
          <br />
          <RevealWords text={displayName(data)} delay={0.4} className="xp-strong" />
        </h1>
      </div>

      <motion.div
        className="flex-1 min-h-0 w-full max-w-[26rem] flex items-center justify-center py-2"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring', bounce: 0.35 }}
      >
        <CuteDuo className="h-full w-full" />
      </motion.div>

      <div className="w-full text-center">
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="font-display text-lg xp-ink mb-4"
        >
          Are you excited for what&apos;s next?
        </motion.p>

        <div className="relative flex items-center justify-center gap-6 h-[3.6rem]">
          <motion.button
            ref={yesRef}
            onClick={e => yes(e)}
            animate={{ scale: 1 + Math.min(tries, 6) * 0.07 }}
            whileTap={{ scale: 0.92 }}
            className="xp-btn min-w-[7.5rem]"
          >
            {said ? 'Yay! 🎉' : 'Yes 💖'}
          </motion.button>

          <motion.button
            ref={noRef}
            animate={{ x: off.x, y: off.y, rotate: off.rot, scale: surrendered ? 0.9 : 1 }}
            transition={{ type: 'spring', stiffness: 360, damping: 22 }}
            onPointerEnter={dodge}
            onPointerDown={e => { if (!surrendered) { e.preventDefault(); dodge(); } }}
            onClick={e => {
              // Keyboard users (detail === 0) and the "Okay fine" state are allowed through.
              if (surrendered || e.detail === 0) yes(e, true);
              else dodge();
            }}
            className="xp-btn-white min-w-[6.5rem] relative z-10"
          >
            {noLabel}
          </motion.button>
        </div>
      </div>
    </SceneWrap>
  );
}

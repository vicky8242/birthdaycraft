'use client';

import { useRef, useState } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { SceneProps, SceneWrap, XpButton } from '../ui';
import { BurstHost, useBursts } from '../fx';
import { sfx } from '@/lib/sfx';

/** Sweet little captions printed under each photo (cycled). */
const CAPTIONS = [
  'Celebrating you 🎉',
  'Simply the best 💕',
  'Pure happiness ✨',
  'Always smiling 🌸',
  'Forever grateful 🤍',
  'Made of sunshine ☀️',
];

/** How the cards behind the top one peek out (like a loose stack of cards). */
const STACK = [
  { x: 0,  y: 0,  r: 0,    s: 1    },
  { x: -7, y: 13, r: -2.6, s: 0.985 },
  { x: 8,  y: 24, r: 2.4,  s: 0.97 },
];

export default function PhotoScene({ data, next }: SceneProps) {
  const photos = data.photos;
  const fx = useBursts();
  const [index, setIndex] = useState(0);
  const [dirs,  setDirs]  = useState<number[]>([]);
  const done = index >= photos.length;

  function flip(dir: number) {
    if (done) return;
    sfx.tap();
    setDirs(d => { const n = [...d]; n[index] = dir; return n; });
    setIndex(i => i + 1);
    if (index + 1 >= photos.length) window.setTimeout(() => fx.fireFrac(0.5, 0.4, 'hearts', 22), 350);
  }

  return (
    <SceneWrap>
      <BurstHost ctl={fx} />

      <h2 className="font-display italic xp-strong text-center leading-[1.05] whitespace-nowrap text-[clamp(1.55rem,9cqw,2.7rem)]">
        Some Sweet Moments
      </h2>
      <p className="text-[0.95rem] italic font-semibold xp-ink-soft mt-1.5 mb-4 text-center">
        {done ? '(That’s all of them 💕)' : '(Swipe the cards)'}
      </p>

      <div className="relative flex-1 min-h-0 w-full max-w-[21rem]">
        {photos.map((src, i) => {
          const depth = i - index;
          if (depth > 2) return null;
          return (
            <PhotoCard
              key={i}
              src={src}
              caption={CAPTIONS[i % CAPTIONS.length]}
              alt={`Memory ${i + 1}`}
              depth={depth}
              dir={dirs[i] ?? 1}
              onFlip={flip}
            />
          );
        })}

        {done && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-2"
            initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
          >
            <span className="text-7xl xp-heartbeat" aria-hidden="true">💖</span>
            {data.memory && (
              <div className="xp-note w-full text-center">
                <span className="text-[0.7rem] font-extrabold tracking-widest uppercase xp-strong block mb-0.5">Remember this?</span>
                <span className="font-hand font-bold text-xl leading-snug xp-ink">{data.memory}</span>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* progress dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3 h-2" aria-hidden="true">
        {photos.map((_, i) => {
          const active = !done && i === index;
          const seen   = i < index;
          return (
            <span
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: active ? 18 : 7,
                height: 7,
                background: active || seen ? 'var(--strong)' : 'rgba(255,255,255,.8)',
                opacity: seen ? 0.55 : 1,
              }}
            />
          );
        })}
      </div>

      <XpButton onClick={next} className="mt-4 w-full max-w-[16rem]">
        {done ? 'Continue 🌹' : 'Skip to the surprise →'}
      </XpButton>
    </SceneWrap>
  );
}

function PhotoCard({
  src, caption, alt, depth, dir, onFlip,
}: {
  src: string; caption: string; alt: string; depth: number; dir: number; onFlip: (dir: number) => void;
}) {
  const gone  = depth < 0;
  const isTop = depth === 0;
  const st    = STACK[Math.max(0, Math.min(depth, STACK.length - 1))];

  // Swiping is hand-rolled with pointer events (NOT framer's `drag`): the drag feature stops
  // AnimatePresence from ever finishing the scene's exit once a card has been flipped.
  // It lives on the inner layer so it never fights the stack animation on the outer one.
  const x      = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-11, 0, 11]);
  const press  = useRef<{ id: number; x0: number; t0: number; moved: boolean } | null>(null);
  // once flown away, take the card out of the DOM entirely
  const [removed, setRemoved] = useState(false);
  if (removed) return null;

  function onDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!isTop) return;
    press.current = { id: e.pointerId, x0: e.clientX - x.get(), t0: performance.now(), moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const p = press.current;
    if (!p || p.id !== e.pointerId) return;
    const dx = e.clientX - p.x0;
    if (Math.abs(dx) > 6) p.moved = true;
    x.set(dx);
  }
  function onUp(e: React.PointerEvent<HTMLDivElement>) {
    const p = press.current;
    if (!p || p.id !== e.pointerId) return;
    press.current = null;
    const dx = e.clientX - p.x0;
    const dt = Math.max(1, performance.now() - p.t0);
    const velocity = dx / dt; // px per ms
    if (!p.moved) {
      if (dt < 450) onFlip(1);                     // a tap
    } else if (Math.abs(dx) > 70 || Math.abs(velocity) > 0.45) {
      onFlip(dx > 0 ? 1 : -1);                     // a swipe – keep the offset, the outer layer flies it away
    } else {
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 26 });
    }
  }
  function onCancel() {
    press.current = null;
    animate(x, 0, { type: 'spring', stiffness: 300, damping: 26 });
  }

  return (
    <motion.div
      className="absolute inset-x-0 top-0 mx-auto h-[93%] w-full"
      style={{ zIndex: 30 - depth, pointerEvents: isTop ? 'auto' : 'none' }}
      initial={{ opacity: 0, y: 50, scale: 0.92 }}
      animate={gone
        ? { x: dir * 440, rotate: dir * 20, opacity: 0, scale: 0.92 }
        : { x: st.x, y: st.y, rotate: st.r, scale: st.s, opacity: 1 }}
      onAnimationComplete={() => { if (gone) setRemoved(true); }}
      transition={{ type: 'spring', stiffness: 190, damping: 24 }}
    >
      <motion.div
        className="h-full w-full cursor-grab active:cursor-grabbing"
        style={{ x, rotate, touchAction: 'pan-y' }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onCancel}
      >
        <div className="xp-photo-card h-full w-full flex flex-col">
          <div className="relative flex-1 min-h-0 overflow-hidden rounded-[1.15rem] bg-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} draggable={false} className="absolute inset-0 h-full w-full object-cover select-none" />
          </div>
          <p className="font-display xp-strong text-center leading-tight pt-3.5 pb-1.5 whitespace-nowrap text-[clamp(1.15rem,6.9cqw,1.7rem)]">
            {caption}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

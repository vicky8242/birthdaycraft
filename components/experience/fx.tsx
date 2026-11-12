'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, seeded } from './art';

// ───────────────────────────────────────────────────────────────────────────
// Ambient floating hearts (pure CSS animation → cheap, respects reduced-motion)
// ───────────────────────────────────────────────────────────────────────────
export function FloatingHearts({ count = 14, color = '#F37AA3' }: { count?: number; color?: string }) {
  const items = useMemo(() => {
    const r = seeded(count * 13 + 5);
    return Array.from({ length: count }, () => ({
      left:  r() * 100,
      size:  14 + r() * 34,
      dur:   9 + r() * 10,
      delay: -r() * 18,
      op:    0.22 + r() * 0.35,
      sway:  10 + r() * 28,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {items.map((h, i) => (
        <HeartIcon
          key={i}
          color={color}
          className="xp-rise absolute"
          style={{
            left: `${h.left}%`,
            bottom: '-12%',
            width: h.size,
            height: h.size,
            opacity: h.op,
            animationDuration: `${h.dur}s`,
            animationDelay: `${h.delay}s`,
            ['--sway' as string]: `${h.sway}px`,
          }}
        />
      ))}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Click bursts (confetti / hearts / sparkles) positioned inside a container
// ───────────────────────────────────────────────────────────────────────────
type BurstKind = 'confetti' | 'hearts' | 'sparkle';
interface BurstSpec { id: number; x: number; y: number; kind: BurstKind; count: number }

const CONFETTI = ['#F6657F', '#FFD35C', '#7CCBEA', '#8EDB9C', '#BDA6F2', '#FF9CBB', '#fff'];

export function useBursts() {
  const rootRef = useRef<HTMLDivElement>(null);
  const idRef   = useRef(0);
  const [bursts, setBursts] = useState<BurstSpec[]>([]);

  const fire = useCallback((x: number, y: number, kind: BurstKind = 'confetti', count = 22) => {
    const id = ++idRef.current;
    setBursts(b => [...b.slice(-6), { id, x, y, kind, count }]);
    window.setTimeout(() => setBursts(b => b.filter(i => i.id !== id)), 1800);
  }, []);

  /** Burst at the pointer / the centre of the element that was clicked. */
  const fireAt = useCallback((e: { clientX: number; clientY: number; currentTarget: Element }, kind: BurstKind = 'confetti', count = 22) => {
    const root = rootRef.current;
    if (!root) return;
    const rr = root.getBoundingClientRect();
    let { clientX: cx, clientY: cy } = e;
    if (!cx && !cy) {                       // keyboard activation
      const tr = e.currentTarget.getBoundingClientRect();
      cx = tr.left + tr.width / 2;
      cy = tr.top + tr.height / 2;
    }
    fire(cx - rr.left, cy - rr.top, kind, count);
  }, [fire]);

  /** Burst at a fractional point (0..1) of the container. */
  const fireFrac = useCallback((fx: number, fy: number, kind: BurstKind = 'confetti', count = 26) => {
    const root = rootRef.current;
    if (!root) return;
    const rr = root.getBoundingClientRect();
    fire(rr.width * fx, rr.height * fy, kind, count);
  }, [fire]);

  return { rootRef, bursts, fire, fireAt, fireFrac };
}

function Burst({ spec }: { spec: BurstSpec }) {
  const parts = useMemo(() => {
    const r = seeded(spec.id * 977 + 3);
    return Array.from({ length: spec.count }, (_, i) => {
      const angle = (i / spec.count) * Math.PI * 2 + r() * 0.6;
      const dist  = 60 + r() * 110;
      return {
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist - 20,
        rot: (r() - 0.5) * 720,
        size: 7 + r() * 9,
        color: CONFETTI[Math.floor(r() * CONFETTI.length)],
        dur: 0.9 + r() * 0.7,
        w: 5 + r() * 6,
      };
    });
  }, [spec.id, spec.count]);

  return (
    <div className="absolute pointer-events-none" style={{ left: spec.x, top: spec.y }}>
      {parts.map((p, i) => (
        <motion.span
          key={i}
          className="absolute block"
          style={{ left: 0, top: 0 }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.dx, y: p.dy + 70, scale: [0, 1.1, 0.9], opacity: [1, 1, 0], rotate: p.rot }}
          transition={{ duration: p.dur, ease: 'easeOut' }}
        >
          {spec.kind === 'confetti' && (
            <span className="block rounded-[2px]" style={{ width: p.w, height: p.size, background: p.color }} />
          )}
          {spec.kind === 'hearts' && (
            <HeartIcon color={i % 2 ? '#F0506E' : '#FF9CBB'} style={{ width: p.size * 1.8, height: p.size * 1.8 }} />
          )}
          {spec.kind === 'sparkle' && (
            <span style={{ fontSize: p.size * 1.6, color: i % 2 ? '#FFD35C' : '#fff', lineHeight: 1 }}>✦</span>
          )}
        </motion.span>
      ))}
    </div>
  );
}

export function BurstLayer({ bursts }: { bursts: BurstSpec[] }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-30" aria-hidden="true">
      {bursts.map(b => <Burst key={b.id} spec={b} />)}
    </div>
  );
}

/** Drop inside a scene: provides the measuring root + the particle layer. */
export function BurstHost({ ctl }: { ctl: ReturnType<typeof useBursts> }) {
  return (
    <>
      <div ref={ctl.rootRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />
      <BurstLayer bursts={ctl.bursts} />
    </>
  );
}

// Continuous confetti rain (finale)
export function ConfettiRain({ count = 36 }: { count?: number }) {
  const items = useMemo(() => {
    const r = seeded(321);
    return Array.from({ length: count }, () => ({
      left: r() * 100,
      w: 5 + r() * 6,
      h: 8 + r() * 10,
      color: CONFETTI[Math.floor(r() * CONFETTI.length)],
      dur: 4 + r() * 4,
      delay: -r() * 8,
      rot: r() * 360,
    }));
  }, [count]);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20" aria-hidden="true">
      {items.map((c, i) => (
        <span
          key={i}
          className="xp-fall absolute block rounded-[2px]"
          style={{
            left: `${c.left}%`, top: '-6%', width: c.w, height: c.h, background: c.color,
            animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s`, transform: `rotate(${c.rot}deg)`,
          }}
        />
      ))}
    </div>
  );
}

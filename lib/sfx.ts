/** Tiny synthesised sound effects (pop, sparkle, whoosh, yay). No assets needed. */

let ctx: AudioContext | null = null;
let enabled = true;

export function setSfxEnabled(on: boolean) { enabled = on; }

function ac(): AudioContext | null {
  if (typeof window === 'undefined' || !enabled) return null;
  if (!ctx) {
    const AC: typeof AudioContext | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => undefined);
  return ctx;
}

function noise(c: AudioContext, dur: number) {
  const buf  = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * dur)), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  return src;
}

function tone(c: AudioContext, freq: number, t: number, dur: number, vol: number, type: OscillatorType = 'sine') {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(c.destination);
  o.start(t); o.stop(t + dur + 0.05);
}

export const sfx = {
  pop() {
    const c = ac(); if (!c) return;
    const t = c.currentTime;
    const n = noise(c, 0.12);
    const f = c.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 0.8;
    const g = c.createGain();
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    n.connect(f); f.connect(g); g.connect(c.destination);
    n.start(t);
    const o = c.createOscillator();
    const og = c.createGain();
    o.frequency.setValueAtTime(520, t);
    o.frequency.exponentialRampToValueAtTime(110, t + 0.1);
    og.gain.setValueAtTime(0.35, t);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.connect(og); og.connect(c.destination);
    o.start(t); o.stop(t + 0.15);
  },

  sparkle() {
    const c = ac(); if (!c) return;
    const t = c.currentTime;
    [1318, 1568, 2093].forEach((f, i) => tone(c, f, t + i * 0.07, 0.35, 0.07));
  },

  tap() {
    const c = ac(); if (!c) return;
    tone(c, 880, c.currentTime, 0.12, 0.06);
  },

  boing() {
    const c = ac(); if (!c) return;
    const t = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(260, t);
    o.frequency.exponentialRampToValueAtTime(520, t + 0.12);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + 0.25);
  },

  whoosh() {
    const c = ac(); if (!c) return;
    const t = c.currentTime;
    const n = noise(c, 0.7);
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(400, t);
    f.frequency.exponentialRampToValueAtTime(2200, t + 0.3);
    f.frequency.exponentialRampToValueAtTime(300, t + 0.7);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.25, t + 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    n.connect(f); f.connect(g); g.connect(c.destination);
    n.start(t);
  },

  yay() {
    const c = ac(); if (!c) return;
    const t = c.currentTime;
    [523, 659, 784, 1046, 1318].forEach((f, i) => tone(c, f, t + i * 0.09, 0.5, 0.09, 'triangle'));
  },
};

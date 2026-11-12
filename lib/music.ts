import { isSynth, songFile, SONG_ID_RE } from './types';
import type { SynthId, TrackId } from './types';

/**
 * Background music engine.
 *
 * • Instrumentals (dreamy / playful / lullaby) are synthesised with the Web Audio API –
 *   no audio files, no licensing issues.
 * • Songs (listed in /public/music/songs.json) play from /public/music/<id>.mp3. You must
 *   hold the rights to any song you add. If a song's file is missing or fails to load,
 *   playback falls back to the "dreamy" instrumental so a surprise is never silent.
 */

const FALLBACK: SynthId = 'dreamy';

// ── Score definitions ─────────────────────────────────────────────────────
interface Note { t: number; midi: number; dur: number; vel: number; kind: 'bell' | 'pluck' }
interface Pad  { t: number; midis: number[]; dur: number }
interface Score { bpm: number; beats: number; notes: Note[]; pads: Pad[] }

const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

// small deterministic RNG so the "random" tune is always the same
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const CHORDS = {
  C:  { root: 48, tri: [60, 64, 67] },
  G:  { root: 43, tri: [59, 62, 67] },
  Am: { root: 45, tri: [60, 64, 69] },
  F:  { root: 41, tri: [60, 65, 69] },
};
type ChordName = keyof typeof CHORDS;

function dreamyScore(): Score {
  const bars: ChordName[] = ['C', 'G', 'Am', 'F', 'C', 'G', 'F', 'G'];
  const notes: Note[] = [];
  const pads: Pad[]   = [];

  bars.forEach((name, bar) => {
    const c = CHORDS[name];
    const t0 = bar * 4;
    pads.push({ t: t0, midis: [c.root, ...c.tri.map(m => m - 12)], dur: 4 });
    const a = c.tri;
    const arp = [a[0], a[1], a[2], a[0] + 12, a[2], a[1], a[0] + 12, a[1]];
    arp.forEach((m, i) => notes.push({ t: t0 + i * 0.5, midi: m, dur: 0.5, vel: 0.07, kind: 'bell' }));
  });

  const melody: [number, number, number][] = [
    [0, 76, 1.5], [1.5, 74, 0.5], [2, 72, 1], [3, 74, 1],
    [4, 71, 1.5], [5.5, 74, 0.5], [6, 79, 2],
    [8, 72, 1.5], [9.5, 76, 0.5], [10, 81, 2],
    [12, 77, 1.5], [13.5, 76, 0.5], [14, 72, 2],
    [16, 76, 1], [17, 79, 1], [18, 76, 2],
    [20, 74, 1.5], [21.5, 71, 0.5], [22, 74, 2],
    [24, 72, 1.5], [25.5, 69, 0.5], [26, 72, 1], [27, 77, 1],
    [28, 74, 2], [30, 71, 1], [31, 67, 1],
  ];
  melody.forEach(([t, midi, dur]) => notes.push({ t, midi, dur, vel: 0.16, kind: 'bell' }));
  return { bpm: 76, beats: 32, notes, pads };
}

function playfulScore(): Score {
  const bars: ChordName[] = ['C', 'G', 'Am', 'F'];
  const pent = [72, 74, 76, 79, 81, 84];
  const rand = rng(7);
  const notes: Note[] = [];
  const pads: Pad[]   = [];
  let prev = 2;

  bars.forEach((name, bar) => {
    const c = CHORDS[name];
    const t0 = bar * 4;
    notes.push({ t: t0,     midi: c.root,     dur: 0.5, vel: 0.2,  kind: 'pluck' });
    notes.push({ t: t0 + 1.5, midi: c.root + 7, dur: 0.5, vel: 0.12, kind: 'pluck' });
    notes.push({ t: t0 + 2, midi: c.root,     dur: 0.5, vel: 0.16, kind: 'pluck' });
    notes.push({ t: t0 + 3.5, midi: c.root + 7, dur: 0.5, vel: 0.1,  kind: 'pluck' });
    pads.push({ t: t0, midis: c.tri.map(m => m - 12), dur: 4 });
    for (let i = 0; i < 8; i++) {
      if (rand() < 0.28) continue;
      prev = Math.max(0, Math.min(pent.length - 1, prev + Math.round((rand() - 0.5) * 4)));
      notes.push({ t: t0 + i * 0.5, midi: pent[prev], dur: 0.5, vel: 0.13, kind: 'pluck' });
    }
  });
  return { bpm: 112, beats: 16, notes, pads };
}

function lullabyScore(): Score {
  // "Happy Birthday to You" (traditional, public domain) as a gentle music box
  const tune: [number, number, number][] = [
    [0, 67, 0.75], [0.75, 67, 0.25], [1, 69, 1], [2, 67, 1], [3, 72, 1], [4, 71, 2],
    [6, 67, 0.75], [6.75, 67, 0.25], [7, 69, 1], [8, 67, 1], [9, 74, 1], [10, 72, 2],
    [12, 67, 0.75], [12.75, 67, 0.25], [13, 79, 1], [14, 76, 1], [15, 72, 1], [16, 71, 1], [17, 69, 1],
    [18, 77, 0.75], [18.75, 77, 0.25], [19, 76, 1], [20, 72, 1], [21, 74, 1], [22, 72, 3],
  ];
  const notes: Note[] = tune.map(([t, midi, dur]) => ({ t, midi, dur, vel: 0.2, kind: 'bell' as const }));
  const pads: Pad[] = [];
  const bars: ChordName[] = ['C', 'G', 'C', 'G', 'C', 'C', 'F', 'C'];
  bars.forEach((name, bar) => {
    const c = CHORDS[name];
    const t0 = bar * 3;
    notes.push({ t: t0,     midi: c.root,        dur: 1, vel: 0.1,  kind: 'bell' });
    notes.push({ t: t0 + 1, midi: c.tri[1] - 12, dur: 1, vel: 0.06, kind: 'bell' });
    notes.push({ t: t0 + 2, midi: c.tri[2] - 12, dur: 1, vel: 0.06, kind: 'bell' });
    pads.push({ t: t0, midis: c.tri.map(m => m - 12), dur: 3 });
  });
  return { bpm: 84, beats: 27, notes, pads };
}

const SCORES: Record<SynthId, () => Score> = {
  dreamy:  dreamyScore,
  playful: playfulScore,
  lullaby: lullabyScore,
};

// ── Engine ────────────────────────────────────────────────────────────────
export class MusicEngine {
  private ctx:    AudioContext | null = null;
  private master: GainNode | null = null;
  private duckG:  GainNode | null = null;
  private bus:    GainNode | null = null;
  private send:   GainNode | null = null;
  private timer:  number | null = null;
  private el:     HTMLAudioElement | null = null;
  private running = false;
  private muted   = false;
  private ducked  = false;
  private readonly volume = 0.5;
  private onVis = () => this.handleVisibility();

  get isRunning() { return this.running; }

  /** Must be called from a user gesture (tap) so browsers allow audio. */
  start(track: TrackId) {
    if (typeof window === 'undefined') return;
    this.stop(true);
    this.running = true;
    document.addEventListener('visibilitychange', this.onVis);

    if (isSynth(track)) {
      this.startSynth(track);
      return;
    }
    if (!SONG_ID_RE.test(track)) {          // unknown / malformed id
      this.startSynth(FALLBACK);
      return;
    }

    const el = new Audio(songFile(track));
    el.loop   = true;
    el.volume = this.muted ? 0 : this.volume * (this.ducked ? 0.3 : 1);
    this.el = el;
    el.play().catch(() => {
      // file missing, blocked or broken – fall back to the instrumental
      if (this.el !== el || !this.running) return;
      this.el = null;
      this.startSynth(FALLBACK);
    });
  }

  stop(keepVisibility = false) {
    this.running = false;
    if (!keepVisibility) document.removeEventListener('visibilitychange', this.onVis);
    if (this.timer) { window.clearTimeout(this.timer); this.timer = null; }
    if (this.el) { this.el.pause(); this.el = null; }
    if (this.ctx) {
      const ctx = this.ctx, master = this.master;
      try { master?.gain.setTargetAtTime(0, ctx.currentTime, 0.12); } catch { /* ignore */ }
      window.setTimeout(() => ctx.close().catch(() => undefined), 600);
      this.ctx = this.master = this.duckG = this.bus = this.send = null;
    }
  }

  setMuted(m: boolean) {
    this.muted = m;
    this.applyGain();
  }

  duck(on: boolean) {
    this.ducked = on;
    this.applyGain();
  }

  private applyGain() {
    if (this.el) this.el.volume = this.muted ? 0 : this.volume * (this.ducked ? 0.3 : 1);
    if (this.ctx && this.master && this.duckG) {
      const t = this.ctx.currentTime;
      this.master.gain.setTargetAtTime(this.muted ? 0 : this.volume, t, 0.08);
      this.duckG.gain.setTargetAtTime(this.ducked ? 0.3 : 1, t, 0.1);
    }
  }

  private handleVisibility() {
    if (!this.running) return;
    if (document.hidden) {
      this.el?.pause();
      this.ctx?.suspend().catch(() => undefined);
    } else {
      this.el?.play().catch(() => undefined);
      this.ctx?.resume().catch(() => undefined);
    }
  }

  // ── synth ──
  private startSynth(track: SynthId) {
    const AC: typeof AudioContext | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;

    const ctx = new AC();
    ctx.resume().catch(() => undefined);
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.gain.setTargetAtTime(this.muted ? 0 : this.volume, ctx.currentTime, 0.8);
    const duckG = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 5200;
    const bus = ctx.createGain();
    bus.connect(lp); lp.connect(duckG); duckG.connect(master); master.connect(ctx.destination);

    // soft echo
    const send = ctx.createGain();
    send.gain.value = 0.38;
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.36;
    const fb = ctx.createGain();
    fb.gain.value = 0.38;
    const dlp = ctx.createBiquadFilter();
    dlp.type = 'lowpass';
    dlp.frequency.value = 2400;
    send.connect(delay); delay.connect(dlp); dlp.connect(fb); fb.connect(delay); dlp.connect(bus);

    this.master = master; this.duckG = duckG; this.bus = bus; this.send = send;
    this.scheduleLoop(SCORES[track](), ctx.currentTime + 0.25);
  }

  private scheduleLoop(score: Score, startAt: number) {
    const ctx = this.ctx;
    if (!ctx || !this.running) return;
    const spb = 60 / score.bpm;

    score.pads.forEach(p => this.pad(p.midis, startAt + p.t * spb, p.dur * spb));
    score.notes.forEach(n => {
      const when = startAt + n.t * spb;
      const dur  = n.dur * spb;
      if (n.kind === 'pluck') this.pluck(mtof(n.midi), when, dur, n.vel);
      else                    this.bell(mtof(n.midi), when, dur, n.vel);
    });

    const loopLen = score.beats * spb;
    const wait    = Math.max(400, (startAt + loopLen - ctx.currentTime - 1) * 1000);
    this.timer = window.setTimeout(() => this.scheduleLoop(score, startAt + loopLen), wait);
  }

  private bell(freq: number, t: number, dur: number, vel: number) {
    const ctx = this.ctx!, bus = this.bus!, send = this.send!;
    const tail = Math.max(dur, 0.45) * 1.9;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + tail);
    ([[1, 1], [2, 0.28], [3.01, 0.1], [4.2, 0.04]] as const).forEach(([mult, amp]) => {
      const o  = ctx.createOscillator();
      const og = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq * mult;
      og.gain.value = amp;
      o.connect(og); og.connect(g);
      o.start(t); o.stop(t + tail + 0.05);
    });
    g.connect(bus); g.connect(send);
  }

  private pluck(freq: number, t: number, dur: number, vel: number) {
    const ctx = this.ctx!, bus = this.bus!, send = this.send!;
    const tail = Math.max(dur, 0.3) * 1.4;
    const o = ctx.createOscillator();
    const f = ctx.createBiquadFilter();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = freq;
    f.type = 'lowpass';
    f.frequency.setValueAtTime(3200, t);
    f.frequency.exponentialRampToValueAtTime(500, t + tail);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + tail);
    o.connect(f); f.connect(g); g.connect(bus); g.connect(send);
    o.start(t); o.stop(t + tail + 0.05);
  }

  private pad(midis: number[], t: number, dur: number) {
    const ctx = this.ctx!, bus = this.bus!;
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 700;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.035, t + Math.min(0.8, dur * 0.3));
    g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.4);
    f.connect(g); g.connect(bus);
    midis.forEach(m => {
      [-6, 6].forEach(detune => {
        const o = ctx.createOscillator();
        o.type = 'triangle';
        o.frequency.value = mtof(m);
        o.detune.value = detune;
        o.connect(f);
        o.start(t); o.stop(t + dur + 0.5);
      });
    });
  }
}

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type BlowStatus = 'idle' | 'starting' | 'listening' | 'denied' | 'unsupported';

interface Options {
  /** Fires once when a sustained blow is detected. */
  onBlow: () => void;
  /** While this returns false the mic still listens (and calibrates) but a blow is ignored. */
  isArmed?: () => boolean;
}

/**
 * Listens to the microphone and detects a sustained burst of breath-like noise.
 * The first ~0.7s is used to calibrate against room / music noise.
 */
export function useBlowDetector({ onBlow, isArmed }: Options) {
  const [status, setStatus] = useState<BlowStatus>('idle');
  const [level,  setLevel]  = useState(0);          // 0..1 – for UI feedback

  const cb      = useRef(onBlow);
  cb.current    = onBlow;
  const armed   = useRef(isArmed);
  armed.current = isArmed;
  const streamR = useRef<MediaStream | null>(null);
  const ctxR    = useRef<AudioContext | null>(null);
  const rafR    = useRef<number | null>(null);
  const doneR   = useRef(false);

  const stop = useCallback(() => {
    if (rafR.current) cancelAnimationFrame(rafR.current);
    rafR.current = null;
    streamR.current?.getTracks().forEach(t => t.stop());
    streamR.current = null;
    ctxR.current?.close().catch(() => undefined);
    ctxR.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  const start = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setStatus('unsupported');
      return false;
    }
    setStatus('starting');
    doneR.current = false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false },
      });
      streamR.current = stream;

      const AC: typeof AudioContext | undefined =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) { stop(); setStatus('unsupported'); return false; }

      const ctx = new AC();
      ctxR.current = ctx;
      await ctx.resume().catch(() => undefined);

      const src      = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      src.connect(analyser);
      const buf = new Float32Array(analyser.fftSize);

      const t0 = performance.now();
      let baseline = 0, baseN = 0, loudSince = 0, lastUi = 0;

      const tick = (now: number) => {
        analyser.getFloatTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
        const rms = Math.sqrt(sum / buf.length);

        if (now - t0 < 700) {
          baseline += rms; baseN++;
        } else {
          const base      = baseN ? baseline / baseN : 0.01;
          const threshold = base * 2.4 + 0.045;
          const canTrigger = armed.current ? armed.current() : true;
          if (rms > threshold && canTrigger) {
            if (!loudSince) loudSince = now;
            if (now - loudSince > 280 && !doneR.current) {
              doneR.current = true;
              setLevel(1);
              stop();
              cb.current();
              return;
            }
          } else {
            loudSince = 0;
          }
          if (now - lastUi > 60) {
            lastUi = now;
            setLevel(Math.min(1, rms / (threshold * 1.4)));
          }
        }
        rafR.current = requestAnimationFrame(tick);
      };
      rafR.current = requestAnimationFrame(tick);
      setStatus('listening');
      return true;
    } catch {
      stop();
      setStatus('denied');
      return false;
    }
  }, [stop]);

  const cancel = useCallback(() => {
    stop();
    setStatus('idle');
    setLevel(0);
  }, [stop]);

  return { status, level, start, cancel };
}

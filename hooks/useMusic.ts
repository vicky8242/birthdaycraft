'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MusicEngine } from '@/lib/music';
import { setSfxEnabled } from '@/lib/sfx';
import type { TrackId } from '@/lib/types';

export function useMusic(track: TrackId) {
  const engine = useRef<MusicEngine | null>(null);
  const [muted,   setMuted]   = useState(false);
  const [started, setStarted] = useState(false);

  if (!engine.current && typeof window !== 'undefined') engine.current = new MusicEngine();

  useEffect(() => {
    return () => { engine.current?.stop(); };
  }, []);

  /** Call from a tap / click handler. */
  const start = useCallback(() => {
    engine.current?.start(track);
    setStarted(true);
  }, [track]);

  const stop = useCallback(() => {
    engine.current?.stop();
    setStarted(false);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(m => {
      const next = !m;
      engine.current?.setMuted(next);
      setSfxEnabled(!next);
      return next;
    });
  }, []);

  const duck = useCallback((on: boolean) => engine.current?.duck(on), []);

  return { muted, started, start, stop, toggleMute, duck };
}

'use client';

import { useEffect, useState } from 'react';
import { SONG_ID_RE, songFile } from './types';

/** A song from /public/music/songs.json. */
export interface Song {
  id:        string;   // also the file name: /public/music/<id>.mp3
  title:     string;
  emoji:     string;
  desc:      string;
  available: boolean;  // is the mp3 actually there?
}

const MAX_SONGS = 60;
let cache: Promise<Song[]> | null = null;

/** Reads the song list and checks which audio files exist. Cached for the page's lifetime. */
export function loadSongs(): Promise<Song[]> {
  if (typeof window === 'undefined') return Promise.resolve([]);
  if (!cache) {
    cache = fetch('/music/songs.json', { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : []))
      .catch(() => [])
      .then(async (raw: unknown) => {
        const seen = new Set<string>();
        const entries = (Array.isArray(raw) ? raw : [])
          .map(e => {
            const o = (e ?? {}) as Record<string, unknown>;
            const id = typeof o.id === 'string' ? o.id.trim() : '';
            const title = typeof o.title === 'string' ? o.title.trim().slice(0, 60) : '';
            return {
              id,
              title,
              emoji: typeof o.emoji === 'string' && o.emoji.trim() ? o.emoji.trim().slice(0, 4) : '🎶',
              desc:  typeof o.desc === 'string' ? o.desc.trim().slice(0, 60) : '',
            };
          })
          .filter(e => {
            if (!SONG_ID_RE.test(e.id) || !e.title || seen.has(e.id)) return false;
            seen.add(e.id);
            return true;
          })
          .slice(0, MAX_SONGS);

        return Promise.all(
          entries.map(async e => {
            const available = await fetch(songFile(e.id), { method: 'HEAD' })
              .then(r => r.ok && (r.headers.get('content-type') ?? '').includes('audio'))
              .catch(() => false);
            return { ...e, available } as Song;
          }),
        );
      });
  }
  return cache;
}

/** undefined while loading, then the list (possibly empty). */
export function useSongs(): Song[] | undefined {
  const [songs, setSongs] = useState<Song[] | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    loadSongs().then(s => { if (alive) setSongs(s); });
    return () => { alive = false; };
  }, []);
  return songs;
}

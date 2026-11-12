'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useWizard } from '@/context/WizardContext';
import { StepNav } from '@/components/ui';
import { COLOR_OPTIONS, SYNTH_OPTIONS, THEME_CONFIGS, TrackId, MusicOption } from '@/lib/types';
import { MusicEngine } from '@/lib/music';
import { useSongs } from '@/lib/songs';
import { cn } from '@/lib/utils';

/** Step 5 – colour theme + background music */
export default function StepStyle() {
  const { formData, update, nextStep, prevStep } = useWizard();
  const engine  = useRef<MusicEngine | null>(null);
  const [playing, setPlaying] = useState<TrackId | null>(null);
  // from /public/music/songs.json – undefined while loading
  const songs = useSongs();
  const theme = THEME_CONFIGS[formData.themeColor];

  useEffect(() => () => { engine.current?.stop(); }, []);

  function audition(id: TrackId) {
    update({ musicTrack: id });
    if (!engine.current) engine.current = new MusicEngine();
    if (playing === id) {
      engine.current.stop();
      setPlaying(null);
      return;
    }
    engine.current.start(id);
    setPlaying(id);
  }

  function goNext() {
    engine.current?.stop();
    setPlaying(null);
    nextStep();
  }

  return (
    <div className="step-card">
      <div className="text-center mb-10">
        <motion.div
          animate={{ scale: [1, 1.12, 1], rotate: [0, 8, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          className="text-5xl mb-3"
        >
          🎵
        </motion.div>
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-2">Colour &amp; Music</h2>
        <p className="text-white/60">Pick the mood of the surprise 💕</p>
      </div>

      <div className="space-y-10">
        {/* colour */}
        <section aria-labelledby="color-h">
          <h3 id="color-h" className="text-sm font-bold text-white flex items-center gap-2 mb-4"><span>🎨</span> Colour theme</h3>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-5">
            {COLOR_OPTIONS.map(c => {
              const t      = THEME_CONFIGS[c.value];
              const active = formData.themeColor === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => update({ themeColor: c.value })}
                  aria-pressed={active}
                  className="flex flex-col items-center gap-2 group"
                >
                  <span
                    className={cn(
                      'block w-14 h-14 rounded-2xl transition-all duration-300 ring-2',
                      active ? 'scale-110 ring-white' : 'ring-white/10 group-hover:scale-105'
                    )}
                    style={{ background: `linear-gradient(160deg, ${t.bg1}, ${t.bg3})`, boxShadow: active ? `0 0 24px ${t.bg3}` : undefined }}
                  />
                  <span className={cn('text-[0.7rem] font-semibold text-center leading-tight', active ? 'text-white' : 'text-white/50')}>
                    {c.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* mini preview */}
          <motion.div
            key={formData.themeColor}
            initial={{ opacity: 0.4, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl p-6 text-center"
            style={{ background: `linear-gradient(180deg, ${theme.bg1}, ${theme.bg2} 55%, ${theme.bg3})` }}
          >
            <p className="font-hand text-3xl font-bold" style={{ color: theme.ink }}>
              Happy Birthday, {formData.nickname || formData.birthdayPersonName || 'Beautiful'}
            </p>
            <span
              className="inline-block mt-3 px-6 py-2.5 rounded-2xl text-white font-extrabold text-sm shadow-lg"
              style={{ background: theme.strong }}
            >
              Yes 💖
            </span>
          </motion.div>
        </section>

        {/* music */}
        <section aria-labelledby="music-h">
          <h3 id="music-h" className="text-sm font-bold text-white flex items-center gap-2 mb-1"><span>🎶</span> Background music</h3>
          <p className="text-white/55 text-xs mb-5">Tap a track to listen. It plays softly through the whole surprise.</p>

          {songs && songs.length > 0 && (
            <>
              <p className="text-[0.7rem] font-bold uppercase tracking-widest text-rose-300/80 mb-2">Bollywood picks</p>
              {/* scrolls when the list gets long */}
              <div className="grid gap-3 mb-6 max-h-[26rem] overflow-y-auto pr-1 -mr-1">
                {songs.map(s => (
                  <TrackRow
                    key={s.id}
                    m={{ id: s.id, label: s.title, emoji: s.emoji, desc: s.desc }}
                    selected={formData.musicTrack === s.id}
                    isOn={playing === s.id}
                    status={s.available ? 'ready' : 'soon'}
                    onPick={() => audition(s.id)}
                  />
                ))}
              </div>
            </>
          )}

          <p className="text-[0.7rem] font-bold uppercase tracking-widest text-white/40 mb-2">Instrumentals</p>
          <div className="grid gap-3">
            {SYNTH_OPTIONS.map(m => (
              <TrackRow
                key={m.id}
                m={m}
                selected={formData.musicTrack === m.id}
                isOn={playing === m.id}
                status="ready"
                onPick={() => audition(m.id)}
              />
            ))}
          </div>
        </section>
      </div>

      <StepNav onBack={() => { engine.current?.stop(); prevStep(); }} onNext={goNext} nextLabel="Preview My Surprise" nextIcon="🎬" />
    </div>
  );
}

/** One selectable track. `soon` = a song whose audio file hasn't been added yet. */
function TrackRow({
  m, selected, isOn, status, onPick,
}: {
  m: MusicOption; selected: boolean; isOn: boolean; status: 'ready' | 'soon' | 'checking'; onPick: () => void;
}) {
  const disabled = status !== 'ready';
  return (
    <button
      type="button"
      onClick={onPick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        'flex items-center gap-4 p-4 rounded-2xl border text-left transition-all',
        disabled && 'opacity-55 cursor-not-allowed',
        selected && !disabled
          ? 'bg-gradient-to-r from-rose-500/20 to-purple-500/20 border-rose-400/50 shadow-[0_0_20px_rgba(244,63,122,0.18)]'
          : 'border-white/10',
        !selected && !disabled && 'hover:border-white/25 hover:bg-white/5',
      )}
    >
      <span className="text-3xl" aria-hidden="true">{m.emoji}</span>
      <span className="flex-1 min-w-0">
        <span className="block font-bold text-white text-sm truncate">{m.label}</span>
        <span className="block text-xs text-white/50">{m.desc}</span>
      </span>
      {status === 'soon' ? (
        <span className="shrink-0 text-[0.65rem] font-bold uppercase tracking-wider text-amber-200 bg-amber-400/15 border border-amber-300/30 rounded-full px-2.5 py-1">
          Coming soon
        </span>
      ) : (
        <span
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center text-sm shrink-0 transition-colors',
            isOn ? 'bg-rose-500 text-white' : 'bg-white/10 text-white/70',
          )}
          aria-label={isOn ? 'Stop preview' : 'Play preview'}
        >
          {isOn ? (
            <span className="flex items-end gap-[3px] h-4" aria-hidden="true">
              {[0, 1, 2].map(i => (
                <motion.span key={i} className="w-[3px] bg-white rounded-full" animate={{ height: ['30%', '100%', '40%'] }} transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </span>
          ) : status === 'checking' ? '…' : '▶'}
        </span>
      )}
    </button>
  );
}

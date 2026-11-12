'use client';

import { CSSProperties, useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ExperienceData } from '@/lib/experience';
import { THEME_CONFIGS } from '@/lib/types';
import { useMusic } from '@/hooks/useMusic';
import { FloatingHearts } from './fx';
import type { SceneProps } from './ui';

import GateScene    from './scenes/GateScene';
import IntroScene   from './scenes/IntroScene';
import BalloonScene from './scenes/BalloonScene';
import CandleScene  from './scenes/CandleScene';
import PhotoScene   from './scenes/PhotoScene';
import BouquetScene from './scenes/BouquetScene';
import LetterScene  from './scenes/LetterScene';
import FinaleScene  from './scenes/FinaleScene';

export type SceneId = 'gate' | 'intro' | 'balloons' | 'candle' | 'photos' | 'bouquet' | 'letter' | 'finale';

const SCENES: Record<SceneId, (p: SceneProps) => JSX.Element> = {
  gate: GateScene, intro: IntroScene, balloons: BalloonScene, candle: CandleScene,
  photos: PhotoScene, bouquet: BouquetScene, letter: LetterScene, finale: FinaleScene,
};

interface Props {
  data: ExperienceData;
  /** 'page' = the real public link, 'preview' = inside the creator's phone frame */
  mode?: 'page' | 'preview';
  /** development helper: /wish/demo?scene=candle */
  initialScene?: SceneId;
}

export default function Experience({ data, mode = 'page', initialScene }: Props) {
  const theme = THEME_CONFIGS[data.theme];
  const music = useMusic(data.music);

  const scenes = useMemo<SceneId[]>(() => [
    'gate', 'intro', 'balloons', 'candle',
    ...(data.photos.length ? (['photos'] as SceneId[]) : []),
    'bouquet', 'letter', 'finale',
  ], [data.photos.length]);

  const [index, setIndex] = useState(() => {
    const i = initialScene ? scenes.indexOf(initialScene) : 0;
    return i > 0 ? i : 0;
  });
  const [run, setRun] = useState(0);

  const current = scenes[index];
  const Scene   = SCENES[current];

  const next = useCallback(() => setIndex(i => Math.min(i + 1, scenes.length - 1)), [scenes.length]);
  const back = useCallback(() => setIndex(i => Math.max(i - 1, 1)), []);
  const restart = useCallback(() => { setRun(r => r + 1); setIndex(1); }, []);

  const startMusic  = music.start;
  const toggleSound = music.toggleMute;

  const vars = {
    '--bg1': theme.bg1, '--bg2': theme.bg2, '--bg3': theme.bg3,
    '--ink': theme.ink, '--strong': theme.strong, '--soft': theme.soft,
  } as CSSProperties;

  const progress = scenes.length > 1 ? (index / (scenes.length - 1)) * 100 : 0;

  return (
    <div className="xp-root" style={vars}>
      {/* sky */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, var(--bg1) 0%, var(--bg2) 55%, var(--bg3) 100%)' }} />
      <FloatingHearts count={12} color={theme.soft} />

      {/* progress */}
      {index > 0 && (
        <div className="absolute top-0 inset-x-0 h-[3px] z-50 bg-white/30" aria-hidden="true">
          <motion.div className="h-full rounded-r-full" style={{ background: 'var(--strong)' }} animate={{ width: `${progress}%` }} transition={{ duration: 0.6 }} />
        </div>
      )}

      {/* top bar */}
      <AnimatePresence>
        {index > 1 && current !== 'finale' && (
          <motion.button
            key="back"
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            onClick={back}
            className="xp-pill absolute top-4 left-4 z-50"
            aria-label="Go back"
          >
            <span aria-hidden="true">←</span> Back
          </motion.button>
        )}
        {index > 0 && (
          <motion.button
            key="sound"
            initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            onClick={toggleSound}
            className="xp-pill xp-pill-round absolute top-4 right-4 z-50"
            aria-label={music.muted ? 'Turn sound on' : 'Turn sound off'}
            aria-pressed={music.muted}
          >
            <span aria-hidden="true">{music.muted ? '🔇' : '🔊'}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <Scene
          key={`${current}-${run}`}
          data={data}
          mode={mode}
          next={next}
          restart={restart}
          startMusic={startMusic}
          duckMusic={music.duck}
        />
      </AnimatePresence>
    </div>
  );
}

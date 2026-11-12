'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import type { ExperienceData } from '@/lib/experience';

export interface SceneProps {
  data: ExperienceData;
  next: () => void;
  mode: 'page' | 'preview';
  /** called from a user gesture to begin the music */
  startMusic: () => void;
  duckMusic: (on: boolean) => void;
  restart: () => void;
}

/** Every scene lives inside this – handles the enter / exit transition. */
export function SceneWrap({ children, className = '', ...rest }: HTMLMotionProps<'section'>) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28, scale: 0.97, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0,  scale: 1,    filter: 'blur(0px)' }}
      exit={{    opacity: 0, y: -20, scale: 1.02, filter: 'blur(8px)' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute inset-0 flex flex-col items-center px-5 pt-[4.5rem] pb-7 ${className}`}
      {...rest}
    >
      {children}
    </motion.section>
  );
}

/** Big friendly pill button */
export function XpButton({
  variant = 'primary', className = '', children, ...rest
}: HTMLMotionProps<'button'> & { variant?: 'primary' | 'white' }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.94 }}
      className={`${variant === 'primary' ? 'xp-btn' : 'xp-btn-white'} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

/** Letter-by-letter / word-by-word reveal */
export function RevealWords({
  text, className = '', delay = 0, step = 0.07,
}: { text: string; className?: string; delay?: number; step?: number }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <span className={className}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.28em]"
          initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: delay + i * step, duration: 0.45, ease: 'easeOut' }}
        >
          {w}
        </motion.span>
      ))}
    </span>
  );
}

'use client';

import Experience, { SceneId } from '@/components/experience/Experience';
import type { ExperienceData } from '@/lib/experience';
import { THEME_CONFIGS } from '@/lib/types';

interface Props {
  data:          ExperienceData;
  /** local-development notice when the database is not connected yet */
  banner?:       boolean;
  initialScene?: string;
}

const SCENE_IDS: SceneId[] = ['gate', 'intro', 'balloons', 'candle', 'photos', 'bouquet', 'letter', 'finale'];

export default function WishClientPage({ data, banner, initialScene }: Props) {
  const theme = THEME_CONFIGS[data.theme];
  const scene = SCENE_IDS.find(s => s === initialScene);

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center"
      style={{ background: `linear-gradient(160deg, ${theme.bg1}, ${theme.bg3})` }}
    >
      {/* On desktop the wish floats as a phone-sized card; on phones it fills the screen */}
      <div className="relative h-full w-full sm:h-[min(100%,54rem)] sm:max-w-[26rem] sm:rounded-[2.2rem] overflow-hidden sm:shadow-[0_30px_90px_rgba(0,0,0,.28)] sm:ring-1 sm:ring-white/60 isolate">
        <Experience data={data} mode="page" initialScene={scene} />
      </div>

      {banner && (
        <div className="fixed bottom-2 inset-x-2 z-50 text-center text-xs font-semibold text-white bg-black/70 backdrop-blur rounded-full px-4 py-2 pointer-events-none">
          Demo mode — connect Supabase (see README) to show real wishes at this link
        </div>
      )}
    </div>
  );
}

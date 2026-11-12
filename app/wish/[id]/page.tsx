import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerClient, isSupabaseConfigured, PUBLIC_WISH_COLUMNS } from '@/lib/supabase';
import { getLocalWish, localStoreEnabled } from '@/lib/localstore';
import { DEMO_EXPERIENCE, wishToExperience } from '@/lib/experience';
import { Wish } from '@/lib/types';
import WishClientPage from './WishClientPage';

// A wish is private to whoever has the link – never cache it across users or index it.
export const dynamic = 'force-dynamic';

interface Props {
  params:       { id: string };
  searchParams: { scene?: string };
}

async function getWish(slug: string): Promise<Wish | null> {
  if (!isSupabaseConfigured()) return localStoreEnabled() ? getLocalWish(slug) : null;
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('wishes')
      .select(PUBLIC_WISH_COLUMNS)
      .eq('slug', slug)
      .eq('is_paid', true)
      .maybeSingle();
    if (error || !data) return null;
    return data as unknown as Wish;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const robots = { index: false, follow: false };
  if (params.id === 'demo') {
    return { title: 'Try the demo — a sample birthday surprise', robots: { index: true, follow: true } };
  }
  const wish = await getWish(params.id);
  if (!wish) return { title: 'Birthday surprise', robots };
  return {
    title:       `🎂 A birthday surprise for ${wish.birthday_person_name}`,
    description: `${wish.sender_name} made something special for you. Tap to open it 💌`,
    openGraph: {
      title:       `Happy Birthday, ${wish.birthday_person_name}! 🎂`,
      description: `${wish.sender_name} made this just for you 💕 Tap to open.`,
      type:        'website',
    },
    robots,
  };
}

export default async function WishPage({ params, searchParams }: Props) {
  const isDemo = params.id === 'demo';
  const wish   = isDemo ? null : await getWish(params.id);

  // Where wishes can't be stored at all (no Supabase, not your own computer) every link shows the sample wish
  const devFallback = !isDemo && !wish && !isSupabaseConfigured() && !localStoreEnabled();
  if (!isDemo && !wish && !devFallback) notFound();

  const data = wish ? wishToExperience(wish) : DEMO_EXPERIENCE;
  const scene = process.env.NODE_ENV !== 'production' ? searchParams.scene : undefined;

  return <WishClientPage data={data} banner={devFallback} initialScene={scene} />;
}

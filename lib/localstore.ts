import { promises as fs } from 'fs';
import path from 'path';
import { isSupabaseConfigured } from './supabase';
import type { Wish } from './types';

/**
 * File-based stand-in for Supabase, so you can try the full flow (create → link → open it)
 * on your own computer before the database is connected.
 *
 *  - Used ONLY when Supabase is not configured and we are not on Vercel (its disk is read-only).
 *  - Wishes live in `.data/wishes/<slug>.json` (git-ignored); photos are stored inside the file.
 *  - It works for links opened on the machine running the site (or its network). To share with
 *    anyone on the internet, connect Supabase and deploy – see the README.
 */

const DIR  = path.join(process.cwd(), '.data', 'wishes');
const SLUG = /^[a-z0-9]{6,32}$/;

export function localStoreEnabled(): boolean {
  return !isSupabaseConfigured() && !process.env.VERCEL;
}

const file = (slug: string) => path.join(DIR, `${slug}.json`);

type StoredWish = Omit<Wish, 'id' | 'created_at'> & { payment_order_id: string; payment_id?: string };

export async function saveLocalWish(slug: string, wish: Record<string, unknown>, photoUrls: string[], orderId: string): Promise<void> {
  if (!SLUG.test(slug)) throw new Error('bad slug');
  await fs.mkdir(DIR, { recursive: true });
  const record = { ...wish, slug, photo_urls: photoUrls, is_paid: false, payment_order_id: orderId, created_at: new Date().toISOString() };
  await fs.writeFile(file(slug), JSON.stringify(record), 'utf8');
}

async function read(slug: string): Promise<(StoredWish & { created_at: string }) | null> {
  if (!SLUG.test(slug)) return null;
  try {
    return JSON.parse(await fs.readFile(file(slug), 'utf8'));
  } catch {
    return null;
  }
}

/** Mark a stored wish as paid. Returns false if the wish does not exist or the order does not match. */
export async function markLocalPaid(slug: string, orderId: string, paymentId: string): Promise<boolean> {
  const rec = await read(slug);
  if (!rec || rec.payment_order_id !== orderId) return false;
  await fs.writeFile(file(slug), JSON.stringify({ ...rec, is_paid: true, payment_id: paymentId }), 'utf8');
  return true;
}

/** Only paid wishes are visible, exactly like the Supabase query. */
export async function getLocalWish(slug: string): Promise<Wish | null> {
  const rec = await read(slug);
  if (!rec || !rec.is_paid) return null;
  // never expose payment fields
  const { payment_order_id, payment_id, ...pub } = rec;
  void payment_order_id; void payment_id;
  return { id: slug, ...pub } as unknown as Wish;
}

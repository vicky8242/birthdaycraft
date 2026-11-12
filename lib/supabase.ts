import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase is created lazily so the app still builds / runs (in demo mode)
 * when the environment variables are not set yet.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

let serverClient: SupabaseClient | null = null;

/** Service-role client – ONLY use in server code (route handlers / server components). */
export function createServerClient(): SupabaseClient {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured');
  if (!serverClient) {
    serverClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );
  }
  return serverClient;
}

export const PHOTO_BUCKET = 'wish-photos';

/** Columns that are safe to expose on the public wish page. */
export const PUBLIC_WISH_COLUMNS =
  'id, slug, birthday_person_name, nickname, sender_name, birthday_date, milestone, relationship, ' +
  'message, favorite_memory, final_note, signoff, theme_color, qualities, photo_urls, ' +
  'balloon_words, compliments, music_track, is_paid, created_at';

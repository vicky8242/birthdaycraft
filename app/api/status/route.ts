import { NextResponse } from 'next/server';
import { isRazorpayConfigured } from '@/lib/razorpay';
import { isSupabaseConfigured } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/status — which services are connected (no secrets, just booleans).
// Handy after deploying: open /api/status and check that "database" is true.
export async function GET() {
  return NextResponse.json(
    { paymentsLive: isRazorpayConfigured(), database: isSupabaseConfigured() },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

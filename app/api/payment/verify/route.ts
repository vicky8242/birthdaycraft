import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase';
import { isRazorpayConfigured, verifyPaymentSignature } from '@/lib/razorpay';
import { clientIp, rateLimit } from '@/lib/ratelimit';
import { localStoreEnabled, markLocalPaid } from '@/lib/localstore';

export const runtime = 'nodejs';

// POST /api/payment/verify
export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`verify:${clientIp(req)}`, 30, 10 * 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { slug, orderId, paymentId, signature } = await req.json();
    if (typeof slug !== 'string' || typeof orderId !== 'string' || typeof paymentId !== 'string') {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // The "free demo payment" path exists ONLY while Razorpay is not configured on the server.
    // The client can never ask for it – the server decides.
    if (isRazorpayConfigured()) {
      if (!verifyPaymentSignature({ orderId, paymentId, signature: String(signature ?? '') })) {
        return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
      }
    } else if (!orderId.startsWith('order_demo_')) {
      return NextResponse.json({ error: 'Invalid order' }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      if (!localStoreEnabled()) return NextResponse.json({ success: true, slug, persisted: false });
      if (!(await markLocalPaid(slug, orderId, paymentId))) {
        return NextResponse.json({ error: 'Wish not found for this order' }, { status: 404 });
      }
      return NextResponse.json({ success: true, slug, persisted: true });
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('wishes')
      .update({ is_paid: true, payment_id: paymentId })
      .eq('slug', slug)
      .eq('payment_order_id', orderId)          // the order must belong to this wish
      .select('slug');

    if (error) {
      console.error('Supabase update error:', error.message);
      return NextResponse.json({ error: 'Could not confirm payment' }, { status: 500 });
    }
    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Wish not found for this order' }, { status: 404 });
    }

    return NextResponse.json({ success: true, slug, persisted: true });
  } catch (err) {
    console.error('Payment verify error:', err);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}

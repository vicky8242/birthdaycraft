import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, isSupabaseConfigured, PHOTO_BUCKET } from '@/lib/supabase';
import { generateSlug } from '@/lib/utils';
import { getRazorpay, isRazorpayConfigured, WISH_PRICE_PAISE, CURRENCY } from '@/lib/razorpay';
import { clientIp, rateLimit } from '@/lib/ratelimit';
import { localStoreEnabled, saveLocalWish } from '@/lib/localstore';
import { THEME_CONFIGS, isTrackId } from '@/lib/types';

export const runtime = 'nodejs';

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const list = (v: unknown, n: number, max: number) =>
  Array.isArray(v) ? v.map(x => str(x, max)).filter(Boolean).slice(0, n) : [];

const DATA_URL = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/;
const MAX_PHOTO_BYTES = 900_000;
// POST /api/wish — validate, store the draft (unpaid) and create a payment order
export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`wish:${clientIp(req)}`, 12, 10 * 60_000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again in a few minutes.' }, { status: 429 });
    }

    const b = await req.json();

    const wish = {
      birthday_person_name: str(b.birthdayPersonName, 50),
      nickname:             str(b.nickname, 30) || null,
      sender_name:          str(b.senderName, 50),
      birthday_date:        /^\d{4}-\d{2}-\d{2}$/.test(str(b.birthdayDate, 10)) ? str(b.birthdayDate, 10) : null,
      milestone:            str(b.milestone, 10) || null,
      relationship:         str(b.relationship, 20) || null,
      message:              str(b.message, 600),
      favorite_memory:      str(b.favoriteMemory, 300) || null,
      final_note:           str(b.finalNote, 600),
      signoff:              str(b.signoff, 50) || 'With Love',
      theme_color:          str(b.themeColor, 10) in THEME_CONFIGS ? str(b.themeColor, 10) : 'pink',
      qualities:            list(b.qualities, 8, 30),
      balloon_words:        list(b.balloonWords, 4, 24),
      compliments:          list(b.compliments, 6, 60),
      music_track:          isTrackId(str(b.musicTrack, 40)) ? str(b.musicTrack, 40) : 'dreamy',
    };

    if (!wish.birthday_person_name || !wish.sender_name || !wish.message || !wish.final_note) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
    }

    // photos – only accept small, re-compressed images sent as data URLs
    const photos: { mime: string; buf: Buffer }[] = [];
    if (Array.isArray(b.photoUrls)) {
      for (const p of b.photoUrls.slice(0, 5)) {
        const m = typeof p === 'string' ? DATA_URL.exec(p) : null;
        if (!m) continue;
        const buf = Buffer.from(m[2], 'base64');
        if (buf.length > MAX_PHOTO_BYTES) {
          return NextResponse.json({ error: 'One of the photos is too large. Please pick a smaller one.' }, { status: 413 });
        }
        photos.push({ mime: `image/${m[1]}`, buf });
      }
    }

    const slug      = generateSlug(12);
    const amount    = WISH_PRICE_PAISE;
    const payLive   = isRazorpayConfigured();
    const dbLive    = isSupabaseConfigured();

    // No database yet: on your own computer keep the wish in a local file so the link opens the real data
    if (!dbLive) {
      const orderId = `order_demo_${slug}`;
      let persisted = false;
      if (localStoreEnabled()) {
        try {
          const photoUrls = photos.map(p => `data:${p.mime};base64,${p.buf.toString('base64')}`);
          await saveLocalWish(slug, wish, photoUrls, orderId);
          persisted = true;
        } catch (e) {
          console.error('Local save failed:', e);
        }
      }
      return NextResponse.json({
        slug, orderId, amount, currency: CURRENCY,
        demo: !payLive, persisted, local: persisted, keyId: null,
      });
    }

    const supabase = createServerClient();

    // upload photos to storage
    const photoUrls: string[] = [];
    for (let i = 0; i < photos.length; i++) {
      const ext  = photos[i].mime === 'image/png' ? 'png' : photos[i].mime === 'image/webp' ? 'webp' : 'jpg';
      const path = `${slug}/${i + 1}.${ext}`;
      const { error: upErr } = await supabase.storage.from(PHOTO_BUCKET).upload(path, photos[i].buf, {
        contentType: photos[i].mime, upsert: true,
      });
      if (upErr) {
        console.error('Photo upload failed:', upErr.message);
        return NextResponse.json({ error: 'Could not upload your photos. Please try again.' }, { status: 502 });
      }
      photoUrls.push(supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl);
    }

    // payment order
    let orderId = `order_demo_${slug}`;
    if (payLive) {
      try {
        const order = await getRazorpay().orders.create({ amount, currency: CURRENCY, receipt: slug });
        orderId = order.id;
      } catch (e) {
        console.error('Razorpay order failed:', e);
        return NextResponse.json({ error: 'Payment service is unavailable. Please try again shortly.' }, { status: 502 });
      }
    }

    const { error } = await supabase.from('wishes').insert({
      slug, ...wish, mood: 'romantic', photo_urls: photoUrls, is_paid: false, payment_order_id: orderId,
    });
    if (error) {
      console.error('Supabase insert error:', error.message);
      return NextResponse.json({ error: 'Could not save your wish. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({
      slug, orderId, amount, currency: CURRENCY,
      demo: !payLive, persisted: true,
      keyId: payLive ? (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID) : null,
    });
  } catch (err) {
    console.error('POST /api/wish error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

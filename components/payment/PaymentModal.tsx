'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useWizard } from '@/context/WizardContext';
import { Button } from '@/components/ui';
import { PRICE_LABEL } from '@/lib/config';
import { buildShareText } from '@/lib/utils';

interface Props {
  onClose: () => void;
  /** Payments are switched off (Razorpay not set up yet): skip the payment screen and just create the link. */
  free?: boolean;
}

type Stage = 'pay' | 'processing' | 'success';

interface OrderResponse {
  slug:      string;
  orderId:   string;
  amount:    number;
  currency:  string;
  demo:      boolean;
  persisted: boolean;
  local?:    boolean;
  keyId:     string | null;
  error?:    string;
}

type RazorpayCtor = new (opts: Record<string, unknown>) => { open: () => void; on: (e: string, cb: (r: unknown) => void) => void };

function loadRazorpay(): Promise<boolean> {
  return new Promise(resolve => {
    if ((window as unknown as { Razorpay?: RazorpayCtor }).Razorpay) return resolve(true);
    const s   = document.createElement('script');
    s.src     = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async   = true;
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function PaymentModal({ onClose, free = false }: Props) {
  const router = useRouter();
  const { formData, reset, setWishSlug, setShareUrl } = useWizard();

  const [stage,   setStage]   = useState<Stage>('pay');
  const [slug,    setSlug]    = useState('');
  const [demo,    setDemo]    = useState(false);
  const [persist, setPersist] = useState(true);
  const [local,   setLocal]   = useState(false);
  const autoStarted = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const name     = formData.nickname || formData.birthdayPersonName;
  const shareUrl = typeof window !== 'undefined' && slug ? `${window.location.origin}/wish/${slug}` : '';

  // close on Escape (unless mid-payment)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && stage !== 'processing') onClose(); };
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, stage]);

  // Free mode: nothing to pay, so create the link straight away
  useEffect(() => {
    if (free && !autoStarted.current) {
      autoStarted.current = true;
      void handlePay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [free]);

  function finish(newSlug: string) {
    const link = `${window.location.origin}/wish/${newSlug}`;
    setWishSlug(newSlug);
    setShareUrl(link);
    setSlug(newSlug);
    setStage('success');
    try { localStorage.removeItem('birthdaybliss:draft:v2'); } catch { /* ignore */ }
  }

  async function verify(newSlug: string, orderId: string, paymentId: string, signature: string) {
    const res = await fetch('/api/payment/verify', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ slug: newSlug, orderId, paymentId, signature }),
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Verification failed');
  }

  async function handlePay() {
    setStage('processing');
    try {
      // 1. save the (unpaid) wish + create the order on the server
      const res = await fetch('/api/wish', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthdayPersonName: formData.birthdayPersonName,
          nickname:           formData.nickname,
          senderName:         formData.senderName,
          birthdayDate:       formData.birthdayDate,
          milestone:          formData.milestone,
          relationship:       formData.relationship,
          message:            formData.message,
          favoriteMemory:     formData.favoriteMemory,
          finalNote:          formData.finalNote,
          signoff:            formData.signoff,
          themeColor:         formData.themeColor,
          qualities:          formData.qualities,
          balloonWords:       formData.balloonWords,
          compliments:        formData.compliments,
          musicTrack:         formData.musicTrack,
          photoUrls:          formData.photos.map(p => p.dataUrl).filter(Boolean),
        }),
      });
      const order: OrderResponse = await res.json();
      if (!res.ok) throw new Error(order.error || 'Could not save your wish');

      setDemo(order.demo);
      setPersist(order.persisted);
      setLocal(Boolean(order.local));

      // 2a. test mode – Razorpay keys not configured on the server
      if (order.demo) {
        await new Promise(r => setTimeout(r, free ? 700 : 1800));
        await verify(order.slug, order.orderId, `pay_demo_${Date.now()}`, '');
        finish(order.slug);
        return;
      }

      // 2b. real payment via Razorpay Checkout
      const ready = await loadRazorpay();
      if (!ready) throw new Error('Could not load the payment window. Check your connection.');

      const Razorpay = (window as unknown as { Razorpay: RazorpayCtor }).Razorpay;
      const rp = new Razorpay({
        key:         order.keyId,
        amount:      order.amount,
        currency:    order.currency,
        name:        'BirthdayBliss',
        description: `Birthday surprise for ${name}`,
        order_id:    order.orderId,
        prefill:     { name: formData.senderName },
        theme:       { color: '#F43F7A' },
        modal:       { ondismiss: () => setStage('pay') },
        handler: async (r: { razorpay_payment_id: string; razorpay_signature: string }) => {
          setStage('processing');
          try {
            await verify(order.slug, order.orderId, r.razorpay_payment_id, r.razorpay_signature);
            finish(order.slug);
          } catch (e) {
            toast.error(`${(e as Error).message}. If money was deducted, contact support with payment ID ${r.razorpay_payment_id}.`, { duration: 9000 });
            setStage('pay');
          }
        },
      });
      rp.on('payment.failed', () => { toast.error('Payment failed. You have not been charged.'); setStage('pay'); });
      rp.open();
      setStage('pay');
    } catch (err) {
      toast.error((err as Error).message || 'Something went wrong. Please try again.');
      setStage('pay');
    }
  }

  async function copyLink() {
    try { await navigator.clipboard.writeText(shareUrl); toast.success('Link copied! 📋'); }
    catch { toast.error('Could not copy — long-press the link instead'); }
  }

  const shareText = buildShareText(name, shareUrl);

  // Render at <body> level so transformed ancestors (the animated step panel) can't break `position: fixed`
  if (typeof document === 'undefined') return null;
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog" aria-modal="true" aria-label="Payment"
      onClick={e => { if (e.target === e.currentTarget && stage !== 'processing') onClose(); }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
        className="relative w-full max-w-md max-h-[100dvh] overflow-y-auto"
      >
        <div className="glass-card gradient-border p-7 !rounded-b-none sm:!rounded-b-3xl bg-[#1C0A28]/95">
          {stage !== 'processing' && (
            <button ref={closeRef} onClick={onClose} aria-label="Close" className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/70 text-sm">✕</button>
          )}

          {/* ── pay ── */}
          {stage === 'pay' && (
            <>
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">💝</div>
                <h2 className="font-playfair text-2xl font-bold text-white mb-1">
                  {free ? 'Get your share link' : 'Unlock your share link'}
                </h2>
                <p className="text-white/55 text-sm">
                  {free ? 'Free for now · private link · works forever' : 'One payment · private link · works forever'}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/65">🎬 Birthday surprise for {name}</span>
                  <span className="text-white font-semibold">{free ? 'Free' : PRICE_LABEL}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                  <span className="font-bold text-white">Total</span>
                  <span className="font-bold text-2xl gradient-text">{free ? '₹0' : PRICE_LABEL}</span>
                </div>
              </div>

              <Button onClick={handlePay} size="lg" className="w-full justify-center">
                {free ? '🔗 Create my link' : <>🔒 Pay {PRICE_LABEL} securely</>}
              </Button>
              {!free && (
                <p className="text-center text-white/40 text-xs mt-3 leading-relaxed">
                  Pay with UPI, cards or net banking via Razorpay. We never see or store your card details.
                </p>
              )}
            </>
          )}

          {/* ── processing ── */}
          {stage === 'processing' && (
            <div className="text-center py-8" aria-live="polite">
              <div className="text-5xl mb-4 animate-spin-slow">🎂</div>
              <h3 className="font-playfair text-xl font-bold text-white mb-2">Wrapping your surprise…</h3>
              <p className="text-white/55 text-sm mb-8">Please don&apos;t close this window ✨</p>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-600 rounded-full"
                  initial={{ width: '5%' }} animate={{ width: '92%' }} transition={{ duration: 6, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}

          {/* ── success ── */}
          {stage === 'success' && (
            <div className="text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="text-5xl mb-3 inline-block">🎉</motion.div>
              <h3 className="font-playfair text-2xl font-bold text-white mb-2">Your surprise is live!</h3>
              <p className="text-white/60 text-sm mb-5">
                Send this link to <span className="text-rose-300 font-semibold">{name}</span> 💕
              </p>

              {demo && (
                <p className="text-xs text-amber-200 bg-amber-400/10 border border-amber-300/30 rounded-xl px-3 py-2 mb-4">
                  Payment is switched off for now (Razorpay isn&apos;t connected yet), so this one is free 🎁
                </p>
              )}
              {local && (
                <p className="text-xs text-amber-200 bg-amber-400/10 border border-amber-300/30 rounded-xl px-3 py-2 mb-4">
                  Saved on this computer. The link opens here with your real photos and words. To send it to someone
                  else, connect Supabase and deploy the site (see the README).
                </p>
              )}
              {!persist && (
                <p className="text-xs text-amber-200 bg-amber-400/10 border border-amber-300/30 rounded-xl px-3 py-2 mb-4">
                  Database not connected, so this link shows a sample wish. See the README to connect Supabase.
                </p>
              )}

              <div className="flex items-center gap-2 bg-white/5 border border-rose-400/20 rounded-2xl p-3 mb-4">
                <span className="flex-1 text-rose-300 text-xs font-mono truncate text-left" title={shareUrl}>{shareUrl}</span>
                <button onClick={copyLink} className="shrink-0 text-xs bg-gradient-to-r from-rose-500 to-pink-600 text-white px-3 py-1.5 rounded-xl font-semibold">Copy</button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-sm font-semibold hover:bg-[#25D366]/20 transition-all"
                >
                  💬 WhatsApp
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(`A birthday surprise for ${name}`)}&body=${encodeURIComponent(shareText)}`}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-500/10 border border-blue-400/30 text-blue-300 text-sm font-semibold hover:bg-blue-500/20 transition-all"
                >
                  📧 Email
                </a>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => router.push(`/wish/${slug}`)} variant="ghost" size="sm" className="flex-1 justify-center">👁️ Open it</Button>
                <Button onClick={() => { reset(); onClose(); }} variant="ghost" size="sm" className="flex-1 justify-center">➕ Make another</Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

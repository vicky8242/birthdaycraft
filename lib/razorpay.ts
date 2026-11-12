import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PRICE_INR } from './config';

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

let instance: Razorpay | null = null;
/** Lazy – constructing Razorpay without keys throws, which would break `next build`. */
export function getRazorpay(): Razorpay {
  if (!isRazorpayConfigured()) throw new Error('Razorpay is not configured');
  if (!instance) {
    instance = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }
  return instance;
}

// Verify payment signature returned by Razorpay Checkout
export function verifyPaymentSignature({
  orderId, paymentId, signature,
}: { orderId: string; paymentId: string; signature: string }): boolean {
  if (!process.env.RAZORPAY_KEY_SECRET || !signature) return false;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Price config (paise) – derived from the same value the UI displays
export const WISH_PRICE_PAISE = Math.round(PRICE_INR * 100);
export const CURRENCY         = 'INR';

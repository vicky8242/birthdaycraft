/**
 * Minimal best-effort in-memory rate limiter.
 * On serverless each instance has its own memory, so this only slows down casual abuse –
 * put Vercel Firewall / Upstash in front of it for serious protection.
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now  = Date.now();
  const list = (hits.get(key) ?? []).filter(t => now - t < windowMs);
  if (list.length >= max) { hits.set(key, list); return false; }
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) {                       // keep memory bounded
    Array.from(hits.entries()).forEach(([k, v]) => {
      if (!v.some(t => now - t < windowMs)) hits.delete(k);
    });
  }
  return true;
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0] : req.headers.get('x-real-ip') ?? 'unknown').trim();
}

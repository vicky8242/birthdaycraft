# BirthdayBliss 🎂

Create a cute, interactive birthday surprise — pop balloons that spell out a sentence, blow out a candle
(with the mic, or by tapping), open a rose bouquet with compliment bubbles, read a letter — with music, photos
and a private share link. Senders **preview it free**, then pay once to get the link.

Built with Next.js 14 (App Router), TypeScript, Tailwind, Framer Motion, Supabase and Razorpay.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
```

With **no environment variables** the site runs in *demo mode*: the creator and free preview work, **payment is
skipped** (the surprise is free until you add Razorpay keys), and no money moves. On your own computer the wish is
saved to a git-ignored `.data/` folder, so the share link opens the real photos and words, but only on that
computer/network. To send links to anyone, connect Supabase and deploy (Vercel's disk is read-only, so without
Supabase links there show a sample surprise). This is the quickest way to try everything.

## Going live

### 1. Environment variables

Copy `.env.example` to `.env.local` (locally) or add the same variables in your host (e.g. Vercel → Settings →
Environment Variables).

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Your public URL (share links, social previews, sitemap) |
| `NEXT_PUBLIC_WISH_PRICE_INR` | Price in ₹. Shown in the UI **and** charged by the server |
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Database + photo storage |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Payments |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Optional: "Support" link in the footer and legal pages |
The service-role key and Razorpay secret are **server-only** — never give them a `NEXT_PUBLIC_` prefix.

### 2. Supabase

1. Create a project.
2. Open **SQL editor**, paste and run `supabase/schema.sql` (safe to re-run). It creates the `wishes` table
   with RLS on and **no public policies** (all access goes through the server), plus the public-read
   `wish-photos` storage bucket.

### 3. Razorpay

Create API keys in the Razorpay dashboard. Start with **test** keys (`rzp_test_…`) and the test card/UPI
flows; switch to live keys when you are ready. Once Razorpay keys are set, the server only accepts payments
verified by HMAC signature — demo payments are refused.

### 4. Deploy

Push to GitHub and import into Vercel (framework is auto-detected), or `npm run build && npm start` anywhere
Node 18+ runs. Check `/wish/demo` on the deployed site, then make a test surprise end to end.

## Music

The picker has two groups:

- **Instrumentals** — dreamy, playful and a music-box "Happy Birthday". These are **synthesised in the browser**:
  no files, no copyright issues.
- **Bollywood picks** — your songs, listed in `public/music/songs.json` (up to 60). They play from audio files
  that **you must add**, and **you must have the legal right to use them** on a public, paid website (e.g. a
  licence from the label/publisher). Royalty-free tracks work too.

**Adding a song** (no code changes):

1. Save the audio as `public/music/<id>.mp3`, e.g. `public/music/tum-hi-ho.mp3`.
2. Add a line to `public/music/songs.json`:
   ```json
   { "id": "tum-hi-ho", "title": "Tum Hi Ho", "emoji": "💖", "desc": "Bollywood pick" }
   ```
   (`id` = file name without `.mp3`; lowercase letters, digits and dashes only.)
3. Deploy. The song appears in the picker in the order listed.

A song listed in `songs.json` shows **"Coming soon"** (and can't be selected) until its mp3 exists, so you can add
titles first and audio later. If a song file ever fails to load for a recipient, the surprise falls back to the
dreamy instrumental instead of going silent. Keep files around 5 MB or less (128 kbps mp3). More detail is in
`public/music/README.txt`.

## How it's put together

- `components/experience/` — the interactive surprise (`Experience.tsx` + one file per scene in `scenes/`).
  The same component powers the free preview, the public link and the landing-page demo.
- `components/wizard/` + `context/WizardContext.tsx` — the 6-step creator. Text is auto-saved to the browser;
  photos are compressed client-side before upload.
- `app/api/wish` — validates, sanitises and rate-limits input, uploads photos, creates the Razorpay order.
- `app/api/payment/verify` — verifies the payment signature and marks the surprise as paid.
- `app/wish/[id]` — the public page. Only paid surprises are shown; real ones are `noindex`.
- `lib/music.ts`, `lib/sfx.ts` — Web Audio music and sound effects.
- `legacy/` — the original static prototype, kept for reference. Not used by the app.

## Before launch checklist

- [ ] Set all environment variables and run `supabase/schema.sql`
- [ ] Test a full payment with Razorpay test keys, then switch to live keys
- [ ] Have the Privacy and Terms pages (`/privacy`, `/terms`) reviewed for your business and jurisdiction
- [ ] Set `NEXT_PUBLIC_SUPPORT_EMAIL`
- [ ] Note: the rate limiter is in-memory (per server instance). For heavy traffic, swap `lib/ratelimit.ts` for a
      shared store such as Upstash Redis

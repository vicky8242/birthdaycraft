'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Badge } from '@/components/ui';
import PhoneFrame from '@/components/experience/PhoneFrame';
import { DEMO_EXPERIENCE } from '@/lib/experience';
import { PRICE_LABEL } from '@/lib/config';

// The real experience, embedded live. Client-only (uses Web Audio / mic).
const Experience = dynamic(() => import('@/components/experience/Experience'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full grid place-items-center bg-gradient-to-b from-[#ffe3ef] to-[#e9d9ff] text-4xl animate-pulse">
      🎂
    </div>
  ),
});

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Scenes />
      <HowItWorks />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}

/* ── Navbar ─────────────────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-2.5 bg-black/50 backdrop-blur-2xl border-b border-white/10' : 'py-4 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl group-hover:animate-bounce-soft">🎂</span>
          <span className="font-dancing text-2xl font-bold gradient-text">BirthdayBliss</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            { href: '#scenes', label: "What's inside" },
            { href: '#how-it-works', label: 'How it works' },
            { href: '#pricing', label: 'Pricing' },
            { href: '#faq', label: 'FAQ' },
          ].map(l => (
            <a key={l.href} href={l.href} className="text-sm font-semibold text-white/60 hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <Link href="/create">
          <Button size="sm" className="whitespace-nowrap">
            ✨ Create<span className="hidden sm:inline">&nbsp;a surprise</span>
          </Button>
        </Link>
      </div>
    </motion.nav>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────────── */
function Hero() {
  const floaters = [
    { e: '🎈', l: '4%', t: '18%', d: 0, s: 4.5 },
    { e: '💕', l: '93%', t: '14%', d: 0.5, s: 3.8 },
    { e: '🎈', l: '90%', t: '66%', d: 1, s: 5 },
    { e: '✨', l: '7%', t: '72%', d: 0.3, s: 3.5 },
    { e: '🌸', l: '46%', t: '6%', d: 0.8, s: 4.2 },
  ];

  return (
    <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-24 px-4 sm:px-6 overflow-hidden">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-rose-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      {floaters.map((f, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="balloon pointer-events-none z-0 hidden sm:block"
          style={{ left: f.l, top: f.t, animationDuration: `${f.s}s`, animationDelay: `${f.d}s` }}
        >
          {f.e}
        </div>
      ))}

      <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center">
        {/* Copy */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="text-center lg:text-left"
        >
          <motion.div variants={fadeUp} className="mb-5 flex justify-center lg:justify-start">
            <Badge className="bg-rose-500/15 border-rose-400/30 text-rose-300">💝 An interactive birthday surprise</Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-playfair text-[2.6rem] leading-[1.1] sm:text-6xl xl:text-7xl font-bold mb-5"
          >
            <span className="text-white">Turn “happy birthday” into a </span>
            <span className="gradient-text">little game of love</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-base sm:text-lg text-white/65 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
            Pop balloons that spell out your words, blow out a candle with your breath, and open a bouquet of
            little notes — all in a cute, music-filled link you can send on WhatsApp.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-6">
            <Link href="/create" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:min-w-[230px] justify-center">✨ Create yours — preview free</Button>
            </Link>
            <Link href="/wish/demo" className="w-full sm:w-auto">
              <Button variant="ghost" size="lg" className="w-full justify-center">▶ Open full demo</Button>
            </Link>
          </motion.div>

          <motion.ul
            variants={fadeUp}
            className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 text-sm text-white/50"
          >
            <li>🎁 Free preview</li>
            <li>💸 {PRICE_LABEL}, one time</li>
            <li>📱 Opens on any phone</li>
            <li>🔒 Private link</li>
          </motion.ul>
        </motion.div>

        {/* Live demo */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <PhoneFrame>
            <Experience data={DEMO_EXPERIENCE} mode="preview" />
          </PhoneFrame>
          <p className="mt-6 text-center text-xs text-white/45">
            ☝️ This is the real thing — tap it. <span className="text-white/30">(Turn your sound on 🔊)</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Scenes ─────────────────────────────────────────────────────────────── */
const SCENES = [
  { icon: '🧸', title: 'A cute hello', desc: 'A bear and a bunny greet them by name — and the “No” button just won’t be caught.' },
  { icon: '🎈', title: 'Pop the balloons', desc: 'Four balloons, four words. Every pop reveals a piece of your sentence.' },
  { icon: '🕯️', title: 'Blow the candle', desc: 'They blow into the mic to put the flame out. Tap works too, if the mic is off.' },
  { icon: '📸', title: 'Polaroid memories', desc: 'Your photos land as a stack of polaroids they can drag and shuffle.' },
  { icon: '🌹', title: 'Rose bouquet', desc: 'A bouquet blooms and little compliment bubbles float up from it.' },
  { icon: '💌', title: 'A handwritten letter', desc: 'Your words appear one by one on lined paper, then a confetti finale.' },
];

function Scenes() {
  return (
    <section id="scenes" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div {...reveal} className="text-center mb-12">
          <Badge className="mb-4">🎬 What they’ll see</Badge>
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-white mb-3">
            Six tiny moments, <span className="gradient-text">one big smile</span>
          </h2>
          <p className="text-white/55 max-w-xl mx-auto">Everything is yours to customise — the words, photos, colours and music.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {SCENES.map((s, i) => (
            <motion.div
              key={s.title}
              {...reveal}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              whileHover={{ y: -6 }}
              className="glass-card p-6"
            >
              <div className="text-4xl mb-3">{s.icon}</div>
              <h3 className="font-bold text-white mb-1.5">{s.title}</h3>
              <p className="text-sm text-white/55 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How it works ───────────────────────────────────────────────────────── */
const STEPS = [
  { icon: '📝', title: 'Tell us about them', desc: 'Their name, yours, and a few details. Takes a minute.' },
  { icon: '🎨', title: 'Make it yours', desc: 'Balloon words, rose notes, photos, a letter — plus colours and music.' },
  { icon: '👀', title: 'Preview it free', desc: 'Play the whole surprise exactly as they’ll see it. As often as you like.' },
  { icon: '💝', title: 'Pay & share', desc: `Love it? Pay ${PRICE_LABEL} once and send your private link.` },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div {...reveal} className="text-center mb-12">
          <Badge className="mb-4">✨ Simple & fast</Badge>
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-white mb-3">
            Ready in <span className="gradient-text">a few minutes</span>
          </h2>
          <p className="text-white/55 max-w-xl mx-auto">You see the finished surprise before you pay anything.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              {...reveal}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-card p-6 text-center relative"
            >
              <div className="absolute top-3 right-4 font-playfair text-3xl font-bold text-white/10">{i + 1}</div>
              <div className="text-4xl mb-3">{s.icon}</div>
              <h3 className="font-bold text-white mb-1.5">{s.title}</h3>
              <p className="text-sm text-white/55 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ────────────────────────────────────────────────────────────── */
function Pricing() {
  const items = [
    '🧸 All six interactive scenes',
    '🎵 Pick your song (Bollywood + instrumentals)',
    '📸 Up to 5 photos as polaroids',
    '🎨 6 pastel colour themes',
    '🔗 Private link, no expiry',
    '📱 Works on any phone',
  ];
  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-xl mx-auto text-center">
        <motion.div {...reveal}>
          <Badge className="mb-4 bg-amber-400/15 border-amber-400/30 text-amber-300">💰 Simple pricing</Badge>
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-white mb-3">
            Just <span className="gradient-text-gold">{PRICE_LABEL}</span> per surprise
          </h2>
          <p className="text-white/55 mb-8">One time. No subscription. Preview is always free.</p>

          <div className="glass-card p-6 sm:p-8 gradient-border">
            <div className="text-6xl font-playfair font-bold gradient-text-gold mb-1">{PRICE_LABEL}</div>
            <div className="text-white/40 text-sm mb-6">per surprise · link delivered instantly</div>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mb-8 text-left text-sm text-white/75">
              {items.map(t => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <Link href="/create">
              <Button size="lg" className="w-full justify-center">🎂 Start — preview it free</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── FAQ ────────────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'Do I really see it before paying?',
    a: 'Yes. The last step of the creator plays the exact same experience your friend will get. You only pay when you want the shareable link.',
  },
  {
    q: 'Does the candle record my voice?',
    a: 'No. The microphone is only used live to detect a puff of breath while the candle scene is open. Nothing is recorded, stored or sent anywhere. If the mic is declined, they can simply tap the candle.',
  },
  {
    q: 'What about the music?',
    a: 'Pick a Bollywood song or one of the built-in instrumentals (dreamy, playful, or a music-box “Happy Birthday”). Music plays only after the recipient taps to open — phones require a tap before sound — and they can mute any time.',
  },
  {
    q: 'Who can open my link?',
    a: 'Anyone who has it — and only them. Links are long and random, and aren’t listed or indexed by search engines.',
  },
  {
    q: 'Does it work on any phone?',
    a: 'Yes. It opens in the browser on Android, iPhone and desktop — no app to install.',
  },
];

function Faq() {
  return (
    <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div {...reveal} className="text-center mb-10">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white">
            Good to <span className="gradient-text">know</span>
          </h2>
        </motion.div>
        <div className="space-y-3">
          {FAQS.map(f => (
            <motion.details key={f.q} {...reveal} className="glass-card group px-5 py-4 open:bg-white/[0.06]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-white">
                {f.q}
                <span className="text-rose-300 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
              </summary>
              <p className="mt-3 text-sm text-white/60 leading-relaxed">{f.a}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Final CTA ──────────────────────────────────────────────────────────── */
function FinalCta() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <motion.div {...reveal} className="max-w-3xl mx-auto glass-card p-8 sm:p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-purple-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="text-5xl mb-4 animate-bounce-soft">🎂</div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-4">
            Make their day <span className="gradient-text">unforgettable</span>
          </h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">Skip the plain text message. Send something they’ll smile at, and show their friends.</p>
          <Link href="/create">
            <Button size="lg">✨ Create yours — it’s free to preview</Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────────────────────── */
function Footer() {
  const support = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  return (
    <footer className="border-t border-white/5 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🎂</span>
          <span className="font-dancing text-xl font-bold gradient-text">BirthdayBliss</span>
        </div>
        <p className="text-white/35 text-sm text-center">Made with 💕 · © {new Date().getFullYear()} BirthdayBliss</p>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/40">
          <Link href="/wish/demo" className="hover:text-white/70 transition-colors">Demo</Link>
          <Link href="/privacy" className="hover:text-white/70 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white/70 transition-colors">Terms &amp; refunds</Link>
          {support && (
            <a href={`mailto:${support}`} className="hover:text-white/70 transition-colors">Support</a>
          )}
        </nav>
      </div>
    </footer>
  );
}

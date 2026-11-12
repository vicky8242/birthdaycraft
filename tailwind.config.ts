import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        dancing: ['var(--font-dancing)', 'cursive'],
        hand:    ['var(--font-caveat)', 'cursive'],
        display: ['var(--font-dmserif)', 'Georgia', 'serif'],
        cute:    ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      colors: {
        rose: {
          50:  '#FFF1F6',
          100: '#FFE4F0',
          200: '#FFC0D9',
          300: '#FF8DC7',
          400: '#FF6B9D',
          500: '#F43F7A',
          600: '#E11D58',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
        },
        brand: {
          pink:   '#F43F7A',
          purple: '#A855F7',
          gold:   '#F59E0B',
          dark:   '#0F0614',
          card:   '#1C0A28',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-romantic': 'linear-gradient(135deg, #F43F7A 0%, #A855F7 50%, #3B82F6 100%)',
        'gradient-gold': 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0F0614 0%, #1C0A28 50%, #0F0614 100%)',
      },
      animation: {
        'float':        'float 4s ease-in-out infinite',
        'float-slow':   'float 6s ease-in-out infinite',
        'float-fast':   'float 2.5s ease-in-out infinite',
        'pulse-glow':   'pulseGlow 3s ease-in-out infinite',
        'heart-rain':   'heartRain linear infinite',
        'balloon-rise': 'balloonRise ease-in-out infinite',
        'confetti':     'confettiFall linear infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'shine':        'shine 3s ease-in-out infinite',
        'bounce-soft':  'bounceSoft 2s ease-in-out infinite',
        'fade-up':      'fadeUp 0.6s ease forwards',
        'scale-in':     'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'slide-right':  'slideRight 0.5s ease forwards',
        'twinkle':      'twinkle 2s ease-in-out infinite',
        'spin-slow':    'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':      { transform: 'translateY(-18px) rotate(3deg)' },
          '66%':      { transform: 'translateY(-8px) rotate(-2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%':      { opacity: '0.85', filter: 'brightness(1.2)' },
        },
        heartRain: {
          '0%':   { transform: 'translateY(-60px) rotate(0deg)', opacity: '0' },
          '10%':  { opacity: '1' },
          '90%':  { opacity: '0.7' },
          '100%': { transform: 'translateY(110vh) rotate(360deg)', opacity: '0' },
        },
        balloonRise: {
          '0%, 100%': { transform: 'translateY(0) rotate(-4deg)' },
          '50%':      { transform: 'translateY(-28px) rotate(4deg)' },
        },
        confettiFall: {
          '0%':   { transform: 'translateY(-40px) rotate(0deg)', opacity: '0' },
          '5%':   { opacity: '1' },
          '95%':  { opacity: '0.9' },
          '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: '0' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        shine: {
          '0%':       { left: '-100%' },
          '50%, 100%': { left: '160%' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.8)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0.5) rotate(0deg)' },
          '50%':      { opacity: '1', transform: 'scale(1.3) rotate(180deg)' },
        },
      },
      boxShadow: {
        'glow-pink':   '0 0 30px rgba(244,63,122,0.4), 0 0 60px rgba(244,63,122,0.15)',
        'glow-purple': '0 0 30px rgba(168,85,247,0.4), 0 0 60px rgba(168,85,247,0.15)',
        'glow-gold':   '0 0 30px rgba(245,158,11,0.5), 0 0 60px rgba(245,158,11,0.2)',
        'card':        '0 8px 40px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
        'card-hover':  '0 20px 60px rgba(0,0,0,0.5), 0 4px 16px rgba(244,63,122,0.15)',
        'glass':       '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        'inner-glow':  'inset 0 0 20px rgba(244,63,122,0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}

export default config

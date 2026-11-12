import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, Dancing_Script, Caveat, DM_Serif_Display, Nunito } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter    = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const dancing  = Dancing_Script({ subsets: ['latin'], variable: '--font-dancing', display: 'swap' });
// cute pastel experience fonts
const caveat   = Caveat({ subsets: ['latin'], variable: '--font-caveat', display: 'swap' });
const dmSerif  = DM_Serif_Display({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-dmserif', display: 'swap' });
const nunito   = Nunito({ subsets: ['latin'], variable: '--font-nunito', display: 'swap' });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default:  'BirthdayBliss — A cute, interactive birthday surprise for someone you love',
    template: '%s | BirthdayBliss',
  },
  description:
    'Create an interactive birthday surprise: pop balloons, blow the candle, open a rose bouquet and read your heartfelt letter — with music, photos and a link you can share on WhatsApp. Preview free before you pay.',
  keywords: ['birthday wish', 'birthday surprise website', 'romantic birthday gift', 'personalised birthday link', 'birthday wish for girlfriend', 'birthday wish for boyfriend', 'India'],
  applicationName: 'BirthdayBliss',
  openGraph: {
    title:       'BirthdayBliss — Make their birthday unforgettable',
    description: 'Pop balloons, blow the candle, open a rose bouquet. A cute interactive birthday surprise with music — preview free.',
    type:        'website',
    siteName:    'BirthdayBliss',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'BirthdayBliss — Make their birthday unforgettable',
    description: 'A cute interactive birthday surprise you can share as a link. Preview free.',
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎂</text></svg>",
  },
};

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  themeColor:   '#0F0614',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${dancing.variable} ${caveat.variable} ${dmSerif.variable} ${nunito.variable}`}
    >
      <body className="animated-bg min-h-screen antialiased">
        {/* Floating particles - global background */}
        <FloatingParticles />

        {/* Main content */}
        <main className="relative z-10">{children}</main>

        {/* Toast notifications */}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3500,
            style: {
              background:     'rgba(28,10,40,0.95)',
              backdropFilter: 'blur(20px)',
              border:         '1px solid rgba(244,63,122,0.3)',
              color:          '#fff',
              fontFamily:     'var(--font-inter)',
              fontWeight:     '600',
              borderRadius:   '50px',
              padding:        '12px 24px',
              fontSize:       '0.9rem',
            },
            success: { iconTheme: { primary: '#F43F7A', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}

// Floating particles component (server-safe, rendered in layout)
function FloatingParticles() {
  const particles = ['🎈', '💕', '❤️', '🌸', '✨', '🎉', '💫', '🎊', '🌷', '⭐', '💖', '🎀', '🦋', '🌹', '💗'];
  return (
    <div className="particle-container" aria-hidden="true">
      {Array.from({ length: 18 }, (_, i) => (
        <div
          key={i}
          className="particle select-none"
          style={{
            left:              `${(i * 6.2) % 100}%`,
            fontSize:          `${0.8 + (i % 4) * 0.3}rem`,
            animationDuration: `${9 + (i % 7) * 1.5}s`,
            animationDelay:    `${(i * 1.1) % 10}s`,
          }}
        >
          {particles[i % particles.length]}
        </div>
      ))}
    </div>
  );
}

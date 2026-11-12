'use client';

import { useId, useMemo } from 'react';

// â”€â”€ tiny seeded RNG so SVG art is identical on server + client â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** Heart centred on (0,0), ~2*s wide */
export function heartPath(s: number) {
  return `M0 ${s} C ${-s * 1.25} ${-s * 0.1}, ${-s * 0.95} ${-s * 1.15}, 0 ${-s * 0.4} C ${s * 0.95} ${-s * 1.15}, ${s * 1.25} ${-s * 0.1}, 0 ${s} Z`;
}

export function HeartIcon({ className, color = 'currentColor', style }: { className?: string; color?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="-14 -14 28 28" className={className} style={style} aria-hidden="true">
      <path d={heartPath(11)} fill={color} />
    </svg>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Cute bear + bunny with a birthday cake
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function CuteDuo({ className }: { className?: string }) {
  const flags = ['#F6657F', '#8EDB9C', '#FFD35C', '#7CCBEA', '#F6657F', '#8EDB9C', '#FFD35C'];
  return (
    <svg viewBox="0 0 300 268" className={className} role="img" aria-label="A bear and a bunny celebrating with a birthday cake">
      {/* bunting */}
      <path d="M8 18 Q150 62 292 18" stroke="#B5546E" strokeWidth="2" fill="none" />
      {flags.map((c, i) => {
        const x = 24 + i * 40;
        const y = 18 + Math.sin((i / 6) * Math.PI) * 28 + 4;
        return <polygon key={i} points={`${x - 13},${y} ${x + 13},${y + 2} ${x},${y + 26}`} fill={c} className="xp-flag" style={{ animationDelay: `${i * 0.15}s` }} />;
      })}

      <g transform="translate(0 20)">
      {/* sparkles & flowers */}
      <g fill="#FFD35C">
        <path d="M30 120 l4 -10 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4z" className="xp-twinkle" />
        <path d="M268 140 l3 -8 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3z" className="xp-twinkle" style={{ animationDelay: '.7s' }} />
      </g>
      <g className="xp-bob">
        <circle cx="38" cy="168" r="9" fill="#F9B6C9" /><circle cx="38" cy="168" r="3.5" fill="#FFD35C" />
        <circle cx="262" cy="96" r="9" fill="#9ED9F2" /><circle cx="262" cy="96" r="3.5" fill="#FFD35C" />
      </g>
      <path d="M150 104 c-9 -12 -24 0 -12 12 l12 11 l12 -11 c12 -12 -3 -24 -12 -12z" fill="#F0506E" className="xp-heartbeat" style={{ transformOrigin: '150px 115px' }} />

      {/* BEAR */}
      <g className="xp-bob" style={{ animationDelay: '.2s' }}>
        <ellipse cx="92" cy="198" rx="46" ry="38" fill="#B87650" />
        <circle cx="52" cy="102" r="17" fill="#B87650" /><circle cx="52" cy="102" r="9" fill="#E9B896" />
        <circle cx="132" cy="102" r="17" fill="#B87650" /><circle cx="132" cy="102" r="9" fill="#E9B896" />
        <circle cx="92" cy="140" r="52" fill="#C98A62" />
        <ellipse cx="92" cy="156" rx="22" ry="17" fill="#EBC3A2" />
        <ellipse cx="72" cy="136" rx="5.5" ry="6.5" fill="#3D2418" /><circle cx="70" cy="133.5" r="2" fill="#fff" />
        <ellipse cx="112" cy="136" rx="5.5" ry="6.5" fill="#3D2418" /><circle cx="110" cy="133.5" r="2" fill="#fff" />
        <circle cx="58" cy="152" r="9" fill="#F2A28E" opacity=".65" /><circle cx="126" cy="152" r="9" fill="#F2A28E" opacity=".65" />
        <ellipse cx="92" cy="150" rx="5" ry="3.5" fill="#3D2418" />
        <path d="M84 158 Q92 168 100 158 Q92 162 84 158Z" fill="#8E2F3B" />
        {/* hat */}
        <g transform="rotate(-12 92 92)">
          <polygon points="70,92 114,92 92,44" fill="#fff" />
          <polygon points="76,82 108,82 100,66 84,66" fill="#F6657F" opacity=".85" />
          <circle cx="92" cy="43" r="6" fill="#FFD35C" />
        </g>
      </g>

      {/* BUNNY */}
      <g className="xp-bob" style={{ animationDelay: '.6s' }}>
        <ellipse cx="212" cy="198" rx="44" ry="38" fill="#fff" stroke="#F0D8DF" strokeWidth="2" />
        <g transform="rotate(-10 190 78)"><ellipse cx="190" cy="76" rx="13" ry="36" fill="#fff" stroke="#F0D8DF" strokeWidth="2" /><ellipse cx="190" cy="80" rx="6.5" ry="24" fill="#F9C4D3" /></g>
        <g transform="rotate(14 236 78)"><ellipse cx="236" cy="76" rx="13" ry="36" fill="#fff" stroke="#F0D8DF" strokeWidth="2" /><ellipse cx="236" cy="80" rx="6.5" ry="24" fill="#F9C4D3" /></g>
        <circle cx="212" cy="142" r="50" fill="#fff" stroke="#F0D8DF" strokeWidth="2" />
        <path d="M190 138 Q197 128 204 138" stroke="#3D2418" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M220 138 Q227 128 234 138" stroke="#3D2418" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="184" cy="154" r="9" fill="#F9A8BC" opacity=".7" /><circle cx="240" cy="154" r="9" fill="#F9A8BC" opacity=".7" />
        <path d="M207 152 L217 152 L212 158Z" fill="#F0809A" />
        <path d="M204 162 Q212 172 220 162 Q212 166 204 162Z" fill="#E4637F" />
        {/* hat */}
        <g transform="rotate(12 214 96)">
          <polygon points="192,96 236,96 214,48" fill="#9ED9F2" />
          <polygon points="198,86 230,86 222,70 206,70" fill="#fff" opacity=".8" />
          <circle cx="214" cy="47" r="6" fill="#F6657F" />
        </g>
      </g>

      {/* CAKE */}
      <ellipse cx="150" cy="238" rx="78" ry="9" fill="#E9DCE0" />
      <ellipse cx="150" cy="235" rx="74" ry="8" fill="#fff" />
      <rect x="96" y="196" width="108" height="40" rx="12" fill="#F58AA6" />
      <path d="M96 212 q9 12 18 0 q9 12 18 0 q9 12 18 0 q9 12 18 0 q9 12 18 0 q9 12 18 0 v-14 h-108z" fill="#FFE1EA" />
      <rect x="112" y="162" width="76" height="38" rx="11" fill="#FFB8CB" />
      <path d="M112 176 q9.5 12 19 0 q9.5 12 19 0 q9.5 12 19 0 q9.5 12 19 0 v-14 h-76z" fill="#FFF3F6" />
      <text x="150" y="226" textAnchor="middle" fontSize="11" fontWeight="800" fill="#B3315A" fontFamily="var(--font-nunito), sans-serif" letterSpacing="1.5">HAPPY BIRTHDAY</text>
      <rect x="146.5" y="134" width="7" height="30" rx="3" fill="#7FD4D0" />
      <g className="xp-flame" style={{ transformOrigin: '150px 130px' }}>
        <ellipse cx="150" cy="122" rx="7" ry="11" fill="#FFB938" />
        <ellipse cx="150" cy="125" rx="3.5" ry="6" fill="#FFE98A" />
      </g>
      </g>
    </svg>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Balloon (with bow & curly ribbons)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export type BalloonPalette = { light: string; mid: string; dark: string; ribbon: string };

export const BALLOON_COLORS: BalloonPalette[] = [
  { light: '#E3F1FF', mid: '#9DC4F5', dark: '#6D9CE0', ribbon: '#8EB0E8' },   // blue
  { light: '#FFE6EE', mid: '#F7A9C2', dark: '#E57B9F', ribbon: '#EE8DA9' },   // pink
  { light: '#E1FAEC', mid: '#8FD8B1', dark: '#52B887', ribbon: '#58B68A' },   // green
  { light: '#EEE5FF', mid: '#BDA6F2', dark: '#9677DD', ribbon: '#A68AE6' },   // purple
];

export function Balloon({ palette, className }: { palette: BalloonPalette; className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 120 210" className={className} aria-hidden="true" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id={`g${id}`} cx="35%" cy="30%" r="75%">
          <stop offset="0%"  stopColor="#fff" stopOpacity=".95" />
          <stop offset="28%" stopColor={palette.light} />
          <stop offset="70%" stopColor={palette.mid} />
          <stop offset="100%" stopColor={palette.dark} />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="204" rx="26" ry="3" fill="#000" opacity=".06" />
      <path d="M60 6 C94 6 114 34 114 66 C114 102 88 126 60 126 C32 126 6 102 6 66 C6 34 26 6 60 6Z" fill={`url(#g${id})`} />
      <path d="M60 6 C94 6 114 34 114 66 C114 102 88 126 60 126 C32 126 6 102 6 66 C6 34 26 6 60 6Z" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.5" />
      <ellipse cx="36" cy="40" rx="11" ry="20" transform="rotate(-28 36 40)" fill="#fff" opacity=".55" />
      <path d="M53 130 L67 130 L60 120Z" fill={palette.dark} />
      {/* bow */}
      <ellipse cx="45" cy="140" rx="15" ry="7.5" transform="rotate(-18 45 140)" fill={palette.ribbon} />
      <ellipse cx="75" cy="140" rx="15" ry="7.5" transform="rotate(18 75 140)" fill={palette.ribbon} />
      <circle cx="60" cy="140" r="5" fill={palette.dark} />
      <path d="M58 145 Q46 166 58 182 T 54 206" stroke={palette.ribbon} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M62 145 Q76 164 63 180 T 68 204" stroke={palette.ribbon} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Rose
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Rose({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${r / 30})`}>
      <circle r="30" fill="#A00F27" />
      <path d="M-27 -4 C-21 -27 21 -29 27 -4 C23 19 -23 21 -27 -4Z" fill="#DA2A47" />
      <path d="M-19 -2 C-15 -19 15 -19 19 -2 C15 13 -15 13 -19 -2Z" fill="#C41A36" />
      <path d="M-10 0 C-9 -10 10 -10 10 0 C9 8 -9 8 -10 0Z" fill="#9A0D23" />
      <path d="M-6 -1 C-2 -7 7 -5 5 2" stroke="#EE5A72" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M-24 9 Q0 28 24 9" stroke="#7E0A1D" strokeWidth="2" fill="none" opacity=".55" />
      <path d="M-20 -16 Q-6 -26 8 -22" stroke="#FF8CA0" strokeWidth="2" fill="none" opacity=".6" strokeLinecap="round" />
    </g>
  );
}

export function Bouquet({ className }: { className?: string }) {
  const roses: [number, number, number][] = [
    [150, 74, 30], [96, 98, 28], [204, 98, 28], [66, 142, 24], [234, 142, 24],
    [122, 128, 31], [178, 128, 31], [150, 170, 30],
  ];
  const leaves: [number, number, number][] = [
    [62, 96, -40], [238, 96, 40], [48, 150, -65], [252, 150, 65], [110, 60, -25], [190, 60, 25], [84, 186, -50], [216, 186, 50],
  ];
  return (
    <svg viewBox="0 0 300 380" className={className} role="img" aria-label="A bouquet of red roses tied with a ribbon">
      {/* leaves */}
      {leaves.map(([x, y, rot], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
          <path d="M0 0 C-16 -14 -10 -44 0 -52 C10 -44 16 -14 0 0Z" fill={i % 2 ? '#3F7D4B' : '#4C8F57'} />
          <path d="M0 -4 L0 -44" stroke="#2F6A3C" strokeWidth="1.5" />
        </g>
      ))}
      {/* stems */}
      <g stroke="#3C7A45" strokeWidth="5" strokeLinecap="round">
        {roses.map(([x, y], i) => <line key={i} x1={x} y1={y + 10} x2={150} y2={300} />)}
      </g>
      {/* wrapping paper */}
      <path d="M42 150 Q58 250 150 340 L150 190Z" fill="#EAD7BD" />
      <path d="M258 150 Q242 250 150 340 L150 190Z" fill="#E1CBAA" />
      <path d="M78 196 Q150 226 222 196 L168 346 L132 346Z" fill="#F6EAD6" />
      <path d="M150 214 L150 342" stroke="#D9C3A2" strokeWidth="1.5" />
      <path d="M110 208 L138 342M190 208 L162 342" stroke="#E5D3B6" strokeWidth="1.2" />
      {/* roses (back â†’ front) */}
      {roses.map(([x, y, r], i) => <Rose key={i} x={x} y={y} r={r} />)}
      {/* ribbon bow */}
      <g>
        <path d="M150 292 C 112 262, 92 300, 110 312 C 126 322, 146 306, 150 296Z" fill="#DA2B3C" />
        <path d="M150 292 C 188 262, 208 300, 190 312 C 174 322, 154 306, 150 296Z" fill="#E7414F" />
        <path d="M146 300 C 130 330, 108 350, 92 368 L 112 364 C 124 352, 140 332, 150 306Z" fill="#C21F31" />
        <path d="M154 300 C 170 330, 192 350, 208 368 L 188 364 C 176 352, 160 332, 150 306Z" fill="#CC2538" />
        <rect x="141" y="288" width="18" height="18" rx="7" fill="#B5172A" />
      </g>
    </svg>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Heart tree
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function HeartTree({ className, flip = false }: { className?: string; flip?: boolean }) {
  const hearts = useMemo(() => {
    const r = seeded(flip ? 99 : 42);
    const palette = ['#F27BA3', '#F7A1BE', '#EE5C8B', '#FBC1D4', '#F48FB1', '#E94F83'];
    return Array.from({ length: 52 }, (_, i) => {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r());
      const q = (n: number) => Math.round(n * 100) / 100;   // stable across server / client float maths
      return {
        x: q(90 + Math.cos(a) * d * 74),
        y: q(86 + Math.sin(a) * d * 68),
        s: q(6 + r() * 7),
        rot: q((r() - 0.5) * 70),
        c: palette[i % palette.length],
        delay: q(r() * 3),
      };
    });
  }, [flip]);

  return (
    <svg viewBox="0 0 180 270" className={className} aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <g stroke="#8E5C6B" strokeLinecap="round" fill="none">
        <path d="M90 266 C 92 220 86 190 90 150" strokeWidth="11" />
        <path d="M90 190 C 70 172 62 156 56 138" strokeWidth="6" />
        <path d="M90 176 C 110 160 120 146 126 128" strokeWidth="6" />
        <path d="M90 150 C 88 128 92 112 90 96" strokeWidth="6" />
      </g>
      <path d="M70 266 Q90 254 110 266Z" fill="#8E5C6B" opacity=".75" />
      {hearts.map((h, i) => (
        <g key={i} transform={`translate(${h.x} ${h.y}) rotate(${h.rot})`}>
          <path d={heartPath(h.s)} fill={h.c} className="xp-sway" style={{ animationDelay: `${h.delay}s` }} />
        </g>
      ))}
    </svg>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Candle cake (for the blow scene) â€“ flame is controlled via props
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function CandleCake({
  lit, flicker = 0, className,
}: { lit: boolean; flicker?: number; className?: string }) {
  // flicker 0..1 â€“ how hard the user is blowing
  const lean  = Math.min(1, flicker) * 16;
  const scale = 1 - Math.min(1, flicker) * 0.35;
  return (
    <svg viewBox="0 0 300 280" className={className} role="img" aria-label="A birthday cake with one candle">
      <defs>
        <radialGradient id="candleGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFC24A" stopOpacity=".75" />
          <stop offset="100%" stopColor="#FFC24A" stopOpacity="0" />
        </radialGradient>
      </defs>
      {lit && <circle cx="150" cy="74" r="62" fill="url(#candleGlow)" className="xp-glow" />}
      <ellipse cx="150" cy="262" rx="124" ry="14" fill="#000" opacity=".08" />
      <ellipse cx="150" cy="252" rx="118" ry="14" fill="#EFE7EA" />
      <ellipse cx="150" cy="248" rx="112" ry="12" fill="#fff" />
      {/* sponge */}
      <path d="M50 150 L50 224 Q50 242 70 242 L230 242 Q250 242 250 224 L250 150Z" fill="#4A2616" />
      <path d="M50 190 Q150 206 250 190 L250 224 Q250 242 230 242 L70 242 Q50 242 50 224Z" fill="#3B1D10" />
      {/* cream */}
      <path d="M42 138 Q50 104 110 112 Q150 94 196 110 Q258 102 258 140 Q258 170 238 168 Q226 190 206 168 Q190 188 170 168 Q150 190 132 168 Q112 190 94 168 Q76 188 62 166 Q40 172 42 138Z" fill="#FFF3DD" />
      <path d="M62 128 Q100 116 140 124" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".7" fill="none" />
      {/* candle */}
      <rect x="143" y="74" width="14" height="56" rx="5" fill="#8E1E3A" />
      <rect x="143" y="74" width="5" height="56" rx="3" fill="#B53053" />
      <rect x="148.5" y="66" width="3" height="10" rx="1.5" fill="#2B1A16" />
      {lit && (
        <g style={{ transformOrigin: '150px 68px', transform: `skewX(${-lean}deg) scale(${scale})`, transition: 'transform .08s linear' }}>
          <g className="xp-flame" style={{ transformOrigin: '150px 68px' }}>
            <path d="M150 28 C 164 46, 166 62, 150 70 C 134 62, 136 46, 150 28Z" fill="#FFAA2B" />
            <path d="M150 42 C 158 54, 158 64, 150 69 C 142 64, 142 54, 150 42Z" fill="#FFE27A" />
          </g>
        </g>
      )}
    </svg>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Envelope with a heart seal. `open` flips the flap & lifts the card
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function Envelope({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 280 230" className={className} role="img" aria-label="A sealed love letter" style={{ overflow: 'visible' }}>
      <ellipse cx="140" cy="214" rx="104" ry="9" fill="#000" opacity=".08" />
      {/* back */}
      <rect x="20" y="70" width="240" height="140" rx="14" fill="#F4A6BD" />
      {/* card */}
      <g style={{ transform: open ? 'translateY(-78px)' : 'translateY(0)', transition: 'transform .9s cubic-bezier(.22,1,.36,1) .25s' }}>
        <rect x="40" y="88" width="200" height="110" rx="10" fill="#FFFDF8" stroke="#F4D9E1" strokeWidth="2" />
        <text x="140" y="130" textAnchor="middle" fontSize="26" fontFamily="var(--font-caveat), cursive" fontWeight="700" fill="#C0345C">Happy Birthday</text>
        <g transform="translate(140 164)"><path d="M0 12 C-26 -4 -16 -26 0 -12 C16 -26 26 -4 0 12Z" fill="#F0506E" /></g>
      </g>
      {/* front pockets â€“ deliberately overlapping so no slit lets the card show through */}
      <path d="M20 76 L152 156 L30 212 L28 212 Q20 212 20 204 Z" fill="#F8BBCD" />
      <path d="M260 76 L128 156 L250 212 L252 212 Q260 212 260 204 Z" fill="#F7B0C5" />
      <path d="M28 212 L140 136 L252 212 Z" fill="#FBCAD8" />
      {/* flap */}
      <g style={{
        transformBox: 'fill-box', transformOrigin: 'top',
        transform: open ? 'scaleY(-1)' : 'scaleY(1)',
        transition: 'transform .6s cubic-bezier(.4,0,.2,1)',
      }}>
        <path d="M20 76 Q20 70 34 70 L246 70 Q260 70 260 76 L140 158Z" fill="#F7A0B9" />
      </g>
      {/* seal */}
      {!open && (
        <g className="xp-heartbeat" style={{ transformOrigin: '140px 150px' }}>
          <circle cx="140" cy="150" r="22" fill="#D62F57" />
          <circle cx="140" cy="150" r="22" fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="2" />
          <g transform="translate(140 151)"><path d={heartPath(10)} fill="#FFE3EA" /></g>
        </g>
      )}
    </svg>
  );
}


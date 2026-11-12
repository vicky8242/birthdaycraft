import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'BirthdayBliss — an interactive birthday surprise';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ffd1e3 0%, #e7d6ff 55%, #c9dcff 100%)',
          color: '#4a1d6b',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: -120, left: -80, width: 420, height: 420, borderRadius: 999, background: 'rgba(255,120,170,0.35)' }} />
        <div style={{ position: 'absolute', bottom: -140, right: -60, width: 460, height: 460, borderRadius: 999, background: 'rgba(140,100,255,0.28)' }} />
        <div style={{ display: 'flex', fontSize: 120, fontWeight: 800, letterSpacing: -3 }}>BirthdayBliss</div>
        <div style={{ display: 'flex', marginTop: 12, fontSize: 46, color: '#7a3b9a' }}>
          Pop balloons. Blow the candle. Open the surprise.
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 44,
            padding: '16px 40px',
            borderRadius: 999,
            background: '#e0307a',
            color: 'white',
            fontSize: 36,
            fontWeight: 700,
          }}
        >
          Preview yours free
        </div>
      </div>
    ),
    size,
  );
}

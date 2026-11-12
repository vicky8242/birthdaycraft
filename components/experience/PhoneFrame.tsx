'use client';

import { ReactNode } from 'react';

/** A phone-shaped frame so the preview feels like the real thing. */
export default function PhoneFrame({ children, glow = 'rgba(244,63,122,0.45)' }: { children: ReactNode; glow?: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[19rem] sm:max-w-[21rem]">
      <div
        className="absolute -inset-6 rounded-[4rem] blur-3xl opacity-70 pointer-events-none"
        style={{ background: glow }}
        aria-hidden="true"
      />
      <div className="relative aspect-[9/18.2] rounded-[2.8rem] bg-[#17101f] p-[9px] ring-1 ring-white/15 shadow-[0_30px_80px_rgba(0,0,0,.55)]">
        <div className="relative h-full w-full overflow-hidden rounded-[2.3rem] bg-black isolate">
          {children}
        </div>
        <div className="absolute top-[14px] left-1/2 -translate-x-1/2 h-[18px] w-[72px] rounded-full bg-black/90 z-[60] pointer-events-none" aria-hidden="true" />
      </div>
    </div>
  );
}

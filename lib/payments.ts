'use client';

import { useEffect, useState } from 'react';

/**
 * Are real payments switched on? `undefined` while we ask, `false` while Razorpay isn't set up
 * (the surprise is then free), `true` once it is. If the check fails we assume payments ARE on –
 * the server makes the real decision either way, this only changes the wording.
 */
export function usePaymentsLive(): boolean | undefined {
  const [live, setLive] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    let off = false;
    fetch('/api/status', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (!off) setLive(Boolean(d.paymentsLive)); })
      .catch(() => { if (!off) setLive(true); });
    return () => { off = true; };
  }, []);
  return live;
}

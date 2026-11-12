/** Price shown in the UI and charged by the server (single source of truth). */
export const PRICE_INR = Number(process.env.NEXT_PUBLIC_WISH_PRICE_INR || 99);
export const PRICE_LABEL = `₹${PRICE_INR}`;

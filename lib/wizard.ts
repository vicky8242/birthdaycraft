import type { WishFormData } from '@/lib/types';

export interface MissingItem {
  step:  number;
  label: string;
}

const filled = (s: string | undefined) => !!s && s.trim().length > 0;

/** Everything required before a surprise can be paid for. Empty array = ready. */
export function getMissing(f: WishFormData): MissingItem[] {
  const out: MissingItem[] = [];
  if (!filled(f.birthdayPersonName)) out.push({ step: 1, label: "The birthday person's name" });
  if (!filled(f.senderName))    out.push({ step: 1, label: 'Your name' });
  if (f.balloonWords.some(w => !filled(w)))   out.push({ step: 3, label: 'A word for every balloon' });
  if (f.compliments.slice(0, 3).some(c => !filled(c))) out.push({ step: 3, label: 'The first 3 rose notes' });
  if (!filled(f.message))   out.push({ step: 4, label: 'Your birthday letter' });
  if (!filled(f.finalNote)) out.push({ step: 4, label: 'A closing note' });
  return out;
}

/** Which wizard steps are complete. `maxStep` = furthest step the user has reached (for optional/default steps). */
export function stepComplete(f: WishFormData, maxStep: number): boolean[] {
  const missing = getMissing(f);
  const bad = (step: number) => missing.some(m => m.step === step);
  return [
    !bad(1),
    f.photos.length > 0 || maxStep > 2, // photos are optional
    !bad(3),
    !bad(4),
    maxStep > 5,                         // style has good defaults
    false,                               // preview is the destination
  ];
}

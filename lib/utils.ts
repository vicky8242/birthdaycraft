import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { ThemeColor, ThemeConfig, THEME_CONFIGS } from './types';

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get theme config
export function getTheme(color: ThemeColor): ThemeConfig {
  return THEME_CONFIGS[color] ?? THEME_CONFIGS.pink;
}

// Format birthday date nicely
export function formatBirthday(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'do MMMM, yyyy');
  } catch {
    return dateStr;
  }
}

// Unguessable share slug (uses a CSPRNG in both Node and the browser)
export function generateSlug(length = 12): string {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789';      // no look-alikes (l, o, 0, 1)
  const bytes = new Uint8Array(length);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, b => chars[b % chars.length]).join('');
}

/**
 * Read an image file, scale it down and re-encode as JPEG.
 * Keeps uploads small (a phone photo is 4–8 MB; this is ~150 KB) and strips EXIF/location data.
 */
export function compressImage(file: File, maxDim = 1100, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale  = Math.min(1, maxDim / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width  = Math.max(1, Math.round(img.width  * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext('2d');
      if (!ctx) { URL.revokeObjectURL(url); reject(new Error('Canvas not supported')); return; }
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read image')); };
    img.src = url;
  });
}

// Share text builder
export function buildShareText(name: string, url: string): string {
  return `🎂 I made a special birthday surprise for ${name}! Open it here: ${url}`;
}

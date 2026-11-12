import {
  Wish, WishFormData, ThemeColor, TrackId,
  DEFAULT_BALLOON_WORDS, DEFAULT_COMPLIMENTS, MIN_COMPLIMENTS, MAX_COMPLIMENTS, THEME_CONFIGS, isTrackId,
} from './types';

/** Everything the interactive experience needs – independent of where it came from. */
export interface ExperienceData {
  name:        string;
  nickname:    string;
  sender:      string;
  milestone:   string;
  photos:      string[];
  balloonWords: string[];
  compliments: string[];
  message:     string;
  memory:      string;
  qualities:   string[];
  finalNote:   string;
  signoff:     string;
  theme:       ThemeColor;
  music:       TrackId;
}

function clean(list: (string | undefined | null)[] | null | undefined, size: number, fallback: string[]): string[] {
  const out = (list ?? []).map(s => (s ?? '').trim()).filter(Boolean).slice(0, size);
  // Keep exactly `size` entries – fall back for anything missing
  for (let i = out.length; i < size; i++) out.push(fallback[i % fallback.length]);
  return out;
}

/** 3 to 6 rose notes: blanks are dropped, and we top up to 3 with defaults if needed. */
function notes(list: (string | undefined | null)[] | null | undefined): string[] {
  const out = (list ?? []).map(s => (s ?? '').trim()).filter(Boolean).slice(0, MAX_COMPLIMENTS);
  for (let i = out.length; i < MIN_COMPLIMENTS; i++) out.push(DEFAULT_COMPLIMENTS[i % DEFAULT_COMPLIMENTS.length]);
  return out;
}

export function formToExperience(f: WishFormData): ExperienceData {
  return {
    name:         f.birthdayPersonName.trim() || 'Beautiful',
    nickname:     f.nickname.trim(),
    sender:       f.senderName.trim() || 'Someone who loves you',
    milestone:    f.milestone.trim(),
    photos:       f.photos.map(p => p.url || p.dataUrl).filter(Boolean) as string[],
    balloonWords: clean(f.balloonWords, 4, DEFAULT_BALLOON_WORDS),
    compliments:  notes(f.compliments),
    message:      f.message.trim(),
    memory:       f.favoriteMemory.trim(),
    qualities:    f.qualities,
    finalNote:    f.finalNote.trim(),
    signoff:      f.signoff.trim() || 'With Love',
    theme:        f.themeColor,
    music:        f.musicTrack,
  };
}

export function wishToExperience(w: Wish): ExperienceData {
  const theme = (w.theme_color in THEME_CONFIGS ? w.theme_color : 'pink') as ThemeColor;
  const music: TrackId = isTrackId(w.music_track) ? w.music_track : 'dreamy';
  return {
    name:         w.birthday_person_name,
    nickname:     (w.nickname ?? '').trim(),
    sender:       w.sender_name,
    milestone:    w.milestone ?? '',
    photos:       w.photo_urls ?? [],
    balloonWords: clean(w.balloon_words, 4, DEFAULT_BALLOON_WORDS),
    compliments:  notes(w.compliments),
    message:      w.message,
    memory:       w.favorite_memory ?? '',
    qualities:    w.qualities ?? [],
    finalNote:    w.final_note,
    signoff:      w.signoff,
    theme,
    music,
  };
}

/** Used by the landing page and /wish/demo */
export const DEMO_EXPERIENCE: ExperienceData = {
  name:         'Anushka',
  nickname:     '',
  sender:       'someone who adores you',
  milestone:    '',
  photos:       [],
  balloonWords: ['You', 'are', 'my', 'sunshine ☀️'],
  compliments:  ['Forever yours 🤍', 'You make my world beautiful', 'You are my sunshine ☀️'],
  message:
    'Every moment with you feels like a celebration. You light up every room you walk into, ' +
    'and I feel so lucky to have you in my life. Thank you for every laugh, every hug and every ' +
    'little thing that makes ordinary days feel magical.',
  memory:       'That rainy evening when we shared one umbrella and one plate of momos 🥟',
  qualities:    ['✨ Kind', '🌸 Sweet', '💕 Caring', '🌈 Joyful'],
  finalNote:
    "No matter where life takes us, I'll always be here cheering for you. " +
    'You deserve every happiness that comes your way. Happy Birthday, my love. 🌹',
  signoff:      'Forever Yours 💕',
  theme:        'pink',
  music:        'dreamy',
};

/** Title shown on the intro scene, e.g. "Happy 25th Birthday," */
export function introTitle(d: ExperienceData): string {
  return d.milestone ? `Happy ${d.milestone} Birthday,` : 'Happy Birthday,';
}

export function displayName(d: ExperienceData): string {
  return d.nickname || d.name;
}

// ── Core Types for BirthdayBliss ─────────────────────────────────────────

export type ThemeColor   = 'pink' | 'purple' | 'gold' | 'red' | 'teal' | 'blue';
export type Relationship = 'partner' | 'bestfriend' | 'friend' | 'sibling' | 'parent' | 'colleague';
/** Built-in instrumentals, synthesised in the browser (no audio files, no licensing). */
export type SynthId      = 'dreamy' | 'playful' | 'lullaby';
/** A SynthId, or the id of a song listed in /public/music/songs.json (audio at /public/music/<id>.mp3). */
export type TrackId      = string;

export interface WishFormData {
  // Step 1 – details
  birthdayPersonName: string;
  nickname:           string;        // what the sender calls them (optional)
  senderName:         string;
  birthdayDate:       string;        // ISO date string YYYY-MM-DD
  milestone:          string;        // e.g. "30th", "" if none
  relationship:       Relationship | '';

  // Step 2 – photos
  photos: UploadedPhoto[];

  // Step 3 – balloons & roses
  balloonWords: string[];            // exactly 4 – revealed one per balloon
  compliments:  string[];            // 3 to 6 – floating around the bouquet

  // Step 4 – letter
  message:        string;
  favoriteMemory: string;
  qualities:      string[];
  finalNote:      string;
  signoff:        string;
  notesSeeded:    boolean;           // starter letter/closing already pre-filled once

  // Step 5 – style
  themeColor: ThemeColor;
  musicTrack: TrackId;
}

export interface UploadedPhoto {
  id:        string;
  dataUrl?:  string;   // local preview before upload
  url?:      string;   // storage URL after upload
  uploading: boolean;
}

export interface Wish {
  id:                   string;
  slug:                 string;
  birthday_person_name: string;
  nickname?:            string | null;
  sender_name:          string;
  birthday_date:        string;
  milestone:            string | null;
  relationship:         string | null;
  message:              string;
  favorite_memory:      string | null;
  final_note:           string;
  signoff:              string;
  mood?:                string;
  theme_color:          string;
  qualities:            string[];
  photo_urls:           string[];
  balloon_words?:       string[] | null;
  compliments?:         string[] | null;
  music_track?:         string | null;
  is_paid:              boolean;
  created_at:           string;
}

export interface ThemeConfig {
  // creator-UI accent colours
  from:    string;
  to:      string;
  accent:  string;
  text:    string;
  glow:    string;
  border:  string;
  // pastel experience palette
  bg1:     string;   // top of gradient
  bg2:     string;   // middle
  bg3:     string;   // bottom
  ink:     string;   // dark readable text
  strong:  string;   // buttons / highlights
  soft:    string;   // hearts / light accents
  label:   string;
}

export const THEME_CONFIGS: Record<ThemeColor, ThemeConfig> = {
  pink: {
    from: '#F43F7A', to: '#E11D58', accent: '#FFE4F0', text: '#FFF1F6', glow: 'rgba(244,63,122,0.5)', border: 'rgba(244,63,122,0.3)',
    bg1: '#FFE6F0', bg2: '#FBCADD', bg3: '#F5A9C8', ink: '#7D1237', strong: '#D81B60', soft: '#F8A5C2', label: 'Blush Pink',
  },
  purple: {
    from: '#A855F7', to: '#7C3AED', accent: '#F3E8FF', text: '#FAF5FF', glow: 'rgba(168,85,247,0.5)', border: 'rgba(168,85,247,0.3)',
    bg1: '#F4E9FF', bg2: '#E0CBFB', bg3: '#C9A9F3', ink: '#47197A', strong: '#8E44D6', soft: '#CDB0F5', label: 'Lavender Dream',
  },
  gold: {
    from: '#F59E0B', to: '#D97706', accent: '#FEF3C7', text: '#FFFBEB', glow: 'rgba(245,158,11,0.5)', border: 'rgba(245,158,11,0.3)',
    bg1: '#FFF3E1', bg2: '#FFDDB5', bg3: '#FFC18F', ink: '#772F0F', strong: '#E4702A', soft: '#FFC999', label: 'Honey Peach',
  },
  red: {
    from: '#EF4444', to: '#DC2626', accent: '#FFE4E6', text: '#FFF1F2', glow: 'rgba(239,68,68,0.5)', border: 'rgba(239,68,68,0.3)',
    bg1: '#FFE5E5', bg2: '#FFBDBD', bg3: '#FF9A9F', ink: '#7A1020', strong: '#D32F40', soft: '#FFA3A8', label: 'Cherry Kiss',
  },
  teal: {
    from: '#14B8A6', to: '#0D9488', accent: '#CCFBF1', text: '#F0FDFA', glow: 'rgba(20,184,166,0.5)', border: 'rgba(20,184,166,0.3)',
    bg1: '#E4FBF3', bg2: '#BBF1DE', bg3: '#92E1C7', ink: '#0B4A41', strong: '#0F9F86', soft: '#9CE8D2', label: 'Mint Fresh',
  },
  blue: {
    from: '#3B82F6', to: '#2563EB', accent: '#DBEAFE', text: '#EFF6FF', glow: 'rgba(59,130,246,0.5)', border: 'rgba(59,130,246,0.3)',
    bg1: '#E6F1FF', bg2: '#C2DDFF', bg3: '#9ECAFF', ink: '#0F3872', strong: '#2F7BE0', soft: '#A9CDFB', label: 'Baby Blue',
  },
};

export const MILESTONE_OPTIONS = [
  { label: '18th 🎉', value: '18th' },
  { label: '20th ✨', value: '20th' },
  { label: '21st 🥳', value: '21st' },
  { label: '25th 💫', value: '25th' },
  { label: '30th 🌟', value: '30th' },
  { label: '40th 👑', value: '40th' },
  { label: '50th 🎖️', value: '50th' },
];

export const RELATIONSHIP_OPTIONS: { label: string; value: Relationship }[] = [
  { label: '💑 Partner',     value: 'partner'    },
  { label: '👯 Best Friend', value: 'bestfriend' },
  { label: '🤝 Friend',      value: 'friend'     },
  { label: '👨‍👧 Sibling',    value: 'sibling'    },
  { label: '👨‍👩‍👧 Parent',   value: 'parent'     },
  { label: '💼 Colleague',   value: 'colleague'  },
];

export const QUALITY_OPTIONS = [
  '✨ Kind', '💡 Smart', '🎨 Creative', '🌟 Funny',
  '💪 Strong', '🌸 Sweet', '🎯 Determined', '💕 Caring',
  '🦋 Free-spirited', '🌈 Joyful', '🎵 Talented', '🔥 Passionate',
  '🌺 Graceful', '🎭 Witty', '⭐ Inspiring', '🍀 Lucky',
];

export const SIGNOFF_OPTIONS = [
  'Forever Yours 💕',
  'With All My Love 🌹',
  'Always & Forever ✨',
  'Your #1 Fan 🎉',
  'Yours Truly 💖',
  'With Warmth 🌸',
  'Till Eternity 💫',
  'Your Person 🫶',
];

export const COLOR_OPTIONS: { label: string; value: ThemeColor; hex: string }[] =
  (Object.keys(THEME_CONFIGS) as ThemeColor[]).map(value => ({
    value,
    label: THEME_CONFIGS[value].label,
    hex:   THEME_CONFIGS[value].bg3,
  }));

// ── Balloon sentence presets (4 pieces, one per balloon) ───────────────────
export const BALLOON_PRESETS: string[][] = [
  ['You', 'are', 'my', 'sunshine ☀️'],
  ['Happy', 'Birthday', 'my', 'favourite human 💗'],
  ['Love you', 'to the', 'moon', '& back 🌙'],
  ['My', 'heart', 'is', 'yours 💖'],
  ['Stay', 'magical', 'always', '✨'],
];

export const COMPLIMENT_SUGGESTIONS = [
  'You are my sunshine ☀️',
  'Forever yours 🤍',
  'You make my world beautiful',
  'My favourite person 💕',
  'Home is wherever you are 🏡',
  'You are my happy place 🌷',
  'Thank you for being you',
  'You light up every room ✨',
  'My heart smiles because of you',
  'Luckiest to have you 🍀',
];

// ── Music ───────────────────────────────────────────────────────────────────
// Built-in instrumentals live here. SONGS are NOT hard-coded: they come from
// /public/music/songs.json (see public/music/README.txt) so you can add as many as you like
// without touching code. A song's audio is /public/music/<id>.mp3 – you must hold the rights to it.
export interface MusicOption {
  id:    TrackId;
  label: string;
  emoji: string;
  desc:  string;
}

export const SYNTH_OPTIONS: (MusicOption & { id: SynthId })[] = [
  { id: 'dreamy',  label: 'Dreamy Romance', emoji: '🌙', desc: 'Soft, filmy, hopeful'  },
  { id: 'playful', label: 'Playful Joy',    emoji: '🎈', desc: 'Bouncy and bright'      },
  { id: 'lullaby', label: 'Music-Box Wish', emoji: '🎂', desc: 'Happy Birthday, gently' },
];

export const isSynth = (id: string): id is SynthId => SYNTH_OPTIONS.some(m => m.id === id);

/** Song ids double as file names, so keep them URL-safe (also blocks path tricks). */
export const SONG_ID_RE = /^[a-z0-9][a-z0-9-]{0,39}$/;
export const isTrackId  = (v: unknown): v is TrackId => typeof v === 'string' && (isSynth(v) || SONG_ID_RE.test(v));
export const songFile   = (id: string) => `/music/${id}.mp3`;

export const DEFAULT_BALLOON_WORDS = BALLOON_PRESETS[0];
export const MIN_COMPLIMENTS = 3;
export const MAX_COMPLIMENTS = 6;
export const DEFAULT_COMPLIMENTS   = ['Forever yours 🤍', 'You make my world beautiful', 'You are my sunshine ☀️'];

export const INITIAL_FORM_DATA: WishFormData = {
  birthdayPersonName: '',
  nickname:           '',
  senderName:         '',
  birthdayDate:       '',
  milestone:          '',
  relationship:       '',
  photos:             [],
  balloonWords:       [...DEFAULT_BALLOON_WORDS],
  compliments:        [...DEFAULT_COMPLIMENTS],
  message:            '',
  favoriteMemory:     '',
  qualities:          [],
  finalNote:          '',
  signoff:            'Forever Yours 💕',
  notesSeeded:        false,
  themeColor:         'pink',
  musicTrack:         'dreamy',
};

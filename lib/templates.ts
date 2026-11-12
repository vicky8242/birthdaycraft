import type { Relationship } from './types';

/**
 * Starter texts for the letter step. They are pre-filled (and fully editable) so nobody
 * faces a blank page. The scene already prints "Dear <name>," above the letter, so letters don't start with a greeting.
 * Keep every text under 600 characters (the field limit).
 */

type Key = Relationship | 'default';

const LETTERS: Record<Key, string[]> = {
  partner: [
    "Every day with you feels like a little celebration. You make the ordinary moments magical and the hard days feel lighter. Thank you for your smile, your patience and the way you love me. I am so lucky to be yours. Today is all about you, and I hope it is as beautiful as you are. 💕",
    "Somewhere between the late-night talks and the silly laughs, you became my favourite person. You light up every room you walk into, and my whole world with it. I hope this year brings you everything your heart wishes for, and I promise to be right beside you for all of it. 🌹",
  ],
  bestfriend: [
    "You know all my secrets, all my silly stories and still you stick around. Thank you for every laugh, every pep talk and every random plan that turned into a memory. Life is so much better with you in it. Today is your day, so eat the cake, take the photos and shine like you always do! 🎉",
    "Friends come and go, but you turned out to be family. Thank you for always being there, for the honest advice and the endless jokes. I hope this birthday is full of everything you love, and that this year is the best one yet. I am always in your corner. 💖",
  ],
  friend: [
    "You have a way of making everyone around you feel happy and welcome. Thank you for the laughs, the kindness and all the good times. I hope today is filled with cake, surprises and people who adore you, because you truly deserve every bit of it. 🎂",
    "Having you as a friend is one of the nicest things in my life. You bring so much warmth and joy wherever you go. I wish you a year full of good health, big smiles and dreams coming true. Enjoy every moment of your special day! ✨",
  ],
  sibling: [
    "We have fought over the silliest things and laughed over even sillier ones, and I would not trade a single moment. You have always had my back, and I will always have yours. I hope today is as awesome as you are. Thank you for being my partner in everything. 🤗",
    "Growing up with you has been the best part of my life. You make me laugh, you make me crazy and you make me proud. I hope this birthday brings you all the happiness you give to the rest of us. Love you always. 💛",
  ],
  parent: [
    "Everything good in me started with you. Thank you for your endless love, your sacrifices and the way you always believed in me. No words can ever say how grateful I am. I hope today fills your heart with joy, because you deserve the world and more. 🙏",
    "You have been my guide, my strength and my safe place. Thank you for every lesson, every hug and every blessing. May this year bring you health, peace and all the happiness you have given me. I am so proud to be yours. 🌸",
  ],
  colleague: [
    "It is a pleasure working with you. Your kindness, energy and positive attitude make the whole team better. Thank you for always being so helpful and supportive. I hope your birthday is full of joy, good food and well-earned rest. Wishing you a wonderful year ahead! 🌟",
    "You bring so much good energy to everything you do, and it does not go unnoticed. Thank you for being such a great teammate and friend. I hope today is full of smiles, cake and celebration. Here is to another fantastic year! 🎈",
  ],
  default: [
    "Every moment with you feels like a celebration. You light up every room you walk into, and I feel so lucky to have you in my life. Thank you for every laugh, every hug and every little thing that makes ordinary days feel magical. I hope today brings you all the happiness you deserve. 💕",
    "Some people make the world a little brighter just by being in it, and you are one of them. Thank you for your kindness, your smile and the memories we share. I hope this year is full of beautiful surprises and every wish of yours comes true. 🌸",
  ],
};

const CLOSINGS: Record<Key, string[]> = {
  partner: [
    "No matter where life takes us, I will always be right here, loving you more every day. Happy Birthday, my love. 🌹",
    "You are my today and all of my tomorrows. Happy Birthday, my heart. Forever yours. 💕",
  ],
  bestfriend: [
    "No matter how far or how busy life gets, I will always be your biggest fan. Happy Birthday, my favourite human! 💗",
    "Here is to more laughs, more memories and more chaos together. Happy Birthday, bestie! 🥳",
  ],
  friend: [
    "Thank you for being you. Wishing you a year as wonderful as you are. Happy Birthday! 🎉",
    "May this year be your best one yet. Happy Birthday, and enjoy every second of it! 🌟",
  ],
  sibling: [
    "Wherever life takes us, I will always be your biggest supporter. Happy Birthday, you star! 🤍",
    "Thank you for always being there. Love you more than words can say. Happy Birthday! 🎂",
  ],
  parent: [
    "Thank you for everything. I love you more than words can ever say. Happy Birthday! 🙏",
    "May God give you all the happiness you have given me. Happy Birthday, with all my love. 🌷",
  ],
  colleague: [
    "Wishing you a fantastic year ahead, full of success and joy. Happy Birthday! 🌟",
    "Thank you for being such a wonderful teammate. Enjoy your special day. Happy Birthday! 🎈",
  ],
  default: [
    "No matter where life takes us, I will always be here cheering for you. You deserve every happiness. Happy Birthday! 🌹",
    "May this year bring you smiles, success and everything your heart desires. Happy Birthday! 🎂",
  ],
};

const key = (r: Relationship | ''): Key => (r && r in LETTERS ? r : 'default');

export const letterCount  = (r: Relationship | '') => LETTERS[key(r)].length;
export const closingCount = (r: Relationship | '') => CLOSINGS[key(r)].length;

/** The nth starter letter for this relationship (wraps around). */
export function letterTemplate(r: Relationship | '', n = 0): string {
  const list = LETTERS[key(r)];
  return list[((n % list.length) + list.length) % list.length];
}

export function closingTemplate(r: Relationship | '', n = 0): string {
  const list = CLOSINGS[key(r)];
  return list[((n % list.length) + list.length) % list.length];
}

/** True when the text is exactly one of our starter texts (so we know it is safe to swap it). */
export function isTemplate(text: string, kind: 'letter' | 'closing'): boolean {
  const t = text.trim();
  const all = Object.values(kind === 'letter' ? LETTERS : CLOSINGS).flat();
  return all.includes(t);
}

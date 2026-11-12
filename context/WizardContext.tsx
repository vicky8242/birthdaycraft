'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { WishFormData, INITIAL_FORM_DATA, UploadedPhoto } from '@/lib/types';

interface WizardContextType {
  step:       number;
  totalSteps: number;
  formData:   WishFormData;
  wishSlug:   string | null;
  shareUrl:   string | null;

  setStep:      (s: number) => void;
  nextStep:     () => void;
  prevStep:     () => void;
  update:       (patch: Partial<WishFormData>) => void;
  addPhoto:     (photo: UploadedPhoto) => void;
  removePhoto:  (id: string) => void;
  toggleQuality:(q: string) => void;
  setBalloonWord: (i: number, v: string) => void;
  setCompliment:  (i: number, v: string) => void;
  reset:        () => void;
  setWishSlug:  (slug: string) => void;
  setShareUrl:  (url: string) => void;
}

const WizardContext = createContext<WizardContextType | null>(null);

const DRAFT_KEY   = 'birthdaybliss:draft:v2';
export const MAX_PHOTOS = 5;

export function WizardProvider({ children }: { children: ReactNode }) {
  const [step,     setStepState] = useState(1);
  const [formData, setFormData]  = useState<WishFormData>(INITIAL_FORM_DATA);
  const [wishSlug, setWishSlug]  = useState<string | null>(null);
  const [shareUrl, setShareUrl]  = useState<string | null>(null);
  const hydrated = useRef(false);

  const totalSteps = 6;

  // ── restore an unfinished draft (text only – photos are too big for localStorage) ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { formData?: Partial<WishFormData>; step?: number };
        if (saved.formData) setFormData(d => ({ ...d, ...saved.formData, photos: [] }));
        if (saved.step && saved.step >= 1 && saved.step <= totalSteps - 1) setStepState(saved.step);
      }
    } catch { /* ignore corrupt drafts */ }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    const t = window.setTimeout(() => {
      try {
        const { photos, ...rest } = formData;
        void photos;
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ formData: rest, step: Math.min(step, totalSteps - 1) }));
      } catch { /* storage full / blocked */ }
    }, 400);
    return () => window.clearTimeout(t);
  }, [formData, step]);

  const setStep  = useCallback((s: number) => {
    setStepState(Math.max(1, Math.min(s, totalSteps)));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const nextStep = useCallback(() => setStep(step + 1), [setStep, step]);
  const prevStep = useCallback(() => setStep(step - 1), [setStep, step]);

  const update = useCallback((patch: Partial<WishFormData>) => {
    setFormData(d => ({ ...d, ...patch }));
  }, []);

  const addPhoto = useCallback((photo: UploadedPhoto) => {
    setFormData(d => ({
      ...d,
      photos: d.photos.length < MAX_PHOTOS ? [...d.photos, photo] : d.photos,
    }));
  }, []);

  const removePhoto = useCallback((id: string) => {
    setFormData(d => ({ ...d, photos: d.photos.filter(p => p.id !== id) }));
  }, []);

  const toggleQuality = useCallback((q: string) => {
    setFormData(d => ({
      ...d,
      qualities: d.qualities.includes(q)
        ? d.qualities.filter(x => x !== q)
        : d.qualities.length < 8 ? [...d.qualities, q] : d.qualities,
    }));
  }, []);

  const setBalloonWord = useCallback((i: number, v: string) => {
    setFormData(d => ({ ...d, balloonWords: d.balloonWords.map((w, j) => (j === i ? v : w)) }));
  }, []);

  const setCompliment = useCallback((i: number, v: string) => {
    setFormData(d => ({ ...d, compliments: d.compliments.map((w, j) => (j === i ? v : w)) }));
  }, []);

  const reset = useCallback(() => {
    setStepState(1);
    setFormData(INITIAL_FORM_DATA);
    setWishSlug(null);
    setShareUrl(null);
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
  }, []);

  return (
    <WizardContext.Provider value={{
      step, totalSteps, formData, wishSlug, shareUrl,
      setStep, nextStep, prevStep,
      update, addPhoto, removePhoto, toggleQuality, setBalloonWord, setCompliment,
      reset, setWishSlug, setShareUrl,
    }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be used inside WizardProvider');
  return ctx;
}

'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useWizard, MAX_PHOTOS } from '@/context/WizardContext';
import { StepNav } from '@/components/ui';
import { compressImage } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function StepPhotos() {
  const { formData, addPhoto, removePhoto, nextStep, prevStep } = useWizard();
  const [busy, setBusy] = useState(false);

  const onDrop = useCallback(async (accepted: File[]) => {
    const slots = MAX_PHOTOS - formData.photos.length;
    if (slots <= 0) { toast.error(`Maximum ${MAX_PHOTOS} photos allowed 📸`); return; }

    setBusy(true);
    for (const file of accepted.slice(0, slots)) {
      if (file.size > 15 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 15MB)`);
        continue;
      }
      try {
        const dataUrl = await compressImage(file);
        addPhoto({ id: `${Date.now()}_${Math.random().toString(36).slice(2)}`, dataUrl, uploading: false });
      } catch {
        toast.error(`Could not read ${file.name}`);
      }
    }
    setBusy(false);
  }, [formData.photos.length, addPhoto]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:   { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    multiple: true,
  });

  return (
    <div className="step-card">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          className="text-5xl mb-3"
        >
          📸
        </motion.div>
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-2">
          Add Your Memories
        </h2>
        <p className="text-white/60">
          They flip through as cute polaroids in the surprise 💕
          <span className="ml-2 text-white/40 text-sm">({formData.photos.length}/{MAX_PHOTOS})</span>
        </p>
      </div>

      {/* Drop Zone */}
      {formData.photos.length < MAX_PHOTOS && (
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer
            transition-all duration-300 mb-6
            ${isDragActive
              ? 'border-rose-400 bg-rose-500/10 scale-[1.02] drop-zone-active'
              : 'border-white/15 hover:border-rose-400/40 hover:bg-white/[0.03]'
            }
          `}
        >
          <input {...getInputProps()} aria-label="Upload photos" />
          <div className="text-4xl mb-3">{busy ? '⏳' : isDragActive ? '📂' : '📷'}</div>
          <h3 className="font-bold text-white mb-1.5">
            {busy ? 'Getting your photos ready…' : isDragActive ? 'Drop your photos here!' : 'Drag & Drop Photos'}
          </h3>
          <p className="text-white/50 text-sm mb-4">or tap to choose from your gallery</p>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500/20 to-pink-600/20 border border-rose-400/30 text-rose-300 text-sm font-semibold px-5 py-2.5 rounded-full">
            📁 Browse Photos
          </div>
          <p className="text-white/35 text-xs mt-4">
            JPG, PNG, WebP · Up to {MAX_PHOTOS} photos · Resized automatically
          </p>
        </div>
      )}

      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <AnimatePresence>
          {formData.photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{    opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.35, type: 'spring', bounce: 0.3 }}
              className="relative aspect-square rounded-2xl overflow-hidden group bg-white p-1.5 shadow-lg"
              style={{ rotate: i % 2 ? 1.5 : -1.5 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.dataUrl || photo.url} alt={`Memory ${i + 1}`} className="w-full h-full object-cover rounded-xl" />

              <button
                onClick={() => removePhoto(photo.id)}
                aria-label={`Remove photo ${i + 1}`}
                className="absolute top-2 right-2 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-500/80 transition-colors"
              >
                ✕
              </button>

              <div className="absolute top-2 left-2 w-6 h-6 bg-gradient-to-br from-rose-500 to-pink-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {i + 1}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {formData.photos.length === 0 && (
        <p className="text-center text-white/45 text-sm mb-6">
          No photos? No problem — you can skip this step 💕
        </p>
      )}

      <StepNav
        onBack={prevStep}
        onNext={nextStep}
        nextLabel={formData.photos.length ? 'Balloons & Roses' : 'Skip photos'}
      />
    </div>
  );
}

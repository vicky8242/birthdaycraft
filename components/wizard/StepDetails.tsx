'use client';

import { useWizard } from '@/context/WizardContext';
import { Input, StepNav, PillGroup, OptionalBadge } from '@/components/ui';
import { MILESTONE_OPTIONS, RELATIONSHIP_OPTIONS } from '@/lib/types';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function StepDetails() {
  const { formData, update, nextStep } = useWizard();

  function handleNext() {
    if (!formData.birthdayPersonName.trim()) {
      toast.error('Please enter the birthday person\'s name 🎂');
      return;
    }
    if (!formData.senderName.trim()) {
      toast.error('Please enter your name 💕');
      return;
    }
    nextStep();
  }

  return (
    <div className="step-card">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="text-5xl mb-3"
        >
          🎂
        </motion.div>
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-2">
          Let&apos;s Start the Magic!
        </h2>
        <p className="text-white/50">Tell us about the birthday star and you 💕</p>
      </div>

      <div className="space-y-8">
        {/* Names row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Birthday Person's Name"
            icon="🎁"
            placeholder="e.g. Priya, Rahul, Sarah..."
            value={formData.birthdayPersonName}
            onChange={e => update({ birthdayPersonName: e.target.value })}
            maxLength={50}
            hint="The star of the show 🌟"
          />
          <Input
            label="Your Name"
            icon="💝"
            placeholder="Your name..."
            value={formData.senderName}
            onChange={e => update({ senderName: e.target.value })}
            maxLength={50}
            hint="Who's sending all this love? 💕"
          />
        </div>

        <Input
          label="What do you call them?"
          icon="🧸"
          placeholder="e.g. Anu, Babu, Chotu… (shown in the surprise)"
          value={formData.nickname}
          onChange={e => update({ nickname: e.target.value })}
          maxLength={30}
          hint="Optional — if filled, the surprise will say this instead of their name 💕"
          optional
        />

        {/* Birthday Date */}
        <div>
          <label className="text-sm font-semibold text-white/80 flex items-center gap-2 mb-1.5">
            <span>📅</span> Birthday Date <OptionalBadge />
          </label>
          <input
            type="date"
            value={formData.birthdayDate}
            onChange={e => update({ birthdayDate: e.target.value })}
            className="glass-input w-full px-4 py-3.5 text-base md:w-64 cursor-pointer"
          />
        </div>

        {/* Milestone */}
        <div>
          <label className="text-sm font-semibold text-white/80 flex items-center gap-2 mb-3">
            <span>🎊</span> Milestone Birthday <OptionalBadge />
          </label>
          <PillGroup
            options={MILESTONE_OPTIONS}
            value={formData.milestone}
            onChange={v => update({ milestone: formData.milestone === v ? '' : v })}
          />
          {/* Custom milestone */}
          <input
            type="text"
            placeholder="Or type a custom milestone (e.g. 35th)..."
            value={MILESTONE_OPTIONS.some(o => o.value === formData.milestone) ? '' : formData.milestone}
            onChange={e => update({ milestone: e.target.value })}
            className="glass-input w-full px-4 py-3 text-sm mt-3"
            maxLength={10}
          />
        </div>

        {/* Relationship */}
        <div>
          <label className="text-sm font-semibold text-white/80 flex items-center gap-2 mb-3">
            <span>💞</span> Your Relationship <OptionalBadge />
          </label>
          <PillGroup
            options={RELATIONSHIP_OPTIONS}
            value={formData.relationship}
            onChange={v => update({ relationship: v })}
          />
        </div>
      </div>

      <StepNav showBack={false} onNext={handleNext} nextLabel="Add Photos" />
    </div>
  );
}

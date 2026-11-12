'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ── Reusable Button ────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'gold' | 'glass';
  size?:    'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const sizes = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-base',
    lg: 'px-10 py-5 text-lg',
  };

  const variants = {
    primary: cn(
      'relative overflow-hidden',
      'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600',
      'text-white font-bold rounded-full shadow-glow-pink',
      'hover:shadow-[0_8px_40px_rgba(244,63,122,0.6)] hover:scale-105',
      'active:scale-95 transition-all duration-300',
      'btn-shine'
    ),
    ghost: cn(
      'border border-white/20 text-white/80 rounded-full font-semibold',
      'hover:bg-white/10 hover:border-white/40 hover:text-white',
      'transition-all duration-200'
    ),
    gold: cn(
      'relative overflow-hidden',
      'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500',
      'text-gray-900 font-bold rounded-full shadow-glow-gold',
      'hover:shadow-[0_8px_40px_rgba(245,158,11,0.6)] hover:scale-105',
      'active:scale-95 transition-all duration-300'
    ),
    glass: cn(
      'bg-white/10 backdrop-blur-sm border border-white/20',
      'text-white font-semibold rounded-full',
      'hover:bg-white/20 hover:border-white/30',
      'transition-all duration-200'
    ),
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.96 }}
      className={cn(variants[variant], sizes[size], 'cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed', className)}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Processing...
        </span>
      ) : children}
    </motion.button>
  );
}

// ── Input ──────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:    React.ReactNode;
  hint?:     string;
  error?:    string;
  icon?:     string;
  optional?: boolean;
}

export function Input({ label, hint, error, icon, optional, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {label}
          {optional && <OptionalBadge />}
        </label>
      )}
      <input
        className={cn(
          'glass-input w-full px-4 py-3.5 text-base',
          error && 'border-red-400/60 focus:border-red-400',
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-white/40 pl-1">{hint}</p>}
      {error && <p className="text-xs text-red-400 pl-1">{error}</p>}
    </div>
  );
}

// ── Textarea ───────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?:    React.ReactNode;
  hint?:     string;
  error?:    string;
  icon?:     string;
  maxChars?: number;
  value?:    string;
}

export function Textarea({
  label, hint, error, icon, maxChars, value, className, ...props
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
            {icon && <span>{icon}</span>}
            {label}
          </label>
          {maxChars && (
            <span className={cn(
              'text-xs font-medium tabular-nums',
              (value?.length ?? 0) > maxChars * 0.85 ? 'text-rose-400' : 'text-white/30'
            )}>
              {value?.length ?? 0}/{maxChars}
            </span>
          )}
        </div>
      )}
      <textarea
        value={value}
        className={cn(
          'glass-input w-full px-4 py-3.5 text-base resize-none leading-relaxed',
          error && 'border-red-400/60',
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-white/40 pl-1">{hint}</p>}
      {error && <p className="text-xs text-red-400 pl-1">{error}</p>}
    </div>
  );
}

// ── Badge ──────────────────────────────────────────────────────────────────
export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold',
      'bg-white/10 border border-white/15 text-white/80 backdrop-blur-sm',
      className
    )}>
      {children}
    </span>
  );
}

// ── Section Divider ────────────────────────────────────────────────────────
export function Divider({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

// ── Step Navigation ────────────────────────────────────────────────────────
interface StepNavProps {
  onBack?:     () => void;
  onNext?:     () => void;
  nextLabel?:  string;
  nextIcon?:   string;
  loading?:    boolean;
  backLabel?:  string;
  showBack?:   boolean;
}

export function StepNav({
  onBack,
  onNext,
  nextLabel = 'Continue',
  nextIcon  = '→',
  loading   = false,
  backLabel = '← Back',
  showBack  = true,
}: StepNavProps) {
  return (
    <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
      <div>
        {showBack && onBack && (
          <button
            onClick={onBack}
            className="text-white/50 hover:text-white font-semibold text-sm transition-colors flex items-center gap-2"
          >
            {backLabel}
          </button>
        )}
      </div>
      {onNext && (
        <Button onClick={onNext} loading={loading} size="md">
          {nextLabel} {nextIcon}
        </Button>
      )}
    </div>
  );
}

// ── Optional Badge ─────────────────────────────────────────────────────────
export function OptionalBadge() {
  return (
    <span className="ml-2 text-xs font-normal text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
      optional
    </span>
  );
}

// ── Select Pills ───────────────────────────────────────────────────────────
interface PillGroupProps<T extends string> {
  options:   { label: string; value: T }[];
  value:     T | '';
  onChange:  (v: T) => void;
  className?: string;
}

export function PillGroup<T extends string>({
  options, value, onChange, className
}: PillGroupProps<T>) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200',
            value === opt.value
              ? 'bg-gradient-to-r from-rose-500 to-pink-600 border-transparent text-white shadow-glow-pink scale-105'
              : 'border-white/15 text-white/60 hover:border-rose-400/40 hover:text-white/90 hover:bg-white/5'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

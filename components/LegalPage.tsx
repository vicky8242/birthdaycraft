import Link from 'next/link';
import { ReactNode } from 'react';

/** Shared shell for the Privacy / Terms pages. */
export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <main className="min-h-screen px-4 sm:px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 mb-8 text-white/60 hover:text-white transition-colors text-sm">
          ← <span className="font-dancing text-xl font-bold gradient-text">BirthdayBliss</span>
        </Link>
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-1">{title}</h1>
        <p className="text-white/40 text-sm mb-8">Last updated {updated}</p>
        <div className="glass-card p-6 sm:p-8 space-y-6 text-white/70 text-[0.95rem] leading-relaxed [&_h2]:font-bold [&_h2]:text-white [&_h2]:text-lg [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_a]:text-rose-300 [&_a]:underline">
          {children}
        </div>
      </div>
    </main>
  );
}

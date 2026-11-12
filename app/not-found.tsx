import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center px-6 text-center">
      <div>
        <div className="text-6xl mb-4 animate-bounce-soft">🎈</div>
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-2">This surprise has floated away</h1>
        <p className="text-white/55 mb-8 max-w-sm mx-auto">
          We couldn’t find that page. If someone sent you a link, double-check it was copied completely.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary px-6 py-3 rounded-2xl font-bold text-white">Go home</Link>
          <Link href="/create" className="px-6 py-3 rounded-2xl font-bold text-white/80 border border-white/15 hover:bg-white/5 transition-colors">
            Make a surprise
          </Link>
        </div>
      </div>
    </main>
  );
}

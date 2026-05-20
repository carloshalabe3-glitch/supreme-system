import Link from 'next/link';

export default function BlogHeader() {
  return (
    <header className="border-b border-zinc-800 sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-lg tracking-tight hover:text-indigo-300 transition-colors">
          The Dev Blog
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-zinc-400 hover:text-white text-sm transition-colors">
            Articles
          </Link>
          <Link href="/about" className="text-zinc-400 hover:text-white text-sm transition-colors">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}

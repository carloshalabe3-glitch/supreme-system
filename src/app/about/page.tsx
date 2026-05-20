import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: 'About The Dev Blog',
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-6">About</h1>
      <div className="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          The Dev Blog is a place for practical, no-nonsense articles on React, TypeScript, CSS,
          and everything else that makes up the modern web platform.
        </p>
        <p>
          Every post is written by working engineers and focuses on real problems you'll encounter
          in production—not toy examples. We value depth over breadth, and correctness over hype.
        </p>
        <p>
          Topics include React Server Components, TypeScript patterns, CSS architecture, browser
          APIs, developer tools, accessibility, and web performance.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {[
          { name: 'Alex Rivera', bio: 'Full-stack engineer focused on React and the modern web.' },
          { name: 'Sam Chen', bio: 'Frontend developer passionate about CSS and accessibility.' },
          { name: 'Jordan Kim', bio: 'TypeScript enthusiast and open-source contributor.' },
        ].map((author) => (
          <div key={author.name} className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold mb-3">
              {author.name[0]}
            </div>
            <p className="text-white font-semibold text-sm mb-1">{author.name}</p>
            <p className="text-zinc-500 text-xs leading-relaxed">{author.bio}</p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm transition-colors font-medium"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Read the articles
        </Link>
      </div>
    </div>
  );
}

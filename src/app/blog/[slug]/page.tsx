import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPosts, getPostBySlug, formatDate } from '@/lib/posts';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = post.content.split('\n\n');

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm mb-10 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All articles
      </Link>

      <header className="mb-10">
        <div className="flex flex-wrap gap-2 mb-5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
          {post.title}
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed mb-6">{post.excerpt}</p>
        <div className="flex items-center gap-4 text-sm text-zinc-500 border-t border-zinc-800 pt-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold text-sm">
              {post.author[0]}
            </div>
            <div>
              <p className="text-white font-medium text-sm">{post.author}</p>
              <p className="text-zinc-500 text-xs">{post.authorBio}</p>
            </div>
          </div>
          <div className="ml-auto text-right">
            <p>{formatDate(post.date)}</p>
            <p className="text-zinc-600">{post.readTime} min read</p>
          </div>
        </div>
      </header>

      <article className="prose-blog">
        {paragraphs.map((block, i) => {
          const trimmed = block.trim();
          if (!trimmed) return null;

          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={i} className="text-xl font-bold text-white mt-10 mb-4">
                {trimmed.slice(3)}
              </h2>
            );
          }

          if (trimmed.startsWith('```')) {
            const lines = trimmed.split('\n');
            const code = lines.slice(1, lines.length - 1).join('\n');
            return (
              <pre key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 overflow-x-auto my-6">
                <code className="text-zinc-300 text-sm font-mono leading-relaxed">{code}</code>
              </pre>
            );
          }

          if (trimmed.startsWith('- ')) {
            const items = trimmed.split('\n').filter((l) => l.startsWith('- '));
            return (
              <ul key={i} className="list-disc list-inside space-y-2 my-4 text-zinc-300">
                {items.map((item, j) => (
                  <li key={j} className="leading-relaxed">
                    {renderInline(item.slice(2))}
                  </li>
                ))}
              </ul>
            );
          }

          if (/^\d+\./.test(trimmed)) {
            const items = trimmed.split('\n').filter((l) => /^\d+\./.test(l));
            return (
              <ol key={i} className="list-decimal list-inside space-y-2 my-4 text-zinc-300">
                {items.map((item, j) => (
                  <li key={j} className="leading-relaxed">
                    {renderInline(item.replace(/^\d+\.\s*/, ''))}
                  </li>
                ))}
              </ol>
            );
          }

          return (
            <p key={i} className="text-zinc-300 leading-relaxed my-4">
              {renderInline(trimmed)}
            </p>
          );
        })}
      </article>

      <div className="mt-16 pt-8 border-t border-zinc-800">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm transition-colors font-medium"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to all articles
        </Link>
      </div>
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="bg-zinc-800 text-indigo-300 px-1.5 py-0.5 rounded text-sm font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

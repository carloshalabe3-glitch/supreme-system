import Link from 'next/link';
import { Post, formatDate } from '@/lib/posts';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group block bg-zinc-900 rounded-2xl p-8 border border-zinc-800 hover:border-indigo-500/50 transition-all duration-200"
      >
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400"
            >
              {tag}
            </span>
          ))}
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400">
            Featured
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors leading-snug">
          {post.title}
        </h2>
        <p className="text-zinc-400 text-base leading-relaxed mb-6">{post.excerpt}</p>
        <div className="flex items-center justify-between text-sm text-zinc-500">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold text-xs">
              {post.author[0]}
            </div>
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{formatDate(post.date)}</span>
            <span>&middot;</span>
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-zinc-900 rounded-2xl p-6 border border-zinc-800 hover:border-indigo-500/50 transition-all duration-200"
    >
      <div className="flex flex-wrap gap-2 mb-3">
        {post.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>
      <h2 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors leading-snug">
        {post.title}
      </h2>
      <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>{post.author}</span>
        <div className="flex items-center gap-2">
          <span>{formatDate(post.date)}</span>
          <span>&middot;</span>
          <span>{post.readTime} min</span>
        </div>
      </div>
    </Link>
  );
}

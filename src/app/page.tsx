import { getAllPosts } from '@/lib/posts';
import PostCard from '@/components/PostCard';

export default function HomePage() {
  const posts = getAllPosts();
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">The Dev Blog</h1>
        <p className="text-zinc-400 text-lg">
          Practical articles on React, TypeScript, CSS, and the modern web.
        </p>
      </div>

      {featured && (
        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
            Featured
          </h2>
          <PostCard post={featured} featured />
        </section>
      )}

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
          Latest Articles
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {rest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}

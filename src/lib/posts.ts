export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  authorBio: string;
  tags: string[];
  readTime: number;
  featured?: boolean;
}

export const posts: Post[] = [
  {
    slug: 'understanding-react-server-components',
    title: 'Understanding React Server Components',
    excerpt:
      'React Server Components fundamentally change how we think about rendering. Here\'s everything you need to know to get started.',
    date: '2026-05-18',
    author: 'Alex Rivera',
    authorBio: 'Full-stack engineer with a focus on React and the modern web.',
    tags: ['React', 'Next.js', 'Performance'],
    readTime: 6,
    featured: true,
    content: `
React Server Components (RSCs) let you render components on the server without shipping their JavaScript to the client. This isn't just server-side rendering—it's a fundamentally different model.

## The Core Idea

Traditional React components run in the browser. Server Components run *only* on the server. The client receives rendered output, not component code. This means:

- Zero JavaScript bundle contribution from server components
- Direct access to databases, file systems, and server-only APIs
- No need for \`useEffect\` or loading states for initial data

## Client vs. Server Components

By default, all components in the App Router are Server Components. To opt into client-side interactivity, you add \`'use client'\` at the top of the file.

\`\`\`tsx
// Server Component — runs on the server, no JS sent to client
async function PostList() {
  const posts = await db.posts.findMany();
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}

// Client Component — runs in the browser
'use client';
function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>Like</button>;
}
\`\`\`

## Composition Rules

You can import a Client Component inside a Server Component, but not the other way around. However, you *can* pass Server Components as children to Client Components.

\`\`\`tsx
// This works: Server wraps Client with children
function ServerPage() {
  return (
    <ClientShell>
      <ServerContent />
    </ClientShell>
  );
}
\`\`\`

## When to Use Each

Use Server Components for data fetching, database access, sensitive logic, and anything that doesn't need interactivity. Use Client Components for event handlers, browser APIs, \`useState\`, and \`useEffect\`.

The rule of thumb: push interactivity to the leaves of your component tree.

## Performance Impact

A real-world Next.js app using RSCs aggressively can ship **40–60% less JavaScript** to the browser. That translates directly into faster Time to Interactive—especially on mobile devices.

Server Components are the future of React rendering. Start small: convert your data-fetching components first, and work your way up.
    `.trim(),
  },
  {
    slug: 'css-container-queries-in-practice',
    title: 'CSS Container Queries in Practice',
    excerpt:
      'Media queries respond to the viewport. Container queries respond to the element\'s parent. Here\'s why that matters and how to use them today.',
    date: '2026-05-12',
    author: 'Sam Chen',
    authorBio: 'Frontend developer passionate about CSS, design systems, and accessibility.',
    tags: ['CSS', 'Frontend', 'Design'],
    readTime: 4,
    content: `
For years, responsive design meant one thing: media queries keyed to the viewport width. That worked well for page-level layouts, but fell apart for reusable components dropped into unpredictable containers.

Container queries fix this.

## What They Are

A container query lets a component respond to the size of its *containing element* rather than the viewport.

\`\`\`css
.card-wrapper {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 120px 1fr;
  }
}
\`\`\`

Now \`.card\` will switch to a two-column layout whenever its parent is at least 400px wide—regardless of the viewport.

## Why This Is a Big Deal

Imagine a \`<ProductCard>\` component used in three places:

1. A full-width hero section
2. A two-column grid
3. A sidebar

With media queries, you'd need hacky overrides or duplicated CSS for each context. With container queries, the card *knows* its own available space and adapts automatically.

## Named Containers

You can name containers for more explicit targeting:

\`\`\`css
.sidebar {
  container: sidebar / inline-size;
}

@container sidebar (max-width: 240px) {
  .widget { font-size: 0.875rem; }
}
\`\`\`

## Browser Support

Container queries now have **baseline support** across all major browsers. You can use them in production today without polyfills.

## Container Query Units

There are also new length units tied to the container:

- \`cqw\` — 1% of container width
- \`cqh\` — 1% of container height
- \`cqi\` — 1% of container inline size

\`\`\`css
.card-title {
  font-size: clamp(1rem, 4cqi, 1.5rem);
}
\`\`\`

Start replacing viewport-dependent component styles with container queries. Your design system will thank you.
    `.trim(),
  },
  {
    slug: 'typescript-satisfies-operator',
    title: 'The TypeScript `satisfies` Operator You\'ve Been Missing',
    excerpt:
      'TypeScript 4.9 introduced `satisfies`—a way to validate types without widening them. It\'s more useful than you think.',
    date: '2026-05-05',
    author: 'Jordan Kim',
    authorBio: 'TypeScript enthusiast and open-source contributor.',
    tags: ['TypeScript', 'JavaScript'],
    readTime: 5,
    content: `
TypeScript's type system is powerful, but sometimes assigning a type annotation is too aggressive—it widens the inferred type and loses precision. The \`satisfies\` operator solves this.

## The Problem

\`\`\`ts
type Route = {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
};

const routes = {
  home: { path: '/', method: 'GET' },
  login: { path: '/login', method: 'POST' },
} satisfies Record<string, Route>;

// TypeScript still knows routes.home.method is 'GET', not just string
routes.home.method; // type: "GET"
\`\`\`

Without \`satisfies\`, you'd annotate as \`Record<string, Route>\` and lose the literal type information. With \`satisfies\`, you validate *and* preserve precision.

## Real-World Example: Theme Config

\`\`\`ts
type Color = string;
type Theme = Record<string, Color | { light: Color; dark: Color }>;

const palette = {
  primary: '#6366f1',
  background: { light: '#ffffff', dark: '#09090b' },
} satisfies Theme;

// TypeScript knows background is an object, not just Color | {light, dark}
palette.background.dark; // ✓ — no error, type is string
\`\`\`

## Combining with \`as const\`

\`\`\`ts
const STATUS = {
  pending: 0,
  active: 1,
  archived: 2,
} as const satisfies Record<string, number>;

type Status = keyof typeof STATUS; // "pending" | "active" | "archived"
\`\`\`

This pattern gives you both the literal tuple of keys *and* the guarantee that all values are numbers.

## When to Reach for It

Use \`satisfies\` when you want to:

1. Validate an object against a type without widening it
2. Keep autocomplete and literal types on deeply nested values
3. Check that a config object conforms to an interface while preserving exact shapes

It's a small addition to the language with outsized ergonomic wins. Add it to your TypeScript toolkit today.
    `.trim(),
  },
  {
    slug: 'web-vitals-core-optimization-guide',
    title: 'A Practical Guide to Core Web Vitals Optimization',
    excerpt:
      'LCP, CLS, and INP are the metrics Google uses to rank your site. Here\'s a concrete checklist to improve all three.',
    date: '2026-04-28',
    author: 'Alex Rivera',
    authorBio: 'Full-stack engineer with a focus on React and the modern web.',
    tags: ['Performance', 'SEO', 'Web'],
    readTime: 7,
    content: `
Core Web Vitals are Google's user-experience metrics that directly influence search rankings. Here's what each one measures and exactly how to improve it.

## Largest Contentful Paint (LCP)

LCP measures how long it takes for the largest visible element to render. Target: **under 2.5 seconds**.

**Common culprits and fixes:**

- **Unoptimized hero images** → Use \`<img loading="eager" fetchpriority="high">\` on your above-the-fold image. Never lazy-load it.
- **Render-blocking resources** → Move non-critical CSS to \`<link rel="preload">\` or inline critical CSS.
- **Slow server response (TTFB)** → Use a CDN, enable HTTP/2, and add server-side caching.

\`\`\`html
<!-- Good: preload your LCP image -->
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high" />
\`\`\`

## Cumulative Layout Shift (CLS)

CLS measures visual stability—how much elements move around during page load. Target: **under 0.1**.

**Fixes:**

- Always specify \`width\` and \`height\` on \`<img>\` and \`<video>\` elements.
- Reserve space for ads and embeds with fixed-size containers.
- Avoid inserting content above existing content after load.

\`\`\`css
/* Reserve aspect ratio space */
.video-wrapper {
  aspect-ratio: 16 / 9;
}
\`\`\`

## Interaction to Next Paint (INP)

INP replaced FID in 2024. It measures responsiveness across *all* interactions, not just the first. Target: **under 200ms**.

**Fixes:**

- Break up long tasks with \`scheduler.yield()\` or \`setTimeout(fn, 0)\`.
- Debounce expensive event handlers.
- Virtualize long lists with \`@tanstack/virtual\`.
- Move heavy computation to Web Workers.

\`\`\`ts
async function handleClick() {
  updateUI(); // fast part
  await scheduler.yield(); // yield to browser
  await heavyComputation(); // slow part runs after paint
}
\`\`\`

## Tooling

- **Lighthouse** in Chrome DevTools for lab data
- **PageSpeed Insights** for real-world field data
- **Web Vitals Chrome Extension** for per-page measurement
- **Vercel Speed Insights** if you're on Vercel

Run Lighthouse on your five most important pages and fix the top three issues on each. That alone will get most sites to "Good" across all three metrics.
    `.trim(),
  },
  {
    slug: 'building-accessible-modals',
    title: 'Building Truly Accessible Modals',
    excerpt:
      'Most modal implementations break keyboard navigation and screen readers. Here\'s how to build one that works for everyone.',
    date: '2026-04-20',
    author: 'Sam Chen',
    authorBio: 'Frontend developer passionate about CSS, design systems, and accessibility.',
    tags: ['Accessibility', 'Frontend', 'HTML'],
    readTime: 5,
    content: `
Modals seem simple, but getting them right for keyboard and screen reader users requires deliberate effort. Here's the complete checklist.

## ARIA Roles and Attributes

A modal dialog needs:

\`\`\`html
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Confirm Delete</h2>
  <p id="modal-description">This action cannot be undone.</p>
</div>
\`\`\`

- \`role="dialog"\` announces it as a dialog to screen readers
- \`aria-modal="true"\` tells assistive tech to ignore content behind the modal
- \`aria-labelledby\` links the heading so users hear the title when the modal opens

## Focus Management

When the modal opens, move focus inside it. When it closes, return focus to the trigger.

\`\`\`ts
function openModal(triggerEl: HTMLElement, modalEl: HTMLElement) {
  const firstFocusable = modalEl.querySelector<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  firstFocusable?.focus();

  return function closeModal() {
    triggerEl.focus();
  };
}
\`\`\`

## Focus Trapping

Keyboard users must not be able to Tab out of the modal while it's open.

\`\`\`ts
function trapFocus(modalEl: HTMLElement) {
  const focusable = Array.from(
    modalEl.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  modalEl.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}
\`\`\`

## Closing on Escape and Backdrop Click

\`\`\`ts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

backdrop.addEventListener('click', closeModal);
\`\`\`

## Scroll Lock

Prevent the page from scrolling while the modal is open:

\`\`\`ts
document.body.style.overflow = 'hidden'; // open
document.body.style.overflow = ''; // close
\`\`\`

## Using the Native \`<dialog>\` Element

Modern browsers support \`<dialog>\` which handles some of this automatically:

\`\`\`html
<dialog id="my-dialog">
  <h2>Dialog Title</h2>
  <button autofocus>Close</button>
</dialog>
\`\`\`

\`\`\`ts
const dialog = document.getElementById('my-dialog') as HTMLDialogElement;
dialog.showModal(); // native focus trap + Escape handling
\`\`\`

The native dialog element still needs ARIA attributes and manual focus restoration on close, but it removes the need for custom focus trapping code.

Test every modal with a screen reader (VoiceOver on Mac, NVDA on Windows) and keyboard-only navigation before shipping.
    `.trim(),
  },
  {
    slug: 'git-worktrees-workflow',
    title: 'Git Worktrees: The Workflow Upgrade You\'re Overlooking',
    excerpt:
      'Switching branches to review a PR while mid-feature is painful. Git worktrees let you have multiple branches checked out simultaneously.',
    date: '2026-04-10',
    author: 'Jordan Kim',
    authorBio: 'TypeScript enthusiast and open-source contributor.',
    tags: ['Git', 'Developer Tools', 'Workflow'],
    readTime: 4,
    content: `
You're deep in a feature branch when a coworker's PR needs review. You stash, switch branches, set up the environment again, review, switch back, unstash—and lose your mental context in the process.

Git worktrees eliminate this friction.

## What Is a Worktree?

A worktree is a second (or third, or fourth) working directory linked to the same repository. Each worktree has its own branch checked out independently.

\`\`\`bash
# Create a worktree for a PR review
git worktree add ../project-pr-review origin/feature/new-dashboard

# Now you have two working directories:
# ~/project            → your feature branch
# ~/project-pr-review  → the PR branch
\`\`\`

Open both in separate editor windows. No stashing, no context switching.

## Common Workflows

**Reviewing a PR without losing your place:**
\`\`\`bash
git worktree add ../review-$(date +%s) origin/pr-branch
cd ../review-*
# review, run tests, done
git worktree remove ../review-*
\`\`\`

**Keeping a stable build alongside development:**
\`\`\`bash
git worktree add ../project-stable main
# Run the stable version while breaking changes live on main worktree
\`\`\`

**Hotfix while mid-feature:**
\`\`\`bash
git worktree add ../hotfix main
cd ../hotfix && git checkout -b hotfix/critical-fix
# Fix, commit, push, merge
git worktree remove ../hotfix
\`\`\`

## Listing and Removing Worktrees

\`\`\`bash
git worktree list        # see all active worktrees
git worktree remove PATH # remove a worktree
git worktree prune       # clean up stale refs
\`\`\`

## Caveats

- You cannot check out the same branch in two worktrees simultaneously.
- Some tools (especially older IDEs) don't handle multiple worktree paths gracefully.
- Node \`node_modules\` and build caches are not shared—you'll need to reinstall in each worktree.

For most developers, worktrees pay for themselves on the first PR review. Add \`git worktree add\` to your muscle memory.
    `.trim(),
  },
];

export function getAllPosts(): Post[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

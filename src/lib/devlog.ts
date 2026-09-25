/**
 * Dev log posts = Markdown files in src/content/devlog/.
 * File name → URL:  003-designing-the-fishing-system.md → /devlog/003-designing-the-fishing-system/
 * Frontmatter: number, title, date (YYYY-MM-DD or null), game (slug or null),
 *              status (published | soon), excerpt, tags.
 */

export interface DevlogPost {
  slug: string;
  number: number;
  /** "DEV LOG #003" */
  label: string;
  title: string;
  date: string | null;
  game: string | null;
  status: 'published' | 'soon';
  excerpt: string;
  tags: string[];
  html: string;
  minutes: number;
}

type MdModule = { meta: Record<string, unknown>; html: string };

const modules = import.meta.glob<MdModule>('../content/devlog/*.md', { eager: true });

const str = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));

export const POSTS: DevlogPost[] = Object.entries(modules)
  .map(([file, mod]) => {
    const slug = file.split('/').pop()!.replace(/\.md$/, '');
    const m = mod.meta;
    const number = typeof m.number === 'number' ? m.number : Number.parseInt(slug, 10) || 0;
    const words = mod.html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    return {
      slug,
      number,
      label: `Dev Log #${String(number).padStart(3, '0')}`,
      title: str(m.title) || slug,
      date: m.date ? str(m.date) : null,
      game: m.game ? str(m.game) : null,
      status: m.status === 'published' ? 'published' : 'soon',
      excerpt: str(m.excerpt),
      tags: Array.isArray(m.tags) ? m.tags.map(str) : [],
      html: mod.html,
      minutes: Math.max(1, Math.round(words / 220)),
    } satisfies DevlogPost;
  })
  .sort((a, b) => b.number - a.number);

export const PUBLISHED_POSTS = POSTS.filter((p) => p.status === 'published');

/** Display order everywhere: published entries (newest first), then the ones still in the works. */
export function displayOrder(posts: DevlogPost[]): DevlogPost[] {
  const published = posts.filter((p) => p.status === 'published').sort((a, b) => b.number - a.number);
  const soon = posts.filter((p) => p.status !== 'published').sort((a, b) => a.number - b.number);
  return [...published, ...soon];
}

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);

/** Posts for one game, including "coming soon" ones. */
export const postsForGame = (game: string) => displayOrder(POSTS.filter((p) => p.game === game));

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-09-25" → "Sep 25, 2026" (locale-independent so SSR and browser agree). */
export function formatDate(iso: string | null): string {
  if (!iso) return 'TBA';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

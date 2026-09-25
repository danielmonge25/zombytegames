import { GAMES, getGame, type Game } from './data/games';
import { SITE } from './data/site';
import { PUBLISHED_POSTS, getPost, type DevlogPost } from './lib/devlog';
import { normalizePath } from './lib/router';
import { absoluteUrl, type PageMeta } from './lib/meta';
import { paths } from './lib/paths';

export type Route =
  | { page: 'home' }
  | { page: 'games' }
  | { page: 'game'; game: Game }
  | { page: 'devlog' }
  | { page: 'post'; post: DevlogPost }
  | { page: 'not-found' };

export function matchRoute(pathname: string): Route {
  const p = normalizePath(pathname);
  if (p === '/') return { page: 'home' };
  if (p === '/games') return { page: 'games' };
  if (p === '/devlog') return { page: 'devlog' };
  let m = p.match(/^\/games\/([a-z0-9-]+)$/);
  if (m) {
    const game = getGame(m[1]);
    return game ? { page: 'game', game } : { page: 'not-found' };
  }
  m = p.match(/^\/devlog\/([a-z0-9-]+)$/);
  if (m) {
    const post = getPost(m[1]);
    return post && post.status === 'published' ? { page: 'post', post } : { page: 'not-found' };
  }
  return { page: 'not-found' };
}

/** Every URL that gets its own pre-rendered HTML file (also used for sitemap.xml). */
export function prerenderPaths(): string[] {
  return [paths.home, paths.games, ...GAMES.map((g) => paths.game(g.slug)), paths.devlog, ...PUBLISHED_POSTS.map((p) => paths.post(p.slug))];
}

const organization = {
  '@type': 'Organization',
  '@id': `${SITE.url}/#org`,
  name: SITE.name,
  url: `${SITE.url}/`,
  logo: absoluteUrl('/icon-512.png'),
  description: SITE.description,
};

export function metaFor(route: Route): PageMeta {
  switch (route.page) {
    case 'home':
      return {
        title: SITE.title,
        description: SITE.description,
        path: paths.home,
        jsonLd: [
          { '@context': 'https://schema.org', ...organization },
          { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: `${SITE.url}/`, publisher: { '@id': `${SITE.url}/#org` } },
        ],
      };
    case 'games':
      return {
        title: `Games · ${SITE.name}`,
        description: `Every game from ${SITE.name}: BLOODCAST (in development), Domino Dancing (concept), and whatever comes next.`,
        path: paths.games,
      };
    case 'game': {
      const g = route.game;
      return {
        title: g.seo.title,
        description: g.seo.description,
        path: paths.game(g.slug),
        image: g.seo.image,
        imageAlt: `${g.title} — ${g.tagline}`,
        preloadFonts: g.slug === 'bloodcast' ? ['/fonts/pirata-one-latin.woff2', '/fonts/cormorant-garamond-500-italic-latin.woff2'] : undefined,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'VideoGame',
            name: g.title,
            description: g.seo.description,
            url: absoluteUrl(paths.game(g.slug)),
            genre: g.genre,
            ...(g.slug === 'bloodcast' ? { playMode: 'MultiPlayer', gameEngine: 'Unity' } : { playMode: 'SinglePlayer' }),
            author: { '@id': `${SITE.url}/#org` },
            publisher: { '@id': `${SITE.url}/#org` },
          },
          { '@context': 'https://schema.org', ...organization },
        ],
      };
    }
    case 'devlog':
      return {
        title: `Dev Log · ${SITE.name}`,
        description: `The ${SITE.name} development journal: progress notes, experiments and lessons from building BLOODCAST and other games solo.`,
        path: paths.devlog,
      };
    case 'post': {
      const p = route.post;
      return {
        title: `${p.title} — ${p.label} · ${SITE.name}`,
        description: p.excerpt,
        path: paths.post(p.slug),
        type: 'article',
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: p.title,
            description: p.excerpt,
            url: absoluteUrl(paths.post(p.slug)),
            ...(p.date ? { datePublished: p.date } : {}),
            author: { '@type': 'Organization', name: SITE.name, url: `${SITE.url}/` },
            publisher: { '@id': `${SITE.url}/#org` },
          },
          { '@context': 'https://schema.org', ...organization },
        ],
      };
    }
    default:
      return {
        title: `Level not found · ${SITE.name}`,
        description: 'This page swam away. Head back to Zombyte Games.',
        path: '/404.html',
        noindex: true,
      };
  }
}

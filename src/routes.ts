import { GAMES } from './data/games';
import { CONTACT_LINKS, OWNER, SITE } from './data/site';
import { normalizePath } from './lib/router';
import { absoluteUrl, type PageMeta } from './lib/meta';
import { paths } from './lib/paths';

/** The site is a one-pager: the home page, plus a 404 for anything else. */
export type Route = { page: 'home' } | { page: 'not-found' };

export function matchRoute(pathname: string): Route {
  return normalizePath(pathname) === '/' ? { page: 'home' } : { page: 'not-found' };
}

/** Every URL that gets its own pre-rendered HTML file (also used for sitemap.xml). */
export function prerenderPaths(): string[] {
  return [paths.home];
}

const person = {
  '@type': 'Person',
  '@id': `${SITE.url}/#person`,
  name: OWNER.name,
  jobTitle: OWNER.role,
  nationality: { '@type': 'Country', name: OWNER.country },
  url: `${SITE.url}/`,
  sameAs: CONTACT_LINKS.filter((l) => l.id === 'linkedin' && l.url).map((l) => l.url),
};

const organization = {
  '@type': 'Organization',
  '@id': `${SITE.url}/#org`,
  name: SITE.name,
  url: `${SITE.url}/`,
  logo: absoluteUrl('/icon-512.png'),
  description: SITE.description,
  sameAs: CONTACT_LINKS.filter((l) => l.id === 'youtube' && l.url).map((l) => l.url),
  founder: { '@id': `${SITE.url}/#person` },
};

export function metaFor(route: Route): PageMeta {
  if (route.page === 'home') {
    return {
      title: SITE.title,
      description: SITE.description,
      path: paths.home,
      preloadFonts: ['/fonts/pirata-one-latin.woff2'],
      jsonLd: [
        { '@context': 'https://schema.org', ...organization },
        { '@context': 'https://schema.org', ...person },
        { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: `${SITE.url}/`, publisher: { '@id': `${SITE.url}/#org` } },
        ...GAMES.map((g) => ({
          '@context': 'https://schema.org',
          '@type': 'VideoGame',
          name: g.title,
          description: g.summary,
          url: absoluteUrl(paths.game(g.slug)),
          genre: g.genre,
          author: { '@id': `${SITE.url}/#org` },
        })),
      ],
    };
  }
  return {
    title: `Level not found · ${SITE.name}`,
    description: 'This page swam away. Head back to Zombyte Games.',
    path: '/',
    noindex: true,
  };
}

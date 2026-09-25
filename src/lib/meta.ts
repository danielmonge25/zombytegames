import { SITE } from '../data/site';

/** Everything that goes into <head> for one page. */
export interface PageMeta {
  title: string;
  description: string;
  /** Canonical path, e.g. "/". */
  path: string;
  /** Social preview image path under public/, e.g. "/og/og-bloodcast.png" (1200×630). */
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[];
  /** Extra fonts used above the fold on this page (preloaded to avoid layout shift). */
  preloadFonts?: string[];
}

export const absoluteUrl = (path: string) => new URL(path, SITE.url).href;

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function tagList(meta: PageMeta) {
  const url = absoluteUrl(meta.path);
  const image = absoluteUrl(meta.image ?? SITE.ogImage);
  const imageAlt = meta.imageAlt ?? SITE.ogImageAlt;
  return {
    url,
    metas: [
      ['name', 'description', meta.description],
      ['name', 'robots', meta.noindex ? 'noindex, follow' : 'index, follow'],
      ['property', 'og:site_name', SITE.name],
      ['property', 'og:type', meta.type ?? 'website'],
      ['property', 'og:locale', 'en_US'],
      ['property', 'og:title', meta.title],
      ['property', 'og:description', meta.description],
      ['property', 'og:url', url],
      ['property', 'og:image', image],
      ['property', 'og:image:width', '1200'],
      ['property', 'og:image:height', '630'],
      ['property', 'og:image:alt', imageAlt],
      ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:title', meta.title],
      ['name', 'twitter:description', meta.description],
      ['name', 'twitter:image', image],
      ['name', 'twitter:image:alt', imageAlt],
    ] as const,
  };
}

const jsonLdString = (data: Record<string, unknown>[]) => JSON.stringify(data).replace(/</g, '\\u003c');

/** Static head markup for pre-rendered pages. */
export function renderHeadTags(meta: PageMeta): string {
  const { url, metas } = tagList(meta);
  const lines = [
    `<title>${esc(meta.title)}</title>`,
    `<link rel="canonical" href="${esc(url)}" />`,
    ...metas.map(([attr, key, value]) => `<meta ${attr}="${key}" content="${esc(value)}" />`),
  ];
  for (const font of meta.preloadFonts ?? []) lines.push(`<link rel="preload" href="${esc(font)}" as="font" type="font/woff2" crossorigin />`);
  if (meta.jsonLd?.length) lines.push(`<script type="application/ld+json" id="ld-json">${jsonLdString(meta.jsonLd)}</script>`);
  return lines.join('\n    ');
}

/** Keeps <head> in sync after client-side navigation. */
export function applyMeta(meta: PageMeta) {
  const { url, metas } = tagList(meta);
  document.title = meta.title;
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url;
  for (const [attr, key, value] of metas) {
    let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.content = value;
  }
  let ld = document.getElementById('ld-json');
  if (meta.jsonLd?.length) {
    if (!ld) {
      ld = document.createElement('script');
      ld.id = 'ld-json';
      ld.setAttribute('type', 'application/ld+json');
      document.head.appendChild(ld);
    }
    ld.textContent = jsonLdString(meta.jsonLd);
  } else {
    ld?.remove();
  }
}

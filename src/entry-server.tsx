import { renderToString } from 'react-dom/server';
import { App } from './App';
import { matchRoute, metaFor, prerenderPaths } from './routes';
import { renderHeadTags } from './lib/meta';
import { SITE } from './data/site';

/** Used at build time by scripts/prerender.mjs to turn every route into static HTML. */
export function render(url: string) {
  const html = renderToString(<App initialPath={url} />);
  const head = renderHeadTags(metaFor(matchRoute(url)));
  return { html, head };
}

export { prerenderPaths };
export const SITE_URL = SITE.url;

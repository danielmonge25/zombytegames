import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import { initAnalytics } from './lib/analytics';

const container = document.getElementById('root')!;
// Pre-rendered pages carry the path they were rendered for (see scripts/prerender.mjs).
const renderedFor = container.dataset.route;

if (renderedFor) {
  hydrateRoot(container, <App initialPath={renderedFor} />);
} else {
  // `npm run dev`: nothing was pre-rendered, render from scratch.
  container.innerHTML = '';
  createRoot(container).render(<App initialPath={location.pathname} />);
}

initAnalytics();

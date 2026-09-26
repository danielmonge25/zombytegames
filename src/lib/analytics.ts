import { GOATCOUNTER_CODE } from '../data/site';

interface GoatCounter {
  count?: (vars: { path: string; title?: string; event?: boolean }) => void;
}

declare global {
  interface Window {
    goatcounter?: GoatCounter;
  }
}

/**
 * Loads GoatCounter, a cookie-free visit counter (no consent banner needed).
 * Does nothing until GOATCOUNTER_CODE is set in src/data/site.ts.
 * GoatCounter ignores localhost, so local testing doesn't count as visits.
 */
export function initAnalytics() {
  if (!GOATCOUNTER_CODE || document.querySelector('script[data-goatcounter]')) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
  document.head.appendChild(script);
}

/** Counts a named event, e.g. track('contact-discord'). Safe to call when analytics is off. */
export function track(name: string, title?: string) {
  window.goatcounter?.count?.({ path: name, title: title ?? name, event: true });
}

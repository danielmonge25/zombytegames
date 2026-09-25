import { useEffect, useLayoutEffect } from 'react';
import { isReducedMotion } from './motion';

export const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Scroll-reveal for every element with a `data-reveal` attribute.
 * CSS (global.css) hides them once the app has hydrated; this adds
 * `data-revealed` when they scroll into view. Re-runs on every page change.
 */
export function useRevealOnScroll(pageKey: unknown) {
  useIsoLayoutEffect(() => {
    const root = document.documentElement;
    const pending = () => Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])'));
    const reveal = (el: Element) => ((el as HTMLElement).dataset.revealed = '');

    if (!root.classList.contains('hydrated')) {
      // First load: whatever is already on screen stays visible (no flash).
      const vh = window.innerHeight;
      for (const el of pending()) {
        const r = el.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) reveal(el);
      }
      root.classList.add('hydrated');
    }
    if (isReducedMotion() || !('IntersectionObserver' in window)) {
      pending().forEach(reveal);
      return;
    }

    const watched = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            reveal(e.target);
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
    );
    const watch = () =>
      pending().forEach((el) => {
        if (!watched.has(el)) {
          watched.add(el);
          io.observe(el);
        }
      });
    watch();
    // Content that appears later (tabs, filters…) gets revealed too.
    const mo = new MutationObserver(watch);
    const main = document.getElementById('main');
    if (main) mo.observe(main, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pageKey]);
}

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { isReducedMotion } from './motion';

export const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** `false` during SSR + hydration, `true` afterwards. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** Tracks whether an element is on screen. */
export function useInView<T extends Element>(
  options: { rootMargin?: string; threshold?: number; once?: boolean } = {},
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const { rootMargin = '0px', threshold = 0, once = false } = options;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) io.disconnect();
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold, once]);
  return [ref, inView];
}

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

/** Calls `fn` once per animation frame while `active` is true. */
export function useAnimationFrame(active: boolean, fn: (time: number, dt: number) => void) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(64, t - last);
      last = t;
      fnRef.current(t, dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { flushSync } from 'react-dom';
import { isReducedMotion } from './motion';

/**
 * A deliberately tiny client-side router.
 * Pages are pre-rendered to static HTML at build time (scripts/prerender.mjs);
 * after hydration, links navigate without reloading and use the View
 * Transitions API when the browser supports it.
 */

/** "/games/bloodcast/" → "/games/bloodcast" (the form used for route matching). */
export function normalizePath(pathname: string): string {
  let p = pathname.split(/[?#]/)[0] || '/';
  if (!p.startsWith('/')) p = `/${p}`;
  p = p.replace(/\/index\.html$/, '/').replace(/\/{2,}/g, '/');
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

interface RouterState {
  path: string;
  hash: string;
  /** Increments on every page change. */
  key: number;
}

interface RouterValue extends RouterState {
  navigate: (to: string, opts?: { replace?: boolean }) => void;
}

const RouterContext = createContext<RouterValue | null>(null);
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

type ViewTransitionDocument = Document & { startViewTransition?: (cb: () => void) => unknown };

function commit(update: () => void) {
  const doc = document as ViewTransitionDocument;
  if (typeof doc.startViewTransition === 'function' && !isReducedMotion()) {
    doc.startViewTransition(() => flushSync(update));
  } else {
    update();
  }
}

export function scrollToHash(hash: string, smooth: boolean): boolean {
  if (!hash || hash === '#') return false;
  const el = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!el) return false;
  el.scrollIntoView({ behavior: smooth && !isReducedMotion() ? 'smooth' : 'auto', block: 'start' });
  return true;
}

export function RouterProvider({ initialPath, children }: { initialPath: string; children: ReactNode }) {
  const [state, setState] = useState<RouterState>(() => ({ path: normalizePath(initialPath), hash: '', key: 0 }));
  const pendingScroll = useRef<{ hash: string; y: number } | null>(null);
  const pathRef = useRef(state.path);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    // The static HTML may have been rendered for a different path (e.g. 404.html).
    const real = normalizePath(location.pathname);
    if (real !== pathRef.current) setState((s) => ({ ...s, path: real, key: s.key + 1 }));
    if (location.hash) requestAnimationFrame(() => scrollToHash(location.hash, false));

    const onPop = (e: PopStateEvent) => {
      const y = e.state && typeof e.state.y === 'number' ? e.state.y : 0;
      const nextPath = normalizePath(location.pathname);
      if (nextPath === pathRef.current) {
        if (!scrollToHash(location.hash, true)) window.scrollTo(0, y);
        setState((s) => ({ ...s, hash: location.hash }));
        return;
      }
      pendingScroll.current = { hash: y ? '' : location.hash, y };
      commit(() => setState((s) => ({ path: nextPath, hash: location.hash, key: s.key + 1 })));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Apply the scroll position right after a page change is rendered.
  useIsoLayoutEffect(() => {
    pathRef.current = state.path;
    const p = pendingScroll.current;
    if (!p) return;
    pendingScroll.current = null;
    if (p.hash && scrollToHash(p.hash, false)) return;
    window.scrollTo(0, p.y);
  }, [state.key, state.path]);

  const navigate = useCallback((to: string, opts: { replace?: boolean } = {}) => {
    const url = new URL(to, location.href);
    if (url.origin !== location.origin) {
      location.assign(url.href);
      return;
    }
    const nextPath = normalizePath(url.pathname);
    const samePage = nextPath === normalizePath(location.pathname);
    const href = url.pathname + url.search + url.hash;

    // Remember where we were so "back" can restore it.
    history.replaceState({ ...(history.state ?? {}), y: window.scrollY }, '');
    if (opts.replace) history.replaceState({ y: 0 }, '', href);
    else history.pushState({ y: 0 }, '', href);

    if (samePage) {
      if (!scrollToHash(url.hash, true)) window.scrollTo({ top: 0, behavior: isReducedMotion() ? 'auto' : 'smooth' });
      setState((s) => ({ ...s, hash: url.hash }));
      return;
    }
    pendingScroll.current = { hash: url.hash, y: 0 };
    commit(() => setState((s) => ({ path: nextPath, hash: url.hash, key: s.key + 1 })));
  }, []);

  const value = useMemo(() => ({ ...state, navigate }), [state, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterValue {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used inside <RouterProvider>');
  return ctx;
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string; children?: ReactNode };

/** An <a> that navigates client-side for internal URLs. */
export function Link({ to, onClick, children, target, ...rest }: LinkProps) {
  const { navigate } = useRouter();
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (target === '_blank' || /^(https?:|mailto:|tel:)/.test(to)) return;
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={to} onClick={handleClick} target={target} {...rest}>
      {children}
    </a>
  );
}

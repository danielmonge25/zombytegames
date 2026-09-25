import { useSyncExternalStore } from 'react';

/**
 * Motion preference = the OS "reduce motion" setting, unless the visitor
 * overrides it with the toggle in the footer. Mirrored to <html data-motion>
 * so CSS can react too (see the inline script in index.html).
 */
type Override = 'reduced' | 'full' | null;

const STORAGE_KEY = 'zg:motion';
const listeners = new Set<() => void>();
let override: Override = null;
let systemReduced = false;
let started = false;

function start() {
  if (started || typeof window === 'undefined') return;
  started = true;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'reduced' || v === 'full') override = v;
  } catch {
    /* storage unavailable */
  }
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  systemReduced = mq.matches;
  mq.addEventListener('change', (e) => {
    systemReduced = e.matches;
    emit();
  });
}

function emit() {
  const root = document.documentElement;
  if (isReducedMotion()) root.setAttribute('data-motion', 'reduced');
  else root.removeAttribute('data-motion');
  listeners.forEach((l) => l());
}

export function isReducedMotion(): boolean {
  start();
  return override ? override === 'reduced' : systemReduced;
}

export function setReducedMotion(reduced: boolean) {
  start();
  override = reduced ? 'reduced' : 'full';
  try {
    localStorage.setItem(STORAGE_KEY, override);
  } catch {
    /* ignore */
  }
  emit();
}

function subscribe(cb: () => void) {
  start();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** `true` when animations should be toned down. Always `false` during SSR/hydration. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, isReducedMotion, () => false);
}

const noopSubscribe = () => () => {};
/** `true` on devices with a precise pointer (mouse/trackpad). */
export function useFinePointer(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    () => false,
  );
}

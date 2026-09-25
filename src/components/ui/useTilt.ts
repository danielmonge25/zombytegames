import { useEffect, useRef } from 'react';
import { isReducedMotion } from '../../lib/motion';

/**
 * 3D tilt towards the cursor. Writes CSS variables on the element:
 *   --rx / --ry  rotation, --mx / --my  pointer position (for glare).
 * Pair with the `.tilt` class (see ui.css).
 */
export function useTilt<T extends HTMLElement>(max = 8) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let raf = 0;
    let rect: DOMRect | null = null;
    const onEnter = () => {
      rect = el.getBoundingClientRect();
      el.dataset.tilting = '';
    };
    const onMove = (e: PointerEvent) => {
      if (isReducedMotion()) return;
      rect ??= el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${((0.5 - y) * max).toFixed(2)}deg`);
        el.style.setProperty('--ry', `${((x - 0.5) * max).toFixed(2)}deg`);
        el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
        el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      rect = null;
      delete el.dataset.tilting;
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    };
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [max]);
  return ref;
}

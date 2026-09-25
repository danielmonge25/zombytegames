import { useEffect, useRef } from 'react';
import { useFinePointer, useReducedMotion } from '../lib/motion';

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor]';

/**
 * A soft ring that trails the (still visible) native cursor, grows over
 * interactive elements and shows a label for elements with data-cursor="…".
 * Desktop only; disabled with reduced motion.
 */
export function CursorTrail() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!fine || reduced || !ring || !label) return;
    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;
    let raf = 0;
    let shown = false;

    const tick = () => {
      rx += (x - rx) * 0.22;
      ry += (y - ry) * 0.22;
      ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.2 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        shown = true;
        rx = x;
        ry = y;
        ring.dataset.visible = 'true';
      }
      const target = e.target instanceof Element ? e.target : null;
      const hit = target?.closest(INTERACTIVE);
      const text = hit?.closest('[data-cursor]')?.getAttribute('data-cursor') ?? '';
      ring.dataset.hover = hit ? 'true' : 'false';
      ring.dataset.label = text ? 'true' : 'false';
      if (label.textContent !== text) label.textContent = text;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      shown = false;
      ring.dataset.visible = 'false';
    };
    const onDown = () => (ring.dataset.down = 'true');
    const onUp = () => (ring.dataset.down = 'false');

    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;
  return (
    <div ref={ringRef} className="cursor" aria-hidden="true" data-visible="false">
      <div className="cursor__shape">
        <span ref={labelRef} className="cursor__label" />
      </div>
    </div>
  );
}

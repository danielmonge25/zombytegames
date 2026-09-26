import { useEffect, useRef, type CSSProperties } from 'react';
import { PixelSprite } from '../pixel/PixelSprite';
import type { SpriteName } from '../pixel/sprites';
import { isReducedMotion } from '../../lib/motion';

interface Bit {
  sprite: SpriteName;
  /** position in % of the hero */
  x: number;
  y: number;
  scale: number;
  /** parallax depth */
  depth: number;
  /** hidden on small screens */
  desktopOnly?: boolean;
  /** only on wide screens (≥1200px), where there is room next to the text */
  wideOnly?: boolean;
}

const BITS: Bit[] = [
  { sprite: 'gamepad', x: 57, y: 17, scale: 4, depth: 18 },
  { sprite: 'fish', x: 90, y: 24, scale: 4, depth: 26 },
  { sprite: 'heart', x: 47, y: 86, scale: 4, depth: 14, desktopOnly: true },
  { sprite: 'skull', x: 93, y: 74, scale: 4, depth: 22 },
  { sprite: 'floppy', x: 71, y: 88, scale: 4, depth: 30, desktopOnly: true },
  { sprite: 'sparkle', x: 52, y: 62, scale: 4, depth: 10, wideOnly: true },
  { sprite: 'goldfish', x: 38, y: 11, scale: 4, depth: 12, desktopOnly: true },
  { sprite: 'bobber', x: 78, y: 12, scale: 4, depth: 20, desktopOnly: true },
];

/**
 * Pixel objects floating around the hero. They drift with the cursor
 * (parallax) but dodge it when it gets too close.
 */
export function FloatingBits() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const host = refs.current[0]?.parentElement?.parentElement;
    if (!host || isReducedMotion()) return;
    const state = BITS.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }));
    let mx = 0;
    let my = 0;
    let pointerX = -9999;
    let pointerY = -9999;
    let raf = 0;
    let visible = true;
    const phase = BITS.map((_, i) => i * 1.7);

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      pointerX = e.clientX;
      pointerY = e.clientY;
    };
    const onLeave = () => {
      pointerX = pointerY = -9999;
      mx = my = 0;
    };

    const tick = (t: number) => {
      BITS.forEach((b, i) => {
        const el = refs.current[i];
        const s = state[i];
        if (!el) return;
        let targetX = -mx * b.depth;
        let targetY = -my * b.depth + Math.sin(t / 1400 + phase[i]) * 7;
        // dodge the cursor
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2 - s.x;
        const cy = r.top + r.height / 2 - s.y;
        const dx = cx - pointerX;
        const dy = cy - pointerY;
        const dist = Math.hypot(dx, dy);
        const radius = 150;
        if (dist < radius && dist > 0) {
          const f = (1 - dist / radius) * 90;
          targetX += (dx / dist) * f;
          targetY += (dy / dist) * f;
        }
        s.vx = (s.vx + (targetX - s.x) * 0.06) * 0.82;
        s.vy = (s.vy + (targetY - s.y) * 0.06) * 0.82;
        s.x += s.vx;
        s.y += s.vy;
        el.style.transform = `translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0) rotate(${(s.vx * 1.6).toFixed(1)}deg)`;
      });
      raf = visible ? requestAnimationFrame(tick) : 0;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(host);
    host.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div className="bits" aria-hidden="true">
      {BITS.map((b, i) => (
        <div
          key={b.sprite}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={`bits__item${b.desktopOnly ? ' bits__item--desktop' : ''}${b.wideOnly ? ' bits__item--wide' : ''}`}
          style={{ left: `${b.x}%`, top: `${b.y}%`, '--i': i } as CSSProperties}
        >
          <PixelSprite name={b.sprite} scale={b.scale} />
        </div>
      ))}
    </div>
  );
}

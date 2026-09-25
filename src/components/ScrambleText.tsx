import { useEffect, useRef } from 'react';
import { isReducedMotion } from '../lib/motion';

const GLYPHS = '01<>/\\#%&*+=?$@ZMBYT';

interface Props {
  text: string;
  /** hover = when the closest link/button is hovered or focused; view = once when scrolled into view. */
  trigger?: 'hover' | 'view' | 'mount';
  duration?: number;
  className?: string;
}

/**
 * Text that "decodes" from random glyphs. The real text is always in the
 * DOM for screen readers and search engines; only the visual copy animates.
 */
export function ScrambleText({ text, trigger = 'hover', duration = 520, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const chars = [...text];

    const run = () => {
      if (isReducedMotion()) return;
      cancelAnimationFrame(raf);
      const start = performance.now();
      const frame = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        let out = '';
        for (let i = 0; i < chars.length; i++) {
          const c = chars[i];
          const revealAt = 0.25 + (i / chars.length) * 0.75;
          out += c === ' ' || p >= revealAt ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
        if (p < 1) raf = requestAnimationFrame(frame);
        else el.textContent = text;
      };
      raf = requestAnimationFrame(frame);
    };

    let detach = () => {};
    if (trigger === 'hover') {
      const target = el.closest('a, button') ?? el;
      target.addEventListener('pointerenter', run);
      target.addEventListener('focus', run);
      detach = () => {
        target.removeEventListener('pointerenter', run);
        target.removeEventListener('focus', run);
      };
    } else if (trigger === 'mount') {
      run();
    } else if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          run();
          io.disconnect();
        }
      });
      io.observe(el);
      detach = () => io.disconnect();
    }

    return () => {
      cancelAnimationFrame(raf);
      detach();
      el.textContent = text;
    };
  }, [text, trigger, duration]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}

import { useEffect, useRef } from 'react';
import { isReducedMotion } from '../../lib/motion';

/**
 * The hero "byte field": a grid of pixels that light up, grow and get
 * pushed away around the cursor, with random bit-flips (0/1) — code
 * slowly becoming a world. Pauses when off-screen or when the tab is hidden.
 * Without a mouse, an invisible attractor wanders around instead.
 */
export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let gap = 26;
    let cols = 0;
    let rows = 0;
    let flash = new Float32Array(0);
    let glyph = new Uint8Array(0);
    let px = -1000;
    let py = -1000;
    let tx = -1000;
    let ty = -1000;
    let lastMove = -1e9;
    let raf = 0;
    let visible = true;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gap = w < 700 ? 28 : 26;
      cols = Math.ceil(w / gap) + 1;
      rows = Math.ceil(h / gap) + 1;
      flash = new Float32Array(cols * rows);
      glyph = new Uint8Array(cols * rows);
      if (isReducedMotion()) draw(performance.now(), true);
    };

    const draw = (t: number, still = false) => {
      ctx.clearRect(0, 0, w, h);
      if (!still) {
        // Idle / touch: a slow wandering attractor keeps the field alive.
        if (t - lastMove > 2600) {
          tx = w * (0.62 + 0.3 * Math.sin(t / 3100));
          ty = h * (0.45 + 0.28 * Math.sin(t / 2300 + 1.3));
        }
        px += (tx - px) * 0.09;
        py += (ty - py) * 0.09;
        for (let k = 0; k < 3; k++) {
          if (Math.random() < 0.6) {
            const idx = (Math.random() * flash.length) | 0;
            flash[idx] = 1;
            glyph[idx] = Math.random() < 0.5 ? 48 : 49; // "0" | "1"
          }
        }
      }
      const R = Math.max(160, Math.min(260, w * 0.2));
      const offX = (w - (cols - 1) * gap) / 2;
      const offY = (h - (rows - 1) * gap) / 2;

      // pass 1: resting pixels
      ctx.fillStyle = '#8b6cff';
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = offX + i * gap;
          const y = offY + j * gap;
          const dx = x - px;
          const dy = y - py;
          if (dx * dx + dy * dy < R * R) continue;
          const f = flash[j * cols + i];
          ctx.globalAlpha = 0.13 + f * 0.5;
          const s = 1.6 + f * 1.4;
          ctx.fillRect(x - s / 2, y - s / 2, s, s);
        }
      }
      // pass 2: pixels near the cursor — bigger, brighter, pushed away
      ctx.fillStyle = '#c6ff3d';
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = offX + i * gap;
          const y = offY + j * gap;
          const dx = x - px;
          const dy = y - py;
          const d2 = dx * dx + dy * dy;
          if (d2 >= R * R) continue;
          const d = Math.sqrt(d2) || 1;
          const f = 1 - d / R;
          const push = f * f * 16;
          const s = 1.8 + f * 4.2;
          ctx.globalAlpha = 0.18 + f * 0.8;
          ctx.fillRect(x + (dx / d) * push - s / 2, y + (dy / d) * push - s / 2, s, s);
        }
      }
      // pass 3: flickering bits
      if (!still) {
        ctx.fillStyle = '#c6ff3d';
        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let idx = 0; idx < flash.length; idx++) {
          const f = flash[idx];
          if (f <= 0) continue;
          flash[idx] = Math.max(0, f - 0.018);
          if (f > 0.55) {
            ctx.globalAlpha = (f - 0.55) * 1.4;
            ctx.fillText(String.fromCharCode(glyph[idx]), offX + (idx % cols) * gap, offY + Math.floor(idx / cols) * gap - 12);
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf && visible && !document.hidden && !isReducedMotion()) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      lastMove = performance.now();
      if (px < -500) {
        px = tx;
        py = ty;
      }
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    host.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    if (isReducedMotion()) draw(0, true);
    else start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      host.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="byte-field" aria-hidden="true" />;
}

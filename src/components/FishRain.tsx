import { useEffect, useRef } from 'react';
import { useStore } from '../lib/store';
import { fishRainStore } from '../lib/easterEggs';
import { SPRITES, PALETTE } from './pixel/sprites';

/** Konami-code easter egg: it rains pixel fish. */

function spriteCanvas(rows: readonly string[], scale: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = rows[0].length * scale;
  c.height = rows.length * scale;
  const ctx = c.getContext('2d')!;
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === '.') return;
      ctx.fillStyle = PALETTE[ch];
      ctx.fillRect(x * scale, y * scale, scale, scale);
    });
  });
  return c;
}

interface Fish {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  vr: number;
  img: HTMLCanvasElement;
  born: number;
}

export function FishRain() {
  const count = useStore(fishRainStore);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!count || !canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    const sprites = [SPRITES.fish, SPRITES.goldfish, SPRITES.pinkfish].map((s) => spriteCanvas(s, 4));
    const start = performance.now();
    const fish: Fish[] = Array.from({ length: Math.round(Math.min(70, W / 18)) }, (_, i) => ({
      x: Math.random() * W,
      y: -60 - Math.random() * H * 0.9,
      vx: (Math.random() - 0.5) * 3,
      vy: 1 + Math.random() * 4,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      img: sprites[i % sprites.length],
      born: start,
    }));

    let raf = 0;
    const tick = (now: number) => {
      const t = now - start;
      ctx.clearRect(0, 0, W, H);
      const fade = t > 4200 ? Math.max(0, 1 - (t - 4200) / 900) : 1;
      ctx.globalAlpha = fade;
      for (const f of fish) {
        f.vy += 0.28;
        f.x += f.vx;
        f.y += f.vy;
        f.r += f.vr;
        if (f.y > H - 18) {
          f.y = H - 18;
          f.vy *= -0.42;
          f.vx *= 0.8;
          f.vr *= 0.6;
        }
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.r);
        ctx.drawImage(f.img, -f.img.width / 2, -f.img.height / 2);
        ctx.restore();
      }
      if (fade > 0) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [count]);

  return <canvas ref={canvasRef} className="fish-rain" aria-hidden="true" />;
}

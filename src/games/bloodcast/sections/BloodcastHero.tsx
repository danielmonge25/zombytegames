import { useEffect, useRef } from 'react';
import type { Game } from '../../../data/games';
import { Link } from '../../../lib/router';
import { paths } from '../../../lib/paths';
import { imageNamed } from '../../../lib/images';
import { isReducedMotion } from '../../../lib/motion';
import { Button } from '../../../components/ui/Button';
import { BloodcastScene } from '../art/BloodcastScene';

interface Ripple {
  x: number;
  y: number;
  r: number;
  max: number;
  a: number;
}

/** Rings on the water where the cursor touches it — plus the odd fish rising. */
function WaterRipples() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.closest('.bch') as HTMLElement | null;
    if (!canvas || !host || isReducedMotion()) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = 0;
    let h = 0;
    let waterY = 0;
    let scale = 1;
    let raf = 0;
    let visible = true;
    let lastSpawn = 0;
    let nextAmbient = performance.now() + 900;
    const ripples: Ripple[] = [];

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // The scene is 1600×900, bottom-aligned with "slice": water starts at y=640.
      scale = Math.max(w / 1600, h / 900);
      waterY = h - (900 - 640) * scale;
    };

    const spawn = (x: number, y: number, max: number) => {
      ripples.push({ x, y, r: 2, max, a: 0.55 });
      if (ripples.length > 40) ripples.shift();
      start();
    };

    const tick = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      if (t > nextAmbient) {
        nextAmbient = t + 900 + Math.random() * 2200;
        spawn(Math.random() * w, waterY + 20 * scale + Math.random() * (h - waterY - 30 * scale), 40 * scale + Math.random() * 30 * scale);
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        const p = ripples[i];
        p.r += (p.max - p.r) * 0.035 + 0.25;
        p.a *= 0.972;
        if (p.a < 0.02) {
          ripples.splice(i, 1);
          continue;
        }
        const squash = 0.2 + ((p.y - waterY) / Math.max(1, h - waterY)) * 0.12;
        ctx.strokeStyle = `rgba(246, 234, 210, ${p.a.toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.r, p.r * squash, 0, 0, Math.PI * 2);
        ctx.stroke();
        if (p.r > 10) {
          ctx.strokeStyle = `rgba(255, 122, 147, ${(p.a * 0.5).toFixed(3)})`;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.r * 0.6, p.r * 0.6 * squash, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    function start() {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(tick);
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const now = performance.now();
      if (y > waterY + 6 && now - lastSpawn > 110) {
        lastSpawn = now;
        spawn(x, y, 50 * scale + 20);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);
    host.addEventListener('pointermove', onMove, { passive: true });
    start();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="bch__ripples" aria-hidden="true" />;
}

export function BloodcastHero({ game }: { game: Game }) {
  const heroRef = useRef<HTMLElement>(null);
  const keyArt = imageNamed('bloodcast', 'key-art');

  // Pointer + scroll parallax for the scene layers.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || isReducedMotion()) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--px', (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
      hero.style.setProperty('--py', (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        hero.style.setProperty('--sy', Math.min(1, window.scrollY / window.innerHeight).toFixed(3));
      });
    };
    hero.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header ref={heroRef} className="bch">
      <div className="bch__scene">
        {keyArt ? (
          <img className="bch__keyart" src={keyArt.src} srcSet={keyArt.srcSet} sizes="100vw" width={keyArt.width} height={keyArt.height} alt="" fetchPriority="high" />
        ) : (
          <>
            <BloodcastScene variant="full" />
            <WaterRipples />
          </>
        )}
      </div>
      <div className="bch__vignette" aria-hidden="true" />

      <div className="container bch__inner">
        <Link to={paths.games} className="back-link">
          ← All games
        </Link>
        <div className="bch__content">
          <p className="bch__meta">
            <span className="status status--in-development">{game.statusLabel}</span>
            <span className="bch__catalog">{game.catalog} · A Zombyte Games project</span>
          </p>
          <h1 id="bc-title" className="bch__title">
            {game.title}
          </h1>
          <p className="bch__subtitle">{game.tagline}</p>
          <p className="bch__genre">Multiplayer · Gothic fishing · Social hangout</p>
          <div className="bch__ctas">
            <Button to="#about-the-game" variant="blood" icon="down">
              Enter the world
            </Button>
          </div>
        </div>
      </div>

      {keyArt ? null : <p className="bch__caption">Placeholder illustration — not in-game footage</p>}
      <div className="bch__scroll" aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>
    </header>
  );
}

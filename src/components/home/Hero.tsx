import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { InteractiveBackground } from './InteractiveBackground';
import { FloatingBits } from './FloatingBits';
import { Mascot, type Mood } from '../mascot/Mascot';
import { Button } from '../ui/Button';
import { paths } from '../../lib/paths';
import { heroByteVisibleStore } from '../../lib/ui';
import { unlock } from '../../lib/achievements';
import { isReducedMotion } from '../../lib/motion';
import './hero.css';

const HELLOS = ['hi! i’m byte.', 'byte lives here.', 'code → worlds. i’m proof.', 'poke me again. i dare you.', 'okay that tickles.'];

const intro = (i: number) => ({ '--i': i }) as CSSProperties;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const byteRef = useRef<HTMLDivElement>(null);
  const [mood, setMood] = useState<Mood>('idle');
  const [hello, setHello] = useState<string | null>(null);
  const pokes = useRef(0);
  const timer = useRef(0);

  // Spotlight on the giant ZOMBYTE letters follows the pointer.
  useEffect(() => {
    const section = sectionRef.current;
    const wm = wordmarkRef.current;
    if (!section || !wm) return;
    const onMove = (e: PointerEvent) => {
      const r = wm.getBoundingClientRect();
      wm.style.setProperty('--mx', `${Math.round(e.clientX - r.left)}px`);
      wm.style.setProperty('--my', `${Math.round(e.clientY - r.top)}px`);
      wm.dataset.lit = 'true';
    };
    const onLeave = () => delete wm.dataset.lit;
    section.addEventListener('pointermove', onMove, { passive: true });
    section.addEventListener('pointerleave', onLeave);
    return () => {
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  // While the big Byte is on screen, the corner companion stays hidden.
  useEffect(() => {
    const el = byteRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => heroByteVisibleStore.set(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => {
      io.disconnect();
      heroByteVisibleStore.set(false);
    };
  }, []);

  const poke = () => {
    pokes.current += 1;
    setMood(pokes.current % 4 === 0 ? 'wink' : 'happy');
    setHello(HELLOS[(pokes.current - 1) % HELLOS.length]);
    if (pokes.current === 5) unlock('best-friends');
    const el = byteRef.current;
    if (el && !isReducedMotion()) {
      el.classList.remove('is-hopping');
      void el.offsetWidth;
      el.classList.add('is-hopping');
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setMood('idle');
      setHello(null);
    }, 2400);
  };

  return (
    <section id="top" ref={sectionRef} className="hero" aria-labelledby="hero-title">
      <InteractiveBackground />
      <div className="hero__glow" aria-hidden="true" />
      <FloatingBits />

      <div ref={wordmarkRef} className="hero__wordmark" aria-hidden="true">
        <span className="hero__wm-outline">ZOMBYTE</span>
        <span className="hero__wm-fill">ZOMBYTE</span>
      </div>

      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="hero__kicker" data-intro style={intro(0)}>
            <span className="pixel-badge">Zombyte Games</span>
            <span className="hero__solo">Solo indie game development</span>
          </p>
          <h1 id="hero-title" className="hero__title">
            <span className="hero__line">
              <span data-intro style={intro(1)}>
                Hi, I’m <span className="hero__name">Daniel</span>.{' '}
              </span>
            </span>
            <span className="hero__line">
              <span data-intro style={intro(2)}>
                I make <span className="hero__strange">strange</span>{' '}
              </span>
            </span>
            <span className="hero__line">
              <span data-intro style={intro(3)}>
                little <span className="hero__games">games</span>
                <span className="hero__period">.</span>
              </span>
            </span>
          </h1>
          <p className="hero__lede" data-intro style={intro(5)}>
            AI Engineer from Costa Rica by day, solo game developer by choice. Right now I’m building BLOODCAST — a multiplayer gothic
            fishing game.
          </p>
          <div className="hero__ctas" data-intro style={intro(6)}>
            <Button to={paths.game('bloodcast')} icon="down">
              Explore BLOODCAST
            </Button>
            <Button
              to={paths.about}
              variant="ghost"
              extra={
                <span className="peek" aria-hidden="true">
                  <Mascot mood="happy" track={false} />
                </span>
              }
            >
              Meet the developer
            </Button>
          </div>
        </div>

        <div className="hero__byte" data-intro style={intro(4)}>
          <div ref={byteRef} className="hero__byte-body" onAnimationEnd={(e) => e.currentTarget.classList.remove('is-hopping')}>
            <p className="hero__bubble" data-show={Boolean(hello)} aria-hidden="true">
              {hello}
            </p>
            <button type="button" className="hero__byte-btn" onClick={poke} aria-label="Poke Byte, the Zombyte mascot" data-cursor="Poke">
              <Mascot mood={mood} />
            </button>
          </div>
          <span className="hero__byte-shadow" aria-hidden="true" />
        </div>
      </div>

      <div className="hero__hud" data-intro style={intro(7)}>
        <div className="container hero__hud-inner">
          <span>
            <b>P1</b> Daniel Monge
          </span>
          <span className="hero__hud-quest">
            <b>Quest</b> Build BLOODCAST
          </span>
          <span className="hero__hud-scroll" aria-hidden="true">
            Scroll to start <i />
          </span>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link, useRouter } from '../lib/router';
import { CURRENTLY_BUILDING, NAV_ITEMS } from '../data/site';
import { getGame } from '../data/games';
import { paths } from '../lib/paths';
import { Logo } from './Logo';
import { ScrambleText } from './ScrambleText';
import { ACHIEVEMENTS, useUnlocked } from '../lib/achievements';
import { secretsOpenStore } from '../lib/ui';
import { PixelSprite } from './pixel/PixelSprite';
import './navbar.css';

/** Home sections → which nav item they belong to (scrollspy). */
const SPY: Record<string, string | null> = {
  top: null,
  games: 'Games',
  about: 'About',
  journey: 'About',
  contact: 'Contact',
};

interface Props {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export function Navbar({ menuOpen, setMenuOpen }: Props) {
  const { path } = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [spy, setSpy] = useState<string | null>(null);
  const unlocked = useUnlocked();
  const building = getGame(CURRENTLY_BUILDING);

  // Scroll progress ("XP bar") + compact header after scrolling.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      headerRef.current?.toggleAttribute('data-scrolled', window.scrollY > 24);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [path]);

  // Scrollspy for the one-page sections on the home page.
  useEffect(() => {
    setSpy(null);
    if (path !== '/' || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setSpy(SPY[e.target.id] ?? null);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    Object.keys(SPY).forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [path]);

  // Mobile menu: lock scroll, focus first link, Escape closes.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('menu-open', menuOpen);
    if (!menuOpen) return;
    menuRef.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      root.classList.remove('menu-open');
    };
  }, [menuOpen, setMenuOpen]);

  const isActive = (match: string) =>
    match.startsWith('#') ? path === '/' && spy === NAV_ITEMS.find((i) => i.match === match)?.label : path === match || path.startsWith(`${match}/`);
  const isCurrentPage = (match: string) => !match.startsWith('#') && path === match;

  return (
    <>
      <header ref={headerRef} className="nav" data-menu={menuOpen}>
        <div className="nav__inner">
          <Logo onNavigate={() => setMenuOpen(false)} />

          <nav className="nav__links" aria-label="Primary">
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="nav__link"
                    data-active={isActive(item.match)}
                    aria-current={isCurrentPage(item.match) ? 'page' : undefined}
                  >
                    <ScrambleText text={item.label} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {building ? (
            <Link to={paths.game(building.slug)} className="status-pill" aria-label={`Currently building: ${building.title}`}>
              <span className="status-pill__dot" aria-hidden="true" />
              <span className="status-pill__label" aria-hidden="true">
                Currently building
              </span>
              <span className="status-pill__game" aria-hidden="true">
                {building.title}
              </span>
            </Link>
          ) : null}

          <button
            ref={toggleRef}
            type="button"
            className="nav__toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            <span className="nav__burger" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
        <div className="nav__xp" aria-hidden="true">
          <div ref={barRef} className="nav__xp-fill" />
        </div>
      </header>

      <div id="mobile-menu" ref={menuRef} className="menu" data-open={menuOpen} inert={!menuOpen}>
        <nav aria-label="Mobile">
          <ul className="menu__links">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.href} style={{ '--i': i } as CSSProperties}>
                <Link
                  to={item.href}
                  className="menu__link"
                  aria-current={isCurrentPage(item.match) ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                  <span className="menu__arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu__foot">
          {building ? (
            <Link to={paths.game(building.slug)} className="status-pill status-pill--menu" onClick={() => setMenuOpen(false)}>
              <span className="status-pill__dot" aria-hidden="true" />
              <span className="status-pill__label">Currently building</span>
              <span className="status-pill__game">{building.title}</span>
            </Link>
          ) : null}
          <button
            type="button"
            className="menu__secrets"
            onClick={() => {
              setMenuOpen(false);
              secretsOpenStore.set(true);
            }}
          >
            <PixelSprite name="trophy" scale={2} />
            Secrets found {unlocked.length}/{ACHIEVEMENTS.length}
          </button>
        </div>
      </div>
    </>
  );
}

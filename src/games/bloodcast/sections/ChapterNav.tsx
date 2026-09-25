import { useEffect, useState } from 'react';
import { Link } from '../../../lib/router';

export const CHAPTERS = [
  { id: 'about-the-game', label: 'About' },
  { id: 'gameplay', label: 'Gameplay' },
  { id: 'world', label: 'World' },
  { id: 'fishing', label: 'Fishing' },
  { id: 'collection', label: 'Collection' },
  { id: 'customize', label: 'Customize' },
  { id: 'screenshots', label: 'Screenshots' },
  { id: 'development', label: 'Development' },
  { id: 'technology', label: 'Technology' },
  { id: 'bloodcast-log', label: 'Dev log' },
  { id: 'follow', label: 'Follow' },
];

/** Side navigation for the long BLOODCAST page (large screens only). */
export function ChapterNav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    CHAPTERS.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <nav className="chapters" aria-label="BLOODCAST sections" data-show={active ? 'true' : 'false'}>
      <ol>
        {CHAPTERS.map((c, i) => (
          <li key={c.id}>
            <Link to={`#${c.id}`} className="chapters__link" aria-current={active === c.id ? 'location' : undefined}>
              <span className="chapters__label">{c.label}</span>
              <span className="chapters__dot" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

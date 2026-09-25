import { useEffect, useRef, type CSSProperties } from 'react';
import { GAMES, type Game } from '../../data/games';
import { CURRENTLY_BUILDING } from '../../data/site';
import { imageNamed } from '../../lib/images';
import { SectionHeading } from '../ui/SectionHeading';
import { ArtSlot } from '../ui/ArtSlot';
import { GameArt } from '../../games/registry';
import './games.css';

/** Feeds the pointer position into --px/--py so illustrated art can parallax. */
function useParallaxVars<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--px', (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
      el.style.setProperty('--py', (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
    };
    const onLeave = () => {
      el.style.setProperty('--px', '0');
      el.style.setProperty('--py', '0');
    };
    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);
  return ref;
}

/** Things Byte says when a game's panel scrolls into view. */
const BYTE_LINES: Record<string, string> = {
  bloodcast: 'That’s BLOODCAST. A strange place to fish.',
  'domino-dancing': 'Go on, push the first domino.',
};

function GamePanel({ game, index }: { game: Game; index: number }) {
  const artRef = useParallaxVars<HTMLDivElement>();
  const cover = imageNamed(game.slug, 'cover');
  const current = game.slug === CURRENTLY_BUILDING;
  const interactive = !cover && game.slug === 'domino-dancing';
  const links = game.links.filter((l) => l.url);

  return (
    <article
      id={game.slug}
      className={`game-panel game-panel--${game.slug}`}
      data-flip={index % 2 === 1}
      style={{ '--accent': game.theme.accent, '--accent2': game.theme.accent2 } as CSSProperties}
      aria-labelledby={`${game.slug}-title`}
      data-reveal="scale"
      data-byte={BYTE_LINES[game.slug]}
    >
      <div ref={artRef} className="game-panel__art">
        <ArtSlot
          label={interactive ? 'click to push' : `${game.title} art`}
          image={cover}
          alt={`${game.title} artwork`}
          ratio="16 / 10"
          tag={interactive ? 'Placeholder visual' : 'Placeholder art'}
          sizes="(min-width: 1024px) 58vw, 100vw"
          interactive={interactive}
        >
          <GameArt game={game} />
        </ArtSlot>
        {current ? (
          <span className="game-panel__live" aria-hidden="true">
            <i /> Currently building
          </span>
        ) : null}
      </div>

      <div className="game-panel__info">
        <p className="game-panel__meta">
          <span className={`status status--${game.status}`}>{game.statusLabel}</span>
          <span className="game-panel__catalog" aria-hidden="true">
            {game.catalog}
          </span>
        </p>
        <h3 id={`${game.slug}-title`} className="game-panel__title">
          {game.title}
        </h3>
        <p className="game-panel__tagline">{game.tagline}</p>
        <p className="game-panel__summary">{game.summary}</p>
        <dl className="game-panel__specs">
          <div>
            <dt>Genre</dt>
            <dd>{game.genre}</dd>
          </div>
          <div>
            <dt>Tech</dt>
            <dd>{game.tech.length ? game.tech.join(' • ') : 'TBD'}</dd>
          </div>
        </dl>
        {links.length ? (
          <ul className="game-panel__links">
            {links.map((l) => (
              <li key={l.label}>
                <a className="btn btn--ghost btn--small" href={l.url!} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

export function Games() {
  const next = GAMES.length + 1;
  return (
    <section id="games" className="section games" aria-labelledby="games-title">
      <div className="container">
        <SectionHeading
          index="01"
          kicker="Games"
          title="What I’m building"
          intro="One game in development, one concept, and an empty slot for whatever comes next."
          id="games-title"
          live
        />
        <div className="games__list">
          {GAMES.map((game, i) => (
            <GamePanel key={game.slug} game={game} index={i} />
          ))}
          <div className="games__empty" data-reveal>
            <span className="games__empty-q" aria-hidden="true">
              ?
            </span>
            <p>
              <span className="games__empty-code">ZG-{String(next).padStart(3, '0')} · Empty slot</span>
              <span>
                Whatever gets built next lives here<span className="loading-dots" aria-hidden="true" />
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

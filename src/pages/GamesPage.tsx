import { useRef, useState, type KeyboardEvent } from 'react';
import { GAMES } from '../data/games';
import { Link } from '../lib/router';
import { paths } from '../lib/paths';
import { GameArt, hasRealCover } from '../games/registry';
import './pages.css';

/** /games/ — pick a game like in an indie launcher. ↑/↓ to move, Enter to start. */
export function GamesPage() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const game = GAMES[active];

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const next = (active + (e.key === 'ArrowDown' ? 1 : -1) + GAMES.length) % GAMES.length;
    setActive(next);
    listRef.current?.querySelectorAll<HTMLAnchorElement>('.launcher__item')[next]?.focus();
  };

  return (
    <section className="section page-top launcher" aria-labelledby="launcher-title">
      <div className="container">
        <header className="page-head">
          <p className="kicker" data-reveal="fade">
            <span className="page-head__index">//</span> Game launcher
          </p>
          <h1 id="launcher-title" className="page-head__title" data-reveal>
            Select a game
          </h1>
          <p className="page-head__intro" data-reveal>
            Everything Zombyte Games is working on, from in-development to barely-an-idea. Use <kbd>↑</kbd> <kbd>↓</kbd> and <kbd>Enter</kbd> —
            or just click.
          </p>
        </header>

        <div className="launcher__grid" data-reveal>
          <ul ref={listRef} className="launcher__list" onKeyDown={onKeyDown}>
            {GAMES.map((g, i) => (
              <li key={g.slug}>
                <Link
                  to={paths.game(g.slug)}
                  className="launcher__item"
                  data-active={i === active}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  data-cursor="Start"
                >
                  <span className="launcher__cursor" aria-hidden="true">
                    ▶
                  </span>
                  <span className="launcher__num" aria-hidden="true">
                    {g.catalog}
                  </span>
                  <span className="launcher__name">{g.title}</span>
                  <span className={`status status--${g.status}`}>{g.statusLabel}</span>
                  <span className="sr-only">. {g.summary}</span>
                </Link>
              </li>
            ))}
            <li>
              <div className="launcher__item launcher__item--empty">
                <span className="launcher__cursor" aria-hidden="true" />
                <span className="launcher__num" aria-hidden="true">
                  ZG-{String(GAMES.length + 1).padStart(3, '0')}
                </span>
                <span className="launcher__name">Empty slot</span>
                <span className="status status--empty">Soon</span>
              </div>
            </li>
          </ul>

          <div className="launcher__preview" data-active={game.slug} aria-hidden="true">
            <div className="launcher__screen">
              <GameArt game={game} sizes="(min-width: 1024px) 55vw, 100vw" />
              {hasRealCover(game) ? null : <span className="launcher__tag">Placeholder art</span>}
              <span className="launcher__scan" />
            </div>
            <div className="launcher__info">
              <p className="launcher__genre">{game.genre}</p>
              <p className="launcher__summary">{game.summary}</p>
              <p className="launcher__tech">{game.tech.length ? game.tech.join(' • ') : 'Tech: TBD'}</p>
              <p className="launcher__press">
                <span>Press Enter</span> to start
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

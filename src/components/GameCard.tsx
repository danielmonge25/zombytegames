import type { CSSProperties } from 'react';
import type { Game } from '../data/games';
import { Link } from '../lib/router';
import { paths } from '../lib/paths';
import { GameArt, hasRealCover } from '../games/registry';
import { useTilt } from './ui/useTilt';
import './game-card.css';

/** A game as a cartridge: tilts towards the cursor, whole card is clickable. */
export function GameCard({ game }: { game: Game }) {
  const tiltRef = useTilt<HTMLElement>(9);
  return (
    <article
      ref={tiltRef}
      className={`game-card tilt game-card--${game.slug}`}
      style={{ '--accent': game.theme.accent, '--accent2': game.theme.accent2 } as CSSProperties}
    >
      <div className="game-card__shell">
        <div className="game-card__top" aria-hidden="true">
          <span className="game-card__grip" />
          <span className="game-card__code">{game.catalog}</span>
        </div>
        <div className="game-card__art">
          <GameArt game={game} />
          {hasRealCover(game) ? null : <span className="game-card__tag">Placeholder art</span>}
        </div>
        <div className="game-card__body">
          <span className={`status status--${game.status}`}>{game.statusLabel}</span>
          <h3 className="game-card__title">
            <Link to={paths.game(game.slug)} className="game-card__link" data-cursor="Play">
              {game.title}
            </Link>
          </h3>
          <p className="game-card__genre">{game.genre}</p>
          <p className="game-card__summary">{game.summary}</p>
          <ul className="game-card__tech" aria-label="Technology">
            {(game.tech.length ? game.tech : ['Tech: TBD']).map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="game-card__foot" aria-hidden="true">
          <span className="game-card__start">Press start</span>
          <span className="game-card__arrow">→</span>
        </div>
      </div>
      <span className="tilt__glare" aria-hidden="true" />
    </article>
  );
}

/** The slot waiting for the next game. */
export function EmptySlotCard({ slot }: { slot: number }) {
  const tiltRef = useTilt<HTMLElement>(6);
  return (
    <article ref={tiltRef} className="game-card game-card--empty tilt">
      <div className="game-card__shell">
        <div className="game-card__top" aria-hidden="true">
          <span className="game-card__grip" />
          <span className="game-card__code">ZG-{String(slot).padStart(3, '0')}</span>
        </div>
        <div className="game-card__art game-card__art--empty" aria-hidden="true">
          <span className="empty__q">?</span>
          <span className="empty__insert">Insert cartridge</span>
        </div>
        <div className="game-card__body">
          <span className="status status--empty">Empty slot</span>
          <h3 className="game-card__title">???</h3>
          <p className="game-card__genre">Next game</p>
          <p className="game-card__summary">
            Nothing here yet. Whatever gets built next lives in this slot<span className="loading-dots" aria-hidden="true" />
          </p>
        </div>
      </div>
    </article>
  );
}

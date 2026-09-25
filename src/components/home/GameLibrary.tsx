import type { CSSProperties } from 'react';
import { GAMES } from '../../data/games';
import { paths } from '../../lib/paths';
import { Link } from '../../lib/router';
import { SectionHeading } from '../ui/SectionHeading';
import { EmptySlotCard, GameCard } from '../GameCard';
import './game-library.css';

export function GameLibrary() {
  return (
    <section id="games" className="section library" aria-labelledby="games-title" data-byte="Pick a cartridge!">
      <div className="container">
        <div className="library__head">
          <SectionHeading
            index="02"
            kicker="Game library"
            title="Games"
            intro="One in development. One concept. One empty slot waiting for whatever comes next."
            id="games-title"
          />
          <Link to={paths.games} className="text-link library__launcher" data-reveal="fade">
            Open the launcher <span className="arrow">→</span>
          </Link>
        </div>
        <ul className="library__grid">
          {GAMES.map((game, i) => (
            <li key={game.slug} data-reveal style={{ '--delay': `${i * 90}ms` } as CSSProperties}>
              <GameCard game={game} />
            </li>
          ))}
          <li data-reveal style={{ '--delay': `${GAMES.length * 90}ms` } as CSSProperties}>
            <EmptySlotCard slot={GAMES.length + 1} />
          </li>
        </ul>
      </div>
    </section>
  );
}

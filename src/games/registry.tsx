import type { Game } from '../data/games';
import { imageNamed } from '../lib/images';
import { BloodcastScene } from './bloodcast/art/BloodcastScene';
import { DominoArt } from './domino-dancing/DominoArt';
import { GeneratedArt } from './GeneratedArt';

/**
 * The art shown in a game's panel:
 *  1. src/games/<slug>/assets/cover.(png|jpg|webp) if it exists
 *  2. a hand-made placeholder for known games
 *  3. a generated pixel pattern for anything new
 */
export function GameArt({ game, sizes = '(min-width: 1024px) 55vw, 100vw' }: { game: Game; sizes?: string }) {
  const cover = imageNamed(game.slug, 'cover');
  if (cover) {
    return (
      <img
        className="game-art__img"
        src={cover.src}
        srcSet={cover.srcSet}
        sizes={sizes}
        width={cover.width}
        height={cover.height}
        alt={`${game.title} artwork`}
        loading="lazy"
        decoding="async"
      />
    );
  }
  switch (game.slug) {
    case 'bloodcast':
      return <BloodcastScene variant="card" />;
    case 'domino-dancing':
      return <DominoArt variant="stage" />;
    default:
      return <GeneratedArt seed={game.slug} accent={game.theme.accent} accent2={game.theme.accent2} />;
  }
}

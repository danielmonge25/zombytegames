import type { ComponentType } from 'react';
import type { Game } from '../data/games';
import { imageNamed } from '../lib/images';
import { BloodcastScene } from './bloodcast/art/BloodcastScene';
import { BloodcastPage } from './bloodcast/BloodcastPage';
import { DominoArt } from './domino-dancing/DominoArt';
import { GeneratedArt } from './GeneratedArt';

/**
 * Games that need more than the generic <ProjectPage> template get a custom
 * page here. Everything else just works from src/data/games.ts.
 */
export const CUSTOM_GAME_PAGES: Record<string, ComponentType<{ game: Game }>> = {
  bloodcast: BloodcastPage,
};

/** Optional interactive hero visual for the generic game page. */
export const STAGE_ART: Record<string, ComponentType> = {
  'domino-dancing': () => <DominoArt variant="stage" />,
};

/**
 * Cover art for cards and the launcher:
 *  1. src/games/<slug>/assets/cover.(png|jpg|webp) if it exists
 *  2. a hand-made placeholder for known games
 *  3. a generated pixel pattern for anything new
 */
export function GameArt({ game, sizes = '(min-width: 1024px) 33vw, 100vw' }: { game: Game; sizes?: string }) {
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
        alt=""
        loading="lazy"
        decoding="async"
      />
    );
  }
  switch (game.slug) {
    case 'bloodcast':
      return <BloodcastScene variant="card" />;
    case 'domino-dancing':
      return <DominoArt variant="card" />;
    default:
      return <GeneratedArt seed={game.slug} accent={game.theme.accent} accent2={game.theme.accent2} />;
  }
}

/** True when the art shown for a game is a placeholder (so we can label it honestly). */
export const hasRealCover = (game: Game) => Boolean(imageNamed(game.slug, 'cover'));

/**
 * THE GAME LIST
 * ------------------------------------------------------------------
 * Every game shown on the site comes from this list. Each entry gets its
 * own panel in the Games section of the home page, in this order.
 *
 * Optional art: drop `cover.png|jpg|webp` into src/games/<slug>/assets/
 * and it replaces the placeholder art automatically.
 */

export type GameStatus = 'in-development' | 'prototype' | 'concept' | 'released';

export interface GameLink {
  label: string;
  /** Only links with a real URL are shown. Never put a fake URL here. */
  url: string | null;
}

export interface Game {
  /** Used for the section anchor: zombytegames.com/#<slug> */
  slug: string;
  title: string;
  tagline: string;
  status: GameStatus;
  /** Text on the status badge. */
  statusLabel: string;
  genre: string;
  /** Short tech list. Empty = not decided yet. */
  tech: string[];
  /** One or two sentences. Keep it short — this is an overview. */
  summary: string;
  /** Store / community links, shown as buttons once they have a URL. */
  links: GameLink[];
  /** Cartridge-style label, e.g. "ZG-001". */
  catalog: string;
  /** Accent colours for the game's panel. */
  theme: { accent: string; accent2: string };
}

export const GAMES: Game[] = [
  {
    slug: 'bloodcast',
    title: 'BLOODCAST',
    tagline: 'A strange place to fish.',
    status: 'in-development',
    statusLabel: 'In development',
    genre: 'Multiplayer gothic fishing / social hangout',
    tech: ['Unity', 'C#', 'Multiplayer'],
    summary:
      'A multiplayer fishing and social hangout game set in a dark gothic world. Fish, chat, explore, collect rare fish, customize your character, and hang out with other players.',
    links: [
      { label: 'Steam', url: null },
      { label: 'itch.io', url: null },
      { label: 'Discord', url: null },
    ],
    catalog: 'ZG-001',
    theme: { accent: '#e0405e', accent2: '#efe6d2' },
  },
  {
    slug: 'domino-dancing',
    title: 'Domino Dancing',
    tagline: 'A roguelike built around dominoes.',
    status: 'concept',
    statusLabel: 'Concept',
    genre: '2D single-player roguelike',
    tech: [],
    summary:
      'A 2D single-player roguelike built around dominoes, with incremental progression and strategic systems — inspired by the structure of games like Balatro, with its own identity and mechanics.',
    links: [],
    catalog: 'ZG-002',
    theme: { accent: '#ff5fa2', accent2: '#53e5ff' },
  },
];

export const getGame = (slug: string) => GAMES.find((g) => g.slug === slug);

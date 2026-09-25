/**
 * THE GAME REGISTRY
 * ------------------------------------------------------------------
 * Every game on the site comes from this list. Adding an entry gives it:
 *   • a cartridge card on the home page and in the /games/ launcher
 *   • its own page at /games/<slug>/ (generic template, or a custom one
 *     registered in src/games/registry.tsx)
 *   • a pre-rendered HTML page + sitemap entry at build time
 *
 * Optional art: drop `cover.png|jpg|webp` into src/games/<slug>/assets/
 * and it replaces the placeholder art automatically.
 */

export type GameStatus = 'in-development' | 'prototype' | 'concept' | 'released';

export interface GameLink {
  label: string;
  /** `null` = placeholder slot ("coming soon"). Never put a fake URL here. */
  url: string | null;
}

export interface Game {
  slug: string;
  title: string;
  tagline: string;
  status: GameStatus;
  /** Text on the status badge. */
  statusLabel: string;
  genre: string;
  /** Short tech list for cards. Empty = not decided yet. */
  tech: string[];
  /** One or two sentences for cards and the launcher. */
  summary: string;
  /** Paragraphs for the game page. */
  description: string[];
  facts: { label: string; value: string }[];
  links: GameLink[];
  /** Cartridge label, e.g. "ZG-001". */
  catalog: string;
  /** Accent colours for cards and the generic page template. */
  theme: { accent: string; accent2: string; ink: string };
  seo: { title: string; description: string; image: string };
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
      'A multiplayer fishing and social hangout game set in a dark gothic world. Fish, chat, explore, collect, and hang out.',
    description: [
      'BLOODCAST is a multiplayer fishing and social hangout game set in a dark gothic world.',
      'Cast a line into ponds and rivers, collect fish of varying rarity, customize your character, and hang out with other players — talking through text chat, not voice.',
    ],
    facts: [
      { label: 'Status', value: 'In development' },
      { label: 'Genre', value: 'Multiplayer gothic fishing / social hangout' },
      { label: 'Engine', value: 'Unity' },
      { label: 'Language', value: 'C#' },
      { label: 'Chat', value: 'Text only — no voice chat' },
      { label: 'Release', value: 'TBA' },
    ],
    links: [
      { label: 'Steam', url: null },
      { label: 'itch.io', url: null },
      { label: 'Discord', url: null },
      { label: 'GitHub', url: null },
    ],
    catalog: 'ZG-001',
    theme: { accent: '#e0405e', accent2: '#efe6d2', ink: '#0b0710' },
    seo: {
      title: 'BLOODCAST — A strange place to fish · Zombyte Games',
      description:
        'BLOODCAST is a multiplayer gothic fishing and social hangout game in development by solo developer Zombyte Games. Fish, chat, explore, collect, and hang out.',
      image: '/og/og-bloodcast.jpg',
    },
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
      'A 2D single-player roguelike built around dominoes, with incremental progression and strategic systems.',
    description: [
      'Domino Dancing is a 2D single-player roguelike built around dominoes.',
      'It uses incremental progression and strategic systems inspired by the structure of games like Balatro — while building its own identity and mechanics.',
      'Right now it is a concept / prototype. Nothing is released and nothing is announced: it is an idea being explored.',
    ],
    facts: [
      { label: 'Status', value: 'Concept / prototype' },
      { label: 'Genre', value: 'Roguelike' },
      { label: 'Perspective', value: '2D' },
      { label: 'Players', value: 'Single-player' },
      { label: 'Progression', value: 'Incremental' },
      { label: 'Release', value: 'Not announced' },
    ],
    links: [],
    catalog: 'ZG-002',
    theme: { accent: '#ff5fa2', accent2: '#53e5ff', ink: '#0d0a14' },
    seo: {
      title: 'Domino Dancing — Concept · Zombyte Games',
      description:
        'Domino Dancing is a 2D single-player roguelike concept built around dominoes, with incremental progression and strategic systems. A Zombyte Games prototype.',
      image: '/og/og-domino-dancing.jpg',
    },
  },
];

export const getGame = (slug: string) => GAMES.find((g) => g.slug === slug);

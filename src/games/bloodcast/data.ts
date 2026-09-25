import type { SpriteName } from '../../components/pixel/sprites';

/**
 * BLOODCAST page content. Everything here is based on what is actually
 * known about the game — unknown details stay as "???" placeholders.
 *
 * Art drop-in folders (see README.md):
 *   assets/key-art.(png|jpg|webp)        → hero + home page art
 *   assets/world/castle|graveyard|garden|waterways.(png|jpg|webp)
 *   assets/fish/fish-001.(png|webp)      → fish collection card art
 *   assets/characters/girl.(png|webp)    → the mysterious girl
 *   assets/characters/player.(png|webp)  → character customization
 *   assets/screenshots/*.(png|jpg|webp)  → screenshot gallery (sorted by name)
 */

export const GAMEPLAY: { id: string; title: string; text: string; sprite: SpriteName }[] = [
  { id: 'fish', title: 'Fish', text: 'Cast into ponds and rivers and see what bites.', sprite: 'bobber' },
  { id: 'chat', title: 'Chat', text: 'Talk with other players through text chat. No voice chat — just words.', sprite: 'chat' },
  { id: 'explore', title: 'Explore', text: 'Wander a dark gothic world: a castle, a graveyard, a garden, ponds and rivers.', sprite: 'compass' },
  { id: 'collect', title: 'Collect', text: 'Catch many different fish, from common finds to rare discoveries.', sprite: 'collection' },
  { id: 'customize', title: 'Customize', text: 'Make your character your own.', sprite: 'hat' },
  { id: 'hang-out', title: 'Hang out', text: 'Relax, fish side by side, and spend time with other players.', sprite: 'people' },
];

export interface Location {
  id: 'castle' | 'graveyard' | 'garden' | 'waterways';
  name: string;
  short: string;
  text: string;
  sprite: SpriteName;
}

export const LOCATIONS: Location[] = [
  { id: 'castle', name: 'The Castle', short: 'Castle', text: 'A large gothic house — castle-sized, and impossible to miss.', sprite: 'castle' },
  { id: 'graveyard', name: 'The Graveyard', short: 'Graveyard', text: 'Old graves, crooked crosses, and plenty of fog.', sprite: 'tombstone' },
  { id: 'garden', name: 'The Dark Garden', short: 'Garden', text: 'A dark garden, overgrown and strangely beautiful.', sprite: 'rose' },
  { id: 'waterways', name: 'Ponds & Rivers', short: 'Waterways', text: 'Ponds and rivers running through the world. Every cast starts here.', sprite: 'wave' },
];

export type FishShape = 'classic' | 'eel' | 'puffer' | 'angler' | 'ray' | 'koi';

export interface Fish {
  id: string;
  /** null = not revealed yet ("???") */
  name: string | null;
  rarity: string | null;
  habitat: string | null;
  description: string | null;
  /** Placeholder silhouette until real art exists in assets/fish/<id>.png */
  shape: FishShape;
}

/**
 * The fish collection. Add real fish by filling in the fields — and drop
 * art into assets/fish/<id>.png. Leave fields null to keep them as "???".
 */
export const FISH: Fish[] = [
  { id: 'fish-001', name: null, rarity: null, habitat: null, description: null, shape: 'classic' },
  { id: 'fish-002', name: null, rarity: null, habitat: null, description: null, shape: 'eel' },
  { id: 'fish-003', name: null, rarity: null, habitat: null, description: null, shape: 'puffer' },
  { id: 'fish-004', name: null, rarity: null, habitat: null, description: null, shape: 'angler' },
  { id: 'fish-005', name: null, rarity: null, habitat: null, description: null, shape: 'ray' },
  { id: 'fish-006', name: null, rarity: null, habitat: null, description: null, shape: 'koi' },
  { id: 'fish-007', name: null, rarity: null, habitat: null, description: null, shape: 'eel' },
  { id: 'fish-008', name: null, rarity: null, habitat: null, description: null, shape: 'classic' },
  { id: 'fish-009', name: null, rarity: null, habitat: null, description: null, shape: 'angler' },
  { id: 'fish-010', name: null, rarity: null, habitat: null, description: null, shape: 'koi' },
  { id: 'fish-011', name: null, rarity: null, habitat: null, description: null, shape: 'puffer' },
  { id: 'fish-012', name: null, rarity: null, habitat: null, description: null, shape: 'ray' },
];

/** Colours for rarity labels once the tiers are revealed, e.g. { Common: '#a7a1bc', Rare: '#53e5ff' }. */
export const RARITY_COLORS: Record<string, string> = {};

export const TECH: { name: string; glyph: string; text: string }[] = [
  { name: 'Unity', glyph: 'UN', text: 'The engine BLOODCAST is being built in.' },
  { name: 'C#', glyph: 'C#', text: 'The gameplay code — fishing, collecting, customizing, and everything in between.' },
  { name: 'Networking', glyph: 'NET', text: 'Multiplayer, so players can fish, chat, and hang out together.' },
  { name: 'Game Systems', glyph: 'SYS', text: 'Fishing, rarity and collection, progression, and character customization.' },
];

/** Colours for the placeholder mannequin in the customization section (a toy, not the real options). */
export const TINTS = [
  { name: 'Blood', color: '#e0405e' },
  { name: 'Bone', color: '#efe6d2' },
  { name: 'Violet', color: '#8b6cff' },
  { name: 'Bog', color: '#3fb8a8' },
  { name: 'Candle', color: '#ffb547' },
  { name: 'Ash', color: '#8c86a5' },
];

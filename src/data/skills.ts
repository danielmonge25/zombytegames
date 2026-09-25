import type { SpriteName } from '../components/pixel/sprites';

/** The "Inventory" (skills) section. Honest, no skill levels or percentages. */
export interface Skill {
  name: string;
  /** Short label for the item slot. */
  glyph: string;
  note: string;
}

export interface SkillBag {
  id: string;
  title: string;
  tag: string;
  sprite: SpriteName;
  color: string;
  items: Skill[];
  /** Empty slots = room to grow. */
  emptySlots: number;
}

export const INVENTORY: SkillBag[] = [
  {
    id: 'game-development',
    title: 'Game Development',
    tag: 'Leveling up',
    sprite: 'gamepad',
    color: '#c6ff3d',
    items: [
      { name: 'Unity', glyph: 'UN', note: 'The engine BLOODCAST is being built in.' },
      { name: 'C#', glyph: 'C#', note: 'Gameplay code, systems, and a lot of experiments.' },
      { name: 'Gameplay Programming', glyph: 'GP', note: 'Turning mechanics into code — like casting a line.' },
      { name: 'Game Systems', glyph: 'GS', note: 'Collections, progression, and multiplayer plumbing.' },
    ],
    emptySlots: 2,
  },
  {
    id: 'software-engineering',
    title: 'Software Engineering',
    tag: 'Main class',
    sprite: 'code',
    color: '#53e5ff',
    items: [
      { name: 'Python', glyph: 'PY', note: 'AI, automation, and scripting.' },
      { name: 'APIs', glyph: 'API', note: 'Building and connecting services.' },
      { name: 'Automation', glyph: 'AU', note: 'Letting machines do the repetitive parts.' },
      { name: 'Git', glyph: 'GIT', note: 'Version control for everything — including this website.' },
      { name: 'CI/CD', glyph: 'CI', note: 'This site deploys itself on every push to main.' },
    ],
    emptySlots: 1,
  },
  {
    id: 'ai',
    title: 'AI',
    tag: 'Day job',
    sprite: 'chip',
    color: '#8b6cff',
    items: [
      { name: 'Generative AI', glyph: 'GEN', note: 'Building with generative models.' },
      { name: 'AI APIs', glyph: 'AI', note: 'Integrating AI models into real applications.' },
      { name: 'Automation', glyph: 'AUT', note: 'Workflows where AI does the heavy lifting.' },
      { name: 'AI-assisted development', glyph: 'AID', note: 'AI tools as part of the everyday development workflow.' },
    ],
    emptySlots: 2,
  },
];

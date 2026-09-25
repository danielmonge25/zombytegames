import type { SpriteName } from '../components/pixel/sprites';

/** The "My journey" timeline on the home page. Keep it honest. */
export interface JourneyStage {
  id: string;
  title: string;
  era: string;
  summary: string;
  details: string[];
  tags: string[];
  sprite: SpriteName;
  current?: boolean;
}

export const JOURNEY: JourneyStage[] = [
  {
    id: 'software-engineering',
    title: 'Software Engineering',
    era: 'The foundation',
    summary: 'Graduated as a Software Engineer.',
    details: ['The foundation for everything since: software design, problem solving, and turning big ideas into systems that work.'],
    tags: ['Degree', 'Foundations'],
    sprite: 'code',
  },
  {
    id: 'ai-engineering',
    title: 'AI Engineering',
    era: 'The day job',
    summary: 'Working professionally as an AI Engineer.',
    details: ['Software engineering, artificial intelligence, automation, APIs, cloud technologies, and production systems.'],
    tags: ['AI', 'Automation', 'APIs', 'Cloud', 'Production'],
    sprite: 'chip',
  },
  {
    id: 'game-development',
    title: 'Game Development',
    era: 'The new quest',
    summary: 'Starting Zombyte Games.',
    details: [
      'Taking the same engineering mindset into games — built independently, one project at a time.',
      'BLOODCAST is in development. Domino Dancing is a concept on the bench.',
    ],
    tags: ['Unity', 'C#', 'Game design'],
    sprite: 'gamepad',
    current: true,
  },
];

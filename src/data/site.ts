/**
 * Site-wide settings. Most day-to-day edits happen here.
 */
export const SITE = {
  name: 'Zombyte Games',
  url: 'https://zombytegames.com',
  title: 'Zombyte Games — Solo Indie Game Developer',
  description:
    'Zombyte Games is the personal game development portfolio of a Software Engineer and AI Engineer building independent games and interactive experiences.',
  tagline: 'One engineer building weird, interesting games.',
  ogImage: '/og/og-default.jpg',
  ogImageAlt: 'Zombyte Games — solo indie game development',
} as const;

/** Slug of the game shown in the nav status pill and marked "Currently building" in the Games section. */
export const CURRENTLY_BUILDING = 'bloodcast';

export interface ContactLink {
  id: 'github' | 'linkedin' | 'email' | 'discord';
  label: string;
  /** Leave `null` to show a "coming soon" slot. Example: 'https://github.com/your-name' or 'mailto:you@example.com'. */
  url: string | null;
  /** Optional text shown under the label, e.g. '@zombytegames'. */
  handle?: string;
}

/**
 * Contact / social links. Nothing is invented here: every slot stays a
 * placeholder until you paste a real URL.
 */
export const CONTACT_LINKS: ContactLink[] = [
  { id: 'github', label: 'GitHub', url: null },
  { id: 'linkedin', label: 'LinkedIn', url: null },
  { id: 'email', label: 'Email', url: null },
  { id: 'discord', label: 'Discord', url: null },
];

export const NAV_ITEMS = [
  { label: 'Games', href: '/#games', match: '#games' },
  { label: 'About', href: '/#about', match: '#about' },
  { label: 'Contact', href: '/#contact', match: '#contact' },
] as const;

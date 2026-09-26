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

/** The person behind Zombyte Games. */
export const OWNER = {
  name: 'Daniel Monge',
  role: 'AI Engineer',
  country: 'Costa Rica',
} as const;

export interface ContactLink {
  id: 'linkedin' | 'discord' | 'youtube' | 'tiktok';
  label: string;
  /** Leave `null` to show a "coming soon" slot. */
  url: string | null;
  /** Optional text shown under the label, e.g. '@zombytegames'. */
  handle?: string;
}

/**
 * Contact / social links. Nothing is invented here: every slot stays a
 * placeholder until you paste a real URL.
 */
export const CONTACT_LINKS: ContactLink[] = [
  { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/danielmngarc/', handle: 'Daniel Monge' },
  { id: 'discord', label: 'Discord', url: 'https://discord.gg/4vbHn7uxNs', handle: 'Join the server' },
  { id: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@ZombyteGames', handle: '@ZombyteGames' },
  { id: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@zombytegames', handle: '@zombytegames' },
];

/**
 * GoatCounter site code for visit stats (the "zombytegames" in
 * zombytegames.goatcounter.com). Leave `null` to turn analytics off.
 */
export const GOATCOUNTER_CODE: string | null = null;

export const NAV_ITEMS = [
  { label: 'Games', href: '/#games', match: '#games' },
  { label: 'About', href: '/#about', match: '#about' },
  { label: 'Contact', href: '/#contact', match: '#contact' },
] as const;

/** Every internal URL in one place. The site is a single page with sections. */
export const paths = {
  home: '/',
  games: '/#games',
  game: (slug: string) => `/#${slug}`,
  about: '/#about',
  contact: '/#contact',
};

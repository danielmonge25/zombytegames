/** Every internal URL in one place. Pages live in folders, so URLs end with "/". */
export const paths = {
  home: '/',
  about: '/#about',
  contact: '/#contact',
  games: '/games/',
  game: (slug: string) => `/games/${slug}/`,
  devlog: '/devlog/',
  post: (slug: string) => `/devlog/${slug}/`,
};

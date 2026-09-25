/**
 * Pixel sprites as text maps: one character = one pixel, "." = transparent.
 * Colours come from PALETTE. Rendered by <PixelSprite name="fish" />.
 */

export const PALETTE: Record<string, string> = {
  k: '#15111f', // outline
  w: '#f4f1ff', // white
  g: '#8c86a5', // stone grey
  G: '#4b4560', // dark grey
  l: '#c6ff3d', // lime
  L: '#7fc21a', // lime shade
  h: '#eaffb0', // lime highlight
  v: '#8b6cff', // violet
  V: '#5a3fd6', // violet shade
  p: '#ff5fa2', // pink
  P: '#c73a7c', // pink shade
  c: '#53e5ff', // cyan
  C: '#1f9fc0', // cyan shade
  a: '#ffb547', // amber
  A: '#d4801c', // amber shade
  r: '#e0405e', // crimson
  R: '#9c2239', // crimson shade
  b: '#efe6d2', // bone
  B: '#b9ad93', // bone shade
  m: '#8a5a33', // wood
};

export const SPRITES = {
  fish: [
    '......kkkkk.....',
    'kk..kkccccckk...',
    'kckkcccccccccck.',
    'kcccccccccwkcck.',
    'kcccccccccccccck',
    'kckkCCCCCCCCCck.',
    'kk..kkCCCCCCkk..',
    '......kkkkkk....',
  ],
  goldfish: [
    '......kkkkk.....',
    'kk..kkaaaaakk...',
    'kakkaaaaaaaaaak.',
    'kaaaaaaaaawkaak.',
    'kaaaaaaaaaaaaaak',
    'kakkAAAAAAAAAak.',
    'kk..kkAAAAAAkk..',
    '......kkkkkk....',
  ],
  pinkfish: [
    '......kkkkk.....',
    'kk..kkpppppkk...',
    'kpkkppppppppppk.',
    'kpppppppppwkppk.',
    'kppppppppppppppk',
    'kpkkPPPPPPPPPpk.',
    'kk..kkPPPPPPkk..',
    '......kkkkkk....',
  ],
  bobber: [
    '....k...',
    '....k...',
    '..kkkk..',
    '.krrrrk.',
    'krwrrrrk',
    'krrrrrrk',
    'kRRRRRRk',
    'kbbbbbbk',
    'kbbbbbbk',
    '.kBBBBk.',
    '..kkkk..',
  ],
  gamepad: [
    '..kkkkkkkkkk..',
    '.kvvvvvvvvvvk.',
    'kvvwvvvvvvpvvk',
    'kvwwwvvvvpvpvk',
    'kvvwvvvvvvpvvk',
    'kvvvvkkkkvvvvk',
    '.kvvk....kvvk.',
    '..kk......kk..',
  ],
  heart: [
    '.kk...kk.',
    'kppk.kppk',
    'kpwppppPk',
    'kppppppPk',
    '.kppppPk.',
    '..kpppk..',
    '...kPk...',
    '....k....',
  ],
  skull: [
    '..kkkkkk..',
    '.kbbbbbbk.',
    'kbbbbbbbbk',
    'kbkkbbkkbk',
    'kbkkbbkkbk',
    'kbbbbbbbbk',
    '.kbbkkbbk.',
    '..kbbbbk..',
    '..kbkbkbk.',
    '...kkkk...',
  ],
  sparkle: [
    '...a...',
    '...a...',
    '..aaa..',
    'aaawaaa',
    '..aaa..',
    '...a...',
    '...a...',
  ],
  floppy: [
    'kkkkkkkkk.',
    'kvvwwwwvvk',
    'kvvwwwkvvk',
    'kvvwwwkvvk',
    'kvvvvvvvvk',
    'kvbbbbbbvk',
    'kvbggggbvk',
    'kvbbbbbbvk',
    'kvbggggbvk',
    'kkkkkkkkkk',
  ],
  code: [
    '...l...l.l...',
    '..l....l..l..',
    '.l....l....l.',
    'l.....l.....l',
    '.l....l....l.',
    '..l..l....l..',
    '...l.l...l...',
  ],
  chip: [
    '..k.k.k.k..',
    '.kkkkkkkkk.',
    'kkvvvvvvvkk',
    '.kvvvvvvvk.',
    'kkvvlllvvkk',
    '.kvvlwlvvk.',
    'kkvvlllvvkk',
    '.kvvvvvvvk.',
    'kkvvvvvvvkk',
    '.kkkkkkkkk.',
    '..k.k.k.k..',
  ],
  trophy: [
    '.kkkkkkkkk.',
    'kkawaaaaakk',
    'k.kaaaaak.k',
    'k.kaaaaak.k',
    '.kkaaaaakk.',
    '...kaaak...',
    '....kak....',
    '....kak....',
    '...kkkkk...',
    '..kAAAAAk..',
    '..kkkkkkk..',
  ],
  lock: [
    '..ggggg..',
    '.gg...gg.',
    '.g.....g.',
    '.g.....g.',
    'kkkkkkkkk',
    'kaaaaaaak',
    'kaaakaaak',
    'kaaakaaak',
    'kaaaaaaak',
    'kkkkkkkkk',
  ],
} as const satisfies Record<string, readonly string[]>;

export type SpriteName = keyof typeof SPRITES;

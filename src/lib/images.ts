/**
 * Drop-in art: any image inside src/games/<slug>/assets/ is picked up
 * automatically, resized (480–1920px) and converted to WebP at build time.
 *
 *   src/games/<slug>/assets/cover.png   → replaces the placeholder art in that game's panel
 */

export interface ImageAsset {
  /** File name without extension, e.g. "01-the-castle". */
  name: string;
  /** Human label derived from the file name, e.g. "The castle". */
  label: string;
  /** Largest optimized version (≤ 1920px wide). */
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

type ImgOutput = { src: string; w: number; h: number; srcset?: string };

const modules = import.meta.glob<ImgOutput>(
  '/src/games/*/assets/**/*.{png,jpg,jpeg,webp,avif,PNG,JPG,JPEG,WEBP,AVIF}',
  { eager: true, import: 'default', query: '?w=480;960;1440;1920&format=webp&as=img' },
);

/** "01-the-castle_at-night" → "The castle at night" */
function labelFromFileName(name: string): string {
  const text = name.replace(/^\d+[-_ .]*/, '').replace(/[-_]+/g, ' ').trim();
  return text ? text[0].toUpperCase() + text.slice(1) : name;
}

/** Remove duplicate width descriptors (small originals are never upscaled). */
function dedupeSrcSet(srcset: string | undefined, fallback: string, width: number): string {
  if (!srcset) return `${fallback} ${width}w`;
  const seen = new Map<string, string>();
  for (const part of srcset.split(',')) {
    const [url, descriptor] = part.trim().split(/\s+/);
    if (url && descriptor && !seen.has(descriptor)) seen.set(descriptor, url);
  }
  return [...seen].map(([d, url]) => `${url} ${d}`).join(', ');
}

const ALL = Object.entries(modules)
  .map(([path, img]) => {
    const rel = path.replace('/src/games/', '').replace('/assets/', '/'); // "bloodcast/cover.png"
    const dir = rel.slice(0, rel.lastIndexOf('/'));
    const name = rel.slice(rel.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '');
    const asset: ImageAsset = {
      name,
      label: labelFromFileName(name),
      src: img.src,
      srcSet: dedupeSrcSet(img.srcset, img.src, img.w),
      width: img.w,
      height: img.h,
    };
    return { dir, asset };
  })
  .sort((a, b) => a.asset.name.localeCompare(b.asset.name, 'en', { numeric: true }));


/** One image by name (without extension), e.g. imageNamed('bloodcast/world', 'castle'). */
export function imageNamed(dir: string, name: string): ImageAsset | undefined {
  return ALL.find((e) => e.dir === dir && e.asset.name.toLowerCase() === name.toLowerCase())?.asset;
}

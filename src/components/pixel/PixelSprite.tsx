import { memo } from 'react';
import { PALETTE, SPRITES, type SpriteName } from './sprites';

interface Rect {
  x: number;
  y: number;
  w: number;
  fill: string;
}

/** Converts a text map into horizontal runs of same-coloured pixels. */
export function spriteRects(rows: readonly string[], palette: Record<string, string> = PALETTE): Rect[] {
  const rects: Rect[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === '.') {
        x++;
        continue;
      }
      let w = 1;
      while (x + w < row.length && row[x + w] === ch) w++;
      rects.push({ x, y, w, fill: palette[ch] ?? PALETTE[ch] ?? '#ff00ff' });
      x += w;
    }
  });
  return rects;
}

const cache = new Map<string, Rect[]>();

interface Props {
  name: SpriteName;
  /** Size of one pixel in CSS px (default 4). */
  scale?: number;
  className?: string;
  /** Accessible name. Without it the sprite is decorative (aria-hidden). */
  title?: string;
}

export const PixelSprite = memo(function PixelSprite({ name, scale = 4, className, title }: Props) {
  const rows = SPRITES[name];
  let rects = cache.get(name);
  if (!rects) {
    rects = spriteRects(rows);
    cache.set(name, rects);
  }
  const w = rows[0].length;
  const h = rows.length;
  return (
    <svg
      className={className ? `pixel ${className}` : 'pixel'}
      viewBox={`0 0 ${w} ${h}`}
      width={w * scale}
      height={h * scale}
      shapeRendering="crispEdges"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1.02} fill={r.fill} />
      ))}
    </svg>
  );
});

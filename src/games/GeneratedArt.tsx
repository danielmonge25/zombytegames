import { useMemo } from 'react';
import { seeded } from '../lib/random';

/** Deterministic pixel pattern used as cover art for games without art yet. */
export function GeneratedArt({ seed, accent, accent2 }: { seed: string; accent: string; accent2: string }) {
  const cells = useMemo(() => {
    let h = 0;
    for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const r = seeded(h);
    const out: { x: number; y: number; c: string; o: number }[] = [];
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 8; x++) {
        if (r() < 0.42) {
          const c = r() < 0.6 ? accent : accent2;
          const o = +(0.25 + r() * 0.75).toFixed(2);
          out.push({ x, y, c, o }, { x: 15 - x, y, c, o }); // mirrored like an invader
        }
      }
    }
    return out;
  }, [seed, accent, accent2]);

  return (
    <svg viewBox="-4 -3 24 16" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" aria-hidden="true" style={{ width: '100%', height: '100%', background: '#0d0b14' }}>
      {cells.map((p, i) => (
        <rect key={i} x={p.x} y={p.y} width={1.02} height={1.02} fill={p.c} opacity={p.o} />
      ))}
    </svg>
  );
}

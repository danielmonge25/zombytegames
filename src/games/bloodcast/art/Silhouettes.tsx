import { useId, type CSSProperties } from 'react';
import type { FishShape } from '../data';

/**
 * Placeholder silhouettes for BLOODCAST (not final designs):
 * fish shapes for the collection, the mysterious girl, and a mannequin.
 */

const FISH_PATHS: Record<FishShape, { body: string; extra?: string; eye: [number, number]; lure?: [number, number] }> = {
  classic: {
    body: 'M16 32C28 14 58 8 84 14c16 4 26 12 30 18-4 6-14 14-30 18-26 6-56 0-68-18Z',
    extra: 'M20 32 3 15l4 17-4 17ZM48 13l12-10 11 10ZM58 50l7 11 8-12Z',
    eye: [97, 28],
  },
  eel: {
    body: 'M4 38c12-16 26-14 38-4s26 10 38-2 24-12 36-4c-4 6-12 8-20 6-10 8-24 18-40 14s-26-14-38-8c-6 4-10 4-14-2Z',
    extra: 'M50 27l8-7 8 8Z',
    eye: [104, 27],
  },
  puffer: {
    body: 'M62 8a24 24 0 1 1 0 48 24 24 0 0 1 0-48Z',
    extra:
      'M40 32 22 20l4 12-4 12ZM62 2l3 7h-6ZM80 7l-1 8-5-4ZM90 20l-5 6-2-6ZM44 7l1 8 5-4ZM62 62l-3-7h6ZM80 57l-6-3 5-5ZM44 57l6-3-5-5Z',
    eye: [74, 26],
  },
  angler: {
    body: 'M22 36c4-20 30-26 52-20 18 4 34 14 36 24-10 10-34 16-60 12-16-2-28-6-28-16Z',
    extra: 'M24 36 4 22l4 14-4 14ZM84 44l4 6 3-6 3 6 3-6 3 6 3-7Z',
    eye: [88, 30],
    lure: [106, 8],
  },
  ray: {
    body: 'M30 32C50 10 80 6 112 32 80 58 50 54 30 32Z',
    extra: 'M32 31 2 29v6l30-1Z',
    eye: [90, 26],
  },
  koi: {
    body: 'M42 32c10-14 38-18 58-12 8 3 14 8 16 12-2 4-8 9-16 12-20 6-48 2-58-12Z',
    extra: 'M44 32C32 20 18 10 2 14c10 8 14 14 12 18 2 4-2 10-12 18 16 4 30-6 42-18ZM70 18l10-10 6 11ZM72 46l8 9 4-10Z',
    eye: [103, 29],
  },
};

export function FishSilhouette({ shape, className, revealed }: { shape: FishShape; className?: string; revealed?: boolean }) {
  const f = FISH_PATHS[shape];
  return (
    <svg className={`fish-sil${className ? ` ${className}` : ''}`} viewBox="0 0 120 64" aria-hidden="true" focusable="false">
      <g className="fish-sil__body" fill={revealed ? 'currentColor' : '#07050b'} stroke="rgb(255 122 147 / .35)" strokeWidth="1.2">
        <path d={f.body} />
        {f.extra ? <path d={f.extra} /> : null}
      </g>
      {f.lure ? (
        <>
          <path d={`M80 18C86 6 ${f.lure[0] - 8} ${f.lure[1] - 4} ${f.lure[0]} ${f.lure[1]}`} stroke="rgb(255 122 147 / .45)" strokeWidth="1.5" fill="none" />
          <circle className="fish-sil__lure" cx={f.lure[0]} cy={f.lure[1]} r="3.5" fill="#ffb547" />
        </>
      ) : null}
      <circle cx={f.eye[0]} cy={f.eye[1]} r="2.6" fill="#ff7a93" className="fish-sil__eye" />
    </svg>
  );
}

/** The mysterious girl: mostly darkness, two glowing eyes. */
export function GirlSilhouette() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <svg className="girl-sil" viewBox="0 0 200 280" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`g${uid}moon`} cx="0.5" cy="0.28" r="0.6">
          <stop offset="0" stopColor="#3a1a2e" />
          <stop offset="0.6" stopColor="#140a14" />
          <stop offset="1" stopColor="#07050a" />
        </radialGradient>
        <radialGradient id={`g${uid}eye`}>
          <stop offset="0" stopColor="#ffd0d8" />
          <stop offset="0.35" stopColor="#ff5f7a" />
          <stop offset="1" stopColor="#ff5f7a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="280" fill={`url(#g${uid}moon)`} />
      {/* gothic window */}
      <path d="M52 250V96a48 48 0 0 1 96 0v154Z" fill="none" stroke="rgb(239 230 210 / .08)" strokeWidth="3" />
      <path d="M100 48v202M52 150h96" stroke="rgb(239 230 210 / .06)" strokeWidth="2" />
      {/* silhouette */}
      <g fill="#040306" stroke="rgb(255 122 147 / .22)" strokeWidth="1.2">
        <path d="M64 92c-4-40 22-52 36-52 18-2 42 12 38 52 2 30-6 60 4 88H58c10-28 2-58 6-88Z" />
        <path d="M78 150c-8 34-24 80-36 130h116c-12-50-28-96-36-130-12-8-32-8-44 0Z" />
      </g>
      <g className="girl-sil__eyes">
        <circle cx="89" cy="92" r="9" fill={`url(#g${uid}eye)`} opacity="0.8" />
        <circle cx="111" cy="92" r="9" fill={`url(#g${uid}eye)`} opacity="0.8" />
        <ellipse cx="89" cy="92" rx="2.6" ry="1.8" fill="#fff0f2" />
        <ellipse cx="111" cy="92" rx="2.6" ry="1.8" fill="#fff0f2" />
      </g>
    </svg>
  );
}

/** Customization placeholder: a simple mannequin tinted by --tint. */
export function Mannequin({ tint }: { tint: string }) {
  return (
    <svg className="mannequin" viewBox="0 0 160 220" aria-hidden="true" focusable="false" style={{ '--tint': tint } as CSSProperties}>
      <g className="mannequin__hat" fill="none" stroke="currentColor" strokeDasharray="4 4" strokeWidth="2" opacity="0.6">
        <path d="M52 50 80 8l28 42Z" />
        <text x="80" y="42" textAnchor="middle" fontSize="16" fill="currentColor" stroke="none" fontFamily="Silkscreen, monospace">
          ?
        </text>
      </g>
      <g fill="var(--tint)" stroke="#0a0710" strokeWidth="3" strokeLinejoin="round">
        <circle cx="80" cy="76" r="26" />
        <path d="M54 110c0-8 12-14 26-14s26 6 26 14l6 58H48Z" />
        <path d="M54 112 34 150l10 6 18-30ZM106 112l20 38-10 6-18-30Z" />
        <path d="M60 166h16v44H60ZM84 166h16v44H84Z" />
      </g>
      <g fill="#0a0710">
        <rect x="70" y="72" width="5" height="7" />
        <rect x="85" y="72" width="5" height="7" />
      </g>
      <path d="M58 132h44" stroke="#0a0710" strokeWidth="3" strokeDasharray="5 5" />
    </svg>
  );
}

import { useState, type CSSProperties } from 'react';
import { unlock } from '../../lib/achievements';
import './domino.css';

/** Pip positions on a 3×3 grid (0–6). */
const PIPS: Record<number, [number, number][]> = {
  0: [],
  1: [[1, 1]],
  2: [
    [0, 0],
    [2, 2],
  ],
  3: [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  4: [
    [0, 0],
    [2, 0],
    [0, 2],
    [2, 2],
  ],
  5: [
    [0, 0],
    [2, 0],
    [1, 1],
    [0, 2],
    [2, 2],
  ],
  6: [
    [0, 0],
    [2, 0],
    [0, 1],
    [2, 1],
    [0, 2],
    [2, 2],
  ],
};

const TILES: [number, number][] = [
  [6, 3],
  [5, 5],
  [2, 4],
  [1, 6],
  [3, 3],
  [4, 2],
  [0, 5],
];

function Half({ value, y }: { value: number; y: number }) {
  return (
    <>
      {PIPS[value].map(([cx, cy], i) => (
        <circle key={i} cx={10 + cx * 10} cy={y + 10 + cy * 10} r={3.2} />
      ))}
    </>
  );
}

function Domino({ top, bottom }: { top: number; bottom: number }) {
  return (
    <svg className="domino__svg" viewBox="0 0 40 84" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="38" height="82" rx="6" className="domino__face" />
      <rect x="6" y="41" width="28" height="2" className="domino__line" />
      <g className="domino__pips">
        <Half value={top} y={0} />
        <Half value={bottom} y={42} />
      </g>
    </svg>
  );
}

interface Props {
  /** "card": decorative (topples on hover). "stage": interactive button. */
  variant?: 'card' | 'stage';
}

/**
 * Domino Dancing placeholder art: a row of dominoes that sway ("dance")
 * and topple in a chain reaction. Not gameplay — just a visual idea.
 */
export function DominoArt({ variant = 'card' }: Props) {
  const [fallen, setFallen] = useState(false);

  const push = () => {
    if (fallen) return;
    setFallen(true);
    unlock('chain-reaction');
    window.setTimeout(() => setFallen(false), 3400);
  };

  const row = (
    <div className="domino__row" data-fallen={fallen}>
      {TILES.map(([a, b], i) => (
        <span key={i} className="domino" style={{ '--i': i } as CSSProperties}>
          <Domino top={a} bottom={b} />
        </span>
      ))}
    </div>
  );

  return (
    <div className={`domino-art domino-art--${variant}`}>
      <div className="domino-art__table" aria-hidden="true" />
      {variant === 'stage' ? (
        <button type="button" className="domino-art__push" onClick={push} aria-label="Push the first domino" data-cursor="Push">
          {row}
        </button>
      ) : (
        row
      )}
    </div>
  );
}

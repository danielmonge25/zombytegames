import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { spriteRects } from '../pixel/PixelSprite';
import { PALETTE } from '../pixel/sprites';
import { onPointerMove } from '../../lib/pointer';
import { useReducedMotion } from '../../lib/motion';
import { useStore } from '../../lib/store';
import { zombieStore } from '../../lib/easterEggs';
import './mascot.css';

/**
 * BYTE — the Zombyte mascot. A pixel cube with a bite taken out of it.
 * Eyes follow the cursor, it blinks, and it has a few moods.
 */

export type Mood = 'idle' | 'happy' | 'surprised' | 'dizzy' | 'sleep' | 'wink';

const BODY = [
  '..kkkkkkkkk.....',
  '.khhhlllllk.....',
  'khhllllllllk....',
  'khllllllllllk...',
  'kllllllllllllkk.',
  'klllllllllllllLk',
  'klllllllllllllLk',
  'klllllllllllllLk',
  'klllllllllllllLk',
  'klllllllllllllLk',
  'klllllllllllllLk',
  'klllllllllllllLk',
  'kllllllllllllLLk',
  '.kLLLLLLLLLLLLk.',
  '..kLLkkkkkkLLk..',
  '...kk......kk...',
];

const ZOMBIE_PALETTE = { ...PALETTE, l: '#9fd65c', L: '#5d9a2c', h: '#d6f2a8' };
const INK = '#15111f';
const EYES = [3, 9]; // x of each 3×4 eye
const EYE_Y = 5;

type Px = [x: number, y: number, w?: number, h?: number];

function eyeShape(mood: Mood, x: number, isRight: boolean): Px[] | 'open' | 'small' {
  switch (mood) {
    case 'happy':
      return [
        [x, EYE_Y + 2],
        [x + 1, EYE_Y + 1],
        [x + 2, EYE_Y + 2],
      ];
    case 'wink':
      return isRight ? [[x, EYE_Y + 2, 3, 1]] : 'open';
    case 'dizzy':
      return [
        [x, EYE_Y],
        [x + 2, EYE_Y],
        [x + 1, EYE_Y + 1],
        [x, EYE_Y + 2],
        [x + 2, EYE_Y + 2],
      ];
    case 'sleep':
      return [[x, EYE_Y + 2, 3, 1]];
    case 'surprised':
      return 'small';
    default:
      return 'open';
  }
}

function mouthShape(mood: Mood, zombie: boolean): Px[] {
  if (mood === 'happy' || mood === 'wink')
    return [
      [5, 10],
      [6, 11, 3, 1],
      [9, 10],
    ];
  if (mood === 'surprised') return [[6, 10, 3, 2]];
  if (mood === 'dizzy')
    return [
      [5, 11],
      [6, 10],
      [7, 11],
      [8, 10],
      [9, 11],
    ];
  if (mood === 'sleep') return [[6, 11, 2, 1]];
  // idle: stitched zombie mouth
  const stitches: Px[] = [
    [5, 10, 5, 1],
    [6, 9],
    [8, 9],
    [6, 11],
    [8, 11],
  ];
  return zombie ? [...stitches, [4, 9], [4, 11], [10, 9], [10, 11]] : stitches;
}

interface MascotProps {
  mood?: Mood;
  /** Follow the pointer with the eyes. */
  track?: boolean;
  className?: string;
  title?: string;
}

export const Mascot = memo(function Mascot({ mood = 'idle', track = true, className, title }: MascotProps) {
  const zombie = useStore(zombieStore);
  const reduced = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const pupilsRef = useRef<SVGGElement>(null);
  const [blink, setBlink] = useState(false);

  const body = useMemo(() => spriteRects(BODY, zombie ? ZOMBIE_PALETTE : PALETTE), [zombie]);

  // Random blinking while idle.
  useEffect(() => {
    if (mood !== 'idle' || reduced) return;
    let t: number;
    const schedule = () => {
      t = window.setTimeout(() => {
        setBlink(true);
        t = window.setTimeout(() => {
          setBlink(false);
          schedule();
        }, 130);
      }, 2200 + Math.random() * 4200);
    };
    schedule();
    return () => window.clearTimeout(t);
  }, [mood, reduced]);

  // Eyes follow the pointer.
  useEffect(() => {
    if (!track) return;
    return onPointerMove((px, py) => {
      const svg = svgRef.current;
      const pupils = pupilsRef.current;
      if (!svg || !pupils) return;
      const r = svg.getBoundingClientRect();
      if (r.width === 0) return;
      const dx = px - (r.left + r.width * 0.44);
      const dy = py - (r.top + r.height * 0.42);
      const dist = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, dist / 260);
      pupils.setAttribute('transform', `translate(${((dx / dist) * k * 0.6).toFixed(2)} ${((dy / dist) * k * 1.05).toFixed(2)})`);
    });
  }, [track]);

  const effectiveMood: Mood = zombie && (mood === 'idle' || mood === 'surprised') ? 'dizzy' : mood;
  const showBlink = blink && effectiveMood === 'idle';

  return (
    <svg
      ref={svgRef}
      className={`byte${className ? ` ${className}` : ''}`}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      data-mood={effectiveMood}
    >
      {title ? <title>{title}</title> : null}
      <g className="byte__body">
        {body.map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.w} height={1.02} fill={r.fill} />
        ))}
      </g>
      {/* cheeks */}
      <rect x={1} y={9} width={2} height={1} fill="#ff5fa2" opacity={0.55} />
      <rect x={11} y={9} width={2} height={1} fill="#ff5fa2" opacity={0.55} />
      {/* eyes */}
      <g className="byte__eyes">
        {EYES.map((x, i) => {
          const shape = showBlink ? ([[x, EYE_Y + 2, 3, 1]] as Px[]) : eyeShape(effectiveMood, x, i === 1);
          if (shape === 'open' || shape === 'small') {
            return <rect key={i} x={x} y={EYE_Y} width={3} height={4} fill="#f8f6ff" />;
          }
          return shape.map(([px, py, w = 1, h = 1], j) => <rect key={`${i}-${j}`} x={px} y={py} width={w} height={h} fill={INK} />);
        })}
        <g ref={pupilsRef}>
          {EYES.map((x, i) => {
            const shape = showBlink ? null : eyeShape(effectiveMood, x, i === 1);
            if (shape === 'open') return <rect key={i} x={x + 0.5} y={EYE_Y + 1.2} width={2} height={2} fill={INK} />;
            if (shape === 'small') return <rect key={i} x={x + 1} y={EYE_Y + 1.5} width={1} height={1} fill={INK} />;
            return null;
          })}
        </g>
      </g>
      {/* mouth */}
      {mouthShape(effectiveMood, zombie).map(([x, y, w = 1, h = 1], i) => (
        <rect key={`m${i}`} x={x} y={y} width={w} height={h} fill={INK} />
      ))}
    </svg>
  );
});

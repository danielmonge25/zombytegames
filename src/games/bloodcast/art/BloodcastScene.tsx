import { useId, useMemo, type CSSProperties } from 'react';
import { seeded } from '../../../lib/random';
import './scene.css';

/**
 * Placeholder key art for BLOODCAST — an SVG illustration (NOT game footage).
 * Layers move with the CSS variables --px / --py (pointer, -1…1) and --sy
 * (scroll) set by the parent. Replace with real key art by dropping
 * `cover.png|jpg|webp` into src/games/bloodcast/assets/.
 */

const d = (depth: number) => ({ '--d': depth }) as CSSProperties;

/** Arched window path. */
const arch = (x: number, y: number, w: number, h: number) =>
  `M${x} ${y + h}V${y + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2}V${y + h}Z`;

/** Rounded-top tombstone path. */
const stone = (x: number, y: number, w: number, h: number) => arch(x, y, w, h);

const WINDOWS: [number, number, number, number, boolean][] = [
  // x, y, w, h, lit
  [1020, 420, 18, 36, true],
  [1081, 420, 18, 36, false],
  [1142, 420, 18, 36, true],
  [1082, 246, 16, 28, true],
  [933, 446, 14, 24, true],
  [933, 520, 14, 24, false],
  [1238, 416, 16, 28, true],
  [1238, 500, 16, 28, true],
  [1336, 496, 12, 20, true],
  [872, 500, 10, 16, false],
  [1020, 520, 14, 24, false],
  [1146, 520, 14, 24, true],
];

const TOMBS: [number, number, number, number][] = [
  [118, 556, 34, 50],
  [188, 572, 28, 40],
  [262, 552, 40, 58],
  [344, 576, 26, 36],
  [412, 584, 30, 40],
  [486, 598, 24, 32],
];

export function BloodcastScene({ variant = 'full', className }: { variant?: 'full' | 'card'; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const id = (name: string) => `bc${uid}${name}`;
  const url = (name: string) => `url(#${id(name)})`;

  const stars = useMemo(() => {
    const r = seeded(1337);
    return Array.from({ length: variant === 'full' ? 110 : 60 }, () => {
      const size = r() < 0.1 ? 3 : r() < 0.45 ? 2 : 1.4;
      return { x: Math.round(r() * 2000 - 200), y: Math.round(r() * 520), s: size, o: +(0.25 + r() * 0.7).toFixed(2), tw: r() < 0.3, delay: +(r() * 5).toFixed(2) };
    });
  }, [variant]);

  const embers = useMemo(() => {
    const r = seeded(99);
    return Array.from({ length: 16 }, () => ({
      x: Math.round(200 + r() * 1300),
      y: Math.round(520 + r() * 300),
      rad: +(1.6 + r() * 2).toFixed(1),
      dur: +(7 + r() * 8).toFixed(1),
      delay: +(r() * -14).toFixed(1),
    }));
  }, []);

  return (
    <svg
      className={`bc-scene bc-scene--${variant}${className ? ` ${className}` : ''}`}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id('sky')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#05030a" />
          <stop offset="0.42" stopColor="#110a1c" />
          <stop offset="0.6" stopColor="#24102a" />
          <stop offset="0.7" stopColor="#4a1230" />
          <stop offset="0.72" stopColor="#5c1530" />
        </linearGradient>
        <radialGradient id={id('halo')}>
          <stop offset="0" stopColor="#ffe3d0" stopOpacity="0.5" />
          <stop offset="0.3" stopColor="#ff6b7d" stopOpacity="0.22" />
          <stop offset="1" stopColor="#e0405e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id('moon')} cx="0.38" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="0.65" stopColor="#f1e5cc" />
          <stop offset="1" stopColor="#cdb795" />
        </radialGradient>
        <linearGradient id={id('water')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a0c22" />
          <stop offset="0.25" stopColor="#12081a" />
          <stop offset="1" stopColor="#040207" />
        </linearGradient>
        <radialGradient id={id('fog')}>
          <stop offset="0" stopColor="#d8c8f0" stopOpacity="0.2" />
          <stop offset="1" stopColor="#d8c8f0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id('glow')}>
          <stop offset="0" stopColor="#ffb547" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffb547" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id('fade')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={id('reflect')}>
          <rect x="-400" y="640" width="2400" height="260" fill={url('fade')} />
        </mask>

        {/* The castle — defined once, drawn twice (itself + reflection) */}
        <g id={id('castle')}>
          <g fill="#0a0610">
            {/* cypress trees */}
            <path d="M812 640 L826 452 L840 640Z M1418 640 L1434 470 L1450 640Z M1460 640 L1472 520 L1484 640Z" />
            {/* outer wall + battlements */}
            <rect x="860" y="500" width="540" height="142" />
            {Array.from({ length: 18 }, (_, i) => (
              <rect key={i} x={860 + i * 30} y={486} width={16} height={16} />
            ))}
            {/* left turret */}
            <rect x="858" y="458" width="36" height="184" />
            <path d="M852 461 L876 414 L900 461Z" />
            {/* left tower */}
            <rect x="905" y="394" width="72" height="248" />
            <path d="M893 398 L941 286 L989 398Z" />
            <rect x="939" y="266" width="4" height="24" />
            {/* main hall */}
            <rect x="990" y="358" width="200" height="284" />
            <path d="M974 362 L1090 246 L1206 362Z" />
            <rect x="1148" y="286" width="13" height="56" />
            {/* central spire */}
            <rect x="1062" y="200" width="56" height="170" />
            <path d="M1051 204 L1090 56 L1129 204Z" />
            <rect x="1088" y="30" width="4" height="30" />
            <rect x="1082" y="38" width="16" height="4" />
            {/* right tower */}
            <rect x="1205" y="370" width="84" height="272" />
            <path d="M1192 374 L1247 250 L1302 374Z" />
            <rect x="1245" y="230" width="4" height="24" />
            {/* far right tower */}
            <rect x="1318" y="448" width="52" height="194" />
            <path d="M1309 451 L1344 388 L1379 451Z" />
            {/* garden hedges at the castle's feet */}
            <ellipse cx="880" cy="644" rx="54" ry="24" />
            <ellipse cx="962" cy="646" rx="42" ry="19" />
            <ellipse cx="1190" cy="647" rx="64" ry="21" />
            <ellipse cx="1302" cy="645" rx="58" ry="23" />
            <ellipse cx="1402" cy="646" rx="42" ry="17" />
          </g>
          {/* windows */}
          <circle cx="1090" cy="326" r="15" fill="#ffb547" opacity="0.85" className="bc-win bc-win--slow" />
          <path d="M1075 326h30M1090 311v30" stroke="#0a0610" strokeWidth="3" />
          {WINDOWS.map(([x, y, w, h, lit], i) => (
            <path
              key={i}
              d={arch(x, y, w, h)}
              fill={lit ? '#ffb547' : '#1c0f1a'}
              className={lit ? `bc-win${i % 3 === 0 ? ' bc-win--flicker' : ''}` : undefined}
              style={lit ? ({ animationDelay: `${(i * 0.73) % 4}s` } as CSSProperties) : undefined}
            />
          ))}
          <path d={arch(1070, 584, 40, 58)} fill="#050308" />
        </g>
      </defs>

      {/* sky */}
      <rect x="-400" y="0" width="2400" height="900" fill={url('sky')} />

      <g className="bc-world">
        {/* stars */}
        <g className="bc-layer" style={d(2)}>
          {stars.map((s, i) => (
            <rect
              key={i}
              x={s.x}
              y={s.y}
              width={s.s}
              height={s.s}
              fill="#f4ecff"
              opacity={s.o}
              className={s.tw ? 'bc-star' : undefined}
              style={s.tw ? ({ animationDelay: `${s.delay}s` } as CSSProperties) : undefined}
            />
          ))}
        </g>

        {/* moon */}
        <g className="bc-layer bc-moon" style={d(6)}>
          <circle cx="1160" cy="262" r="300" fill={url('halo')} />
          <circle cx="1160" cy="262" r="112" fill={url('moon')} />
          <g fill="#c9b18e" opacity="0.45">
            <circle cx="1128" cy="232" r="16" />
            <circle cx="1196" cy="292" r="11" />
            <circle cx="1172" cy="214" r="7" />
            <circle cx="1122" cy="300" r="8" />
          </g>
        </g>

        {/* far hills */}
        <g className="bc-layer" style={d(10)}>
          <path
            d="M-400 612 C-150 580 0 590 150 578 S450 552 620 572 S930 548 1080 566 S1380 552 1560 574 S1850 560 2000 570 V660 H-400Z"
            fill="#170b1c"
          />
        </g>

        {/* castle */}
        <g className="bc-layer" style={d(16)}>
          <use href={`#${id('castle')}`} />
        </g>

        {/* graveyard */}
        <g className="bc-layer" style={d(24)} fill="#0b0710">
          <path d="M-400 642 V606 C-200 590 -40 584 60 588 C160 574 280 570 390 586 C480 598 570 610 680 642Z" />
          {TOMBS.map(([x, y, w, h], i) => (
            <path key={i} d={stone(x, y, w, h)} />
          ))}
          <rect x="226" y="512" width="9" height="72" />
          <rect x="213" y="530" width="35" height="9" />
          <rect x="444" y="548" width="7" height="48" />
          <rect x="434" y="560" width="27" height="7" />
          {/* dead tree */}
          <g stroke="#0b0710" strokeLinecap="round" fill="none">
            <path d="M70 600 C78 540 70 480 86 420 C92 390 92 360 100 326" strokeWidth="14" />
            <path d="M86 446 C56 426 34 404 16 372" strokeWidth="8" />
            <path d="M90 404 C126 384 146 356 168 330" strokeWidth="7" />
            <path d="M96 362 C78 342 68 320 62 290" strokeWidth="5" />
            <path d="M100 330 C112 308 122 290 140 274" strokeWidth="4" />
            <path d="M146 348 C168 342 186 330 202 316" strokeWidth="3.5" />
            <path d="M28 390 C12 384 0 378 -14 366" strokeWidth="3.5" />
            <path d="M64 300 C52 288 46 276 44 262" strokeWidth="2.5" />
          </g>
          {/* iron fence */}
          <g>
            <rect x="-40" y="612" width="700" height="4" />
            <rect x="-40" y="630" width="720" height="4" />
            {Array.from({ length: 32 }, (_, i) => (
              <path key={i} d={`M${-30 + i * 22} 642 V604 l3 -9 l3 9 V642Z`} />
            ))}
          </g>
        </g>

        {/* fog */}
        <g className="bc-fog">
          <ellipse cx="300" cy="628" rx="560" ry="56" fill={url('fog')} />
          <ellipse cx="1200" cy="638" rx="620" ry="48" fill={url('fog')} className="bc-fog--b" />
          <ellipse cx="760" cy="612" rx="420" ry="40" fill={url('fog')} className="bc-fog--c" />
        </g>

        {/* water */}
        <rect x="-400" y="640" width="2400" height="260" fill={url('water')} />
        <rect x="-400" y="640" width="2400" height="1.5" fill="#ff8a9c" opacity="0.18" />

        {/* reflections */}
        <g mask={url('reflect')} opacity="0.55">
          <use href={`#${id('castle')}`} transform="translate(0 1284) scale(1 -1)" />
        </g>
        <g className="bc-shimmer">
          {Array.from({ length: 12 }, (_, i) => {
            const w = 190 - i * 12 + ((i * 37) % 23);
            return (
              <rect
                key={i}
                x={1160 - w / 2}
                y={660 + i * 17}
                width={w}
                height={3}
                rx={1.5}
                fill="#f6ead2"
                opacity={+(0.55 - i * 0.038).toFixed(3)}
                style={{ animationDelay: `${(i * 0.37).toFixed(2)}s` } as CSSProperties}
              />
            );
          })}
        </g>
        <g fill="#f6ead2" opacity="0.07">
          <rect x="-200" y="700" width="700" height="1" />
          <rect x="300" y="760" width="900" height="1" />
          <rect x="900" y="820" width="800" height="1" />
        </g>

        {/* the line, the bobber, the ripples */}
        <g className="bc-line">
          <path d="M-60 120 Q 360 380 604 700" stroke="#efe6d2" strokeOpacity="0.45" strokeWidth="1.6" fill="none" />
          <g className="bc-ripples" fill="none" stroke="#efe6d2">
            <ellipse cx="604" cy="708" rx="30" ry="6" strokeOpacity="0.35" />
            <ellipse cx="604" cy="708" rx="30" ry="6" strokeOpacity="0.35" className="bc-ripple--late" />
          </g>
          <g className="bc-bobber">
            <circle cx="604" cy="703" r="30" fill={url('glow')} opacity="0.18" />
            <path d="M594 703 a10 10 0 0 1 20 0Z" fill="#e0405e" />
            <path d="M594 703 a10 10 0 0 0 20 0Z" fill="#efe6d2" />
            <rect x="603" y="684" width="2" height="10" fill="#efe6d2" />
          </g>
        </g>

        {/* foreground reeds */}
        <g className="bc-layer" style={d(40)} stroke="#030205" strokeLinecap="round" fill="none">
          <path d="M20 900 C24 820 18 760 30 690" strokeWidth="5" />
          <path d="M52 900 C50 830 58 780 50 720" strokeWidth="4" />
          <path d="M84 900 C92 850 88 800 104 752" strokeWidth="4" />
          <path d="M1540 900 C1536 830 1544 770 1532 700" strokeWidth="5" />
          <path d="M1574 900 C1580 840 1572 790 1586 736" strokeWidth="4" />
          <g fill="#030205" stroke="none">
            <ellipse cx="30" cy="690" rx="6" ry="20" />
            <ellipse cx="50" cy="718" rx="5" ry="16" />
            <ellipse cx="1532" cy="700" rx="6" ry="20" />
          </g>
        </g>

        {variant === 'full' ? (
          <g className="bc-embers">
            {embers.map((e, i) => (
              <circle
                key={i}
                cx={e.x}
                cy={e.y}
                r={e.rad}
                fill="#ffb547"
                style={{ animationDuration: `${e.dur}s`, animationDelay: `${e.delay}s` } as CSSProperties}
              />
            ))}
          </g>
        ) : null}
      </g>
    </svg>
  );
}

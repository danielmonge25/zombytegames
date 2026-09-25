import { useRef, useState, type KeyboardEvent } from 'react';
import { LOCATIONS, type Location } from '../data';
import { imageNamed } from '../../../lib/images';
import { unlock } from '../../../lib/achievements';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import { ArtSlot } from '../../../components/ui/ArtSlot';
import { PixelSprite } from '../../../components/pixel/PixelSprite';

/** Simple silhouette vignettes per location, used until real art is dropped in. */
function LocationArt({ id }: { id: Location['id'] }) {
  const common = (
    <>
      <rect width="400" height="225" fill="url(#wl-sky)" />
      <circle cx="310" cy="58" r="26" fill="#efe6d2" opacity="0.9" />
      <circle cx="310" cy="58" r="60" fill="#e0405e" opacity="0.08" />
    </>
  );
  return (
    <svg viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" className={`loc-art loc-art--${id}`}>
      <defs>
        <linearGradient id="wl-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#07050b" />
          <stop offset="0.7" stopColor="#1f0d1f" />
          <stop offset="1" stopColor="#3a1026" />
        </linearGradient>
      </defs>
      {common}
      <g fill="#050308">
        {id === 'castle' ? (
          <>
            <path d="M120 225V118l20-34 20 34v-8h24V70l22-50 22 50v40h24v8l20-34 20 34v107Z" />
            <path d="M100 225v-60l10-20 10 20v60ZM300 225v-54l10-18 10 18v54Z" />
            <g fill="#ffb547" className="bc-win--flicker">
              <rect x="202" y="92" width="8" height="14" />
              <rect x="140" y="140" width="7" height="12" />
              <rect x="268" y="150" width="7" height="12" />
            </g>
          </>
        ) : null}
        {id === 'graveyard' ? (
          <>
            <path d="M0 225v-40c60-20 140-26 220-14s140 16 180 8v46Z" />
            <path d="M60 190v-30a14 14 0 0 1 28 0v30ZM130 186v-38a16 16 0 0 1 32 0v38ZM210 184v-26a12 12 0 0 1 24 0v26ZM290 190v-34a14 14 0 0 1 28 0v34Z" />
            <path d="M180 190v-58h8v14h16v8h-16v36Z" />
            <path d="M340 190c4-40-2-70 10-100M346 130c-14-10-22-24-26-40M350 110c10-10 18-24 22-40" stroke="#050308" strokeWidth="6" fill="none" strokeLinecap="round" />
          </>
        ) : null}
        {id === 'garden' ? (
          <>
            <path d="M0 225v-46c40-14 90-10 130 0s100 12 140 0 90-10 130 2v44Z" />
            <path d="M40 186a26 26 0 1 1 52 0ZM110 184a34 34 0 1 1 68 0ZM230 186a30 30 0 1 1 60 0ZM310 186a24 24 0 1 1 48 0Z" />
            <path d="M190 190v-72a22 22 0 0 1 44 0v72h-8v-72a14 14 0 0 0-28 0v72Z" />
            {Array.from({ length: 20 }, (_, i) => (
              <path key={i} d={`M${i * 20 + 4} 225v-26l3-6 3 6v26Z`} />
            ))}
            <g fill="#e0405e">
              <circle cx="66" cy="168" r="4" />
              <circle cx="140" cy="160" r="4" />
              <circle cx="158" cy="172" r="3.5" />
              <circle cx="262" cy="166" r="4" />
            </g>
          </>
        ) : null}
        {id === 'waterways' ? (
          <>
            <path d="M0 150c60-8 120 4 180 0s140-12 220-4v79H0Z" fill="#12081a" />
            <path d="M0 150c60-8 120 4 180 0s140-12 220-4" stroke="#ff7a93" strokeOpacity="0.25" fill="none" />
            <g fill="#f6ead2" opacity="0.5">
              <rect x="290" y="165" width="44" height="2" rx="1" />
              <rect x="298" y="176" width="30" height="2" rx="1" />
              <rect x="304" y="188" width="18" height="2" rx="1" />
            </g>
            <path d="M20 225c2-30-2-50 6-80M40 225c-2-24 4-40 0-64M360 225c2-26-4-44 4-70" stroke="#050308" strokeWidth="4" fill="none" strokeLinecap="round" />
            <ellipse cx="160" cy="190" rx="26" ry="5" fill="none" stroke="#efe6d2" strokeOpacity="0.3" className="loc-ripple" />
          </>
        ) : null}
      </g>
    </svg>
  );
}

export function World() {
  const [active, setActive] = useState(0);
  const visited = useRef(new Set<number>([0]));
  const tabsRef = useRef<HTMLDivElement>(null);
  const loc = LOCATIONS[active];
  const art = imageNamed('bloodcast/world', loc.id);

  const select = (i: number) => {
    setActive(i);
    visited.current.add(i);
    if (visited.current.size === LOCATIONS.length) unlock('cartographer');
  };

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    let next = active;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (active + 1) % LOCATIONS.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (active - 1 + LOCATIONS.length) % LOCATIONS.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = LOCATIONS.length - 1;
    select(next);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <section id="world" className="section bc-world" aria-labelledby="world-title" data-byte="Spooky. I love it here.">
      <div className="container">
        <SectionHeading
          index="03"
          kicker="The world"
          title="A dark gothic world"
          intro="Gothic architecture and atmospheric places: a large gothic house, a graveyard, a dark garden, and the ponds and rivers where the fishing happens."
          id="world-title"
        />

        <div className="map" data-reveal>
          <div ref={tabsRef} className="map__tabs" role="tablist" aria-label="Locations" onKeyDown={onKeyDown}>
            {LOCATIONS.map((l, i) => (
              <button
                key={l.id}
                type="button"
                role="tab"
                id={`loc-tab-${l.id}`}
                aria-selected={i === active}
                aria-controls="loc-panel"
                tabIndex={i === active ? 0 : -1}
                className="map__tab"
                onClick={() => select(i)}
              >
                <span className="map__pin" aria-hidden="true">
                  <PixelSprite name={l.sprite} scale={3} />
                </span>
                <span className="map__tab-text">
                  <span className="map__tab-num">0{i + 1}</span>
                  {l.short}
                </span>
              </button>
            ))}
          </div>

          <div id="loc-panel" className="map__panel" role="tabpanel" aria-labelledby={`loc-tab-${loc.id}`}>
            <div className="map__art" key={loc.id}>
              <ArtSlot label={`${loc.short} artwork`} image={art} ratio="16 / 9" tag="Art slot" sizes="(min-width: 1024px) 60vw, 100vw">
                <LocationArt id={loc.id} />
              </ArtSlot>
            </div>
            <div className="map__info" key={`${loc.id}-info`}>
              <h3 className="map__name">{loc.name}</h3>
              <p className="map__text">{loc.text}</p>
              <p className="map__progress" aria-hidden="true">
                {LOCATIONS.map((l, i) => (
                  <span key={l.id} data-on={i === active} />
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

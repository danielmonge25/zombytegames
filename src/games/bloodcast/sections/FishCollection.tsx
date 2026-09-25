import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { FISH, RARITY_COLORS, type Fish } from '../data';
import { imageNamed } from '../../../lib/images';
import { isReducedMotion } from '../../../lib/motion';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import { FishSilhouette } from '../art/Silhouettes';

function FishArt({ fish, large }: { fish: Fish; large?: boolean }) {
  const img = imageNamed('bloodcast/fish', fish.id);
  if (img) {
    return (
      <img
        className="fish-art__img"
        src={img.src}
        srcSet={img.srcSet}
        sizes={large ? '320px' : '160px'}
        width={img.width}
        height={img.height}
        alt={fish.name ?? 'Unknown fish'}
        loading="lazy"
        decoding="async"
      />
    );
  }
  return <FishSilhouette shape={fish.shape} className={large ? 'fish-sil--large' : undefined} />;
}

const num = (i: number) => `#${String(i + 1).padStart(3, '0')}`;

export function FishCollection() {
  const [selected, setSelected] = useState(0);
  const gridRef = useRef<HTMLUListElement>(null);
  const detailRef = useRef<HTMLElement>(null);

  const choose = (i: number) => {
    setSelected(i);
    // Single-column layout: bring the detail panel into view so the tap has visible feedback.
    const panel = detailRef.current;
    if (panel && window.innerWidth < 1100) {
      const r = panel.getBoundingClientRect();
      if (r.bottom < 80 || r.top > window.innerHeight) panel.scrollIntoView({ behavior: isReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    }
  };
  const fish = FISH[selected];
  const discovered = FISH.filter((f) => f.name).length;
  const rarityColor = (f: Fish) => (f.rarity ? (RARITY_COLORS[f.rarity] ?? 'var(--rose)') : 'var(--dim)');

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const grid = gridRef.current;
    if (!grid) return;
    const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length || 1;
    const moves: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols };
    let next = selected;
    if (e.key in moves) next = selected + moves[e.key];
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = FISH.length - 1;
    else return;
    e.preventDefault();
    next = Math.max(0, Math.min(FISH.length - 1, next));
    setSelected(next);
    grid.querySelectorAll<HTMLButtonElement>('.fish-card')[next]?.focus();
  };

  return (
    <section id="collection" className="section bc-collection" aria-labelledby="collection-title" data-byte="So many question marks…">
      <div className="container">
        <SectionHeading
          index="05"
          kicker="Fish collection"
          title="The Collection"
          intro="Many different fish, many rarities. Every entry here is a placeholder slot until the real fish are revealed."
          id="collection-title"
        />

        <div className="fishdex" data-reveal>
          <header className="fishdex__bar">
            <span className="fishdex__title">Collection log</span>
            <span className="fishdex__count">
              Discovered <b>{discovered}</b> / ??
            </span>
            <span className="fishdex__hint" aria-hidden="true">
              ← ↑ → ↓ to browse
            </span>
          </header>

          <div className="fishdex__body">
            <ul ref={gridRef} className="fishdex__grid" onKeyDown={onKeyDown} aria-label="Fish entries">
              {FISH.map((f, i) => (
                <li key={f.id}>
                  <button
                    type="button"
                    className="fish-card"
                    data-selected={i === selected}
                    aria-current={i === selected ? 'true' : undefined}
                    tabIndex={i === selected ? 0 : -1}
                    onClick={() => choose(i)}
                    data-cursor="Inspect"
                    style={{ '--wiggle': `${(i % 4) * 0.15}s` } as CSSProperties}
                  >
                    <span className="fish-card__num">{num(i)}</span>
                    <span className="fish-card__art">
                      <FishArt fish={f} />
                    </span>
                    <span className="fish-card__name">{f.name ?? '???'}</span>
                    <span className="fish-card__rarity" style={{ color: rarityColor(f) }}>
                      Rarity: {f.rarity ?? '???'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <aside ref={detailRef} className="fishdex__detail" aria-live="polite" aria-label="Selected fish">
              <div className="fishdex__portrait" key={fish.id}>
                <FishArt fish={fish} large />
                <span className="fishdex__stamp">{fish.name ? 'Discovered' : 'Undiscovered'}</span>
              </div>
              <p className="fishdex__id">
                {num(selected)} · {fish.name ? 'Entry' : 'Unknown fish'}
              </p>
              <h3 className="fishdex__name">{fish.name ?? '???'}</h3>
              <dl className="fishdex__facts">
                <div>
                  <dt>Rarity</dt>
                  <dd style={{ color: rarityColor(fish) }}>{fish.rarity ?? '???'}</dd>
                </div>
                <div>
                  <dt>Habitat</dt>
                  <dd>{fish.habitat ?? '???'}</dd>
                </div>
              </dl>
              <p className="fishdex__notes">
                {fish.description ?? 'Not discovered yet. Artwork and details will appear here as BLOODCAST development continues.'}
              </p>
            </aside>
          </div>
          <p className="fishdex__foot">Placeholder silhouettes — not final fish designs.</p>
        </div>
      </div>
    </section>
  );
}

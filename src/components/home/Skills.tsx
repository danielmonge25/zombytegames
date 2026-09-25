import { useState, type CSSProperties } from 'react';
import { INVENTORY, type SkillBag } from '../../data/skills';
import { SectionHeading } from '../ui/SectionHeading';
import { PixelSprite } from '../pixel/PixelSprite';
import './skills.css';

function Bag({ bag, index }: { bag: SkillBag; index: number }) {
  const [active, setActive] = useState(0);
  const [pop, setPop] = useState(-1);
  const item = bag.items[active];
  const noteId = `bag-note-${bag.id}`;

  return (
    <article
      className="bag"
      style={{ '--bag': bag.color, '--delay': `${index * 110}ms` } as CSSProperties}
      data-reveal
      aria-labelledby={`bag-${bag.id}`}
    >
      <header className="bag__head">
        <span className="bag__icon" aria-hidden="true">
          <PixelSprite name={bag.sprite} scale={3} />
        </span>
        <div>
          <h3 id={`bag-${bag.id}`} className="bag__title">
            {bag.title}
          </h3>
          <p className="bag__tag">{bag.tag}</p>
        </div>
        <span className="bag__count" aria-hidden="true">
          {bag.items.length}/{bag.items.length + bag.emptySlots}
        </span>
      </header>

      <ul className="bag__slots">
        {bag.items.map((s, i) => (
          <li key={s.name}>
            <button
              type="button"
              className="slot"
              data-active={i === active}
              data-pop={i === pop}
              aria-describedby={i === active ? noteId : undefined}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => {
                setActive(i);
                setPop(i);
                window.setTimeout(() => setPop(-1), 500);
              }}
            >
              <span className="slot__glyph" aria-hidden="true">
                {s.glyph}
              </span>
              <span className="slot__name">{s.name}</span>
            </button>
          </li>
        ))}
        {Array.from({ length: bag.emptySlots }, (_, i) => (
          <li key={`empty-${i}`} aria-hidden="true">
            <span className="slot slot--empty">
              <span className="slot__glyph">+</span>
              <span className="slot__name">Learning…</span>
            </span>
          </li>
        ))}
      </ul>

      <p id={noteId} className="bag__note">
        <span className="bag__caret" aria-hidden="true">
          &gt;
        </span>{' '}
        <strong>{item.name}</strong> — {item.note}
      </p>
    </article>
  );
}

export function Skills() {
  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title" data-byte="Inventory check!">
      <div className="container">
        <SectionHeading
          index="05"
          kicker="Skills"
          title="Inventory"
          intro="Tools of the trade, sorted into bags. Hover or tap an item to inspect it. The empty slots are on purpose."
          id="skills-title"
        />
        <div className="skills__grid">
          {INVENTORY.map((bag, i) => (
            <Bag key={bag.id} bag={bag} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

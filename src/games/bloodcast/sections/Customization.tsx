import { useState, type CSSProperties } from 'react';
import { TINTS } from '../data';
import { imageNamed } from '../../../lib/images';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import { Mannequin } from '../art/Silhouettes';

export function Customization() {
  const [tint, setTint] = useState(0);
  const player = imageNamed('bloodcast/characters', 'player');

  return (
    <section id="customize" className="section bc-custom" aria-labelledby="customize-title" data-byte="Ooh, dress-up.">
      <div className="container bc-custom__grid">
        <div className="bc-custom__copy">
          <SectionHeading index="06" kicker="Character customization" title="Make them yours" id="customize-title" />
          <p className="bc-lead" data-reveal>
            Customize your character and make it your own.
          </p>
          <p data-reveal>The actual customization options will be revealed as development continues.</p>

          {player ? null : (
            <fieldset className="tints" data-reveal>
              <legend>Try a colour on the placeholder</legend>
              <div className="tints__row">
                {TINTS.map((t, i) => (
                  <label key={t.name} className="tint" style={{ '--c': t.color } as CSSProperties} title={t.name}>
                    <input type="radio" name="bc-tint" className="sr-only" checked={i === tint} onChange={() => setTint(i)} />
                    <span className="tint__swatch" aria-hidden="true" />
                    <span className="sr-only">{t.name}</span>
                  </label>
                ))}
              </div>
              <p className="bc-note">Placeholder mannequin — not the in-game character or its options.</p>
            </fieldset>
          )}
        </div>

        <div className="mirror" data-reveal="scale">
          <div className="mirror__glass">
            {player ? (
              <img src={player.src} srcSet={player.srcSet} sizes="(min-width: 1024px) 34vw, 80vw" width={player.width} height={player.height} alt="BLOODCAST player character" loading="lazy" decoding="async" />
            ) : (
              <Mannequin tint={TINTS[tint].color} />
            )}
          </div>
          <span className="mirror__plate" aria-hidden="true">
            Mirror, mirror…
          </span>
        </div>
      </div>
    </section>
  );
}

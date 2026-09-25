import { useEffect, useRef } from 'react';
import { getGame } from '../../data/games';
import { CURRENTLY_BUILDING } from '../../data/site';
import { paths } from '../../lib/paths';
import { Link } from '../../lib/router';
import { imageNamed } from '../../lib/images';
import { SectionHeading } from '../ui/SectionHeading';
import { ArtSlot } from '../ui/ArtSlot';
import { Button } from '../ui/Button';
import { BloodcastScene } from '../../games/bloodcast/art/BloodcastScene';
import './currently-building.css';

/** Feeds pointer position into --px/--py so the scene's layers parallax. */
export function useParallaxVars<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--px', (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
      el.style.setProperty('--py', (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
    };
    const onLeave = () => {
      el.style.setProperty('--px', '0');
      el.style.setProperty('--py', '0');
    };
    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);
  return ref;
}

export function CurrentlyBuilding() {
  const game = getGame(CURRENTLY_BUILDING)!;
  const artRef = useParallaxVars<HTMLDivElement>();
  const keyArt = imageNamed(game.slug, 'key-art');

  return (
    <section id="currently-building" className="section cb" aria-labelledby="cb-title" data-byte="That’s BLOODCAST. A strange place to fish.">
      <div className="container">
        <SectionHeading index="01" kicker="Work in progress" title="Currently building" id="cb-title" live />

        <article className="cb__panel" data-reveal="scale">
          <div ref={artRef} className="cb__art">
            <Link to={paths.game(game.slug)} className="cb__art-link" tabIndex={-1} aria-hidden="true" data-cursor="Enter">
              <ArtSlot label="BLOODCAST key art" image={keyArt} ratio="16 / 10" tag="Placeholder illustration" sizes="(min-width: 1024px) 60vw, 100vw">
                <BloodcastScene variant="card" />
              </ArtSlot>
            </Link>
            <span className="cb__rec" aria-hidden="true">
              <i /> Live build · work in progress
            </span>
          </div>

          <div className="cb__info">
            <span className="status status--in-development">{game.statusLabel}</span>
            <h3 className="cb__title">{game.title}</h3>
            <p className="cb__tagline">{game.tagline}</p>
            <dl className="cb__specs">
              <div>
                <dt>Status</dt>
                <dd>In development</dd>
              </div>
              <div>
                <dt>Genre</dt>
                <dd>Multiplayer gothic fishing / social hangout</dd>
              </div>
              <div>
                <dt>Tech</dt>
                <dd>{game.tech.join(' • ')}</dd>
              </div>
            </dl>
            <Button to={paths.game(game.slug)} variant="blood" icon="arrow">
              Enter BLOODCAST
            </Button>
          </div>
        </article>
      </div>
    </section>
  );
}

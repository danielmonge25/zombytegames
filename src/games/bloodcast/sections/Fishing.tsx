import { useEffect, useRef, useState } from 'react';
import { imageNamed } from '../../../lib/images';
import { unlock } from '../../../lib/achievements';
import { byteSay } from '../../../lib/ui';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import { ArtSlot } from '../../../components/ui/ArtSlot';
import { FishSilhouette, GirlSilhouette } from '../art/Silhouettes';
import type { FishShape } from '../data';

type Phase = 'idle' | 'casting' | 'waiting' | 'bite' | 'caught' | 'missed' | 'early';

const SHAPES: FishShape[] = ['classic', 'eel', 'puffer', 'angler', 'ray', 'koi'];

const STATUS: Record<Phase, string> = {
  idle: 'The water is perfectly still.',
  casting: 'Whoosh…',
  waiting: 'Waiting for a bite…',
  bite: 'Something bit! Reel it in!',
  caught: 'You caught: ??? — UNKNOWN FISH. Rarity: ???',
  missed: 'It got away…',
  early: 'Too early — you scared it off.',
};

const LABEL: Record<Phase, string> = {
  idle: 'Cast',
  casting: 'Casting…',
  waiting: 'Reel',
  bite: 'Reel!',
  caught: 'Cast again',
  missed: 'Cast again',
  early: 'Cast again',
};

/** A tiny website toy: cast, wait, reel in time. Not actual BLOODCAST gameplay. */
function CastToy() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [shape, setShape] = useState<FishShape>('classic');
  const [catches, setCatches] = useState(0);
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => clear, []);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const cast = () => {
    clear();
    setPhase('casting');
    later(() => setPhase('waiting'), 650);
    later(() => {
      setPhase('bite');
      later(() => setPhase((p) => (p === 'bite' ? 'missed' : p)), 1150);
    }, 650 + 1300 + Math.random() * 2600);
  };

  const act = () => {
    if (phase === 'bite') {
      clear();
      setShape(SHAPES[Math.floor(Math.random() * SHAPES.length)]);
      setPhase('caught');
      setCatches((c) => c + 1);
      unlock('first-catch');
      byteSay('Nice catch! What even is that?', 'happy');
    } else if (phase === 'waiting') {
      clear();
      setPhase('early');
    } else if (phase !== 'casting') {
      cast();
    }
  };

  return (
    <div className="cast" data-phase={phase}>
      <div className="cast__water" aria-hidden="true">
        <span className="cast__moon" />
        <span className="cast__line" />
        <span className="cast__bobber">
          <svg viewBox="0 0 20 28">
            <rect x="9" y="0" width="2" height="8" fill="#efe6d2" />
            <path d="M0 18a10 10 0 0 1 20 0Z" fill="#e0405e" />
            <path d="M0 18a10 10 0 0 0 20 0Z" fill="#efe6d2" />
          </svg>
        </span>
        <span className="cast__ring" />
        <span className="cast__ring cast__ring--2" />
        <span className="cast__alert">!</span>
        <span className="cast__catch">
          <FishSilhouette shape={shape} />
        </span>
      </div>
      <div className="cast__ui">
        <p className="cast__status" aria-live="polite">
          {STATUS[phase]}
        </p>
        <button type="button" className="btn btn--blood cast__btn" onClick={act} disabled={phase === 'casting'} data-cursor={phase === 'bite' ? 'Reel!' : undefined}>
          {LABEL[phase]}
        </button>
        <p className="cast__note">
          Website mini-game, not actual BLOODCAST gameplay{catches ? ` · catches: ${catches}` : ''}.
        </p>
      </div>
    </div>
  );
}

export function Fishing() {
  const girl = imageNamed('bloodcast/characters', 'girl');
  return (
    <section id="fishing" className="section bc-fishing" aria-labelledby="fishing-title" data-byte="Have you tried catching one?">
      <div className="container">
        <SectionHeading index="04" kicker="Fishing" title="Cast. Wait. Reel." id="fishing-title" />
        <div className="bc-fishing__grid">
          <div className="bc-fishing__copy">
            <p className="bc-lead" data-reveal>
              Fishing is at the heart of BLOODCAST.
            </p>
            <p data-reveal>
              Cast your line into the world’s ponds and rivers, reel in what you find, and slowly fill your collection. There are many
              different fish to discover, with varying rarities — some common, some very rare.
            </p>
            <p data-reveal>
              And then there’s <em>her</em>: a mysterious gothic girl, tied to your fishing and collection progression. Who she is… is part of
              the mystery.
            </p>
            <div data-reveal>
              <CastToy />
            </div>
          </div>

          <figure className="girl" data-reveal="right">
            <ArtSlot label="The mysterious girl" image={girl} ratio="5 / 7" tag="Character art slot" sizes="(min-width: 1024px) 30vw, 80vw">
              <GirlSilhouette />
            </ArtSlot>
            <figcaption className="girl__caption">
              <span className="girl__name">???</span>
              <span className="girl__role">A mysterious gothic girl · more soon</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

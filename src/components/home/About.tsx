import type { CSSProperties } from 'react';
import { GAMES } from '../../data/games';
import { paths } from '../../lib/paths';
import { Link } from '../../lib/router';
import { SectionHeading } from '../ui/SectionHeading';
import { Mascot } from '../mascot/Mascot';
import './about.css';

const ROLES = ['Design.', 'Programming.', 'Systems.', 'Experiments.', 'Games.'];

/** A number that rolls into place like a slot machine when revealed. */
function Roll({ value }: { value: number }) {
  const digits = Array.from({ length: 10 + value + 1 }, (_, i) => i % 10);
  return (
    <span className="roll" aria-hidden="true">
      <span className="roll__strip" style={{ '--n': 10 + value } as CSSProperties}>
        {digits.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </span>
    </span>
  );
}

export function About() {
  const inDev = GAMES.filter((g) => g.status === 'in-development').length;
  const concepts = GAMES.filter((g) => g.status === 'concept' || g.status === 'prototype').length;

  const stats = [
    { label: 'Games in development', value: inDev },
    { label: 'Concepts on the bench', value: concepts },
    { label: 'Team size', value: 1 },
  ];

  return (
    <section id="about" className="section about" aria-labelledby="about-title" data-byte="That’s the dev behind the games. Also: my creator.">
      <div className="container">
        <SectionHeading kicker="About" tone="pink" title="The developer behind the games" id="about-title" />

        <div className="about__grid">
          <div className="about__copy">
            <p className="about__lead" data-reveal>
              I’m Daniel Monge, a Software Engineer graduate from Costa Rica, currently working as an <mark>AI Engineer</mark>.
            </p>
            <p data-reveal>
              My professional world revolves around software engineering, artificial intelligence, automation, APIs, and building production systems.
            </p>
            <p data-reveal>
              Now I’m taking that engineering mindset into something I’ve wanted to build for myself: <strong className="about__games">games.</strong>
            </p>
            <p data-reveal>Zombyte Games is my space to experiment, learn, and turn ideas into playable worlds.</p>

            <div className="solo" data-reveal>
              <span className="pixel-badge">Solo developer</span>
              <p className="solo__roles">
                {ROLES.map((r, i) => (
                  <span key={r} style={{ '--i': i } as CSSProperties}>
                    {r}{' '}
                  </span>
                ))}
              </p>
            </div>
          </div>

          <div className="about__side">
            <div className="player" data-reveal="right">
              <div className="player__head">
                <div className="player__avatar" aria-hidden="true">
                  <Mascot mood="happy" />
                </div>
                <div>
                  <p className="player__eyebrow">Player profile</p>
                  <p className="player__name">Daniel Monge</p>
                  <p className="player__class">Class: AI Engineer · LV.1 game dev</p>
                  <p className="player__class">Home base: Costa Rica</p>
                </div>
              </div>
              <dl className="player__stats">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>
                      <Roll value={s.value} />
                      <span className="sr-only">{s.value}</span>
                    </dd>
                  </div>
                ))}
                <div>
                  <dt>Fish to discover</dt>
                  <dd>
                    <Link to={paths.game('bloodcast')} className="player__unknown">
                      ???
                    </Link>
                  </dd>
                </div>
              </dl>
              <div className="player__xp">
                <span>Game dev XP</span>
                <span className="player__bar" aria-hidden="true">
                  <i />
                </span>
                <span className="player__xp-label">Leveling up</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

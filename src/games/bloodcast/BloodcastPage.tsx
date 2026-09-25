import type { CSSProperties } from 'react';
import type { Game } from '../../data/games';
import { GAMEPLAY, TECH } from './data';
import { imagesIn } from '../../lib/images';
import { postsForGame } from '../../lib/devlog';
import { paths } from '../../lib/paths';
import { Link } from '../../lib/router';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Button } from '../../components/ui/Button';
import { PixelSprite } from '../../components/pixel/PixelSprite';
import { ScreenshotGallery, type GalleryItem } from '../../components/ScreenshotGallery';
import { DevLogList } from '../../components/DevLogList';
import { useTilt } from '../../components/ui/useTilt';
import { BloodcastHero } from './sections/BloodcastHero';
import { ChapterNav } from './sections/ChapterNav';
import { World } from './sections/World';
import { Fishing } from './sections/Fishing';
import { FishCollection } from './sections/FishCollection';
import { Customization } from './sections/Customization';
import './bloodcast.css';

/** Set to a YouTube video id (e.g. 'dQw4w9WgXcQ') once the trailer exists. */
const TRAILER_YOUTUBE_ID: string | null = null;

/** Captions for the empty screenshot slots (until real screenshots are added). */
const SCREENSHOT_SLOTS = [
  'The castle at night',
  'Fishing at the pond',
  'The graveyard',
  'The dark garden',
  'Hanging out with other players',
  'The fish collection',
  'Character customization',
  'Rivers after dark',
  'The mysterious girl',
];

function Ornament() {
  return (
    <div className="bc-orn" aria-hidden="true">
      <span />
      <PixelSprite name="fish" scale={2} />
      <span />
    </div>
  );
}

function GameplayCard({ item, index }: { item: (typeof GAMEPLAY)[number]; index: number }) {
  const ref = useTilt<HTMLElement>(10);
  return (
    <li data-reveal style={{ '--delay': `${index * 70}ms` } as CSSProperties}>
      <article ref={ref} className={`play-card play-card--${item.id} tilt`}>
        <span className="play-card__num" aria-hidden="true">
          0{index + 1}
        </span>
        <span className="play-card__icon" aria-hidden="true">
          <PixelSprite name={item.sprite} scale={5} />
        </span>
        <h3 className="play-card__title">{item.title}</h3>
        <p className="play-card__text">{item.text}</p>
        <span className="tilt__glare" aria-hidden="true" />
      </article>
    </li>
  );
}

export function BloodcastPage({ game }: { game: Game }) {
  const shots: GalleryItem[] = imagesIn('bloodcast/screenshots').map((img) => ({
    src: img.src,
    srcSet: img.srcSet,
    width: img.width,
    height: img.height,
    alt: `BLOODCAST screenshot: ${img.label}`,
    caption: img.label,
  }));
  const posts = postsForGame('bloodcast');

  return (
    <article className="bcp" aria-labelledby="bc-title">
      <BloodcastHero game={game} />
      <ChapterNav />

      {/* 1 — about */}
      <section id="about-the-game" className="section bc-about" aria-labelledby="bc-about-title" data-byte="A strange place to fish. I approve.">
        <div className="container bc-about__grid">
          <div>
            <SectionHeading index="01" kicker="About the game" title="Welcome to BLOODCAST" id="bc-about-title" />
            <div className="bc-prose">
              <p className="bc-lead" data-reveal>
                BLOODCAST is a multiplayer fishing and social hangout game set in a dark gothic world.
              </p>
              <p data-reveal>
                Fish in moonlit ponds and rivers. Explore a world of gothic architecture: a large gothic house, a graveyard, a dark garden. Collect
                fish of every rarity, customize your character, and hang out with other players — talking through text chat, not voice.
              </p>
              <p data-reveal>
                It is inspired by the relaxed social-fishing structure of games like <em>Webfishing</em>, while building its own gothic visual
                identity and world.
              </p>
            </div>
          </div>
          <dl className="bc-facts" data-reveal="right">
            {game.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Ornament />

      {/* 2 — gameplay */}
      <section id="gameplay" className="section bc-gameplay" aria-labelledby="bc-gameplay-title" data-byte="Fish. Chat. Explore. Collect. Customize. Hang out.">
        <div className="container">
          <SectionHeading index="02" kicker="Gameplay" title="What you do here" id="bc-gameplay-title" />
          <ul className="play-grid">
            {GAMEPLAY.map((item, i) => (
              <GameplayCard key={item.id} item={item} index={i} />
            ))}
          </ul>
        </div>
      </section>

      {/* 3–6 */}
      <World />
      <Fishing />
      <FishCollection />
      <Customization />

      {/* 7 — screenshots */}
      <section id="screenshots" className="section bc-shots" aria-labelledby="bc-shots-title" data-byte="Real screenshots are coming soon!">
        <div className="container">
          <SectionHeading
            index="07"
            kicker="Screenshots"
            title="Postcards from the dark"
            intro={
              shots.length
                ? 'Captured in-game during development.'
                : 'Real screenshots will live here soon. Until then, these are empty frames — nothing on this page is fake footage.'
            }
            id="bc-shots-title"
          />
          {TRAILER_YOUTUBE_ID ? (
            <div className="trailer" data-reveal>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${TRAILER_YOUTUBE_ID}`}
                title="BLOODCAST trailer"
                loading="lazy"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="trailer trailer--soon" data-reveal>
              <span className="trailer__play" aria-hidden="true" />
              <p>
                <strong>Trailer</strong> — coming soon
              </p>
            </div>
          )}
          <ScreenshotGallery items={shots} placeholders={SCREENSHOT_SLOTS} />
        </div>
      </section>

      <Ornament />

      {/* 8 — development */}
      <section id="development" className="section bc-dev" aria-labelledby="bc-dev-title" data-byte="Just one dev. And me, for moral support.">
        <div className="container bc-dev__grid">
          <div>
            <SectionHeading index="08" kicker="Development" title="Made by one person" id="bc-dev-title" />
            <div className="bc-prose">
              <p className="bc-lead" data-reveal>
                BLOODCAST is being developed by a solo developer.
              </p>
              <p data-reveal>
                Design, programming, systems, and everything in between. It is still in development, so things will change along the way — the dev
                log is where the progress gets written down.
              </p>
            </div>
          </div>
          <ul className="bc-dev__status" data-reveal="right">
            <li>
              <span>Status</span>
              <strong className="bc-blink">In development</strong>
            </li>
            <li>
              <span>Team</span>
              <strong>1 — solo</strong>
            </li>
            <li>
              <span>Release date</span>
              <strong>TBA</strong>
            </li>
            <li>
              <span>Platforms</span>
              <strong>TBA</strong>
            </li>
          </ul>
        </div>
      </section>

      {/* 9 — technology */}
      <section id="technology" className="section bc-tech" aria-labelledby="bc-tech-title" data-byte="Unity and C#. The good stuff.">
        <div className="container">
          <SectionHeading index="09" kicker="Technology" title="Under the hood" id="bc-tech-title" />
          <ul className="tech-grid">
            {TECH.map((t, i) => (
              <li key={t.name} className="tech-card" data-reveal style={{ '--delay': `${i * 80}ms` } as CSSProperties}>
                <span className="tech-card__glyph" aria-hidden="true">
                  {t.glyph}
                </span>
                <h3 className="tech-card__name">{t.name}</h3>
                <p className="tech-card__text">{t.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 10 — dev log */}
      <section id="bloodcast-log" className="section bc-log" aria-labelledby="bc-log-title">
        <div className="container">
          <SectionHeading index="10" kicker="Development log" title="From the dev log" id="bc-log-title" />
          <DevLogList posts={posts} emptyText="No BLOODCAST entries yet — the first one is being written." />
          <p className="section-foot" data-reveal="fade">
            <Link to={paths.devlog} className="text-link">
              The full dev log <span className="arrow">→</span>
            </Link>
          </p>
        </div>
      </section>

      {/* 11 — follow */}
      <section id="follow" className="section bc-follow" aria-labelledby="bc-follow-title">
        <div className="container bc-follow__inner">
          <p className="bc-follow__kicker" data-reveal="fade">
            // 11 — Stay close to the water
          </p>
          <h2 id="bc-follow-title" className="bc-follow__title" data-reveal>
            Follow the development
          </h2>
          <p className="bc-follow__text" data-reveal>
            Store pages and community links will appear here as soon as they exist.
          </p>
          <ul className="bc-follow__links">
            {game.links.map((l, i) => (
              <li key={l.label} data-reveal style={{ '--delay': `${i * 70}ms` } as CSSProperties}>
                {l.url ? (
                  <a className="follow-slot" href={l.url} target="_blank" rel="noopener noreferrer">
                    <span className="follow-slot__label">{l.label}</span>
                    <span className="follow-slot__state">Open →</span>
                  </a>
                ) : (
                  <span className="follow-slot follow-slot--soon" aria-label={`${l.label}: coming soon`}>
                    <span className="follow-slot__label">{l.label}</span>
                    <span className="follow-slot__state">Coming soon</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
          <div className="bc-follow__ctas" data-reveal>
            <Button to={paths.devlog} variant="blood" icon="arrow">
              Read the dev log
            </Button>
            <Button to={paths.games} variant="ghost">
              More games
            </Button>
          </div>
        </div>
      </section>
    </article>
  );
}

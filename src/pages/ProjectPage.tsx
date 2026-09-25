import type { CSSProperties } from 'react';
import type { Game } from '../data/games';
import { Link } from '../lib/router';
import { paths } from '../lib/paths';
import { imageNamed, imagesIn } from '../lib/images';
import { postsForGame } from '../lib/devlog';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ArtSlot } from '../components/ui/ArtSlot';
import { Button } from '../components/ui/Button';
import { ScreenshotGallery, type GalleryItem } from '../components/ScreenshotGallery';
import { DevLogList } from '../components/DevLogList';
import { GameArt, STAGE_ART } from '../games/registry';
import './pages.css';

/**
 * The generic game page, driven entirely by src/data/games.ts.
 * Used by every game that doesn't register a custom page (e.g. Domino Dancing).
 */
export function ProjectPage({ game }: { game: Game }) {
  const screenshots: GalleryItem[] = imagesIn(`${game.slug}/screenshots`).map((img) => ({
    src: img.src,
    srcSet: img.srcSet,
    width: img.width,
    height: img.height,
    alt: `${game.title} screenshot: ${img.label}`,
    caption: img.label,
  }));
  const posts = postsForGame(game.slug);
  const Stage = STAGE_ART[game.slug];
  const cover = imageNamed(game.slug, 'cover');

  return (
    <article className="project" style={{ '--accent': game.theme.accent, '--accent2': game.theme.accent2 } as CSSProperties} aria-labelledby="project-title">
      <header className="project__hero page-top">
        <div className="container project__hero-grid">
          <div className="project__intro">
            <Link to={paths.games} className="back-link">
              ← All games
            </Link>
            <p className="project__meta" data-reveal="fade">
              <span className={`status status--${game.status}`}>{game.statusLabel}</span>
              <span className="project__catalog">{game.catalog}</span>
            </p>
            <h1 id="project-title" className="project__title" data-reveal>
              {game.title}
            </h1>
            <p className="project__tagline" data-reveal>
              {game.tagline}
            </p>
            <p className="project__genre" data-reveal>
              {game.genre}
            </p>
          </div>
          <div className="project__visual" data-reveal="scale">
            {Stage && !cover ? (
              <div className="project__stage">
                <Stage />
                <p className="project__stage-note">Placeholder visual, not gameplay — click to push.</p>
              </div>
            ) : (
              <ArtSlot label={`${game.title} cover`} image={cover} ratio="16 / 10" eager>
                <GameArt game={game} />
              </ArtSlot>
            )}
          </div>
        </div>
      </header>

      <section className="section project__about" aria-labelledby="project-about-title">
        <div className="container project__about-grid">
          <div>
            <SectionHeading index="01" kicker="About" title="The idea" id="project-about-title" />
            <div className="project__prose">
              {game.description.map((p, i) => (
                <p key={i} data-reveal className={i === 0 ? 'project__lead' : undefined}>
                  {p}
                </p>
              ))}
            </div>
          </div>
          <dl className="project__facts" data-reveal="right">
            {game.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {screenshots.length ? (
        <section className="section" aria-labelledby="project-shots-title">
          <div className="container">
            <SectionHeading index="02" kicker="Screenshots" title="From the prototype" id="project-shots-title" />
            <ScreenshotGallery items={screenshots} />
          </div>
        </section>
      ) : null}

      <section className="section" aria-labelledby="project-log-title">
        <div className="container">
          <SectionHeading index={screenshots.length ? '03' : '02'} kicker="Dev log" title="Notes" id="project-log-title" />
          <DevLogList posts={posts} emptyText={`No dev log entries for ${game.title} yet.`} />
        </div>
      </section>

      <section className="section project__cta" aria-labelledby="project-cta-title">
        <div className="container project__cta-inner">
          <h2 id="project-cta-title" className="project__cta-title" data-reveal>
            {game.status === 'released' ? 'Play it' : 'Want to see where it goes?'}
          </h2>
          <p className="project__cta-text" data-reveal>
            {game.links.some((l) => l.url) ? 'Find it here:' : 'Nothing to download yet — progress will show up in the dev log first.'}
          </p>
          {game.links.some((l) => l.url) ? (
            <ul className="project__links">
              {game.links
                .filter((l) => l.url)
                .map((l) => (
                  <li key={l.label}>
                    <a className="btn btn--ghost btn--small" href={l.url!} target="_blank" rel="noopener noreferrer">
                      {l.label}
                    </a>
                  </li>
                ))}
            </ul>
          ) : null}
          <div className="project__cta-buttons" data-reveal>
            <Button to={paths.devlog} icon="arrow">
              Read the dev log
            </Button>
            <Button to={paths.games} variant="ghost">
              All games
            </Button>
          </div>
        </div>
      </section>
    </article>
  );
}

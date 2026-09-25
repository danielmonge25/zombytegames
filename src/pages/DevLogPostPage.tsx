import type { DevlogPost } from '../lib/devlog';
import { PUBLISHED_POSTS, formatDate } from '../lib/devlog';
import { getGame } from '../data/games';
import { Link } from '../lib/router';
import { paths } from '../lib/paths';
import './pages.css';

export function DevLogPostPage({ post }: { post: DevlogPost }) {
  const game = post.game ? getGame(post.game) : undefined;
  const ordered = [...PUBLISHED_POSTS].sort((a, b) => a.number - b.number);
  const i = ordered.findIndex((p) => p.slug === post.slug);
  const prev = ordered[i - 1];
  const next = ordered[i + 1];

  return (
    <article className="section page-top post" aria-labelledby="post-title">
      <div className="container post__inner">
        <Link to={paths.devlog} className="back-link">
          ← Dev log
        </Link>
        <header className="post__head">
          <p className="post__label">{post.label}</p>
          <h1 id="post-title" className="post__title">
            {post.title}
          </h1>
          <p className="post__meta">
            <time dateTime={post.date ?? undefined}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.minutes} min read</span>
            <span aria-hidden="true">·</span>
            {game ? <Link to={paths.game(game.slug)}>{game.title}</Link> : <span>Zombyte Games</span>}
          </p>
        </header>

        <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

        <footer className="post__foot">
          {post.tags.length ? (
            <ul className="post__tags" aria-label="Tags">
              {post.tags.map((t) => (
                <li key={t} className="chip">
                  #{t}
                </li>
              ))}
            </ul>
          ) : null}
          <nav className="post__nav" aria-label="More entries">
            {prev ? (
              <Link to={paths.post(prev.slug)} className="post__nav-link">
                <span>← Previous</span>
                {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link to={paths.post(next.slug)} className="post__nav-link post__nav-link--next">
                <span>Next →</span>
                {next.title}
              </Link>
            ) : (
              <Link to={paths.devlog} className="post__nav-link post__nav-link--next">
                <span>More →</span>
                All entries
              </Link>
            )}
          </nav>
        </footer>
      </div>
    </article>
  );
}

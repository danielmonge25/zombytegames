import type { CSSProperties } from 'react';
import type { DevlogPost } from '../lib/devlog';
import { formatDate } from '../lib/devlog';
import { getGame } from '../data/games';
import { Link } from '../lib/router';
import { paths } from '../lib/paths';
import './devlog.css';

function Entry({ post }: { post: DevlogPost }) {
  const game = post.game ? getGame(post.game) : undefined;
  const published = post.status === 'published';
  const body = (
    <>
      <span className="log__num" aria-hidden="true">
        #{String(post.number).padStart(3, '0')}
      </span>
      <div className="log__main">
        <p className="log__meta">
          <span>{post.label}</span>
          <span aria-hidden="true">·</span>
          <span>{published ? <time dateTime={post.date ?? undefined}>{formatDate(post.date)}</time> : 'Date TBA'}</span>
          <span className={`log__tag${game ? ` log__tag--${game.slug}` : ''}`}>{game ? game.title : 'Zombyte'}</span>
          {published ? null : <span className="log__soon">In the works</span>}
        </p>
        <h3 className="log__title">{post.title}</h3>
        <p className="log__excerpt">{post.excerpt}</p>
      </div>
      <span className="log__cta" aria-hidden="true">
        {published ? (
          <>
            Read <span className="log__arrow">→</span>
          </>
        ) : (
          <span className="log__lock">Soon</span>
        )}
      </span>
    </>
  );
  return published ? (
    <Link to={paths.post(post.slug)} className="log__entry" data-cursor="Read">
      {body}
    </Link>
  ) : (
    <div className="log__entry log__entry--soon">{body}</div>
  );
}

/** A dev log listing. Reused on the home page, /devlog/ and each game page. */
export function DevLogList({ posts, emptyText = 'No entries yet — the first one is being written.' }: { posts: DevlogPost[]; emptyText?: string }) {
  if (!posts.length) return <p className="log__empty">{emptyText}</p>;
  return (
    <ol className="log">
      {posts.map((p, i) => (
        <li key={p.slug} data-reveal style={{ '--delay': `${i * 80}ms` } as CSSProperties}>
          <Entry post={p} />
        </li>
      ))}
    </ol>
  );
}

import { useState } from 'react';
import { POSTS, displayOrder } from '../lib/devlog';
import { getGame } from '../data/games';
import { DevLogList } from '../components/DevLogList';
import './pages.css';

export function DevLogIndexPage() {
  const [filter, setFilter] = useState<string>('all');
  const games = [...new Set(POSTS.map((p) => p.game ?? 'zombyte'))];
  const posts = displayOrder(POSTS).filter((p) => filter === 'all' || (p.game ?? 'zombyte') === filter);
  const label = (key: string) => (key === 'zombyte' ? 'General' : (getGame(key)?.title ?? key));

  return (
    <section className="section page-top devlog-page" aria-labelledby="devlog-page-title">
      <div className="container">
        <header className="page-head">
          <p className="kicker" data-reveal="fade">
            <span className="page-head__index">//</span> Dev log
          </p>
          <h1 id="devlog-page-title" className="page-head__title" data-reveal>
            The development journal
          </h1>
          <p className="page-head__intro" data-reveal>
            Progress notes, experiments, and lessons from building games as a solo developer. Newest entries first; the ones still being written
            are listed at the end.
          </p>
        </header>

        <div className="filters" role="group" aria-label="Filter entries" data-reveal="fade">
          {['all', ...games].map((key) => (
            <button key={key} type="button" className="filters__btn" aria-pressed={filter === key} onClick={() => setFilter(key)}>
              {key === 'all' ? 'All entries' : label(key)}
              <span className="filters__count">{key === 'all' ? POSTS.length : POSTS.filter((p) => (p.game ?? 'zombyte') === key).length}</span>
            </button>
          ))}
        </div>

        <DevLogList posts={posts} />
      </div>
    </section>
  );
}

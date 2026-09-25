import { useEffect, useState } from 'react';
import { Mascot } from '../components/mascot/Mascot';
import { Button } from '../components/ui/Button';
import { paths } from '../lib/paths';
import './pages.css';

export function NotFoundPage() {
  const [path, setPath] = useState('');
  useEffect(() => setPath(window.location.pathname), []);

  return (
    <section className="section page-top notfound" aria-labelledby="notfound-title">
      <div className="container notfound__inner">
        <div className="notfound__byte" aria-hidden="true">
          <Mascot mood="dizzy" />
        </div>
        <p className="notfound__code" aria-hidden="true">
          404
        </p>
        <h1 id="notfound-title" className="notfound__title">
          Level not found
        </h1>
        <p className="notfound__text">
          This page swam away{path && path !== '/404' ? <> — <code>{path}</code> doesn’t exist</> : null}. Byte looked everywhere.
        </p>
        <div className="notfound__ctas">
          <Button to={paths.home} icon="arrow">
            Respawn at home
          </Button>
          <Button to={paths.games} variant="ghost">
            See the games
          </Button>
        </div>
      </div>
    </section>
  );
}

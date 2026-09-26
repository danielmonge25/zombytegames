import { Link } from '../lib/router';
import { GAMES } from '../data/games';
import { SITE } from '../data/site';
import { paths } from '../lib/paths';
import { setReducedMotion, useReducedMotion } from '../lib/motion';
import { ACHIEVEMENTS, useUnlocked } from '../lib/achievements';
import { useStore } from '../lib/store';
import { byteHiddenStore, secretsOpenStore, setByteHidden } from '../lib/ui';
import { PixelSprite } from './pixel/PixelSprite';
import { Mascot } from './mascot/Mascot';
import './footer.css';

export function Footer({ inert }: { inert?: boolean }) {
  const reduced = useReducedMotion();
  const unlocked = useUnlocked();
  const byteHidden = useStore(byteHiddenStore);

  return (
    <footer className="footer" inert={inert}>
      <div className="container footer__top">
        <div className="footer__brand">
          <div className="footer__logo" aria-hidden="true">
            <span className="footer__mark">
              <Mascot mood="happy" track={false} />
            </span>
            <span>
              ZOMBYTE <em>GAMES</em>
            </span>
          </div>
          <p className="footer__tagline">{SITE.tagline}</p>
        </div>

        <nav className="footer__cols" aria-label="Footer">
          <div>
            <h2 className="footer__h">Games</h2>
            <ul>
              {GAMES.map((g) => (
                <li key={g.slug}>
                  <Link to={paths.game(g.slug)}>{g.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="footer__h">Zombyte</h2>
            <ul>
              <li>
                <Link to={paths.about}>About</Link>
              </li>
              <li>
                <Link to={paths.contact}>Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="footer__h">Extras</h2>
            <ul>
              <li>
                <button type="button" className="footer__btn" aria-pressed={reduced} onClick={() => setReducedMotion(!reduced)}>
                  Reduce motion: <strong>{reduced ? 'on' : 'off'}</strong>
                </button>
              </li>
              <li>
                <button type="button" className="footer__btn footer__btn--secrets" onClick={() => secretsOpenStore.set(true)}>
                  <PixelSprite name="trophy" scale={2} />
                  Secrets: <strong>{unlocked.length}/{ACHIEVEMENTS.length}</strong>
                </button>
              </li>
              {byteHidden ? (
                <li>
                  <button type="button" className="footer__btn" onClick={() => setByteHidden(false)}>
                    Summon Byte
                  </button>
                </li>
              ) : null}
            </ul>
          </div>
        </nav>
      </div>

      <div className="container footer__bottom">
        <p>
          © {__BUILD_YEAR__} {SITE.name}. Made by Daniel Monge in Costa Rica.
        </p>
        <p>Thanks for stopping by. Byte says hi.</p>
      </div>
    </footer>
  );
}

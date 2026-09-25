import { useEffect, useRef } from 'react';
import { useStore } from '../lib/store';
import { secretsOpenStore } from '../lib/ui';
import { ACHIEVEMENTS, resetAchievements, useUnlocked } from '../lib/achievements';
import { PixelSprite } from './pixel/PixelSprite';

/** The list of site secrets (achievements), in a native <dialog>. */
export function SecretsDialog() {
  const open = useStore(secretsOpenStore);
  const unlocked = useUnlocked();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  const close = () => secretsOpenStore.set(false);
  const pct = Math.round((unlocked.length / ACHIEVEMENTS.length) * 100);

  return (
    <dialog
      ref={ref}
      className="secrets"
      aria-labelledby="secrets-title"
      onClose={close}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="secrets__inner">
        <header className="secrets__head">
          <PixelSprite name="trophy" scale={4} />
          <div>
            <h2 id="secrets-title">Secrets</h2>
            <p>
              {unlocked.length} of {ACHIEVEMENTS.length} found · saved in this browser
            </p>
          </div>
          <button type="button" className="secrets__close" onClick={close} aria-label="Close secrets">
            ×
          </button>
        </header>
        <div className="secrets__bar" aria-hidden="true">
          <div style={{ width: `${pct}%` }} />
        </div>
        <ul className="secrets__list">
          {ACHIEVEMENTS.map((a) => {
            const got = unlocked.includes(a.id);
            return (
              <li key={a.id} data-unlocked={got}>
                <PixelSprite name={got ? 'trophy' : 'lock'} scale={3} />
                <div>
                  <p className="secrets__name">{got ? a.title : '???'}</p>
                  <p className="secrets__desc">{got ? a.description : `Hint: ${a.hint}`}</p>
                </div>
              </li>
            );
          })}
        </ul>
        {unlocked.length > 0 ? (
          <button type="button" className="secrets__reset" onClick={resetAchievements}>
            Reset progress
          </button>
        ) : null}
      </div>
    </dialog>
  );
}

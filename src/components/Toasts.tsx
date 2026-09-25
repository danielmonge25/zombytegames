import { useStore } from '../lib/store';
import { dismissToast, toastStore } from '../lib/toast';
import { PixelSprite } from './pixel/PixelSprite';

export function Toasts() {
  const toasts = useStore(toastStore);
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.kind}`}>
          <span className="toast__icon" aria-hidden="true">
            <PixelSprite name={t.kind === 'achievement' ? 'trophy' : t.kind === 'zombie' ? 'skull' : 'sparkle'} scale={3} />
          </span>
          <div className="toast__text">
            <p className="toast__title">
              {t.kind === 'achievement' ? <span className="toast__eyebrow">Secret found</span> : null}
              {t.title}
            </p>
            {t.body ? <p className="toast__body">{t.body}</p> : null}
          </div>
          <button type="button" className="toast__close" onClick={() => dismissToast(t.id)} aria-label="Dismiss notification">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

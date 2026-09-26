import { useEffect, useState } from 'react';
import { Mascot } from './mascot/Mascot';
import './boot.css';

/**
 * Title screen shown on the first visit of a session. Visible only while <html> has the `booting`
 * class (set by the inline script in index.html). Any key/click skips it.
 */
export function BootScreen() {
  const [phase, setPhase] = useState<'boot' | 'exit' | 'gone'>('boot');

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('booting')) {
      setPhase('gone');
      return;
    }
    let exitTimer = 0;
    const events = ['keydown', 'pointerdown', 'wheel', 'touchmove'] as const;
    const detach = () => events.forEach((ev) => window.removeEventListener(ev, finish));
    function finish() {
      detach();
      if (!root.classList.contains('booting')) {
        setPhase('gone');
        return;
      }
      root.classList.remove('booting');
      setPhase('exit');
      exitTimer = window.setTimeout(() => setPhase('gone'), 700);
    }
    events.forEach((ev) => window.addEventListener(ev, finish, { passive: true }));
    const auto = window.setTimeout(finish, 2300);
    return () => {
      window.clearTimeout(auto);
      window.clearTimeout(exitTimer);
      detach();
      root.classList.remove('booting');
    };
  }, []);

  if (phase === 'gone') return null;

  return (
    <div className="boot" data-exiting={phase === 'exit'} aria-hidden="true">
      <div className="boot__inner">
        <div className="boot__byte">
          <Mascot track={false} />
        </div>
        <p className="boot__title">
          Zombyte <span>Games</span>
        </p>
        <p className="boot__sub">Loading strange little games…</p>
        <div className="boot__bar">
          <div className="boot__fill" />
        </div>
        <p className="boot__hint">Press any key to start</p>
      </div>
    </div>
  );
}

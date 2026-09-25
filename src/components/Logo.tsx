import { useRef, useState } from 'react';
import { Link } from '../lib/router';
import { Mascot } from './mascot/Mascot';
import { toggleZombieMode } from '../lib/easterEggs';
import { isReducedMotion } from '../lib/motion';

/**
 * ZOMBYTE GAMES logo. To use your own logo later, replace the <Mascot> mark
 * (and/or the wordmark) with an <img src="/logo.svg" alt="" />.
 * Secret: five quick clicks toggle zombie mode.
 */
export function Logo({ onNavigate }: { onNavigate?: () => void }) {
  const clicks = useRef<number[]>([]);
  const markRef = useRef<HTMLSpanElement>(null);
  const [suspicious, setSuspicious] = useState(false);

  const handleClick = () => {
    onNavigate?.();
    const now = Date.now();
    clicks.current = [...clicks.current.filter((t) => now - t < 2200), now];
    const mark = markRef.current;
    if (mark && !isReducedMotion()) {
      mark.classList.remove('is-hopping');
      void mark.offsetWidth;
      mark.classList.add('is-hopping');
    }
    setSuspicious(clicks.current.length >= 3);
    if (clicks.current.length >= 5) {
      clicks.current = [];
      setSuspicious(false);
      toggleZombieMode();
    }
  };

  return (
    <Link to="/" className="logo" aria-label="Zombyte Games — home" onClick={handleClick}>
      <span className="logo__mark" ref={markRef} onAnimationEnd={(e) => e.currentTarget.classList.remove('is-hopping')}>
        <Mascot mood={suspicious ? 'surprised' : 'idle'} />
      </span>
      <span className="logo__word" aria-hidden="true">
        <span className="logo__zombyte">ZOMBYTE</span>
        <span className="logo__games">GAMES</span>
      </span>
    </Link>
  );
}

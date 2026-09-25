import { useEffect } from 'react';
import { makeItRainFish, setZombieMode, toggleZombieMode, zombieStore } from '../lib/easterEggs';
import { ACHIEVEMENTS } from '../lib/achievements';
import { secretsOpenStore } from '../lib/ui';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

declare global {
  interface Window {
    zombyte?: Record<string, () => string>;
  }
}

/** Global listeners for the site's secrets (no UI of its own). */
export function EasterEggs() {
  useEffect(() => {
    let progress = 0;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, [contenteditable="true"]')) return;
      if (e.key === 'Escape' && zombieStore.get() && !document.querySelector('dialog[open]')) {
        setZombieMode(false);
        return;
      }
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      progress = key === KONAMI[progress] ? progress + 1 : key === KONAMI[0] ? 1 : 0;
      if (progress === KONAMI.length) {
        progress = 0;
        makeItRainFish();
      }
    };
    window.addEventListener('keydown', onKey);

    // A hello for the curious people who open DevTools.
    if (!window.zombyte) {
      console.log(
        '%c ZOMBYTE GAMES %c one engineer building weird, interesting games',
        'background:#c6ff3d;color:#0a0910;font-weight:700;padding:4px 6px;border-radius:3px',
        'color:#a7a1bc;padding:4px',
      );
      console.log('%cOh, you opened the console. Of course you did. Try: zombyte.help()', 'color:#8b6cff');
      window.zombyte = {
        help: () => 'zombyte.fish() · zombyte.zombie() · zombyte.secrets()',
        fish: () => {
          makeItRainFish();
          return 'splash.';
        },
        zombie: () => {
          toggleZombieMode();
          return zombieStore.get() ? 'brains…' : 'cured.';
        },
        secrets: () => {
          secretsOpenStore.set(true);
          return `${ACHIEVEMENTS.length} secrets hidden on this site.`;
        },
      };
    }
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return null;
}


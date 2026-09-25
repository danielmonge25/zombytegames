import { createStore } from './store';
import { isReducedMotion } from './motion';
import { pushToast } from './toast';
import { unlock } from './achievements';

/* ── Zombie mode (click the logo 5×) ─────────────────────────── */

export const zombieStore = createStore(false);

export function setZombieMode(on: boolean) {
  if (zombieStore.get() === on) return;
  zombieStore.set(on);
  const root = document.documentElement;
  root.classList.toggle('zombie', on);
  if (!isReducedMotion()) {
    root.classList.remove('glitching');
    void root.offsetWidth; // restart the CSS animation
    root.classList.add('glitching');
    window.setTimeout(() => root.classList.remove('glitching'), 700);
  }
  if (on) {
    unlock('infected');
    pushToast({ kind: 'zombie', title: 'Zombie mode: ON', body: 'The site has been infected. Press Esc or click the logo 5× to cure it.' }, 6000);
  } else {
    pushToast({ kind: 'info', title: 'Cured', body: 'Zombie mode off. Everything is (mostly) normal again.' });
  }
}

export const toggleZombieMode = () => setZombieMode(!zombieStore.get());

/* ── Fish rain (Konami code) ─────────────────────────────────── */

/** Increments every time fish should rain; <FishRain> listens to it. */
export const fishRainStore = createStore(0);

export function makeItRainFish() {
  unlock('old-school');
  if (isReducedMotion()) {
    pushToast({ kind: 'info', title: 'It is raining fish', body: '(Animations are reduced, so you will have to imagine it.)' });
    return;
  }
  fishRainStore.set((n) => n + 1);
}

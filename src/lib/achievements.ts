import { useSyncExternalStore } from 'react';
import { pushToast } from './toast';

/**
 * Site "secrets": little achievements for visitors who poke around.
 * Progress is stored in localStorage (this browser only).
 */
export const ACHIEVEMENTS = [
  { id: 'infected', title: 'Infected', description: 'Clicked the logo five times in a row.', hint: 'The logo is more than a logo.' },
  { id: 'old-school', title: 'Old School', description: 'Entered the Konami code.', hint: '↑ ↑ ↓ ↓ …you know the rest.' },
  { id: 'front-row', title: 'Front Row', description: 'Watched the BLOODCAST trailer.', hint: 'There is a moonlit castle waiting for you to press play.' },
  { id: 'chain-reaction', title: 'Chain Reaction', description: 'Toppled the dominoes.', hint: 'One of the games is one push away from falling over.' },
  { id: 'best-friends', title: 'Best Friends', description: 'Poked Byte five times.', hint: 'Byte likes attention.' },
] as const;

export type AchievementId = (typeof ACHIEVEMENTS)[number]['id'];

const KEY = 'zg:secrets';
const EMPTY: readonly AchievementId[] = [];
const listeners = new Set<() => void>();
let unlocked: readonly AchievementId[] | null = null;

function load(): readonly AchievementId[] {
  if (unlocked) return unlocked;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    unlocked = Array.isArray(raw) ? raw.filter((id) => ACHIEVEMENTS.some((a) => a.id === id)) : [];
  } catch {
    unlocked = [];
  }
  return unlocked!;
}

/** Unlocks an achievement once and shows a toast. Returns true if it was new. */
export function unlock(id: AchievementId): boolean {
  const list = load();
  if (list.includes(id)) return false;
  unlocked = [...list, id];
  try {
    localStorage.setItem(KEY, JSON.stringify(unlocked));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
  const a = ACHIEVEMENTS.find((x) => x.id === id)!;
  pushToast({ kind: 'achievement', title: a.title, body: `${a.description} · ${unlocked.length}/${ACHIEVEMENTS.length} secrets` });
  return true;
}

export function resetAchievements() {
  unlocked = [];
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useUnlocked(): readonly AchievementId[] {
  return useSyncExternalStore(subscribe, load, () => EMPTY);
}

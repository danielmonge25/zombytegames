import { createStore } from './store';
import type { Mood } from '../components/mascot/Mascot';

/** Global UI state shared between unrelated components. */

/** What Byte (the mascot) is currently saying. */
export const byteSpeechStore = createStore<{ text: string; mood?: Mood; id: number } | null>(null);
let speechId = 0;
export function byteSay(text: string, mood?: Mood) {
  byteSpeechStore.set({ text, mood, id: ++speechId });
}

/** Visitor sent Byte away (persisted). */
export const byteHiddenStore = createStore(false);
export function setByteHidden(hidden: boolean) {
  byteHiddenStore.set(hidden);
  try {
    localStorage.setItem('zg:byte', hidden ? 'hidden' : 'shown');
  } catch {
    /* ignore */
  }
}

/** True while the big hero Byte is on screen (the companion hides meanwhile). */
export const heroByteVisibleStore = createStore(false);

/** The "Secrets" dialog. */
export const secretsOpenStore = createStore(false);

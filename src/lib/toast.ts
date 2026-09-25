import { createStore } from './store';

export interface Toast {
  id: number;
  kind: 'achievement' | 'info' | 'zombie';
  title: string;
  body?: string;
}

export const toastStore = createStore<Toast[]>([]);
let nextId = 1;

export function pushToast(toast: Omit<Toast, 'id'>, duration = 4600) {
  const id = nextId++;
  toastStore.set((list) => [...list.slice(-2), { ...toast, id }]);
  window.setTimeout(() => dismissToast(id), duration);
}

export function dismissToast(id: number) {
  toastStore.set((list) => list.filter((t) => t.id !== id));
}

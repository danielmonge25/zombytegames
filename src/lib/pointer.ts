/**
 * One shared pointermove listener for every interactive widget.
 * Listeners are called at most once per animation frame.
 */
type Listener = (x: number, y: number) => void;

const listeners = new Set<Listener>();
let x = -1;
let y = -1;
let attached = false;
let scheduled = false;

function flush() {
  scheduled = false;
  listeners.forEach((l) => l(x, y));
}

function onMove(e: PointerEvent) {
  x = e.clientX;
  y = e.clientY;
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(flush);
  }
}

export function onPointerMove(listener: Listener): () => void {
  if (!attached) {
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });
    attached = true;
  }
  listeners.add(listener);
  if (x >= 0) listener(x, y);
  return () => {
    listeners.delete(listener);
  };
}


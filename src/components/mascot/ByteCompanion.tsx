import { useEffect, useRef, useState } from 'react';
import { Mascot, type Mood } from './Mascot';
import { useStore } from '../../lib/store';
import { byteHiddenStore, byteSay, byteSpeechStore, heroByteVisibleStore, setByteHidden } from '../../lib/ui';
import { useRouter } from '../../lib/router';
import { unlock } from '../../lib/achievements';
import { isReducedMotion } from '../../lib/motion';

const QUIPS = [
  "I'm Byte. I live here.",
  'Fun fact: I was drawn one pixel at a time.',
  'Have you tried clicking the logo? A lot?',
  'BLOODCAST has fish. I have no fins. Unfair.',
  "Psst. There's a terminal in the About section.",
  "I'm not a bug. I'm a feature.",
  'Every game starts as a weird idea.',
  '↑ ↑ ↓ ↓ ← → ← → B A. Just saying.',
  'Did you find all the secrets yet?',
  'This site redeploys itself on every push. Neat, right?',
  'Solo dev means I am also the QA team.',
];

/**
 * Byte, following you around the site from the bottom-right corner.
 * Comments on sections (elements with `data-byte="…"`), reacts to fast
 * scrolling, falls asleep when you go idle, and enjoys being poked.
 */
export function ByteCompanion() {
  const { path } = useRouter();
  const hidden = useStore(byteHiddenStore);
  const heroVisible = useStore(heroByteVisibleStore);
  const speech = useStore(byteSpeechStore);
  const [mounted, setMounted] = useState(false);
  const [mood, setMood] = useState<Mood>('idle');
  const [bubble, setBubble] = useState<string | null>(null);
  const [asleep, setAsleep] = useState(false);
  const pokeRef = useRef<HTMLButtonElement>(null);
  const pokes = useRef(0);
  const quipIndex = useRef(0);
  const moodTimer = useRef<number>(0);
  const bubbleTimer = useRef<number>(0);

  const visible = mounted && !hidden && !heroVisible;

  // Appear shortly after load, restore "sent away" preference.
  useEffect(() => {
    try {
      byteHiddenStore.set(localStorage.getItem('zg:byte') === 'hidden');
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => setMounted(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  // Show whatever Byte was asked to say.
  useEffect(() => {
    if (!speech) return;
    setBubble(speech.text);
    setAsleep(false);
    if (speech.mood) {
      setMood(speech.mood);
      window.clearTimeout(moodTimer.current);
      moodTimer.current = window.setTimeout(() => setMood('idle'), 1800);
    }
    window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setBubble(null), Math.max(2800, speech.text.length * 70));
  }, [speech]);

  // Section commentary: say each section's line once per page view.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const said = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !said.has(e.target)) {
            said.add(e.target);
            const line = (e.target as HTMLElement).dataset.byte;
            // On phones the bubble would cover content, so Byte only talks when poked.
            if (line && window.innerWidth >= 760 && !byteHiddenStore.get() && !heroByteVisibleStore.get()) byteSay(line);
          }
        }
      },
      { rootMargin: '-48% 0px -48% 0px' },
    );
    const t = window.setTimeout(() => document.querySelectorAll('[data-byte]').forEach((el) => io.observe(el)), 400);
    return () => {
      window.clearTimeout(t);
      io.disconnect();
    };
  }, [path]);

  // React to scroll speed + fall asleep when idle.
  useEffect(() => {
    let lastY = window.scrollY;
    let lastT = performance.now();
    let fastSince = 0;
    let complained = false;
    let idle: number;
    const wake = () => {
      setAsleep(false);
      window.clearTimeout(idle);
      idle = window.setTimeout(() => setAsleep(true), 28000);
    };
    const onScroll = () => {
      const now = performance.now();
      const v = Math.abs(window.scrollY - lastY) / Math.max(1, now - lastT);
      lastY = window.scrollY;
      lastT = now;
      wake();
      if (isReducedMotion()) return;
      if (v > 4) {
        if (!fastSince) fastSince = now;
        const dizzy = now - fastSince > 700;
        setMood(dizzy ? 'dizzy' : 'surprised');
        if (dizzy && !complained && window.innerWidth >= 760) {
          complained = true;
          byteSay('Whoa, slow down…');
        }
        window.clearTimeout(moodTimer.current);
        moodTimer.current = window.setTimeout(() => {
          setMood('idle');
          fastSince = 0;
        }, dizzy ? 1400 : 450);
      } else if (v < 1.5) {
        fastSince = 0;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', wake, { passive: true });
    window.addEventListener('keydown', wake);
    wake();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', wake);
      window.removeEventListener('keydown', wake);
      window.clearTimeout(idle);
    };
  }, []);

  const poke = () => {
    pokes.current += 1;
    const el = pokeRef.current;
    if (el && !isReducedMotion()) {
      el.classList.remove('is-hopping');
      void el.offsetWidth; // restart the hop animation
      el.classList.add('is-hopping');
    }
    setAsleep(false);
    const line = QUIPS[quipIndex.current++ % QUIPS.length];
    if (pokes.current === 5) {
      unlock('best-friends');
      byteSay('Okay, okay — we are best friends now.', 'happy');
    } else {
      byteSay(line, pokes.current % 3 === 0 ? 'wink' : 'happy');
    }
  };

  const displayMood: Mood = asleep ? 'sleep' : mood;

  return (
    <aside className="companion" data-visible={visible} aria-label="Byte, the Zombyte mascot" inert={!visible}>
      <div className="companion__bubble" data-show={Boolean(bubble) && !asleep} aria-hidden="true">
        {bubble}
      </div>
      {asleep ? (
        <span className="companion__zzz" aria-hidden="true">
          <span>z</span>
          <span>z</span>
          <span>z</span>
        </span>
      ) : null}
      <button
        ref={pokeRef}
        type="button"
        className="companion__poke"
        onClick={poke}
        onAnimationEnd={(e) => e.currentTarget.classList.remove('is-hopping')}
        aria-label="Poke Byte"
      >
        <Mascot mood={displayMood} />
      </button>
      <button type="button" className="companion__close" onClick={() => setByteHidden(true)} aria-label="Send Byte away">
        ×
      </button>
    </aside>
  );
}

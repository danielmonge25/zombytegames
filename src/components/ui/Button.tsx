import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from '../../lib/router';
import { isReducedMotion } from '../../lib/motion';
import { ScrambleText } from '../ScrambleText';

type Variant = 'primary' | 'ghost' | 'blood' | 'bone';

interface ButtonProps {
  children: string;
  to?: string;
  onClick?: () => void;
  variant?: Variant;
  small?: boolean;
  /** 'arrow' | 'down' or any node. */
  icon?: 'arrow' | 'down' | ReactNode;
  magnetic?: boolean;
  className?: string;
  /** Extra decoration rendered inside the button (e.g. a peeking mascot). */
  extra?: ReactNode;
  ariaLabel?: string;
}

/** Pulls an element slightly towards the cursor while hovered. */
export function useMagnetic<T extends HTMLElement>(enabled = true, strength = 0.28) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const onMove = (e: PointerEvent) => {
      if (isReducedMotion()) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength * 1.3;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    };
    const onLeave = () => {
      el.style.transform = '';
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled, strength]);
  return ref;
}

const ICONS = {
  arrow: (
    <svg width="18" height="12" viewBox="0 0 18 12" shapeRendering="crispEdges" aria-hidden="true">
      <path d="M0 5h12v2H0zM10 1h2v2h-2zM12 3h2v2h-2zM14 5h2v2h-2zM12 7h2v2h-2zM10 9h2v2h-2z" fill="currentColor" />
    </svg>
  ),
  down: (
    <svg width="12" height="16" viewBox="0 0 12 16" shapeRendering="crispEdges" aria-hidden="true">
      <path d="M5 0h2v11H5zM1 7h2v2H1zM3 9h2v2H3zM5 11h2v2H5zM7 9h2v2H7zM9 7h2v2H9z" fill="currentColor" />
    </svg>
  ),
};

export function Button({ children, to, onClick, variant = 'primary', small, icon, magnetic = true, className, extra, ariaLabel }: ButtonProps) {
  const magnetRef = useMagnetic<HTMLSpanElement>(magnetic);
  const cls = ['btn', `btn--${variant}`, small ? 'btn--small' : '', className ?? ''].filter(Boolean).join(' ');
  const iconNode: ReactNode = icon === 'arrow' ? ICONS.arrow : icon === 'down' ? ICONS.down : icon;
  const content = (
    <>
      {extra}
      <ScrambleText text={children} />
      {iconNode ? (
        <span className="btn__icon" aria-hidden="true">
          {iconNode}
        </span>
      ) : null}
    </>
  );
  return (
    <span className="magnet" ref={magnetRef}>
      {to ? (
        <Link to={to} className={cls} aria-label={ariaLabel}>
          {content}
        </Link>
      ) : (
        <button type="button" className={cls} onClick={onClick} aria-label={ariaLabel}>
          {content}
        </button>
      )}
    </span>
  );
}

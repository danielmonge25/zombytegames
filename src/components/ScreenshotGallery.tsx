import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import './gallery.css';

export interface GalleryItem {
  /** Missing src = placeholder slot. */
  src?: string;
  srcSet?: string;
  width?: number;
  height?: number;
  alt: string;
  caption?: string;
}

const TINTS = ['#e0405e', '#8b6cff', '#3fb8a8', '#ffb547', '#ff5fa2', '#53e5ff'];

/** A clearly-labelled empty screenshot frame. */
function ShotPlaceholder({ index, label }: { index: number; label?: string }) {
  const tint = TINTS[index % TINTS.length];
  return (
    <div className="shot-ph" style={{ '--tint': tint } as CSSProperties}>
      <svg className="shot-ph__icon" viewBox="0 0 16 12" shapeRendering="crispEdges" aria-hidden="true">
        <path d="M0 0h16v12H0z" fill="none" />
        <path d="M1 1h14v1H1zM1 10h14v1H1zM1 2h1v8H1zM14 2h1v8h-1z" fill="currentColor" opacity=".7" />
        <path d="M3 8h2V7h1V6h1v1h1v1h1V7h1V6h1V5h1v1h1v2h1v1H3z" fill="currentColor" />
        <path d="M4 3h2v2H4z" fill="currentColor" />
      </svg>
      <span className="shot-ph__num">Screenshot {String(index + 1).padStart(2, '0')}</span>
      {label ? <span className="shot-ph__label">{label}</span> : null}
      <span className="shot-ph__soon">Coming soon</span>
    </div>
  );
}

function Lightbox({ items, index, setIndex }: { items: GalleryItem[]; index: number | null; setIndex: (i: number | null) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const startX = useRef<number | null>(null);
  const open = index !== null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  const go = (delta: number) => {
    if (index === null) return;
    setIndex((index + delta + items.length) % items.length);
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  const item = index !== null ? items[index] : null;

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label="Screenshot viewer"
      onClose={() => setIndex(null)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1);
        else if (e.key === 'ArrowLeft') go(-1);
        else if (e.key === 'Home') setIndex(0);
        else if (e.key === 'End') setIndex(items.length - 1);
      }}
    >
      {item && index !== null ? (
        <div
          className="lightbox__stage"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onClick={(e) => {
            if (e.target === e.currentTarget) ref.current?.close();
          }}
        >
          <figure className="lightbox__figure" key={index}>
            {item.src ? (
              <img src={item.src} srcSet={item.srcSet} sizes="100vw" width={item.width} height={item.height} alt={item.alt} draggable={false} />
            ) : (
              <ShotPlaceholder index={index} label={item.caption} />
            )}
            <figcaption className="lightbox__caption">
              <span>{item.caption ?? item.alt}</span>
              <span className="lightbox__count" aria-live="polite">
                {index + 1} / {items.length}
              </span>
            </figcaption>
          </figure>
          {items.length > 1 ? (
            <>
              <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={() => go(-1)} aria-label="Previous screenshot">
                ←
              </button>
              <button type="button" className="lightbox__nav lightbox__nav--next" onClick={() => go(1)} aria-label="Next screenshot">
                →
              </button>
            </>
          ) : null}
          <button type="button" className="lightbox__close" onClick={() => ref.current?.close()} aria-label="Close screenshot viewer">
            ×
          </button>
        </div>
      ) : null}
    </dialog>
  );
}

interface Props {
  items: GalleryItem[];
  /** Shown as placeholder slots while `items` is empty. */
  placeholders?: string[];
}

/**
 * Screenshot grid + fullscreen lightbox (keyboard arrows, swipe, prev/next).
 * With no real screenshots it renders labelled placeholder slots instead.
 */
export function ScreenshotGallery({ items, placeholders = [] }: Props) {
  const list: GalleryItem[] = items.length ? items : placeholders.map((p) => ({ alt: `Screenshot slot: ${p}`, caption: p }));
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      <ul className="gallery" data-placeholder={items.length ? undefined : 'true'}>
        {list.map((item, i) => (
          <li key={i} className="gallery__item" data-reveal style={{ '--delay': `${(i % 4) * 70}ms` } as CSSProperties}>
            <button type="button" className="gallery__btn" onClick={() => setIndex(i)} aria-label={`View ${item.caption ?? item.alt} (${i + 1} of ${list.length})`} data-cursor="View">
              {item.src ? (
                <img src={item.src} srcSet={item.srcSet} sizes="(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 92vw" width={item.width} height={item.height} alt="" loading="lazy" decoding="async" />
              ) : (
                <ShotPlaceholder index={i} label={item.caption} />
              )}
              <span className="gallery__zoom" aria-hidden="true">
                +
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Lightbox items={list} index={index} setIndex={setIndex} />
    </>
  );
}

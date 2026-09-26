import { useState, type MouseEvent } from 'react';
import type { ImageAsset } from '../lib/images';
import { unlock } from '../lib/achievements';
import { track } from '../lib/analytics';
import './video.css';

interface Props {
  youtubeId: string;
  title: string;
  /** Short caption on the thumbnail, e.g. "Pre-alpha demo trailer". */
  label: string;
  thumb?: ImageAsset;
}

/**
 * A YouTube video that only loads YouTube when someone presses play.
 * Until then it's a plain link to the video with a local thumbnail —
 * faster, more private, and it still works without JavaScript.
 */
export function VideoFacade({ youtubeId, title, label, thumb }: Props) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        className="video__frame"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  const play = (e: MouseEvent<HTMLAnchorElement>) => {
    track(`play-trailer-${youtubeId}`, `Trailer: ${title}`);
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    setPlaying(true);
    unlock('front-row');
  };

  return (
    <a className="video__facade" href={`https://youtu.be/${youtubeId}`} onClick={play} aria-label={`Play video: ${title}`} data-cursor="Play">
      {thumb ? (
        <img
          className="video__thumb"
          src={thumb.src}
          srcSet={thumb.srcSet}
          sizes="(min-width: 1024px) 58vw, 100vw"
          width={thumb.width}
          height={thumb.height}
          alt=""
          loading="lazy"
          decoding="async"
        />
      ) : null}
      <span className="video__cta" aria-hidden="true">
        <span className="video__icon">
          <svg viewBox="0 0 8 8" shapeRendering="crispEdges">
            <path d="M2 1h1v6H2zM3 2h1v4H3zM4 3h1v2H4zM5 3.5h.6v1H5z" fill="currentColor" />
          </svg>
        </span>
        <span className="video__text">{label}</span>
      </span>
    </a>
  );
}

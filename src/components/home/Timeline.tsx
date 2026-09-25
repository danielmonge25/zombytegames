import { useEffect, useRef, useState } from 'react';
import { JOURNEY } from '../../data/journey';
import { SectionHeading } from '../ui/SectionHeading';
import { PixelSprite } from '../pixel/PixelSprite';
import { isReducedMotion } from '../../lib/motion';
import './timeline.css';

/**
 * Software → AI → Games. The track fills as you scroll; each stage lights up
 * and opens when the fill reaches it (and can be toggled by hand).
 */
export function Timeline() {
  const listRef = useRef<HTMLOListElement>(null);
  const [reached, setReached] = useState(-1);
  const [manual, setManual] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (isReducedMotion()) {
      list.style.setProperty('--progress', '1');
      setReached(JOURNEY.length - 1);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const line = vh * 0.62;
      const r = list.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
      list.style.setProperty('--progress', p.toFixed(4));
      let idx = -1;
      list.querySelectorAll<HTMLElement>('.tl__node').forEach((node, i) => {
        const nr = node.getBoundingClientRect();
        if (nr.top + nr.height / 2 < line) idx = i;
      });
      setReached((prev) => Math.max(prev, idx));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section id="journey" className="section journey" aria-labelledby="journey-title" data-byte="Every good game has an origin story.">
      <div className="container">
        <SectionHeading
          index="04"
          kicker="My journey"
          title={
            <>
              Software → AI → <em>Games</em>
            </>
          }
          intro="Three stages so far. The third one is just getting started."
          id="journey-title"
        />

        <ol ref={listRef} className="tl">
          <li className="tl__track" aria-hidden="true">
            <span className="tl__fill" />
          </li>
          {JOURNEY.map((s, i) => {
            const open = manual[s.id] ?? i <= reached;
            const detailsId = `tl-${s.id}`;
            return (
              <li key={s.id} className="tl__stage" data-reached={i <= reached} data-current={s.current ? 'true' : undefined} data-side={i % 2 ? 'right' : 'left'}>
                <span className="tl__node" aria-hidden="true">
                  <PixelSprite name={s.sprite} scale={3} />
                </span>
                <div className="tl__card">
                  <p className="tl__era">
                    <span>Stage {String(i + 1).padStart(2, '0')}</span> · {s.era}
                    {s.current ? <span className="tl__now">Now</span> : null}
                  </p>
                  <h3 className="tl__title">{s.title}</h3>
                  <p className="tl__summary">{s.summary}</p>
                  <div id={detailsId} className="tl__details" data-open={open}>
                    <div className="tl__details-inner">
                      {s.details.map((d) => (
                        <p key={d}>{d}</p>
                      ))}
                      <ul className="tl__tags" aria-label="Keywords">
                        {s.tags.map((t) => (
                          <li key={t} className="chip">
                            {t}
                          </li>
                        ))}
                      </ul>
                      {s.current ? (
                        <p className="tl__loading">
                          <span>Level in progress</span>
                          <span className="tl__loading-bar" aria-hidden="true">
                            <i />
                          </span>
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="tl__toggle"
                    aria-expanded={open}
                    aria-controls={detailsId}
                    onClick={() => setManual((m) => ({ ...m, [s.id]: !open }))}
                  >
                    {open ? 'Show less' : 'Show more'}
                    <span aria-hidden="true">{open ? '−' : '+'}</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

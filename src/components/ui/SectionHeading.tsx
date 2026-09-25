import type { CSSProperties, ReactNode } from 'react';

interface Props {
  /** e.g. "01" */
  index: string;
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  /** id of the <h2> (for aria-labelledby). */
  id?: string;
  /** Show a pulsing "live" dot next to the kicker. */
  live?: boolean;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({ index, kicker, title, intro, id, live, align = 'left', className }: Props) {
  return (
    <header className={`section-head section-head--${align}${className ? ` ${className}` : ''}`}>
      <p className="section-head__kicker" data-reveal="fade">
        <span className="section-head__index">// {index}</span>
        <span className="section-head__line" aria-hidden="true" />
        <span>{kicker}</span>
        {live ? <span className="live-dot" aria-hidden="true" /> : null}
      </p>
      <h2 id={id} className="section-head__title" data-reveal style={{ '--delay': '60ms' } as CSSProperties}>
        {title}
      </h2>
      {intro ? (
        <p className="section-head__intro" data-reveal style={{ '--delay': '140ms' } as CSSProperties}>
          {intro}
        </p>
      ) : null}
    </header>
  );
}

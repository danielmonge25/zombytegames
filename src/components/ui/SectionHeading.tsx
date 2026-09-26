import type { CSSProperties, ReactNode } from 'react';

interface Props {
  /** Small sticker label above the title, e.g. "Games". */
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  /** id of the <h2> (for aria-labelledby). */
  id?: string;
  /** Show a pulsing "live" dot on the sticker. */
  live?: boolean;
  /** Sticker colour. */
  tone?: 'lime' | 'pink' | 'cyan' | 'amber';
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({ kicker, title, intro, id, live, tone = 'lime', align = 'left', className }: Props) {
  return (
    <header className={`section-head section-head--${align}${className ? ` ${className}` : ''}`}>
      <p className={`sticker sticker--${tone}`} data-reveal="fade">
        {live ? <span className="sticker__dot" aria-hidden="true" /> : null}
        {kicker}
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

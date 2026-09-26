import type { CSSProperties } from 'react';
import { CONTACT_LINKS, type ContactLink } from '../../data/site';
import { Mascot } from '../mascot/Mascot';
import { track } from '../../lib/analytics';
import './contact.css';

/** Letters that hop when hovered (and wave once when revealed). */
export function BouncyText({ text }: { text: string }) {
  let n = 0;
  const words = text.split(' ');
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="bouncy">
        {words.map((word, wi) => (
          <span key={wi}>
            <span className="bouncy__word">
              {[...word].map((ch, ci) => (
                <span key={ci} className="bouncy__char" style={{ '--i': n++ } as CSSProperties}>
                  {ch}
                </span>
              ))}
            </span>
            {wi < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </>
  );
}

const GLYPHS: Record<ContactLink['id'], string> = { linkedin: 'IN', discord: 'DC', youtube: 'YT', tiktok: 'TT' };

function ContactSlot({ link }: { link: ContactLink }) {
  const inner = (
    <>
      <span className="contact__glyph" aria-hidden="true">
        {GLYPHS[link.id]}
      </span>
      <span className="contact__label">{link.label}</span>
      <span className="contact__handle">{link.url ? (link.handle ?? 'Open →') : 'Coming soon'}</span>
    </>
  );
  if (!link.url) {
    return (
      <div className={`contact__slot contact__slot--${link.id} contact__slot--soon`} aria-label={`${link.label}: link coming soon`}>
        {inner}
      </div>
    );
  }
  const external = !link.url.startsWith('mailto:');
  return (
    <a
      className={`contact__slot contact__slot--${link.id}`}
      href={link.url}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      data-cursor="Open"
      onClick={() => track(`contact-${link.id}`, `Clicked ${link.label}`)}
    >
      {inner}
    </a>
  );
}

export function Contact() {
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title" data-byte="Come say hi on Discord!">
      <div className="container contact__inner">
        <div className="contact__byte" data-reveal="scale" aria-hidden="true">
          <Mascot mood="happy" />
        </div>
        <p className="sticker sticker--amber" data-reveal="fade">
          Say hi
        </p>
        <h2 id="contact-title" className="contact__title" data-reveal>
          <BouncyText text="Want to see what I'm building?" />
        </h2>
        <p className="contact__text" data-reveal>
          Games, experiments, prototypes, and whatever comes next.
        </p>
        <ul className="contact__links">
          {CONTACT_LINKS.map((link, i) => (
            <li key={link.id} data-reveal style={{ '--delay': `${i * 70}ms` } as CSSProperties}>
              <ContactSlot link={link} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import type { ReactNode } from 'react';
import type { ImageAsset } from '../../lib/images';

interface Props {
  /** What belongs in this slot, e.g. "Castle". */
  label: string;
  /** Real artwork. When present it replaces the placeholder illustration. */
  image?: ImageAsset;
  alt?: string;
  /** CSS aspect-ratio, e.g. "16 / 9". */
  ratio?: string;
  /** Placeholder illustration shown until real art exists. */
  children?: ReactNode;
  tag?: string;
  sizes?: string;
  className?: string;
  eager?: boolean;
}

/**
 * A frame for artwork. Until real art is added it shows a clearly labelled
 * placeholder, so nothing is ever mistaken for actual game footage.
 */
export function ArtSlot({ label, image, alt, ratio = '16 / 9', children, tag = 'Placeholder art', sizes = '(min-width: 1024px) 50vw, 100vw', className, eager }: Props) {
  return (
    <figure className={`art-slot${className ? ` ${className}` : ''}`} style={{ aspectRatio: ratio }} data-has-image={image ? 'true' : 'false'}>
      {image ? (
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes={sizes}
          width={image.width}
          height={image.height}
          alt={alt ?? image.label}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      ) : (
        <div className="art-slot__art" role="img" aria-label={`${tag}: ${label}`}>
          {children}
        </div>
      )}
      <span className="art-slot__corners" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      {image ? null : (
        <figcaption className="art-slot__tag" aria-hidden="true">
          <span className="art-slot__dot" />
          {tag} · {label}
        </figcaption>
      )}
    </figure>
  );
}

import Image from 'next/image';
import styles from './MediaFrame.module.css';

interface MediaFrameProps {
  src?: string;
  alt?: string;
  ratio: string;
  sizes: string;
  label: string;
  motion?: boolean;
  className?: string;
}

// Fixed-ratio photo slot. Without a photo it shows a quiet labelled placeholder, never another dish's image.
export default function MediaFrame({ src, alt, ratio, sizes, label, motion = false, className = '' }: MediaFrameProps) {
  return (
    <div
      className={`frame ${styles.frame} ${className}`}
      style={{ aspectRatio: ratio }}
      data-motion={motion && src ? 'mask' : undefined}
    >
      {src ? (
        <Image src={src} alt={alt ?? ''} fill sizes={sizes} />
      ) : (
        <span className={styles.placeholder} aria-hidden="true">
          Photo coming soon
          <span>{label}</span>
        </span>
      )}
    </div>
  );
}

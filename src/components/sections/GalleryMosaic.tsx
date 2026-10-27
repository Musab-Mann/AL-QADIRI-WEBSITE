import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/ssr';
import MediaFrame from '@/components/ui/MediaFrame';
import { gallery } from '@/data/gallery';
import { copy } from '@/content/site';
import styles from './GalleryMosaic.module.css';

export default function GalleryMosaic({ limit, heading = true }: { limit?: number; heading?: boolean }) {
  const shots = limit ? gallery.slice(0, limit) : gallery;

  return (
    <section className="section" aria-labelledby={heading ? 'gallery-title' : undefined} aria-label={heading ? undefined : 'Gallery'}>
      <div className="wrap">
        {heading && (
          <div className={styles.head}>
            <h2 id="gallery-title">{copy.gallery.title}</h2>
            {limit && (
              <Link href="/gallery" className="text-link">
                View gallery <ArrowRight aria-hidden="true" />
              </Link>
            )}
          </div>
        )}
        <ul className={styles.grid} data-count={shots.length}>
          {shots.map((shot) => (
            <li key={shot.id} className={styles.cell}>
              <MediaFrame
                src={shot.src}
                alt={shot.alt}
                ratio={shot.ratio}
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                label={shot.subject}
                motion
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

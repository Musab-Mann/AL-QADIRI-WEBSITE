import Link from 'next/link';
import { ArrowRight, ForkKnife, MapPin, Moped } from '@phosphor-icons/react/ssr';
import { brand, contact, copy } from '@/content/site';
import styles from './StoryTeaser.module.css';

// Type only: the dish photos all live in the swipeable menu above.
export default function StoryTeaser() {
  return (
    <section className="section" aria-labelledby="story-title" data-scroll3d>
      <div className={`wrap ${styles.grid}`}>
        <h2 id="story-title" className={styles.title}>
          {copy.story.title}
        </h2>
        <div className={styles.text}>
          <ul className={styles.facts}>
            <li>
              <ForkKnife aria-hidden="true" /> {brand.cuisine} cuisine
            </li>
            <li>
              <MapPin aria-hidden="true" /> {contact.addressShort}
            </li>
            <li>
              <Moped aria-hidden="true" /> {contact.delivery}
            </li>
          </ul>
          <Link href="/about" className="text-link">
            Our story <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

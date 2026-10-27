import type { Metadata } from 'next';
import Link from 'next/link';
import { ForkKnife, MapPin, Moped, WhatsappLogo } from '@phosphor-icons/react/ssr';
import MediaFrame from '@/components/ui/MediaFrame';
import { getPublicItem } from '@/server/public-menu.ts';
import { brand, contact, copy, isPlaceholder } from '@/content/site';
import { waHref } from '@/lib/links';
import styles from '../page-intro.module.css';

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Al Qadri Restaurant serves Pakistani cuisine near Big Bazaar in Sajja, Sharjah, with free home delivery.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  const shot = getPublicItem('sada-paratha');
  const storyReady = !isPlaceholder(copy.story.body);

  return (
    <>
      <section className={styles.intro} aria-labelledby="about-title">
        <div className="wrap">
          <h1 id="about-title" className={styles.title}>
            Our story
          </h1>
          <p className={styles.tagline}>{brand.tagline}</p>
        </div>
      </section>

      <section className="section" aria-labelledby="about-heading">
        <div className={`wrap ${styles.split}`}>
          <MediaFrame src={shot?.image} alt={shot?.imageAlt} ratio="4 / 5" sizes="(min-width: 1024px) 45vw, 100vw" label="Sada Paratha" motion />
          <div className={styles.body}>
            <h2 id="about-heading">{copy.story.title}</h2>
            {storyReady ? <p className="lede">{copy.story.body}</p> : <p className={styles.pending}>The full story of Al Qadri is coming soon.</p>}
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
            <div className={styles.actions}>
              <a className="btn btn-primary" href={waHref()} target="_blank" rel="noopener noreferrer">
                <WhatsappLogo aria-hidden="true" weight="fill" /> Order now
              </a>
              <Link className="btn btn-ghost" href="/menu">
                View menu
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

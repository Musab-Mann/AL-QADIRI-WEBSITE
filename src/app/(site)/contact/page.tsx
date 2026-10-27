import type { Metadata } from 'next';
import VisitUs from '@/components/sections/VisitUs';
import JsonLd from '@/components/ui/JsonLd';
import { contact } from '@/content/site';
import { restaurantJsonLd } from '@/lib/schema';
import styles from '../page-intro.module.css';

export const metadata: Metadata = {
  title: 'Contact and Directions',
  description: `Find Al Qadri Restaurant near Big Bazaar, Sajja, Sharjah. WhatsApp or call ${contact.phones.map((p) => p.display).join(' or ')}, email ${contact.email}.`,
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={restaurantJsonLd()} />
      <section className={styles.intro} aria-labelledby="contact-title">
        <div className="wrap">
          <h1 id="contact-title" className={styles.title}>
            Contact
          </h1>
          <p className={styles.tagline}>WhatsApp, call, email or visit us near Big Bazaar.</p>
        </div>
      </section>
      <VisitUs />
    </>
  );
}

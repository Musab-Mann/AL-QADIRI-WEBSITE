import type { Metadata } from 'next';
import GalleryMosaic from '@/components/sections/GalleryMosaic';
import styles from '../page-intro.module.css';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Food from the Al Qadri Restaurant kitchen in Sajja, Sharjah: karahi, biryani, grill, chai and sweets.',
  alternates: { canonical: '/gallery' },
};

export default function GalleryPage() {
  return (
    <>
      <section className={styles.intro} aria-labelledby="gallery-page-title">
        <div className="wrap">
          <h1 id="gallery-page-title" className={styles.title}>
            Gallery
          </h1>
        </div>
      </section>
      <GalleryMosaic heading={false} />
    </>
  );
}

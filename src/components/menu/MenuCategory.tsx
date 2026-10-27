import Image from 'next/image';
import Link from 'next/link';
import AddToOrder from '@/components/order/AddToOrder';
import MediaFrame from '@/components/ui/MediaFrame';
import Price from '@/components/ui/Price';
import { getPublicItemsByCategory, getPublicLead, isItemAvailable } from '@/server/public-menu.ts';
import type { Category, MenuItem } from '@/data/menu';
import styles from './MenuCategory.module.css';

export default function MenuCategory({ category }: { category: Category }) {
  const items = getPublicItemsByCategory(category.id);
  const lead = getPublicLead(category.id) ?? items[0];
  if (!lead) return null;
  const rest = items.filter((item) => item.slug !== lead.slug);
  // Searching works in all three scripts.
  const searchKey = (item: MenuItem) =>
    `${item.name} ${item.nameUr} ${item.nameAr} ${category.label} ${category.labelUr} ${category.labelAr}`.toLowerCase();

  return (
    <section id={category.id} data-category className={styles.section} aria-labelledby={`${category.id}-title`}>
      <header className={styles.head}>
        <div className={styles.headNames}>
          <h2 id={`${category.id}-title`}>{category.label}</h2>
          <p className={styles.headAlt}>
            <span lang="ur" dir="rtl">
              {category.labelUr}
            </span>
            <span className={styles.rule} aria-hidden="true" />
            <span lang="ar" dir="rtl">
              {category.labelAr}
            </span>
          </p>
        </div>
        <span className={styles.count}>
          {items.length} {items.length === 1 ? 'dish' : 'dishes'}
        </span>
      </header>

      <article className={styles.feature} data-search={searchKey(lead)}>
        <Link href={`/menu/${lead.slug}`} className={styles.featureMedia}>
          <MediaFrame
            src={lead.image}
            alt={lead.imageAlt}
            ratio="3 / 2"
            sizes="(min-width: 1024px) 60vw, 100vw"
            label={lead.name}
          />
        </Link>
        <div className={styles.featureRow}>
          <h3 className={styles.featureName}>
            <Link href={`/menu/${lead.slug}`}>{lead.name}</Link>
            <span className={styles.altNames}>
              <span lang="ur" dir="rtl">
                {lead.nameUr}
              </span>
              <span className={styles.rule} aria-hidden="true" />
              <span lang="ar" dir="rtl">
                {lead.nameAr}
              </span>
            </span>
          </h3>
          <Price prices={lead.prices} size="feature" align="end" />
          {isItemAvailable(lead.slug) ? (
            <AddToOrder item={lead} variant="compact" available />
          ) : (
            <span className={styles.unavailable}>Currently Unavailable</span>
          )}
        </div>
      </article>

      <ul className={styles.rows}>
        {rest.map((item) => (
          <li key={item.slug} className={styles.row} data-search={searchKey(item)}>
            <div className={styles.main}>
              {item.image && (
                <span className={styles.thumb} aria-hidden="true">
                  <Image src={item.image} alt="" fill sizes="64px" />
                </span>
              )}
              <Link href={`/menu/${item.slug}`} className={styles.name}>
                <span>{item.name}</span>
                <span className={styles.altNames}>
                  <span lang="ur" dir="rtl">
                    {item.nameUr}
                  </span>
                  <span className={styles.rule} aria-hidden="true" />
                  <span lang="ar" dir="rtl">
                    {item.nameAr}
                  </span>
                </span>
              </Link>
              <span className={styles.leader} aria-hidden="true" />
              <Price prices={item.prices} align="end" />
            </div>
            {isItemAvailable(item.slug) ? (
              <AddToOrder item={item} variant="compact" available />
            ) : (
              <span className={styles.unavailable}>Currently Unavailable</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

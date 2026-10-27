import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from '@phosphor-icons/react/ssr';
import { getPublicCategories, getPublicItemsByCategory, getPublicLead } from '@/server/public-menu.ts';
import { copy } from '@/content/site';
import styles from './MenuIndex.module.css';

export default function MenuIndex() {
  return (
    <section className={`section ${styles.section}`} aria-labelledby="menu-index-title">
      <div className="wrap">
        <h2 id="menu-index-title" className={styles.title}>
          {copy.menuIndex.titleStart} {copy.menuIndex.titleMiddle} {copy.menuIndex.titleEnd}
        </h2>

        <ul className={styles.list}>
          {getPublicCategories().map((category) => {
            const lead = getPublicLead(category.id);
            const count = getPublicItemsByCategory(category.id).length;
            return (
              <li key={category.id} className={styles.row}>
                <Link href={`/menu#${category.id}`} className={styles.link}>
                  <span className={styles.name}>{category.label}</span>
                  <span lang="ur" dir="rtl" className={styles.urdu}>
                    {category.labelUr}
                  </span>
                  <span className={styles.count}>
                    {count} {count === 1 ? 'dish' : 'dishes'}
                  </span>
                  <ArrowUpRight className={styles.arrow} aria-hidden="true" />
                </Link>
                {lead?.image && (
                  <span className={styles.preview} aria-hidden="true">
                    <Image src={lead.image} alt="" fill sizes="360px" />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

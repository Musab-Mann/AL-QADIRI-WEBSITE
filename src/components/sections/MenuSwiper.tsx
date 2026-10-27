import Link from 'next/link';
import { ArrowUpRight } from '@phosphor-icons/react/ssr';
import type { MenuItem } from '@/data/menu';
import {
  getPublicCategories,
  getPublicCategory,
  getPublicFeatured,
  getPublicItemsByCategory,
  isItemAvailable,
} from '@/server/public-menu.ts';
import { copy } from '@/content/site';
import MenuSwiperClient, { type SwiperDish, type SwiperTab } from './MenuSwiperClient';
import styles from './MenuSwiper.module.css';

function toDish(item: MenuItem): SwiperDish {
  return {
    slug: item.slug,
    name: item.name,
    nameUr: item.nameUr,
    category: item.category,
    categoryLabel: getPublicCategory(item.category)?.label ?? '',
    prices: item.prices,
    image: item.image,
    imageAlt: item.imageAlt,
    available: isItemAvailable(item.slug),
  };
}

// The whole menu on the home page as one swipeable strip: one tab per category, every dish with its own photo.
export default function MenuSwiper() {
  const tabs: SwiperTab[] = [
    { id: 'signature', label: 'Signature', labelUr: 'خاص پکوان', items: getPublicFeatured().map(toDish) },
    ...getPublicCategories().map((category) => ({
      id: category.id,
      label: category.label,
      labelUr: category.labelUr,
      items: getPublicItemsByCategory(category.id).map(toDish),
    })),
  ].filter((tab) => tab.items.length > 0);

  return (
    <section className={`section ${styles.section}`} aria-labelledby="swiper-title" data-scroll3d>
      <div className="wrap">
        <div className={styles.head}>
          <div>
            <h2 id="swiper-title" className={styles.title} data-motion="lines">
              <span data-line>
                <span>{copy.swiper.title}</span>
              </span>
            </h2>
            <p className={styles.hint}>{copy.swiper.hint}</p>
          </div>
          <Link href="/menu" className="text-link">
            Full menu <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </div>
      <MenuSwiperClient tabs={tabs} />
    </section>
  );
}

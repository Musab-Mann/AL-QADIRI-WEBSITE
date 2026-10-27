import Link from 'next/link';
import { ArrowUpRight } from '@phosphor-icons/react/ssr';
import MediaFrame from '@/components/ui/MediaFrame';
import Price from '@/components/ui/Price';
import { getPublicCategory, getPublicFeatured } from '@/server/public-menu.ts';
import { copy } from '@/content/site';
import styles from './SignatureDishes.module.css';

const layout = [
  { cell: styles.b, ratio: '16 / 10', sizes: '(min-width: 1024px) 50vw, 80vw' },
  { cell: styles.a, ratio: '4 / 5', sizes: '(min-width: 1024px) 50vw, 80vw' },
  { cell: styles.c, ratio: '4 / 5', sizes: '(min-width: 1024px) 25vw, 80vw' },
  { cell: styles.d, ratio: '4 / 5', sizes: '(min-width: 1024px) 25vw, 80vw' },
  { cell: styles.e, ratio: '4 / 3', sizes: '(min-width: 1024px) 42vw, 80vw' },
  { cell: styles.f, ratio: '16 / 10', sizes: '(min-width: 1024px) 58vw, 80vw' },
];

export default function SignatureDishes() {
  const dishes = getPublicFeatured();

  return (
    <section className="section" aria-labelledby="dishes-title">
      <div className="wrap">
        <div className={styles.head}>
          <h2 id="dishes-title" data-motion="lines">
            <span data-line>
              <span>{copy.dishes.title}</span>
            </span>
          </h2>
          <Link href="/menu" className="text-link">
            Full menu <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>

        <ul className={styles.grid}>
          {dishes.map((dish, index) => {
            const spot = layout[index];
            return (
              <li key={dish.slug} className={`${styles.tile} ${spot.cell}`} data-tilt-card>
                <Link href={`/menu/${dish.slug}`} className={styles.link}>
                  <MediaFrame
                    src={dish.image}
                    alt={dish.imageAlt}
                    ratio={spot.ratio}
                    sizes={spot.sizes}
                    label={dish.name}
                    motion
                    className={styles.media}
                  />
                  <span className={styles.caption}>
                    <span className={styles.meta}>
                      <h3 className={styles.name}>{dish.name}</h3>
                      <span className="muted">{getPublicCategory(dish.category)?.label}</span>
                    </span>
                    <Price prices={dish.prices} size="feature" align="end" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

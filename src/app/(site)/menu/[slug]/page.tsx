import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Phone, WhatsappLogo } from '@phosphor-icons/react/ssr';
import AddToOrder from '@/components/order/AddToOrder';
import MediaFrame from '@/components/ui/MediaFrame';
import Price from '@/components/ui/Price';
import { getPublicCategory, getPublicItem, getPublicItemsByCategory, getPublicMenuItems, isItemAvailable } from '@/server/public-menu.ts';
import { contact, messages } from '@/content/site';
import { telHref, waHref } from '@/lib/links';
import { formatPrice, orderLine } from '@/lib/price';
import styles from './dish.module.css';

// Admin-added dishes are not known at build time, so unlike the original static-only list this
// route now renders new slugs on demand instead of 404ing them, and re-checks availability and
// admin edits on every request rather than caching a stale build-time snapshot.
export const dynamicParams = true;
export const revalidate = 0;

export function generateStaticParams() {
  return getPublicMenuItems().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps<'/menu/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const item = getPublicItem(slug);
  if (!item) return {};
  const category = getPublicCategory(item.category);
  return {
    title: `${item.name}, ${formatPrice(item.prices)}`,
    description: `${item.name}${category ? ` (${category.label})` : ''} at Al Qadri Restaurant, near Big Bazaar, Sajja, Sharjah: ${formatPrice(item.prices)}. Order on WhatsApp ${contact.whatsappPhone.display}.`,
    alternates: { canonical: `/menu/${item.slug}` },
  };
}

export default async function DishPage({ params }: PageProps<'/menu/[slug]'>) {
  const { slug } = await params;
  const item = getPublicItem(slug);
  if (!item) notFound();
  const category = getPublicCategory(item.category);
  const related = getPublicItemsByCategory(item.category)
    .filter((other) => other.slug !== item.slug)
    .slice(0, 4);
  const available = isItemAvailable(item.slug);

  return (
    <>
      <article className={`wrap ${styles.dish}`}>
        <div className={styles.media}>
          <MediaFrame src={item.image} alt={item.imageAlt} ratio="4 / 5" sizes="(min-width: 1024px) 50vw, 100vw" label={item.name} />
        </div>

        <div className={styles.details}>
          <nav aria-label="Breadcrumb" className={styles.crumbs}>
            <Link href="/menu">Menu</Link>
            {category && (
              <>
                <span aria-hidden="true">/</span>
                <Link href={`/menu#${category.id}`}>{category.label}</Link>
              </>
            )}
          </nav>

          <h1 className={styles.name}>{item.name}</h1>
          {(item.nameUr || item.nameAr) && (
            <p className={styles.altNames}>
              <span lang="ur" dir="rtl">
                {item.nameUr}
              </span>
              <span className={styles.rule} aria-hidden="true" />
              <span lang="ar" dir="rtl">
                {item.nameAr}
              </span>
            </p>
          )}
          <Price prices={item.prices} size="hero" />
          {item.description && <p className="lede">{item.description}</p>}

          <div className={styles.order}>
            {available ? (
              <AddToOrder item={item} available />
            ) : (
              <p className={styles.unavailable}>Currently Unavailable</p>
            )}
            <a
              className="btn btn-ghost btn-block"
              href={waHref(messages.dish(orderLine(item)))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsappLogo aria-hidden="true" /> Order this now on WhatsApp
            </a>
          </div>

          <div className={styles.meta}>
            <p>{contact.delivery}</p>
            {contact.phones.map((phone) => (
              <a key={phone.e164} className="text-link" href={telHref(phone)}>
                <Phone aria-hidden="true" /> Call {phone.display}
              </a>
            ))}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className={`wrap ${styles.related}`} aria-labelledby="related-title">
          <h2 id="related-title" className={styles.relatedTitle}>
            More from {category?.label ?? 'the menu'}
          </h2>
          <ul className={styles.relatedList}>
            {related.map((other) => (
              <li key={other.slug}>
                <Link href={`/menu/${other.slug}`} className={styles.relatedLink}>
                  {other.image && (
                    <span className={styles.relatedThumb} aria-hidden="true">
                      <Image src={other.image} alt="" fill sizes="72px" />
                    </span>
                  )}
                  <span className={styles.relatedName}>
                    {other.name}
                    <span lang="ur" dir="rtl" className={styles.relatedUrdu}>
                      {other.nameUr}
                    </span>
                  </span>
                  <Price prices={other.prices} align="end" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

import type { Metadata } from 'next';
import { WhatsappLogo } from '@phosphor-icons/react/ssr';
import CategoryNav from '@/components/menu/CategoryNav';
import MenuCategory from '@/components/menu/MenuCategory';
import MenuSearch from '@/components/menu/MenuSearch';
import JsonLd from '@/components/ui/JsonLd';
import { menuJsonLd } from '@/lib/schema';
import { getPublicCategories, getPublicItemsByCategory, getPublicMenuItems } from '@/server/public-menu.ts';
import { copy, contact } from '@/content/site';
import { waHref } from '@/lib/links';
import styles from './menu.module.css';

export const metadata: Metadata = {
  title: 'Menu and Prices',
  description: `The full Al Qadri Restaurant menu with prices: breakfast, BBQ and grill, curry, rice, karahi and handi specials, and refreshments. Order on WhatsApp ${contact.whatsappPhone.display}.`,
  alternates: { canonical: '/menu' },
};

// Admin can add or hide dishes at any time, so this page always reflects the live catalog.
export const revalidate = 0;

export default function MenuPage() {
  const categories = getPublicCategories();
  const menuItems = getPublicMenuItems();
  const navItems = categories.map((c) => ({ id: c.id, label: c.label, count: getPublicItemsByCategory(c.id).length }));

  return (
    <>
      <JsonLd data={menuJsonLd()} />
      <section className={styles.intro} aria-labelledby="menu-title">
        <div className={`wrap ${styles.introGrid}`}>
          <div>
            <h1 id="menu-title" className={styles.title}>
              Menu
            </h1>
            <p className={styles.legend}>
              {menuItems.length} dishes in {categories.length} categories. {copy.menu.legend}
            </p>
          </div>
          <div className={styles.introActions}>
            <MenuSearch />
            <a className="btn btn-primary" href={waHref()} target="_blank" rel="noopener noreferrer">
              <WhatsappLogo aria-hidden="true" weight="fill" /> Order now
            </a>
          </div>
        </div>
      </section>

      <div className={`wrap ${styles.body}`}>
        <CategoryNav items={navItems} />
        <div className={styles.content}>
          {categories.map((category) => (
            <MenuCategory key={category.id} category={category} />
          ))}
          <p className={styles.empty} data-search-empty hidden>
            No dish matches that name. Ask us on WhatsApp{' '}
            <a className="text-link" href={waHref()} target="_blank" rel="noopener noreferrer">
              {contact.whatsappPhone.display}
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

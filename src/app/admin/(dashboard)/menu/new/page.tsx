import Link from 'next/link';
import { getEffectiveCategories } from '@/server/menu-overlay.ts';
import MenuItemForm from '@/components/admin/MenuItemForm';
import styles from '../../../admin.module.css';

export const revalidate = 0;

export default function AdminNewMenuItemPage() {
  const categories = getEffectiveCategories();

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.pageSubtitle}>
            <Link className="text-link" href="/admin/menu">
              ← Menu
            </Link>
          </p>
          <h1 className={styles.pageTitle}>Add Menu Item</h1>
        </div>
      </div>
      <div className={styles.card}>
        <MenuItemForm categories={categories.map((c) => ({ id: c.id, label: c.label }))} />
      </div>
    </>
  );
}

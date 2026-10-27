import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEffectiveCategories, getEffectiveItemById } from '@/server/menu-overlay.ts';
import MenuItemForm from '@/components/admin/MenuItemForm';
import styles from '../../../../admin.module.css';

export const revalidate = 0;

export default async function AdminEditMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const itemId = Number(id);
  const item = Number.isInteger(itemId) ? getEffectiveItemById(itemId) : undefined;
  if (!item) notFound();
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
          <h1 className={styles.pageTitle}>Edit {item.name}</h1>
        </div>
      </div>
      <div className={styles.card}>
        <MenuItemForm
          categories={categories.map((c) => ({ id: c.id, label: c.label }))}
          initial={{
            id: item.id,
            slug: item.slug,
            name: item.name,
            description: item.description ?? '',
            category: item.category,
            prices: [...item.prices],
            image: item.image,
            available: item.available,
          }}
        />
      </div>
    </>
  );
}

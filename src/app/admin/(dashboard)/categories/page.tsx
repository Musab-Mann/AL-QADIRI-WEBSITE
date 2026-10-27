import { getEffectiveCategories, getEffectiveMenuItems } from '@/server/menu-overlay.ts';
import AddCategoryForm from '@/components/admin/AddCategoryForm';
import ConfirmArchiveButton from '@/components/admin/ConfirmArchiveButton';
import styles from '../../admin.module.css';

export const revalidate = 0;

export default function AdminCategoriesPage() {
  const categories = getEffectiveCategories();
  const items = getEffectiveMenuItems();

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Categories</h1>
          <p className={styles.pageSubtitle}>Organize the menu into sections such as Karahi, Fish, BBQ or Drinks.</p>
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitle}>Add a category</p>
        <AddCategoryForm />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Items</th>
              <th>Source</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const count = items.filter((item) => item.category === category.id).length;
              return (
                <tr key={category.id}>
                  <td>{category.label}</td>
                  <td>{count}</td>
                  <td className="muted">{category.source === 'base' ? 'Original menu' : 'Admin-added'}</td>
                  <td>
                    {count === 0 ? (
                      <ConfirmArchiveButton
                        url={`/api/admin/categories/${category.id}`}
                        label="Remove"
                        confirmLabel="Remove this empty category?"
                      />
                    ) : (
                      <span className="muted">Move or archive its items first</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

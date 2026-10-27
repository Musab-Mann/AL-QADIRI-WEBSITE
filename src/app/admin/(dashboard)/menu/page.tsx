import Link from 'next/link';
import { getEffectiveCategories, getEffectiveMenuItems } from '@/server/menu-overlay.ts';
import { formatAmount } from '@/lib/admin-format.ts';
import AvailabilityToggle from '@/components/admin/AvailabilityToggle';
import ConfirmArchiveButton from '@/components/admin/ConfirmArchiveButton';
import styles from '../../admin.module.css';

export const revalidate = 0;

export default function AdminMenuPage() {
  const categories = getEffectiveCategories();
  const items = getEffectiveMenuItems();

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Menu</h1>
          <p className={styles.pageSubtitle}>{items.length} item{items.length === 1 ? '' : 's'} across {categories.length} categories.</p>
        </div>
        <Link href="/admin/menu/new" className="btn btn-primary">
          Add Menu Item
        </Link>
      </div>

      {categories.map((category) => {
        const categoryItems = items.filter((item) => item.category === category.id);
        if (categoryItems.length === 0) return null;
        return (
          <div key={category.id} className={styles.card}>
            <p className={styles.cardTitle}>
              {category.label}
              {category.source === 'admin' && <span className="muted"> (added by admin)</span>}
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Availability</th>
                    <th>Source</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {categoryItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.prices.map((p) => formatAmount(Number(p))).join(' / ')}</td>
                      <td>
                        <AvailabilityToggle id={item.id} available={item.available} />
                      </td>
                      <td>
                        <span className="muted">{item.source === 'base' ? 'Original menu' : 'Admin-added'}</span>
                      </td>
                      <td style={{ display: 'flex', gap: '1rem' }}>
                        <Link className="text-link" href={`/admin/menu/${item.id}/edit`}>
                          Edit
                        </Link>
                        <ConfirmArchiveButton
                          url={`/api/admin/menu-items/${item.id}`}
                          label="Archive"
                          confirmLabel="Remove from the live menu?"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      <p className="muted">
        Archiving an item removes it from the live menu, but past orders keep showing the name and
        price the customer actually paid.
      </p>
    </>
  );
}

import { getDashboardStats } from '@/server/orders.ts';
import { formatAmount } from '@/lib/admin-format.ts';
import styles from '../admin.module.css';

export const revalidate = 0;

export default function AdminDashboardPage() {
  const stats = getDashboardStats();

  const cards = [
    { label: 'Total Orders', value: stats.totalOrders },
    { label: "Today's Orders", value: stats.todaysOrders },
    { label: 'Pending Orders', value: stats.pendingOrders },
    { label: 'Completed Orders', value: stats.completedOrders },
    { label: 'Cancelled Orders', value: stats.cancelledOrders },
    { label: 'Total Sales', value: formatAmount(stats.totalSales) },
    { label: "Today's Sales", value: formatAmount(stats.todaysSales) },
  ];

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>A live snapshot of orders and sales, calculated from stored orders.</p>
        </div>
      </div>

      <div className={styles.statGrid}>
        {cards.map((card) => (
          <div key={card.label} className={styles.statCard}>
            <span className={styles.statLabel}>{card.label}</span>
            <span className={styles.statValue}>{card.value}</span>
          </div>
        ))}
      </div>

      <div className={styles.card}>
        <p className="muted">
          Cancelled orders are excluded from both sales totals. Manage individual orders from the
          Orders section.
        </p>
      </div>
    </>
  );
}

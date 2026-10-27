import Link from 'next/link';
import { listOrders, STATUS_LABELS, type OrderStatus } from '@/server/orders.ts';
import { formatAmount, formatDateTime } from '@/lib/admin-format.ts';
import styles from '../../admin.module.css';

export const revalidate = 0;

const ALL_STATUSES = Object.keys(STATUS_LABELS) as OrderStatus[];
const PAGE_SIZE = 25;

interface SearchParams {
  status?: string;
  type?: string;
  q?: string;
  from?: string;
  to?: string;
  page?: string;
}

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const { orders, total } = listOrders({
    status: params.status || undefined,
    fulfillmentType: params.type || undefined,
    search: params.q || undefined,
    dateFrom: params.from ? new Date(params.from).toISOString() : undefined,
    dateTo: params.to ? new Date(new Date(params.to).getTime() + 24 * 60 * 60 * 1000).toISOString() : undefined,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Orders</h1>
          <p className={styles.pageSubtitle}>{total} order{total === 1 ? '' : 's'} in total.</p>
        </div>
      </div>

      <form className={styles.filters} method="get">
        <input className={styles.input} style={{ maxWidth: 220 }} type="search" name="q" placeholder="Order ID, name or phone" defaultValue={params.q} />
        <select className={styles.select} style={{ maxWidth: 200 }} name="status" defaultValue={params.status ?? ''}>
          <option value="">All statuses</option>
          {ALL_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
        <select className={styles.select} style={{ maxWidth: 200 }} name="type" defaultValue={params.type ?? ''}>
          <option value="">Pickup + Delivery</option>
          <option value="pickup">Pickup</option>
          <option value="delivery">Free Home Delivery</option>
        </select>
        <input className={styles.input} style={{ maxWidth: 170 }} type="date" name="from" defaultValue={params.from} aria-label="From date" />
        <input className={styles.input} style={{ maxWidth: 170 }} type="date" name="to" defaultValue={params.to} aria-label="To date" />
        <button type="submit" className="btn btn-ghost">
          Filter
        </button>
        {(params.q || params.status || params.type || params.from || params.to) && (
          <Link href="/admin/orders" className="text-link">
            Clear
          </Link>
        )}
      </form>

      {orders.length === 0 ? (
        <div className={styles.emptyState}>No orders match these filters.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Total</th>
                <th>Status</th>
                <th>Placed</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link className="text-link" href={`/admin/orders/${order.id}`}>
                      {order.order_number}
                    </Link>
                  </td>
                  <td>{order.customer_name}</td>
                  <td>{order.customer_phone}</td>
                  <td>{order.fulfillment_type === 'pickup' ? 'Pickup' : 'Free Home Delivery'}</td>
                  <td>{formatAmount(order.total)}</td>
                  <td>
                    <span className={`${styles.badge} ${statusBadgeClass(order.status, styles)}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td>{formatDateTime(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pageCount > 1 && (
        <nav className={styles.pagination} aria-label="Pagination">
          {page > 1 && (
            <Link className="text-link" href={pageHref(params, page - 1)}>
              ← Previous
            </Link>
          )}
          <span>
            Page {page} of {pageCount}
          </span>
          {page < pageCount && (
            <Link className="text-link" href={pageHref(params, page + 1)}>
              Next →
            </Link>
          )}
        </nav>
      )}
    </>
  );
}

function pageHref(params: SearchParams, page: number): string {
  const usp = new URLSearchParams();
  if (params.q) usp.set('q', params.q);
  if (params.status) usp.set('status', params.status);
  if (params.type) usp.set('type', params.type);
  if (params.from) usp.set('from', params.from);
  if (params.to) usp.set('to', params.to);
  usp.set('page', String(page));
  return `/admin/orders?${usp.toString()}`;
}

function statusBadgeClass(status: OrderStatus, styles: Record<string, string>): string {
  if (status === 'completed') return styles.badgeGood;
  if (status === 'cancelled') return styles.badgeBad;
  if (status === 'new') return styles.badgeAccent;
  return styles.badgeMuted;
}

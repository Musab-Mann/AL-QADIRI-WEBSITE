import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderDetail, STATUS_LABELS } from '@/server/orders.ts';
import { formatAmount, formatDateTime } from '@/lib/admin-format.ts';
import StatusUpdateForm from '@/components/admin/StatusUpdateForm';
import styles from '../../../admin.module.css';

export const revalidate = 0;

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = Number(id);
  const detail = Number.isInteger(orderId) ? getOrderDetail(orderId) : null;
  if (!detail) notFound();
  const { order, items } = detail;

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.pageSubtitle}>
            <Link className="text-link" href="/admin/orders">
              ← All orders
            </Link>
          </p>
          <h1 className={styles.pageTitle}>Order #{order.order_number}</h1>
          <p className={styles.pageSubtitle}>Placed {formatDateTime(order.created_at)}</p>
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitle}>Customer</p>
        <p>{order.customer_name}</p>
        <p className="muted">{order.customer_phone}</p>
        <p className="muted">{order.customer_email}</p>
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitle}>Order Type</p>
        <p>{order.fulfillment_type === 'pickup' ? 'Pickup' : 'Free Home Delivery'}</p>
        {order.fulfillment_type === 'delivery' && order.delivery_address && (
          <>
            <p className={styles.cardTitle} style={{ marginTop: '1rem' }}>
              Delivery Address
            </p>
            <p>{order.delivery_address}</p>
          </>
        )}
        <p className={styles.cardTitle} style={{ marginTop: '1rem' }}>
          Payment
        </p>
        <p>{order.payment_method === 'cash' ? 'Cash' : order.payment_method}</p>
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitle}>Items</p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit price</th>
                <th>Line total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.name}
                    {item.portion_label && <span className="muted"> ({item.portion_label})</span>}
                  </td>
                  <td>{item.quantity}</td>
                  <td>{formatAmount(item.unit_price)}</td>
                  <td>{formatAmount(item.line_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2rem', marginTop: '1rem' }}>
          <span className="muted">Subtotal</span>
          <strong>{formatAmount(order.subtotal)}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2rem' }}>
          <span className="muted">Total</span>
          <strong>{formatAmount(order.total)}</strong>
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitle}>Status</p>
        <p className="muted" style={{ marginBottom: '1rem' }}>
          Currently <strong>{STATUS_LABELS[order.status]}</strong>. Notification: {order.notification_status}.
        </p>
        <StatusUpdateForm orderId={order.id} fulfillmentType={order.fulfillment_type} currentStatus={order.status} />
      </div>
    </>
  );
}

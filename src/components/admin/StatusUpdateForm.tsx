'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { STATUS_LABELS, statusesFor, type FulfillmentType, type OrderStatus } from '@/lib/order-status.ts';
import styles from '../../app/admin/admin.module.css';

export default function StatusUpdateForm({
  orderId,
  fulfillmentType,
  currentStatus,
}: {
  orderId: number;
  fulfillmentType: FulfillmentType;
  currentStatus: OrderStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const options = statusesFor(fulfillmentType);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(data.error || 'Could not update the order status.');
        return;
      }
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.formRow}>
      <label className={styles.label} htmlFor="order-status">
        Order status
      </label>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <select
          id="order-status"
          className={styles.select}
          style={{ maxWidth: 260 }}
          value={status}
          onChange={(event) => setStatus(event.target.value as OrderStatus)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {STATUS_LABELS[option]}
            </option>
          ))}
        </select>
        <button type="button" className="btn btn-primary" onClick={save} disabled={saving || status === currentStatus}>
          {saving ? 'Saving…' : 'Update status'}
        </button>
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

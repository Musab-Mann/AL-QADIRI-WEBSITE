'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '../../app/admin/admin.module.css';

export default function AvailabilityToggle({ id, available }: { id: number; available: boolean }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function toggle() {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/menu-items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !available }),
      });
      if (response.ok) router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={saving}
      className={`${styles.badge} ${available ? styles.badgeGood : styles.badgeMuted}`}
      style={{ cursor: 'pointer', background: 'transparent', font: 'inherit' }}
    >
      {available ? 'Available' : 'Unavailable'}
    </button>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '../../app/admin/admin.module.css';

export default function SettingsForm({ etaMinutes }: { etaMinutes: string }) {
  const router = useRouter();
  const [value, setValue] = useState(etaMinutes);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function submit() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ etaMinutes: value.trim() }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(data.error || 'Could not save these settings.');
        return;
      }
      setSuccess(true);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <div className={styles.formRow}>
        <label className={styles.label} htmlFor="eta">
          Estimated pickup / delivery time (minutes)
        </label>
        <input id="eta" className={styles.input} value={value} onChange={(event) => setValue(event.target.value)} placeholder="35 to 40" />
        <p className="muted">Shown to customers as “approximately {value || '…'} minutes” after they place an order.</p>
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {success && <p className={styles.success}>Saved.</p>}
      <div className={styles.actions}>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </form>
  );
}

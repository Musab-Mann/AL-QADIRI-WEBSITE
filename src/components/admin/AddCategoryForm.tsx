'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '../../app/admin/admin.module.css';

export default function AddCategoryForm() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [label, setLabel] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id.trim().toLowerCase(), label: label.trim() }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(data.error || 'Could not add this category.');
        return;
      }
      setId('');
      setLabel('');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      className={styles.formGrid}
      style={{ alignItems: 'end' }}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <div className={styles.formRow}>
        <label className={styles.label} htmlFor="category-label">
          Category name
        </label>
        <input
          id="category-label"
          className={styles.input}
          required
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="e.g. Seafood"
        />
      </div>
      <div className={styles.formRow}>
        <label className={styles.label} htmlFor="category-id">
          Id (used internally, lowercase)
        </label>
        <input
          id="category-id"
          className={styles.input}
          required
          value={id}
          onChange={(event) => setId(event.target.value)}
          placeholder="e.g. seafood"
        />
      </div>
      <div className={styles.formRow}>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Adding…' : 'Add category'}
        </button>
      </div>
      {error && (
        <p className={styles.error} role="alert" style={{ gridColumn: '1 / -1' }}>
          {error}
        </p>
      )}
    </form>
  );
}

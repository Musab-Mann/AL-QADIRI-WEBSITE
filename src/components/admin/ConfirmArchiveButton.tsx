'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ConfirmArchiveButton({
  url,
  label = 'Archive',
  confirmLabel = 'Are you sure?',
}: {
  url: string;
  label?: string;
  confirmLabel?: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function archive() {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(url, { method: 'DELETE' });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(data.error || 'Could not complete this action.');
        setSaving(false);
        return;
      }
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setSaving(false);
    }
  }

  if (error) return <span className="muted">{error}</span>;

  if (confirming) {
    return (
      <span style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
        <span className="muted">{confirmLabel}</span>
        <button type="button" className="text-link" onClick={archive} disabled={saving}>
          {saving ? 'Removing…' : 'Yes, remove'}
        </button>
        <button type="button" className="text-link" onClick={() => setConfirming(false)} disabled={saving}>
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button type="button" className="text-link" onClick={() => setConfirming(true)}>
      {label}
    </button>
  );
}

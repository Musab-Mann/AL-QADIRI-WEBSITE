'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '../../app/admin/admin.module.css';

export default function AccountForm({ username }: { username: string }) {
  const router = useRouter();
  const [newUsername, setNewUsername] = useState(username);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function submit() {
    setError(null);
    setSuccess(false);
    if (newPassword && newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    setSaving(true);
    try {
      const response = await fetch('/api/admin/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername.trim() !== username ? newUsername.trim() : undefined,
          newPassword: newPassword || undefined,
          confirmNewPassword: newPassword ? confirmPassword : undefined,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(data.error || 'Could not update your account.');
        return;
      }
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
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
        <label className={styles.label} htmlFor="new-username">
          Username
        </label>
        <input id="new-username" className={styles.input} value={newUsername} onChange={(event) => setNewUsername(event.target.value)} />
      </div>

      <div className={styles.formRow}>
        <label className={styles.label} htmlFor="current-password">
          Current password
        </label>
        <input
          id="current-password"
          type="password"
          className={styles.input}
          required
          autoComplete="current-password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
        />
        <p className="muted">Required to confirm any change below.</p>
      </div>

      <div className={styles.formRow}>
        <label className={styles.label} htmlFor="new-password">
          New password (leave blank to keep your current password)
        </label>
        <input
          id="new-password"
          type="password"
          className={styles.input}
          autoComplete="new-password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
        />
      </div>

      {newPassword && (
        <div className={styles.formRow}>
          <label className={styles.label} htmlFor="confirm-password">
            Confirm new password
          </label>
          <input
            id="confirm-password"
            type="password"
            className={styles.input}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>
      )}

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {success && <p className={styles.success}>Your account has been updated.</p>}

      <div className={styles.actions}>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}

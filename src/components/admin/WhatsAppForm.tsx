'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '../../app/admin/admin.module.css';

interface WhatsAppFormProps {
  number: string;
  tokenSaved: boolean;
  phoneNumberIdSaved: boolean;
  fromEnvironment: boolean;
}

// The order-alert number plus the Meta WhatsApp Cloud API keys. The token is write-only: it is never sent back to the page.
export default function WhatsAppForm({ number, tokenSaved, phoneNumberIdSaved, fromEnvironment }: WhatsAppFormProps) {
  const router = useRouter();
  const [whatsappNumber, setWhatsappNumber] = useState(number);
  const [token, setToken] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function save(body: Record<string, unknown>, done: string) {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(data.error || 'Could not save these settings.');
        return;
      }
      setToken('');
      setPhoneNumberId('');
      setSuccess(done);
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
        save({ whatsappNumber, whatsappToken: token, whatsappPhoneNumberId: phoneNumberId }, 'Saved.');
      }}
    >
      <div className={styles.formRow}>
        <label className={styles.label} htmlFor="wa-number">
          WhatsApp number for new orders
        </label>
        <input
          id="wa-number"
          className={styles.input}
          value={whatsappNumber}
          onChange={(event) => setWhatsappNumber(event.target.value)}
          placeholder="+971 50 258 2786"
          inputMode="tel"
          autoComplete="off"
        />
        <p className="muted">Every new order is sent here, and the customer&apos;s &quot;Send order on WhatsApp&quot; button opens this chat.</p>
      </div>

      <div className={styles.formRow}>
        <label className={styles.label} htmlFor="wa-token">
          WhatsApp Cloud API token
        </label>
        <input
          id="wa-token"
          className={styles.input}
          type="password"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder={tokenSaved ? 'Saved. Paste a new token to replace it' : 'Paste the permanent token from Meta'}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className={styles.formRow}>
        <label className={styles.label} htmlFor="wa-phone-id">
          WhatsApp phone number ID
        </label>
        <input
          id="wa-phone-id"
          className={styles.input}
          value={phoneNumberId}
          onChange={(event) => setPhoneNumberId(event.target.value)}
          placeholder={phoneNumberIdSaved ? 'Saved. Enter a new ID to replace it' : 'The long number shown next to your WhatsApp number in Meta'}
          inputMode="numeric"
          autoComplete="off"
        />
        <p className="muted">
          Both come from Meta for Developers, WhatsApp, API Setup. Once they are saved, every order is sent to the number above
          automatically, the moment it is placed.
          {fromEnvironment ? ' Values set in the server environment take priority over these fields.' : ''}
        </p>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {success && <p className={styles.success}>{success}</p>}
      <div className={styles.actions}>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving' : 'Save WhatsApp settings'}
        </button>
        {(tokenSaved || phoneNumberIdSaved) && !fromEnvironment && (
          <button
            type="button"
            className="btn btn-ghost"
            disabled={saving}
            onClick={() => save({ clearWhatsappApi: true }, 'Automatic sending switched off.')}
          >
            Disconnect API
          </button>
        )}
      </div>
    </form>
  );
}

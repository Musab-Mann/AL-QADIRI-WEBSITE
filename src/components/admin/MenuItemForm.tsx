'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '../../app/admin/admin.module.css';

export interface MenuItemFormValues {
  id?: number;
  slug: string;
  name: string;
  description: string;
  category: string;
  prices: string[];
  image: string | null;
  available: boolean;
}

export default function MenuItemForm({
  categories,
  initial,
}: {
  categories: { id: string; label: string }[];
  initial?: MenuItemFormValues;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [values, setValues] = useState<MenuItemFormValues>(
    initial ?? {
      slug: '',
      name: '',
      description: '',
      category: categories[0]?.id ?? '',
      prices: [''],
      image: null,
      available: true,
    },
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof MenuItemFormValues>(key: K, value: MenuItemFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function updatePrice(index: number, value: string) {
    setValues((prev) => ({ ...prev, prices: prev.prices.map((p, i) => (i === index ? value : p)) }));
  }

  function addPrice() {
    if (values.prices.length >= 3) return;
    setValues((prev) => ({ ...prev, prices: [...prev.prices, ''] }));
  }

  function removePrice(index: number) {
    setValues((prev) => ({ ...prev, prices: prev.prices.filter((_, i) => i !== index) }));
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setError(null);
    try {
      if (!isEdit) {
        setError('Save the item first, then upload an image from the Edit page.');
        return;
      }
      const formData = new FormData();
      formData.set('image', file);
      const response = await fetch(`/api/admin/menu-items/${initial!.id}/image`, { method: 'POST', body: formData });
      const data = (await response.json().catch(() => ({}))) as { item?: { image: string | null }; error?: string };
      if (!response.ok || !data.item) {
        setError(data.error || 'Could not upload that image.');
        return;
      }
      update('image', data.item.image);
    } catch {
      setError('Something went wrong uploading the image.');
    } finally {
      setUploading(false);
    }
  }

  async function submit() {
    setSaving(true);
    setError(null);
    const body = {
      slug: values.slug.trim(),
      name: values.name.trim(),
      description: values.description.trim() || null,
      category: values.category,
      prices: values.prices.map((p) => p.trim()).filter(Boolean),
      image: values.image,
      available: values.available,
    };
    try {
      const response = await fetch(isEdit ? `/api/admin/menu-items/${initial!.id}` : '/api/admin/menu-items', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string; id?: number };
      if (!response.ok) {
        setError(data.error || 'Could not save this menu item.');
        return;
      }
      router.push('/admin/menu');
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
      <div className={styles.formGrid}>
        <div className={styles.formRow}>
          <label className={styles.label} htmlFor="name">
            Item Name
          </label>
          <input
            id="name"
            className={styles.input}
            required
            value={values.name}
            onChange={(event) => update('name', event.target.value)}
          />
        </div>
        <div className={styles.formRow}>
          <label className={styles.label} htmlFor="slug">
            Slug (used in the dish URL)
          </label>
          <input
            id="slug"
            className={styles.input}
            required
            disabled={isEdit}
            placeholder="e.g. grilled-sea-bass"
            value={values.slug}
            onChange={(event) => update('slug', event.target.value.toLowerCase())}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <label className={styles.label} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          className={styles.textarea}
          value={values.description}
          onChange={(event) => update('description', event.target.value)}
        />
      </div>

      <div className={styles.formRow}>
        <label className={styles.label} htmlFor="category">
          Category
        </label>
        <select
          id="category"
          className={styles.select}
          value={values.category}
          onChange={(event) => update('category', event.target.value)}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formRow}>
        <span className={styles.label}>
          Price{values.prices.length > 1 ? 's' : ''} (AED)
          {values.prices.length === 2 && <span className="muted"> - shown as Half / Full</span>}
        </span>
        {values.prices.map((price, index) => (
          <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <input
              className={styles.input}
              type="number"
              min="0"
              step="0.01"
              required
              value={price}
              onChange={(event) => updatePrice(index, event.target.value)}
            />
            {values.prices.length > 1 && (
              <button type="button" className="btn btn-ghost" onClick={() => removePrice(index)}>
                Remove
              </button>
            )}
          </div>
        ))}
        {values.prices.length < 3 && (
          <button type="button" className="text-link" onClick={addPrice}>
            + Add another price (up to 3)
          </button>
        )}
      </div>

      <div className={styles.formRow}>
        <span className={styles.label}>Image</span>
        {values.image && (
          // Menu photos are user-uploaded content served from /public/uploads; next/image is
          // not required here and a plain <img> keeps the upload preview simple.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={values.image} alt="" style={{ width: 160, height: 160, objectFit: 'cover', marginBottom: '0.5rem' }} />
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={uploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) uploadImage(file);
          }}
        />
        {!isEdit && <p className="muted">You can add a photo once the item has been created.</p>}
        {uploading && <p className="muted">Uploading…</p>}
      </div>

      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={values.available} onChange={(event) => update('available', event.target.checked)} />
        Available to order
      </label>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <div className={styles.actions}>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add item'}
        </button>
      </div>
    </form>
  );
}

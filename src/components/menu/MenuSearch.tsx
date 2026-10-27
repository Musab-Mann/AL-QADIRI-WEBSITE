'use client';

import { useId, useState } from 'react';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import styles from './MenuSearch.module.css';

// Filters the server-rendered menu in place, so the full menu still works without JavaScript.
export default function MenuSearch() {
  const id = useId();
  const [query, setQuery] = useState('');
  const [found, setFound] = useState<number | null>(null);

  const apply = (value: string) => {
    setQuery(value);
    const term = value.trim().toLowerCase();
    let total = 0;
    document.querySelectorAll<HTMLElement>('[data-category]').forEach((section) => {
      let inSection = 0;
      section.querySelectorAll<HTMLElement>('[data-search]').forEach((entry) => {
        const match = !term || (entry.dataset.search ?? '').includes(term);
        entry.hidden = !match;
        if (match) inSection += 1;
      });
      section.hidden = inSection === 0;
      total += inSection;
    });
    const empty = document.querySelector<HTMLElement>('[data-search-empty]');
    if (empty) empty.hidden = total > 0;
    setFound(term ? total : null);
  };

  return (
    <div className={styles.search} role="search">
      <label htmlFor={id} className={styles.label}>
        Search dishes
      </label>
      <div className={styles.field}>
        <MagnifyingGlass aria-hidden="true" className={styles.icon} />
        <input
          id={id}
          type="search"
          value={query}
          onChange={(event) => apply(event.target.value)}
          placeholder="Karahi, biryani, chai"
          autoComplete="off"
          className={styles.input}
        />
        {query && (
          <button type="button" className={styles.clear} onClick={() => apply('')} aria-label="Clear search">
            <X aria-hidden="true" />
          </button>
        )}
      </div>
      <p className="vh" aria-live="polite">
        {found === null ? '' : `${found} ${found === 1 ? 'dish' : 'dishes'} found`}
      </p>
    </div>
  );
}

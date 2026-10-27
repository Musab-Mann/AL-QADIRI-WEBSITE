'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Check, Plus } from '@phosphor-icons/react';
import type { MenuItem } from '@/data/menu';
import { ORDER_ADDED_EVENT, orderStore } from './order-store';
import styles from './AddToOrder.module.css';

interface AddToOrderProps {
  /** The resolved dish, passed down by the server component that already merged base + admin data. */
  item: Pick<MenuItem, 'slug' | 'name' | 'category' | 'prices'>;
  variant?: 'full' | 'compact';
  /** Whether the dish can currently be ordered. Unavailable dishes render a disabled state instead. */
  available?: boolean;
}

export default function AddToOrder({ item, variant = 'full', available = true }: AddToOrderProps) {
  const [portion, setPortion] = useState(item.prices.length > 1 ? item.prices.length - 1 : 0);
  const [added, setAdded] = useState(false);
  const [choosing, setChoosing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const groupId = useId();

  useEffect(() => () => clearTimeout(timer.current), []);

  if (!available) {
    return (
      <div className={variant === 'compact' ? styles.compact : styles.full}>
        <span className={styles.unavailable}>Currently Unavailable</span>
      </div>
    );
  }

  const multi = item.prices.length > 1;
  const optionLabel = (index: number) =>
    item.prices.length === 2 ? `${index === 0 ? 'Half' : 'Full'} AED ${item.prices[index]}` : `AED ${item.prices[index]}`;

  const add = (chosen: number, origin: HTMLElement) => {
    orderStore.add({ slug: item.slug, name: item.name, category: item.category, prices: item.prices }, chosen);
    const rect = origin.getBoundingClientRect();
    window.dispatchEvent(
      new CustomEvent(ORDER_ADDED_EVENT, { detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } }),
    );
    setAdded(true);
    setChoosing(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1600);
  };

  if (variant === 'compact') {
    return (
      <div className={styles.compact} data-open={choosing || undefined}>
        <button
          type="button"
          className={styles.compactButton}
          data-added={added || undefined}
          aria-expanded={multi ? choosing : undefined}
          aria-label={added ? `${item.name} added to order` : `Add ${item.name} to order`}
          onClick={(event) => (multi ? setChoosing((open) => !open) : add(0, event.currentTarget))}
        >
          <span className={styles.swap}>
            <span className={styles.face}>
              <Plus aria-hidden="true" /> Add
            </span>
            <span className={styles.face} aria-hidden="true">
              <Check aria-hidden="true" /> Added
            </span>
          </span>
        </button>
        {multi && (
          <div className={styles.drawer} inert={!choosing}>
            <div className={styles.drawerInner}>
              {item.prices.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={styles.chip}
                  onClick={(event) => add(index, event.currentTarget)}
                >
                  <Plus aria-hidden="true" /> {optionLabel(index)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.full}>
      {multi && (
        <div
          role="radiogroup"
          aria-labelledby={`${groupId}-label`}
          className={styles.segments}
          style={{ '--count': item.prices.length, '--index': portion } as React.CSSProperties}
        >
          <span id={`${groupId}-label`} className="vh">
            Choose portion
          </span>
          <span className={styles.indicator} aria-hidden="true" />
          {item.prices.map((_, index) => (
            <button
              key={index}
              type="button"
              role="radio"
              aria-checked={portion === index}
              className={styles.segment}
              onClick={() => setPortion(index)}
            >
              {optionLabel(index)}
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        className={`btn btn-primary ${styles.addButton}`}
        data-added={added || undefined}
        onClick={(event) => add(portion, event.currentTarget)}
      >
        <span className={styles.swap}>
          <span className={styles.face}>
            <Plus aria-hidden="true" /> Add to order
          </span>
          <span className={styles.face} aria-hidden="true">
            <Check aria-hidden="true" /> Added to order
          </span>
        </span>
      </button>
      <span className="vh" aria-live="polite">
        {added ? `${item.name} added to your order` : ''}
      </span>
    </div>
  );
}

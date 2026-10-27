import type { Prices } from '@/data/menu';
import { formatPrice, portionLabels, priceAriaLabel } from '@/lib/price';
import styles from './Price.module.css';

interface PriceProps {
  prices: Prices;
  size?: 'row' | 'feature' | 'hero';
  align?: 'start' | 'end';
}

export default function Price({ prices, size = 'row', align = 'start' }: PriceProps) {
  const labels = portionLabels(prices);
  return (
    <span className={`${styles.price} ${styles[size]} ${align === 'end' ? styles.end : ''}`} aria-label={priceAriaLabel(prices)}>
      <span className={styles.amount} aria-hidden="true">
        {formatPrice(prices)}
      </span>
      {labels && (
        <span className={styles.labels} aria-hidden="true">
          {labels[0]} / {labels[1]}
        </span>
      )}
    </span>
  );
}

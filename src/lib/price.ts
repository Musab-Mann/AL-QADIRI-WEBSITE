import type { MenuItem, Prices } from '@/data/menu';

export function formatPrice(prices: Prices): string {
  return `AED ${prices.join(' / ')}`;
}

// Two printed prices are Half / Full portions (client decision). One or three prices carry no labels.
export function portionLabels(prices: Prices): readonly [string, string] | null {
  return prices.length === 2 ? ['Half', 'Full'] : null;
}

export function priceAriaLabel(prices: Prices): string {
  const labels = portionLabels(prices);
  if (labels) return `${labels[0]} ${prices[0]} dirhams, ${labels[1]} ${prices[1]} dirhams`;
  if (prices.length === 3) return `${prices[0]}, ${prices[1]} or ${prices[2]} dirhams`;
  return `${prices[0]} dirhams`;
}

export function orderLine(item: MenuItem): string {
  const labels = portionLabels(item.prices);
  if (labels) return `${item.name} (${labels[0]} AED ${item.prices[0]} / ${labels[1]} AED ${item.prices[1]})`;
  return `${item.name} (${formatPrice(item.prices)})`;
}

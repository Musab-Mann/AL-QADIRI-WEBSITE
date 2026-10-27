export function formatAmount(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return `AED ${Number.isInteger(rounded) ? rounded : rounded.toFixed(2)}`;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-AE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatIDR(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  const B = 1_000_000_000;
  const M = 1_000_000;
  if (abs >= B) return `${sign}IDR ${+(abs / B).toFixed(1)}B`;
  if (abs >= M) return `${sign}IDR ${+(abs / M).toFixed(1)}M`;
  return `${sign}IDR ${abs.toLocaleString('id-ID')}`;
}

export function formatPct(n: number, digits: 0 | 1 = 1): string {
  const v = (n * 100);
  return `${v.toFixed(digits)}%`;
}

export function formatYear(n: number): string {
  return `Year ${n}`;
}

export function formatYears(n: number, digits: 0 | 1 = 1): string {
  return `${n.toFixed(digits)} yrs`;
}

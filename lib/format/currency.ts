// Format IDR with Indonesian-style short units:
// >= 1,000,000,000 => "IDR 3M" (Miliar)
// >= 1,000,000 => "IDR 1jt" (Juta)
// >= 1,000 => "IDR 500rb" (Ribu)
// else => "IDR 950"
export function formatIDRShort(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}IDR ${Math.round(abs / 1_000_000_000)}M`;
  if (abs >= 1_000_000) return `${sign}IDR ${Math.round(abs / 1_000_000)}jt`;
  if (abs >= 1_000) return `${sign}IDR ${Math.round(abs / 1_000)}rb`;
  return `${sign}IDR ${Math.round(abs).toLocaleString("id-ID")}`;
}


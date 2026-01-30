// src/utils/timeUtil.ts

export function formatDate(d?: string | number | Date): string {
  if (!d) return "";
  try {
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return "";
  }
}

export function formatYmd(s?: string): string {
  if (!s) return "";
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return s;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dt);
}

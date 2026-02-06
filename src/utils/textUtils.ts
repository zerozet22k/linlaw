// src/utils/textUtils.ts
export function shortText(input: unknown, max = 160): string {
  const s = String(input ?? "").trim().replace(/\s+/g, " ");
  if (!s) return "";
  return s.length > max ? `${s.slice(0, Math.max(0, max - 1))}…` : s;
}

export function normalizeKey(input: unknown): string {
  return String(input ?? "").trim().toLowerCase();
}

export function dedupStrings(
  values: Array<string | null | undefined>,
  normalize: (s: string) => string = normalizeKey
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const s = String(raw ?? "").trim();
    if (!s) continue;
    const k = normalize(s);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(s);
  }
  return out;
}

// src/utils/careerUtil.ts
import { t } from "@/i18n";

export const EMP_TYPE_LABEL = {
  fullTime: "Full-time",
  partTime: "Part-time",
  contract: "Contract",
  internship: "Internship",
  temporary: "Temporary",
  freelance: "Freelance",
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
} as const;

const nf0 = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });

export function labelOfEmploymentType(tp?: unknown): string | undefined {
  const k = String(tp ?? "").trim();
  return (EMP_TYPE_LABEL as Record<string, string>)[k];
}

export function parseNumberLoose(x: unknown): number | undefined {
  if (typeof x === "number") return Number.isFinite(x) ? x : undefined;
  if (typeof x === "string") {
    const n = Number(x.replace(/[,\s]/g, ""));
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

export function currencyCodeSuffix(raw?: unknown): string {
  if (!raw) return "";
  const up = String(raw).trim().toUpperCase();
  return /^[A-Z]{3}$/.test(up) ? ` ${up}` : "";
}

export type SalaryLike = {
  min?: unknown;
  max?: unknown;
  currency?: unknown;
  period?: string | null;
};

export function formatSalaryText(salary: SalaryLike | null | undefined, lang: string): string {
  if (!salary) return "";

  const code = currencyCodeSuffix(salary.currency);
  const unit = salary.period ? ` per ${salary.period}` : "";

  const min = parseNumberLoose(salary.min);
  const max = parseNumberLoose(salary.max);

  const tFrom = t(lang, "career.from");
  const tUpTo = t(lang, "career.upTo");

  if (min != null && max != null) {
    if (min === max) return `${nf0.format(min)}${code}${unit}`;
    return `${nf0.format(min)}–${nf0.format(max)}${code}${unit}`;
  }
  if (min != null) return `${tFrom} ${nf0.format(min)}${code}${unit}`;
  if (max != null) return `${tUpTo} ${nf0.format(max)}${code}${unit}`;
  return "";
}

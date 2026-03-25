export type FieldErrors = Record<string, string>;

export const hasMeaningfulText = (value: unknown): boolean =>
  typeof value === "string" && value.trim().length > 0;

export const hasMeaningfulLanguageValue = (value: unknown): boolean => {
  if (!value || typeof value !== "object") return false;

  return Object.values(value as Record<string, unknown>).some((entry) =>
    hasMeaningfulText(entry)
  );
};

export const isValidYmd = (value: unknown): boolean => {
  if (!hasMeaningfulText(value)) return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value).trim());
};

const collapseSeparators = (value: string, separatorPattern: RegExp) =>
  value.replace(separatorPattern, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");

export const sanitizeUsername = (value: unknown): string => {
  const raw = String(value || "").trim().toLowerCase();
  const withoutDomain = raw.includes("@") ? raw.split("@")[0] : raw;

  return collapseSeparators(
    withoutDomain
      .replace(/["']/g, "")
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/[._]+/g, "-"),
    /[^a-z0-9]+/g
  );
};

export const generateUsername = (value: unknown): string => sanitizeUsername(value);

export const isEmailLikeUsername = (value: unknown): boolean => {
  const raw = String(value || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
};

export const isValidUsername = (value: unknown): boolean => {
  const raw = String(value || "").trim();
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(raw) && raw.length >= 3 && !isEmailLikeUsername(raw);
};

export const sanitizeSlug = (value: unknown): string =>
  collapseSeparators(
    String(value || "")
      .toLowerCase()
      .trim()
      .replace(/["']/g, "")
      .replace(/[^a-z0-9]+/g, "-"),
    /[^a-z0-9]+/g
  );

export const generateSlug = (value: unknown): string => sanitizeSlug(value);

export const isValidSlug = (value: unknown): boolean =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(value || "").trim());

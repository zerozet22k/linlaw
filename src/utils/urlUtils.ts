// src/utils/urlUtils.ts

export const normalizeUrl = (url?: string): string => {
  const u = String(url || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
};

export const isEmbeddableMapUrl = (url?: string): boolean => {
  const u = String(url || "").trim();
  if (!u) return false;
  return /google\.com\/maps\/embed/i.test(u);
};

export const platformLabel = (p: string): string => {
  const x = String(p || "").toLowerCase().trim();
  if (x === "facebook") return "Facebook";
  if (x === "instagram") return "Instagram";
  if (x === "twitter") return "Twitter / X";
  if (x === "linkedin") return "LinkedIn";
  return p?.trim() || "Link";
};

export const isSameOriginReferrer = (referrer: string, origin: string): boolean => {
  try {
    return new URL(referrer).origin === origin;
  } catch {
    return false;
  }
};


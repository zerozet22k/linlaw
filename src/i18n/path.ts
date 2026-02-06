// src/i18n/path.ts
import { isSupportedLanguageLocal, type SupportedLanguage } from "@/i18n/languages";

const EXT = /^([a-z][a-z0-9+.-]*:)?\/\//i;
const isExternal = (href: string) =>
  EXT.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");

export const langSegment = (pathname: string): SupportedLanguage | null => {
  const seg = (pathname.split("/")[1] || "").trim();
  return seg && isSupportedLanguageLocal(seg) ? (seg as SupportedLanguage) : null;
};

export const stripLangPrefix = (pathname: string) => {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] && isSupportedLanguageLocal(parts[0])) {
    const rest = "/" + parts.slice(1).join("/");
    return rest === "/" ? "/" : rest;
  }
  return pathname || "/";
};

export const ensureLangPrefix = (pathname: string, lang: SupportedLanguage) => {
  const p = pathname || "/";
  if (langSegment(p)) return p;
  return `/${lang}${p === "/" ? "" : p}`;
};

export const replaceLangPrefix = (pathname: string, lang: SupportedLanguage) => {
  const rest = stripLangPrefix(pathname);
  return `/${lang}${rest === "/" ? "" : rest}`;
};

export const hrefLang = (href: string, lang: SupportedLanguage) => {
  if (!href) return href;
  if (isExternal(href)) return href;
  if (!href.startsWith("/")) return href;

  const [beforeHash, hash] = href.split("#");
  const url = new URL(beforeHash || "/", "http://local");

  const seg = langSegment(url.pathname);
  const nextPath = seg ? replaceLangPrefix(url.pathname, lang) : ensureLangPrefix(url.pathname, lang);

  const out = `${nextPath}${url.search}`;
  return hash !== undefined ? `${out}#${hash}` : out;
};

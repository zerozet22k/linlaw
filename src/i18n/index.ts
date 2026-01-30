import type { LanguageJson } from "./types";
import {
  langs,
  DEFAULT_LANG,
  SUPPORTED_LANGS,
  isSupportedLanguage,
  type SupportedLanguage,
  type BaseLocale,
  languageFlags,
  languageNames,
  languageNativeNames,
  languages,
} from "./languages";

export {
  langs as messages,
  DEFAULT_LANG,
  SUPPORTED_LANGS,
  isSupportedLanguage,
  languageFlags,
  languageNames,
  languageNativeNames,
  languages,
};

export type { SupportedLanguage, BaseLocale };

function get(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, k) => {
    if (acc == null) return undefined;
    if (typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[k];
  }, obj);
}

function isLanguageJson(x: unknown): x is LanguageJson {
  if (!x || typeof x !== "object" || Array.isArray(x)) return false;

  for (const k of SUPPORTED_LANGS) {
    if (typeof (x as any)[k] === "string") return true;
  }

  return typeof (x as any).en === "string";
}

export function t(
  lang: string,
  keyOrValue: string | LanguageJson | undefined,
  fallback = ""
): string {
  const safeLang: SupportedLanguage = isSupportedLanguage(lang) ? lang : DEFAULT_LANG;

  if (isLanguageJson(keyOrValue)) {
    return keyOrValue[safeLang] || keyOrValue.en || fallback;
  }

  if (typeof keyOrValue === "string") {
    const s = keyOrValue.trim();
    if (!s) return fallback;

    if (!s.includes(".")) return s;

    const hit = get(langs[safeLang], s);
    if (typeof hit === "string") return hit;

    const enHit = get(langs.en, s);
    if (typeof enHit === "string") return enHit;

    return fallback || s;
  }

  return fallback;
}

export function tL(
  lang: SupportedLanguage,
  keyOrValue: string | LanguageJson | undefined,
  fallback = ""
): string {
  return t(lang, keyOrValue, fallback);
}

import type { LanguageJson } from "./types";
import {
  messages,
  DEFAULT_LANG,
  SUPPORTED_LANGS,
  isLang,
  type Lang,
  type BaseLocale,
  languageFlags,
  languageNames,
  languageNativeNames,
  languages,
} from "./languages";

export {
  messages,
  DEFAULT_LANG,
  SUPPORTED_LANGS,
  isLang,
  languageFlags,
  languageNames,
  languageNativeNames,
  languages,
};

export type { Lang, BaseLocale };

function get(obj: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<any>((acc, k) => (acc == null ? acc : acc[k]), obj as any);
}

function isLanguageJson(x: unknown): x is LanguageJson {
  if (!x || typeof x !== "object" || Array.isArray(x)) return false;

  for (const k of SUPPORTED_LANGS) {
    if (typeof (x as any)[k] === "string") return true;
  }

  if (typeof (x as any).en === "string") return true;

  return false;
}

export function t(
  lang: string,
  keyOrValue: string | LanguageJson | undefined,
  fallback: string = ""
): string {
  const safeLang: Lang = isLang(lang) ? lang : DEFAULT_LANG;

  if (isLanguageJson(keyOrValue)) {
    return keyOrValue?.[safeLang] || keyOrValue?.en || fallback;
  }

  if (typeof keyOrValue === "string") {
    const s = keyOrValue.trim();
    if (!s) return fallback;

    if (!s.includes(".")) return s;

    const hit = get(messages[safeLang], s);
    if (typeof hit === "string") return hit;

    const enHit = get(messages.en, s);
    if (typeof enHit === "string") return enHit;

    return fallback || s;
  }

  return fallback;
}

export function tL(
  lang: Lang,
  keyOrValue: string | LanguageJson | undefined,
  fallback: string = ""
): string {
  return t(lang, keyOrValue, fallback);
}

import { en, type BaseLocale } from "./locales/en/index";
import { fr } from "./locales/fr/index";
import { de } from "./locales/de/index";
import { es } from "./locales/es/index";
import { zh } from "./locales/zh/index";
import { ja } from "./locales/ja/index";
import { ko } from "./locales/ko/index";
import { th } from "./locales/th/index";
import { ms } from "./locales/ms/index";
import { my } from "./locales/my/index";

export const langs = { en, fr, de, es, zh, ja, ko, th, ms, my } as const;

/** Canonical language union */
export type SupportedLanguage = keyof typeof langs;

export const DEFAULT_LANG: SupportedLanguage = "en";
export const SUPPORTED_LANGS = Object.keys(langs) as SupportedLanguage[];

export const isSupportedLanguage = (x: string): x is SupportedLanguage => x in langs;

// compile-time shape check
const _localeShapeCheck = langs satisfies Record<SupportedLanguage, BaseLocale>;
void _localeShapeCheck;

export const languageFlags = {
  en: "us",
  fr: "fr",
  de: "de",
  es: "es",
  zh: "cn",
  ja: "jp",
  ko: "kr",
  th: "th",
  ms: "my",
  my: "mm",
} as const satisfies Record<SupportedLanguage, string>;

export const languageNames = {
  en: "English",
  fr: "French",
  de: "German",
  es: "Spanish",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
  th: "Thai",
  ms: "Malay",
  my: "Burmese",
} as const satisfies Record<SupportedLanguage, string>;

export const languageNativeNames = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  th: "ไทย",
  ms: "Bahasa Melayu",
  my: "မြန်မာ",
} as const satisfies Record<SupportedLanguage, string>;

export type LanguageOption = {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
};

export const languages: LanguageOption[] = SUPPORTED_LANGS.map((code) => ({
  code,
  name: languageNames[code],
  nativeName: languageNativeNames[code],
  flag: languageFlags[code],
}));

export type { BaseLocale };

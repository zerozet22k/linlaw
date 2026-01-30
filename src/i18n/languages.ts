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

export const messages = { en, fr, de, es, zh, ja, ko, th, ms, my } as const;
export type Lang = keyof typeof messages;

export const DEFAULT_LANG: Lang = "en";
export const SUPPORTED_LANGS = Object.keys(messages) as Lang[];
export const isLang = (x: string): x is Lang => x in messages;
const _localeShapeCheck = messages satisfies Record<Lang, BaseLocale>;
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
} as const satisfies Record<Lang, string>;

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
} as const satisfies Record<Lang, string>;

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
} as const satisfies Record<Lang, string>;

export type LanguageOption = {
  code: Lang;
  name: string;
  nativeName: string;
  flag: string;
};

export const languages: LanguageOption[] = (Object.keys(languageNames) as Lang[]).map(
  (code) => ({
    code,
    name: languageNames[code],
    nativeName: languageNativeNames[code],
    flag: languageFlags[code],
  })
);

// Re-export for convenience
export type { BaseLocale };

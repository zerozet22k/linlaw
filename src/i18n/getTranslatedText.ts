import { DEFAULT_LANG, isLang, Lang } from "./languages";
import type { LanguageJson } from "./types";

export const getTranslatedText = (
  translations: LanguageJson | undefined,
  language: string,
  fallbackLang: string = DEFAULT_LANG
): string => {
  if (!translations) return "";

  const lang: Lang = isLang(language) ? language : DEFAULT_LANG;
  const fb: Lang = isLang(fallbackLang) ? (fallbackLang as Lang) : DEFAULT_LANG;

  return translations[lang] || translations[fb] || translations.en || "";
};

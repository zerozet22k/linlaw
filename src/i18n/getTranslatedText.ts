import { DEFAULT_LANG, isSupportedLanguage, type SupportedLanguage } from "./languages";
import type { LanguageJson } from "./types";

export const getTranslatedText = (
  translations: LanguageJson | undefined,
  language: string,
  fallbackLang: string = DEFAULT_LANG
): string => {
  if (!translations) return "";

  const lang: SupportedLanguage = isSupportedLanguage(language) ? language : DEFAULT_LANG;
  const fb: SupportedLanguage = isSupportedLanguage(fallbackLang) ? fallbackLang : DEFAULT_LANG;

  return translations[lang] || translations[fb] || translations.en || "";
};

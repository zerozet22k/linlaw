import type { SupportedLanguage } from "./languages";

/**
 * DB translation object:
 * - typed for supported languages
 * - still allows extra language codes coming from DB
 */
export type LanguageJson =
  Partial<Record<SupportedLanguage, string>> & {
    en?: string;
    [languageCode: string]: string | undefined;
  };

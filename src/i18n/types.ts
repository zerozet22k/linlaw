import type { Lang } from "./languages";

/**
 * DB translation object:
 * - typed for supported languages
 * - still allows extra language codes coming from DB
 */
export type LanguageJson =
  Partial<Record<Lang, string>> & {
    en?: string;
    [languageCode: string]: string | undefined;
  };

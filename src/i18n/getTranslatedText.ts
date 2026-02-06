import type { LanguageJson } from "./types";
import type { SupportedLanguage } from "./languages";
import { tL } from "./index"; // wherever tL lives

export const getTranslatedText = (
  value: LanguageJson | string | undefined | null,
  lang: SupportedLanguage,
  fallback = ""
): string => {
  return tL(lang, value ?? undefined, fallback);
};

import { cookies } from "next/headers";
import {
  DEFAULT_LANG,
  isSupportedLanguageLocal,
  type SupportedLanguage,
} from "@/i18n/languages";

export type LangParams = { lang?: string };

export const langIn = (params?: LangParams): SupportedLanguage => {
  const p = String(params?.lang || "").trim();
  if (p && isSupportedLanguageLocal(p)) return p;

  const c = String(cookies().get("language")?.value || "").trim();
  if (c && isSupportedLanguageLocal(c)) return c as SupportedLanguage;

  return DEFAULT_LANG;
};
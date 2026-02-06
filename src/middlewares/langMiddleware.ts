// src/middlewares/langMiddleware.ts
import type { NextRequest } from "next/server";
import {
  DEFAULT_LANG,
  isSupportedLanguageLocal,
  type SupportedLanguage,
} from "@/i18n/languages";
import { LANGUAGE_SETTINGS_KEYS } from "@/config/CMS/settings/keys/LANGUAGE_SETTINGS_KEYS";
import type { SettingsInterface } from "@/config/CMS/settings/settingKeys";

// NO ?lang. Only /{lang}/... then cookie.
export function langFromReq(req: NextRequest): SupportedLanguage {
  const seg = (req.nextUrl.pathname.split("/")[1] || "").trim();
  if (seg && isSupportedLanguageLocal(seg)) return seg;

  const c = (req.cookies.get("language")?.value || "").trim();
  if (c && isSupportedLanguageLocal(c)) return c;

  return DEFAULT_LANG;
}

export function langsFromSettings(
  settings: Partial<SettingsInterface>
): SupportedLanguage[] {
  const raw = settings[
    LANGUAGE_SETTINGS_KEYS.SUPPORTED_LANGUAGES as keyof SettingsInterface
  ] as unknown;

  const list = Array.isArray(raw) ? raw : [];

  const filtered = list
    .filter((x): x is string => typeof x === "string")
    .map((x) => x.trim())
    .filter(Boolean)
    .filter(isSupportedLanguageLocal);

  // hard fallback always present
  return Array.from(new Set<SupportedLanguage>([DEFAULT_LANG, ...filtered]));
}

export function langResolve(
  requested: string,
  enabled: SupportedLanguage[]
): SupportedLanguage {
  const r = (requested || "").trim();
  if (r && isSupportedLanguageLocal(r) && enabled.includes(r)) return r;

  return enabled.includes(DEFAULT_LANG) ? DEFAULT_LANG : enabled[0] ?? DEFAULT_LANG;
}

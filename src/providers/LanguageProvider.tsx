"use client";

import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { LanguageContext } from "@/contexts/LanguageContext";
import { useSettings } from "@/hooks/useSettings";
import { DEFAULT_LANG, isSupportedLanguageLocal, type SupportedLanguage } from "@/i18n/languages";
import { ensureLangPrefix, replaceLangPrefix } from "@/i18n/path";

const LS_KEY = "selected_language";
const CK_KEY = "language";

const ckWrite = (key: string, value: string) => {
  document.cookie = `${key}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax`;
};

const segFromPath = (pathname: string): SupportedLanguage | null => {
  const seg = (pathname.split("/")[1] || "").trim();
  return seg && isSupportedLanguageLocal(seg) ? (seg as SupportedLanguage) : null;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { supportedLanguages } = useSettings();
  const router = useRouter();
  const pathname = usePathname() || "/";

  const enabled = useMemo<SupportedLanguage[]>(
    () => ((supportedLanguages?.length ? supportedLanguages : [DEFAULT_LANG]) as SupportedLanguage[]),
    [supportedLanguages]
  );

  const clamp = useCallback(
    (raw: SupportedLanguage) => (enabled.includes(raw) ? raw : DEFAULT_LANG),
    [enabled]
  );

  // Start from the URL segment during the first render so SSR matches the page language.
  const initialPathLang = segFromPath(pathname);
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    return initialPathLang && enabled.includes(initialPathLang) ? initialPathLang : DEFAULT_LANG;
  });

  // follow URL language on public routes
  useEffect(() => {
    if (pathname.startsWith("/dashboard")) return; // dashboard doesn't carry lang segment
    const seg = segFromPath(pathname);
    if (!seg) return;
    const next = clamp(seg);
    if (next !== language) setLanguageState(next);
  }, [pathname, clamp, language]);

  // explicit user action: persist + navigate
  const setLanguage = useCallback(
    (raw: SupportedLanguage) => {
      const next = clamp(raw);
      setLanguageState(next);

      // persist only on explicit action
      try {
        localStorage.setItem(LS_KEY, next);
      } catch {}
      ckWrite(CK_KEY, next);

      if (pathname.startsWith("/dashboard")) return;

      const seg = segFromPath(pathname);
      const nextPath = seg ? replaceLangPrefix(pathname, next) : ensureLangPrefix(pathname, next);
      router.replace(nextPath);
    },
    [clamp, pathname, router]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        supportedLanguages: enabled,
        currentSupportedLanguages: enabled,
        setCurrentSupportedLanguages: () => {},
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

"use client";

import { ReactNode, useEffect, useMemo, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

import { LanguageContext } from "@/contexts/LanguageContext";
import { useSettings } from "@/hooks/useSettings";
import {
  DEFAULT_LANG,
  isSupportedLanguageLocal,
  type SupportedLanguage,
} from "@/i18n/languages";

import { langSegment, ensureLangPrefix, replaceLangPrefix } from "@/i18n/path";

const LS_KEY = "selected_language";
const CK_KEY = "language";

const ckRead = (key: string) => {
  const m = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
};

const ckWrite = (key: string, value: string) => {
  document.cookie = `${key}=${encodeURIComponent(
    value
  )}; Path=/; Max-Age=31536000; SameSite=Lax`;
};

const segFromPath = (pathname: string): SupportedLanguage | null => {
  const seg = (pathname.split("/")[1] || "").trim();
  return seg && isSupportedLanguageLocal(seg) ? (seg as SupportedLanguage) : null;
};

const safeLocal = (raw: string | null): SupportedLanguage | null => {
  const v = (raw || "").trim();
  return v && isSupportedLanguageLocal(v) ? (v as SupportedLanguage) : null;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { supportedLanguages } = useSettings();
  const router = useRouter();
  const pathname = usePathname();

  const supportedReady = !!supportedLanguages?.length;

  
  const enabled = useMemo<SupportedLanguage[]>(
    () =>
      (supportedLanguages?.length
        ? supportedLanguages
        : [DEFAULT_LANG]) as SupportedLanguage[],
    [supportedLanguages]
  );

  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (typeof window === "undefined") return DEFAULT_LANG;

    
    const fromPath = segFromPath(window.location.pathname);
    if (fromPath) return fromPath;

    
    const fromCookie = safeLocal(ckRead(CK_KEY));
    if (fromCookie) return fromCookie;

    const fromLS = safeLocal(localStorage.getItem(LS_KEY));
    if (fromLS) return fromLS;

    return DEFAULT_LANG;
  });

  const [currentSupportedLanguages, setCurrentSupportedLanguages] =
    useState<SupportedLanguage[]>(enabled);

  useEffect(() => {
    setCurrentSupportedLanguages(enabled);
  }, [enabled]);

  
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(LS_KEY, language);
    ckWrite(CK_KEY, language);
  }, [language]);

  
  const clamp = useCallback(
    (raw: SupportedLanguage) => {
      if (!supportedReady) return raw; 
      if (enabled.includes(raw)) return raw;
      return (enabled[0] || DEFAULT_LANG) as SupportedLanguage;
    },
    [supportedReady, enabled]
  );

  const syncPath = useCallback(
    (langToSync: SupportedLanguage, mode: "router" | "history") => {
      if (typeof window === "undefined") return;

      const url = new URL(window.location.href);
      const cur = `${url.pathname}${url.search}${url.hash}`;

      const seg = langSegment(url.pathname);
      url.pathname = seg
        ? replaceLangPrefix(url.pathname, langToSync)
        : ensureLangPrefix(url.pathname, langToSync);

      const next = `${url.pathname}${url.search}${url.hash}`;
      if (next === cur) return;

      if (mode === "history") {
        window.history.replaceState(null, "", next);
      } else {
        router.replace(next, { scroll: false });
      }
    },
    [router]
  );

  const setLanguage = useCallback(
    (raw: SupportedLanguage) => {
      const next = clamp(raw);
      setLanguageState(next);
      syncPath(next, "router");
    },
    [clamp, syncPath]
  );

  
  useEffect(() => {
    const fromPath = segFromPath(pathname || "/");
    if (!fromPath) return;

    const next = clamp(fromPath);
    if (next === language) return;

    setLanguageState(next);
  }, [pathname, clamp, language]);

  
  useEffect(() => {
    if (!supportedReady) return;
    if (enabled.includes(language)) return;

    const fallback = (enabled[0] || DEFAULT_LANG) as SupportedLanguage;
    setLanguageState(fallback);
    syncPath(fallback, "router");
  }, [supportedReady, enabled, language, syncPath]);

  
  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/dashboard")) return; 
    const seg = segFromPath(pathname);
    if (seg) return;

    syncPath(language, "router");
  }, [pathname, language, syncPath]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        supportedLanguages: enabled,
        currentSupportedLanguages,
        setCurrentSupportedLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

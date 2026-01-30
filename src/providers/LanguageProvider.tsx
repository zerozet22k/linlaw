"use client";

import {
  ReactNode,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LanguageContext } from "@/contexts/LanguageContext";
import { useSettings } from "@/hooks/useSettings";
import { DEFAULT_LANG, type SupportedLanguage } from "@/i18n/languages";

const LANGUAGE_STORAGE_KEY = "selected_language";
const LANGUAGE_COOKIE_KEY = "language";

const readCookie = (key: string) => {
  const m = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
};

const writeCookie = (key: string, value: string) => {
  document.cookie = `${key}=${encodeURIComponent(
    value
  )}; Path=/; Max-Age=31536000; SameSite=Lax`;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { supportedLanguages } = useSettings();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const supportedReady = !!supportedLanguages?.length;

  const effectiveSupported = useMemo<SupportedLanguage[]>(
    () =>
      (supportedLanguages?.length
        ? supportedLanguages
        : [DEFAULT_LANG]) as SupportedLanguage[],
    [supportedLanguages]
  );

  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (typeof window === "undefined") return DEFAULT_LANG as SupportedLanguage;

    const urlLang = new URLSearchParams(window.location.search).get("lang");
    const cookieLang = readCookie(LANGUAGE_COOKIE_KEY);
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);

    return (urlLang || cookieLang || stored || DEFAULT_LANG) as SupportedLanguage;
  });

  const [currentSupportedLanguages, setCurrentSupportedLanguages] =
    useState<SupportedLanguage[]>(effectiveSupported);

  useEffect(() => {
    setCurrentSupportedLanguages(effectiveSupported);
  }, [effectiveSupported]);

  // persist whenever language changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    writeCookie(LANGUAGE_COOKIE_KEY, language);
  }, [language]);

  const validate = useCallback(
    (raw: SupportedLanguage) => {
      if (!supportedReady) return raw;
      if (supportedLanguages!.includes(raw)) return raw;
      return (supportedLanguages![0] || DEFAULT_LANG) as SupportedLanguage;
    },
    [supportedReady, supportedLanguages]
  );

  const syncUrlLang = useCallback(
    (langToSync: SupportedLanguage, mode: "router" | "history") => {
      if (typeof window === "undefined") return;

      const url = new URL(window.location.href);

      const desired = langToSync === DEFAULT_LANG ? null : langToSync;
      const current = url.searchParams.get("lang");

      const ok =
        (desired === null && current === null) ||
        (desired !== null && current === desired);

      if (ok) return;

      if (desired === null) url.searchParams.delete("lang");
      else url.searchParams.set("lang", desired);

      const next = `${url.pathname}${url.search}${url.hash}`;

      // On hash-only changes, using router.replace can interrupt scroll.
      if (mode === "history") {
        window.history.replaceState(null, "", next);
      } else {
        router.replace(next, { scroll: false });
      }
    },
    [router]
  );

  const setLanguage = useCallback(
    (lang: SupportedLanguage) => {
      const next = validate(lang);
      setLanguageState(next);
      // ensure URL reflects selection immediately (preserve hash)
      syncUrlLang(next, "router");
    },
    [syncUrlLang, validate]
  );

  // If URL explicitly has ?lang=..., it wins
  useEffect(() => {
    const raw = searchParams?.get("lang");
    if (!raw) return;

    const next = validate(raw as SupportedLanguage);
    if (next === language) return;

    setLanguageState(next);
  }, [searchParams, language, validate]);

  // Once settings are ready, enforce allowed languages
  useEffect(() => {
    if (!supportedReady) return;
    if (supportedLanguages!.includes(language)) return;

    const fallback = (supportedLanguages![0] || DEFAULT_LANG) as SupportedLanguage;
    setLanguageState(fallback);
    syncUrlLang(fallback, "router");
  }, [supportedReady, supportedLanguages, language, syncUrlLang]);

  // Carry ?lang across *path* navigations (when links forget it)
  useEffect(() => {
    if (!pathname) return;
    syncUrlLang(language, "router");
  }, [pathname, language, syncUrlLang]);

  // Carry ?lang across hash navigations without breaking scroll
  useEffect(() => {
    const onHash = () => syncUrlLang(language, "history");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [language, syncUrlLang]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        supportedLanguages: effectiveSupported,
        currentSupportedLanguages,
        setCurrentSupportedLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

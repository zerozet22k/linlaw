export const dynamic = "force-dynamic";
export const revalidate = 0;

import type { Metadata } from "next";
import React from "react";
import CareersContent from "./content";

import {
  CAREER_PAGE_SETTINGS_KEYS,
  type CAREER_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/CAREER_PAGE_SETTINGS";

import { getPageSettings } from "@/utils/server/pageSettings";
import { valuesOf } from "@/utils/typed";
import { buildPageMetadata } from "@/utils/server/metadata/buildPageMetadata";

import { ROUTES } from "@/config/navigations/routes";
import { t } from "@/i18n";
import { DEFAULT_LANG, type SupportedLanguage } from "@/i18n/languages";
import { cookies } from "next/headers";

const defaults: CAREER_PAGE_SETTINGS_TYPES = {
  [CAREER_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: undefined,
  [CAREER_PAGE_SETTINGS_KEYS.JOBS_SECTION]: {
    section: undefined,
    items: [],
  },
};

async function loadData() {
  return getPageSettings({
    keys: valuesOf(CAREER_PAGE_SETTINGS_KEYS),
    defaults,
  });
}

const getLang = (searchParams?: { lang?: string }): SupportedLanguage => {
  const fromQuery = searchParams?.lang;
  const fromCookie = cookies().get("language")?.value; // matches your LanguageProvider cookie
  return (fromQuery || fromCookie || DEFAULT_LANG) as SupportedLanguage;
};

const getFallbackTitleFromRoutes = (lang: SupportedLanguage) => {
  const route = Object.values(ROUTES).find((r) => r.path === "/careers");
  if (!route) return "Careers";
  return route.navKey ? t(lang, route.navKey, "Careers") : "Careers";
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { lang?: string };
}): Promise<Metadata> {
  const data = await loadData();

  const lang = getLang(searchParams);
  const fallbackTitle = getFallbackTitleFromRoutes(lang);

  return buildPageMetadata({
    path: "/careers",
    pageContent: data[CAREER_PAGE_SETTINGS_KEYS.PAGE_CONTENT],
    lang,
  });

}

const CareersPage = async () => {
  const data = await loadData();
  return <CareersContent data={data} />;
};

export default CareersPage;

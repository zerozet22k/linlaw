import type { Metadata } from "next";
import { cache } from "react";
import { cookies } from "next/headers";
import { getTranslatedText } from "@/i18n/getTranslatedText";
import { DEFAULT_LANG, type SupportedLanguage } from "@/i18n/languages";
import { t } from "@/i18n";
import { ROUTES } from "@/config/navigations/routes";

import {
  getPublicSettings,
  getSeo,
  getSiteName,
  getSiteUrl,
  toAbsoluteUrl,
} from "@/utils/server/publicSiteSettings";

type SharedPageContentLike = {
  title?: any;
  description?: any;
};

type OpenGraphType =
  Extract<NonNullable<Metadata["openGraph"]>, { type?: any }> extends never
  ? string
  : Extract<NonNullable<Metadata["openGraph"]>, { type?: any }>["type"];

export type BuildPageMetadataOpts = {
  path: string;


  fallbackTitle?: string;

  pageContent?: SharedPageContentLike;

  lang?: SupportedLanguage;
  preferFallbackTitle?: boolean;

  title?: string;
  description?: string;
  keywords?: Metadata["keywords"];
  ogImageRaw?: string;
  type?: OpenGraphType;
  noindex?: boolean;
};

const getPublicSettingsCached = cache(async () => getPublicSettings());

function cleanBaseUrl(url: string) {
  return String(url || "").replace(/\/+$/, "");
}

function cleanPath(path: string) {
  let p = String(path || "/").trim();
  if (!p.startsWith("/")) p = `/${p}`;
  if (p !== "/") p = p.replace(/\/+$/, "");
  return p;
}

function robotsNoindex(): Metadata["robots"] {
  return {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  };
}


function matchRouteByPath(pathname: string) {
  const p = cleanPath(pathname);

  return (
    Object.values(ROUTES).find((route) => {
      const routePath = cleanPath(route.path);
      const re = new RegExp(`^${routePath.replace(/:\w+/g, "[^/]+")}$`);
      return re.test(p);
    }) || null
  );
}

function getFallbackTitleFromRoutes(
  path: string,
  lang: SupportedLanguage,
  hardFallback: string
) {
  const route = matchRouteByPath(path);
  if (!route) return hardFallback;

  if (route.navKey) return t(lang as any, route.navKey, hardFallback);


  return String((route as any).key || hardFallback);
}

export async function buildPageMetadata(
  opts: BuildPageMetadataOpts
): Promise<Metadata> {
  const settings = await getPublicSettingsCached();

  const siteName = getSiteName(settings);
  const siteUrl = cleanBaseUrl(getSiteUrl(settings));
  const {
    keywords: globalKeywords,
    ogImageRaw: globalOgRaw,
    description: globalDesc,
  } = getSeo(settings);

  const lang = (opts.lang ?? DEFAULT_LANG) as SupportedLanguage;


  const preferFallbackTitle = opts.preferFallbackTitle ?? true;

  const path = cleanPath(opts.path);


  const fallbackTitle = opts.fallbackTitle
    ?? getFallbackTitleFromRoutes(path, lang, "Page");

  const canonical = `${siteUrl}${path === "/" ? "/" : path}`;

  const contentTitle =
    getTranslatedText(opts.pageContent?.title, lang) ??
    getTranslatedText(opts.pageContent?.title, "en");

  const titleText =
    opts.title ??
    (preferFallbackTitle ? fallbackTitle : contentTitle ?? fallbackTitle);

  const descText = String(
    opts.description ??
    getTranslatedText(opts.pageContent?.description, lang) ??
    getTranslatedText(opts.pageContent?.description, "en") ??
    (globalDesc ? String(globalDesc).trim() : "")
  ).trim();

  const ogRaw = opts.ogImageRaw ?? globalOgRaw;
  const ogAbs = ogRaw ? toAbsoluteUrl(ogRaw, siteUrl) : undefined;

  const socialTitle = path === "/" ? siteName : `${titleText} | ${siteName}`;

  return {
    title: titleText,
    description: descText,
    keywords: opts.keywords ?? globalKeywords,
    alternates: { canonical },
    robots: opts.noindex ? robotsNoindex() : undefined,

    openGraph: {
      title: socialTitle,
      description: descText,
      url: canonical,
      siteName,
      type: (opts.type ?? "website") as any,
      images: ogAbs ? [{ url: ogAbs }] : undefined,
    },

    twitter: {
      card: ogAbs ? "summary_large_image" : "summary",
      title: socialTitle,
      description: descText,
      images: ogAbs ? [ogAbs] : undefined,
    },
  };
}


export const getLang = (searchParams?: { lang?: string }): SupportedLanguage => {
  const fromQuery = searchParams?.lang;
  const fromCookie = cookies().get("language")?.value;
  return (fromQuery || fromCookie || DEFAULT_LANG) as SupportedLanguage;
};

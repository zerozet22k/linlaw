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

// ✅ Works even if openGraph is a union where not all variants have `type`
type OpenGraphType =
  Extract<NonNullable<Metadata["openGraph"]>, { type?: any }> extends never
    ? string
    : Extract<NonNullable<Metadata["openGraph"]>, { type?: any }>["type"];

export type LangSearchParams = { lang?: string };

export type BuildPageMetadataOpts = {
  path: string;

  // optional (will auto-pull from ROUTES if missing)
  fallbackTitle?: string;

  pageContent?: SharedPageContentLike;

  lang?: SupportedLanguage;
  preferFallbackTitle?: boolean; // default true

  title?: string;
  description?: string;
  keywords?: Metadata["keywords"];
  ogImageRaw?: string;
  type?: OpenGraphType;
  noindex?: boolean;
};

export type BuildPageMetadataFromRequestOpts = Omit<BuildPageMetadataOpts, "lang"> & {
  searchParams?: LangSearchParams;
};

const getPublicSettingsCached = cache(async () => getPublicSettings());

function cleanBaseUrl(url: string) {
  return String(url || "").replace(/\/+$/, "");
}

// IMPORTANT:
// - server must not generate canonical with query/hash accidentally
function cleanPath(path: string) {
  let p = String(path || "/").trim();

  // strip query + hash if someone passes them by accident
  p = p.split("#")[0].split("?")[0];

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
      // hash routes are client-only; never match them here
      if (String(route.path || "").includes("#")) return false;

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

function applyLangToUrl(fullUrl: string, lang: SupportedLanguage) {
  // only add ?lang= when non-default
  const url = new URL(fullUrl);
  if (lang && lang !== DEFAULT_LANG) url.searchParams.set("lang", lang);
  else url.searchParams.delete("lang");
  return url.toString();
}

// Optional: emit hreflang alternates if we can discover supported languages
function tryGetSupportedLangsFromSettings(settings: any): SupportedLanguage[] | null {
  const candidates =
    settings?.siteSettings?.supportedLanguages ??
    settings?.supportedLanguages ??
    settings?.i18n?.supportedLanguages ??
    null;

  if (!Array.isArray(candidates) || candidates.length === 0) return null;

  // sanitize to string array
  return candidates
    .map((x: any) => String(x).trim())
    .filter(Boolean) as SupportedLanguage[];
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

  const fallbackTitle =
    opts.fallbackTitle ?? getFallbackTitleFromRoutes(path, lang, "Page");

  // base canonical (no query)
  const canonicalBase = `${siteUrl}${path === "/" ? "/" : path}`;
  // canonical INCLUDING ?lang= (SEO-critical)
  const canonical = applyLangToUrl(canonicalBase, lang);

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

  // ✅ If builder is used for "/", avoid template doubling ("site | site")
  const pageTitle: Metadata["title"] =
    path === "/" ? { absolute: titleText } : titleText;

  // hreflang alternates (optional best-effort)
  const supportedLangs = tryGetSupportedLangsFromSettings(settings);
  const languages =
    supportedLangs && supportedLangs.length > 0
      ? Object.fromEntries(
          supportedLangs.map((l) => [
            l,
            applyLangToUrl(canonicalBase, l as SupportedLanguage),
          ])
        )
      : undefined;

  return {
    title: pageTitle,
    description: descText,
    keywords: opts.keywords ?? globalKeywords,

    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },

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

// ✅ Request-aware language helper (query wins, then cookie, then default)
export const getLang = (searchParams?: LangSearchParams): SupportedLanguage => {
  const fromQuery = searchParams?.lang;
  const fromCookie = cookies().get("language")?.value;
  return (fromQuery || fromCookie || DEFAULT_LANG) as SupportedLanguage;
};

// ✅ One-liner helper so you stop rewriting lang boilerplate in every page
export async function buildPageMetadataFromRequest(
  opts: BuildPageMetadataFromRequestOpts
): Promise<Metadata> {
  const lang = getLang(opts.searchParams);
  return buildPageMetadata({ ...opts, lang });
}

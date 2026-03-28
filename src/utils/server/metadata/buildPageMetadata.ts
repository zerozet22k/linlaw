
import type { Metadata } from "next";
import { cache } from "react";

import { getTranslatedText } from "@/i18n/getTranslatedText";
import {
  DEFAULT_LANG,
  isSupportedLanguageLocal,
  type SupportedLanguage,
} from "@/i18n/languages";
import { t } from "@/i18n";
import { ROUTES } from "@/config/navigations/routes";

import {
  getPublicSettings,
  getSeo,
  getSiteName,
  getSiteUrl,
  toAbsoluteUrl,
} from "@/utils/server/publicSiteSettings";
import { langsFromSettings } from "@/middlewares/langMiddleware";

type SharedPageContentLike = { title?: any; description?: any };

type OpenGraphType =
  Extract<NonNullable<Metadata["openGraph"]>, { type?: any }> extends never
  ? string
  : Extract<NonNullable<Metadata["openGraph"]>, { type?: any }>["type"];

export type LangParams = { lang?: string };

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

export type BuildPageMetadataFromRequestOpts = Omit<BuildPageMetadataOpts, "lang"> & {
  params?: LangParams;
};

const getPublicSettingsCached = cache(async () => getPublicSettings());

const cleanBaseUrl = (url: string) => String(url || "").replace(/\/+$/, "");

const cleanPath = (path: string) => {
  let p = String(path || "/").trim();
  p = p.split("#")[0].split("?")[0];
  if (!p.startsWith("/")) p = `/${p}`;
  if (p !== "/") p = p.replace(/\/+$/, "");
  return p;
};

const robotsNoindex = (): Metadata["robots"] => ({
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
});

function matchRouteByPath(pathname: string) {
  const p = cleanPath(pathname);
  return (
    Object.values(ROUTES).find((route) => {
      if (String(route.path || "").includes("#")) return false;
      const routePath = cleanPath(route.path);
      const re = new RegExp(`^${routePath.replace(/:\w+/g, "[^/]+")}$`);
      return re.test(p);
    }) || null
  );
}

function getFallbackTitleFromRoutes(path: string, lang: SupportedLanguage, hardFallback: string) {
  const route = matchRouteByPath(path);
  if (!route) return hardFallback;
  if (route.navKey) return t(lang as any, route.navKey, hardFallback);
  return String((route as any).key || hardFallback);
}

export function langFromParams(params?: LangParams): SupportedLanguage {
  const raw = String(params?.lang || "").trim();
  if (raw && isSupportedLanguageLocal(raw)) return raw as SupportedLanguage;
  return DEFAULT_LANG;
}

function prefixPath(path: string, lang: SupportedLanguage) {
  const p = cleanPath(path);
  const l = String(lang || DEFAULT_LANG).trim();


  if (p === "/") return `/${l}`;
  return `/${l}${p}`;
}

export async function buildPageMetadata(opts: BuildPageMetadataOpts): Promise<Metadata> {
  const settings = await getPublicSettingsCached();

  const siteName = getSiteName(settings);
  const siteUrl = cleanBaseUrl(getSiteUrl(settings));

  const { keywords: globalKeywords, ogImageRaw: globalOgRaw, description: globalDesc } = getSeo(settings);

  const lang = (opts.lang ?? DEFAULT_LANG) as SupportedLanguage;
  const preferFallbackTitle = opts.preferFallbackTitle ?? true;

  const path = cleanPath(opts.path);

  const fallbackTitle =
    opts.fallbackTitle ?? getFallbackTitleFromRoutes(path, lang, "Page");


  const canonicalPath = prefixPath(path, lang);
  const canonical = `${siteUrl}${canonicalPath === "/" ? "/" : canonicalPath}`;

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

  const pageTitle: Metadata["title"] = path === "/" ? { absolute: titleText } : titleText;

  const enabledLangs = langsFromSettings(settings as any);
  const defaultAlternate = `${siteUrl}${prefixPath(path, DEFAULT_LANG)}`;
  const languages = Object.fromEntries(
    enabledLangs.map((l) => [l, `${siteUrl}${prefixPath(path, l)}`])
  ) as Record<string, string>;
  languages["x-default"] = defaultAlternate;

  return {
    title: pageTitle,
    description: descText,
    keywords: opts.keywords ?? globalKeywords,

    alternates: {
      canonical,
      languages,
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

export async function buildPageMetadataFromRequest(
  opts: BuildPageMetadataFromRequestOpts
): Promise<Metadata> {
  const lang = langFromParams(opts.params);

  return buildPageMetadata({ ...opts, lang });
}

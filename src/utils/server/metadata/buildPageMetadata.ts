import type { Metadata } from "next";
import { cache } from "react";

import { getTranslatedText } from "@/i18n/getTranslatedText";
import { DEFAULT_LANG } from "@/i18n/languages";

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

export type BuildPageMetadataOpts = {
  path: string;
  fallbackTitle: string;
  pageContent?: SharedPageContentLike;

  title?: string;
  description?: string;
  keywords?: Metadata["keywords"];
  ogImageRaw?: string;
  type?: OpenGraphType; // ✅ fixed
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

  const path = cleanPath(opts.path);
  const canonical = `${siteUrl}${path === "/" ? "/" : path}`;

  const titleText =
    opts.title ??
    getTranslatedText(opts.pageContent?.title, DEFAULT_LANG) ??
    getTranslatedText(opts.pageContent?.title, "en") ??
    opts.fallbackTitle;

  const descText = String(
    opts.description ??
      getTranslatedText(opts.pageContent?.description, DEFAULT_LANG) ??
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

export const dynamic = "force-dynamic";

import React from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";

import RelatedBusinessSlugContent from "./content";
import { buildPageMetadata, getLang } from "@/utils/server/metadata/buildPageMetadata";
import { getTranslatedText } from "@/i18n/getTranslatedText";
import { DEFAULT_LANG, SupportedLanguage } from "@/i18n/languages";
import type { RelatedBusinessAPI } from "@/models/RelatedBusinessModel";

function shortText(input: string, max = 160) {
  const s = String(input || "").trim().replace(/\s+/g, " ");
  if (!s) return "";
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

function getRequestOrigin() {
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  const proto = h.get("x-forwarded-proto") || "https";
  return host ? `${proto}://${host}` : "";
}

function toText(maybeLangJsonOrString: any, lang: SupportedLanguage, fallback = "") {
  const v =
    getTranslatedText(maybeLangJsonOrString, lang) ||
    getTranslatedText(maybeLangJsonOrString, "en") ||
    String(maybeLangJsonOrString ?? "").trim();

  return v || fallback;
}
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { lang?: string };
}): Promise<Metadata> {
  const lang = getLang(searchParams);

  const rawSlug = String(params?.slug || "").trim();
  const slug = encodeURIComponent(rawSlug);

  if (!rawSlug) {
    return buildPageMetadata({
      path: "/related-businesses",
      lang,
      fallbackTitle: "Related Business",
      title: "Related Business",
    });
  }

  const origin = getRequestOrigin();

  let title = "Related Business";
  let desc = "";
  let ogImageRaw: string | undefined;

  try {
    if (origin) {
      const res = await fetch(`${origin}/api/related-businesses/slug/${slug}`, {
        cache: "no-store",
      });

      if (res.ok) {
        const item = (await res.json()) as RelatedBusinessAPI;

        title = toText(item?.title, lang, item?.slug || "Related Business");
        desc = toText(item?.description, lang, "");
        ogImageRaw = String(item?.image || "").trim() || undefined;
      }
    }
  } catch {}

  return buildPageMetadata({
    path: `/related-businesses/${rawSlug}`,
    lang,
    title,
    description: shortText(desc) || undefined,
    ogImageRaw,
    type: "website",
  });
}

export default function Page() {
  return <RelatedBusinessSlugContent />;
}

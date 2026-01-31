// src/app/newsletters/[id]/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";

import NewsletterDetailContent from "./content";

import { buildPageMetadata, getLang } from "@/utils/server/metadata/buildPageMetadata";
import { getTranslatedText } from "@/i18n/getTranslatedText";
import type { SupportedLanguage } from "@/i18n/languages";
import type { INewsletterAPI } from "@/models/Newsletter";

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

function toText(v: any, lang: SupportedLanguage, fallback = "") {
  const out =
    getTranslatedText(v, lang) ||
    getTranslatedText(v, "en") ||
    String(v ?? "").trim();
  return out || fallback;
}

function pickOgImageFromNewsletter(n?: INewsletterAPI | null): string | undefined {
  if (!n) return undefined;

  // common fields, if you ever add them later:
  const direct =
    (n as any).ogImage ||
    (n as any).image ||
    (n as any).coverImage ||
    (n as any).thumbnail;

  if (direct) return String(direct).trim() || undefined;

  const atts = Array.isArray(n.fileAttachments) ? n.fileAttachments : [];
  // try: first image attachment
  for (const a of atts) {
    const name = String((a as any)?.fileName || "").toLowerCase();
    const url = String((a as any)?.publicUrl || "");
    if (!url) continue;
    if (/\.(png|jpg|jpeg|webp|gif|svg)$/i.test(name) || /\.(png|jpg|jpeg|webp|gif|svg)(\?|#|$)/i.test(url)) {
      return url;
    }
  }

  return undefined;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { lang?: string };
}): Promise<Metadata> {
  const lang = getLang(searchParams);
  const rawId = String(params?.id || "").trim();
  const id = encodeURIComponent(rawId);

  if (!rawId) {
    return buildPageMetadata({
      path: "/newsletters",
      lang,
      fallbackTitle: "Newsletter",
      title: "Newsletter",
      type: "website",
    });
  }

  const origin = getRequestOrigin();

  let title = "Newsletter";
  let desc = "";
  let ogImageRaw: string | undefined;

  try {
    if (origin) {
      // IMPORTANT: match the same API path your site exposes server-side.
      // If your Next API route is /api/newsletters/[id], this is correct:
      const res = await fetch(`${origin}/api/newsletters/${id}`, { cache: "no-store" });

      if (res.ok) {
        const item = (await res.json()) as INewsletterAPI;

        title =
          toText((item as any)?.title, lang, "") ||
          String((item as any)?._id || rawId) ||
          "Newsletter";

        // pick any meaningful text field you have
        desc =
          toText((item as any)?.summary, lang, "") ||
          toText((item as any)?.description, lang, "") ||
          toText((item as any)?.content, lang, "") ||
          "";

        ogImageRaw = pickOgImageFromNewsletter(item);
      }
    }
  } catch {
    // swallow; fallback metadata will be used
  }

  return buildPageMetadata({
    path: `/newsletters/${rawId}`,
    lang,
    title,
    description: shortText(desc) || undefined,
    ogImageRaw,
    type: "article",
  });
}

export default function Page() {
  return <NewsletterDetailContent />;
}

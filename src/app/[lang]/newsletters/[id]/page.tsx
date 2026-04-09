// src/app/[lang]/newsletters/[id]/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import type { Metadata } from "next";

import NewsletterDetailContent from "./content";

import { buildPageMetadataFromRequest } from "@/utils/server/metadata/buildPageMetadata";
import { shortText } from "@/utils/textUtils";
import { getRequestOrigin } from "@/utils/server/requestOrigin";
import { tL } from "@/i18n";
import type { INewsletterAPI } from "@/models/Newsletter";
import NewsletterService from "@/services/NewsletterService";

function pickOgImageFromNewsletter(n?: INewsletterAPI | null): string | undefined {
  if (!n) return undefined;

  const direct =
    (n as any).ogImage ||
    (n as any).image ||
    (n as any).coverImage ||
    (n as any).thumbnail;

  if (direct) return String(direct).trim() || undefined;

  const atts = Array.isArray(n.fileAttachments) ? n.fileAttachments : [];
  for (const a of atts) {
    const name = String((a as any)?.fileName || "").toLowerCase();
    const url = String((a as any)?.publicUrl || "");
    if (!url) continue;

    if (
      /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(name) ||
      /\.(png|jpg|jpeg|webp|gif|svg)(\?|#|$)/i.test(url)
    ) {
      return url;
    }
  }

  return undefined;
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; id: string };
}): Promise<Metadata> {
  const rawId = String(params?.id || "").trim();
  const id = encodeURIComponent(rawId);

  if (!rawId) {
    return buildPageMetadataFromRequest({
      params,
      path: "/newsletters",
      fallbackTitle: "Newsletter",
      title: "Newsletter",
      type: "website",
    });
  }

  const origin = await getRequestOrigin();

  let title = "Newsletter";
  let desc = "";
  let ogImageRaw: string | undefined;

  try {
    if (origin) {
      const res = await fetch(`${origin}/api/newsletters/${id}`, {
        cache: "no-store",
      });

      if (res.ok) {
        const item = (await res.json()) as INewsletterAPI;

        title =
          tL(params.lang as any, (item as any)?.title, "") ||
          String((item as any)?._id || rawId) ||
          "Newsletter";

        desc =
          tL(params.lang as any, (item as any)?.summary, "") ||
          tL(params.lang as any, (item as any)?.description, "") ||
          tL(params.lang as any, (item as any)?.content, "") ||
          "";

        ogImageRaw = pickOgImageFromNewsletter(item);
      }
    }
  } catch {}

  return buildPageMetadataFromRequest({
    params,
    path: `/newsletters/${rawId}`,
    title,
    description: shortText(desc) || undefined,
    ogImageRaw,
    type: "article",
  });
}

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const rawId = String(params?.id || "").trim();
  let initialNewsletter: INewsletterAPI | null = null;

  if (rawId) {
    const newsletterService = new NewsletterService();
    const item = await newsletterService.getNewsletterById(rawId).catch(() => null);
    if (item) {
      initialNewsletter = JSON.parse(JSON.stringify(item)) as INewsletterAPI;
    }
  }

  return <NewsletterDetailContent initialNewsletter={initialNewsletter} />;
}

import React from "react";
import type { Metadata } from "next";

import RelatedBusinessSlugContent from "./content";
import { buildPageMetadataFromRequest } from "@/utils/server/metadata/buildPageMetadata";
import { shortText } from "@/utils/textUtils";
import { getRequestOrigin } from "@/utils/server/requestOrigin";
import { tL } from "@/i18n";
import type { RelatedBusinessAPI } from "@/models/RelatedBusinessModel";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}): Promise<Metadata> {
  const rawSlug = String(params?.slug || "").trim();
  const slug = encodeURIComponent(rawSlug);

  // fallback (shouldn't really happen if route param is present, but safe)
  if (!rawSlug) {
    return buildPageMetadataFromRequest({
      params,
      path: "/related-businesses",
      fallbackTitle: "Related Business",
      title: "Related Business",
    });
  }

  const origin = await getRequestOrigin();

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

        // use params.lang (segment) as the language source
        title = tL(params.lang as any, item?.title, item?.slug || "Related Business");
        desc = tL(params.lang as any, item?.description, "");
        ogImageRaw = String(item?.image || "").trim() || undefined;
      }
    }
  } catch {}

  return buildPageMetadataFromRequest({
    params,
    path: `/related-businesses/${rawSlug}`,
    title,
    description: shortText(desc) || undefined,
    ogImageRaw,
    type: "website",
  });
}

export default function Page() {
  return <RelatedBusinessSlugContent />;
}

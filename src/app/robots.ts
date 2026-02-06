// src/app/robots.ts
import type { MetadataRoute } from "next";
import { getPublicSettings, getSiteUrl } from "@/utils/server/publicSiteSettings";
import { SUPPORTED_LANGS } from "@/i18n/languages";

export const revalidate = 60 * 60;

const AUTH = ["/login", "/signup", "/profile", "/reset-password", "/verify-email"] as const;

const uniq = (xs: string[]) => Array.from(new Set(xs));

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getPublicSettings();
  const base = getSiteUrl(settings).replace(/\/$/, "");

  const baseDisallow = ["/api/", "/dashboard/", ...AUTH];

  const langDisallow = SUPPORTED_LANGS.flatMap((l) => AUTH.map((p) => `/${l}${p}`));

  const disallow = uniq([...baseDisallow, ...langDisallow]);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}

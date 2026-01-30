// src/app/robots.ts
import type { MetadataRoute } from "next";
import { getPublicSettings, getSiteUrl } from "@/utils/server/publicSiteSettings";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getPublicSettings();
  const base = getSiteUrl(settings).replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api",
        "/dashboard",
        "/login",
        "/signup",
        "/forget-password",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}

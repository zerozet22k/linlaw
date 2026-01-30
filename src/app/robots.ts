// src/app/robots.ts
import type { MetadataRoute } from "next";
import { getPublicSettings, getSiteUrl } from "@/utils/server/publicSiteSettings";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getPublicSettings();
  const base = getSiteUrl(settings).replace(/\/$/, "");

  // keep this list aligned with pages you set `noindex: true`
  const privatePaths = [
    "/api",
    "/dashboard",
    "/login",
    "/signup",
    "/profile",
    "/forget-password",
    "/reset-password",
    "/verify-email",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privatePaths,
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}

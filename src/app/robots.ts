// src/app/robots.ts
import type { MetadataRoute } from "next";
import { getPublicSettings, getSiteUrl } from "@/utils/server/publicSiteSettings";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getPublicSettings();
  const base = getSiteUrl(settings).replace(/\/$/, "");

  // keep aligned with `noindex: true` pages
  const privatePaths = [
    "/api/",            // blocks /api/*
    "/dashboard/",      // blocks /dashboard/*
    "/login",
    "/signup",
    "/profile",
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

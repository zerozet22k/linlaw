import type { MetadataRoute } from "next";
import { getPublicSettings, getSiteUrl } from "@/utils/server/publicSiteSettings";

export default async function robots(): Promise<MetadataRoute.Robots> {
    const settings = await getPublicSettings();
    const base = getSiteUrl(settings).replace(/\/$/, "");

    return {
        rules: [
            { userAgent: "*", allow: "/" },
            {
                userAgent: "*",
                disallow: [
                    "/api",
                    "/dashboard",
                    "/login",
                    "/signup",
                    "/forget-password",
                ],
            },
        ],
        sitemap: `${base}/sitemap.xml`,
    };
}

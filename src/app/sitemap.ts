import type { MetadataRoute } from "next";
import { getPublicSettings, getSiteUrl } from "@/utils/server/publicSiteSettings";
import { ROUTES } from "@/config/navigations/routes";

const isIndexablePath = (p: string) => {
    if (!p || !p.startsWith("/")) return false;
    if (p.includes("#")) return false;
    if (p.includes(":")) return false;
    if (p.startsWith("/dashboard")) return false;
    return true;
};

const UNIQUE = <T,>(arr: T[]) => Array.from(new Set(arr));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const settings = await getPublicSettings();
    const base = getSiteUrl(settings).replace(/\/$/, "");
    const now = new Date();

    const paths = UNIQUE(
        Object.values(ROUTES)
            .map((r) => r.path)
            .filter(isIndexablePath)
            .filter((p) => !["/login", "/signup", "/forget-password"].includes(p))
    );

    return paths.map((p) => ({
        url: `${base}${p === "/" ? "/" : p}`,
        lastModified: now,
    }));
}

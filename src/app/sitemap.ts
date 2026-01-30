import type { MetadataRoute } from "next";
import { getPublicSettings, getSiteUrl } from "@/utils/server/publicSiteSettings";
import { ROUTES } from "@/config/navigations/routes";

export const dynamic = "force-dynamic";

const UNIQUE = <T,>(arr: T[]) => Array.from(new Set(arr));

const isIndexablePath = (p: string) => {
  if (!p || !p.startsWith("/")) return false;
  if (p.includes("#")) return false;
  if (p.includes(":")) return false;

  if (p.startsWith("/dashboard")) return false;
  if (p.startsWith("/api")) return false;
  if (p.includes("[") || p.includes("]")) return false;

  return true;
};

const NOINDEX_PATHS = new Set([
  "/login",
  "/signup",
  "/profile",
  "/forget-password",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getPublicSettings();
  const base = getSiteUrl(settings).replace(/\/$/, "");
  const now = new Date();

  const paths = UNIQUE(
    Object.values(ROUTES)
      .map((r) => r.path)
      .filter(isIndexablePath)
      .filter((p) => !NOINDEX_PATHS.has(p))
  );

  return paths.map((p) => ({
    url: `${base}${p === "/" ? "/" : p}`,
    lastModified: now,
  }));
}

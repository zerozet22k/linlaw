import "server-only";

import SettingService from "@/services/SettingService";
import UserService from "@/services/UserService";
import type { SettingsInterface } from "@/config/CMS/settings/settingKeys";
import { GLOBAL_SETTINGS_KEYS } from "@/config/CMS/settings/keys/GLOBAL_SETTINGS_KEYS";
import { SEO_SETTINGS_KEYS } from "@/config/CMS/settings/keys/SEO_SETTINGS_KEYS";

export type PublicSettings = Partial<SettingsInterface>;

export async function getPublicSettings(opts?: { syncRoles?: boolean }) {
  try {
    const settingService = new SettingService();
    const settings = (await settingService.getPublicSettings()) as PublicSettings;

    // Only needed for dashboard/auth flows. Public pages/sitemap/robots don't need this.
    if (opts?.syncRoles) {
      const userService = new UserService();
      await userService.syncRolePermissions(true);
    }

    return settings || {};
  } catch (e) {
    console.error("Failed to fetch settings:", e);
    return {};
  }
}

export function getSiteName(settings: PublicSettings) {
  return (
    settings?.[GLOBAL_SETTINGS_KEYS.SITE_SETTINGS]?.siteName?.trim() ||
    process.env.NEXT_PUBLIC_SITE_NAME?.trim() ||
    "Default Site Name"
  );
}

export function getSiteUrl(settings: PublicSettings) {
  const u =
    settings?.[GLOBAL_SETTINGS_KEYS.SITE_SETTINGS]?.siteUrl?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "https://example.com";

  return u.replace(/\/+$/, "");
}

export function getSeo(settings: PublicSettings) {
  const description =
    settings?.[SEO_SETTINGS_KEYS.SEO_SETTINGS]?.metaDescription?.trim() ||
    "Default description for SEO.";

  const keywords =
    settings?.[SEO_SETTINGS_KEYS.SEO_SETTINGS]?.keywords
      ?.trim()
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) || ["default", "keywords"];

  const ogImageRaw =
    settings?.[SEO_SETTINGS_KEYS.SEO_SETTINGS]?.ogImage?.trim() ||
    process.env.NEXT_PUBLIC_OG_IMAGE?.trim() ||
    "/default-og-image.png";

  return { description, keywords, ogImageRaw };
}

export function toAbsoluteUrl(maybeUrl: string, base: string) {
  const u = (maybeUrl || "").trim();
  if (!u) return u;
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  const b = base.replace(/\/+$/, "");
  if (!u.startsWith("/")) return `${b}/${u}`;
  return `${b}${u}`;
}

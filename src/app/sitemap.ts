// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { getPublicSettings, getSiteUrl } from "@/utils/server/publicSiteSettings";
import { ROUTES } from "@/config/navigations/routes";

import UserService from "@/services/UserService";
import PageService from "@/services/PageService";
import NewsletterService from "@/services/NewsletterService";
import RelatedBusinessService from "@/services/RelatedBusinessService";

import {
  TEAM_PAGE_SETTINGS_KEYS,
  TEAM_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/TEAM_PAGE_SETTINGS";
import { TeamBlock } from "@/models/TeamBlock";

import type { SettingsInterface } from "@/config/CMS/settings/settingKeys";
import { langsFromSettings } from "@/middlewares/langMiddleware";
import { DEFAULT_LANG, type SupportedLanguage } from "@/i18n/languages";

// cache sitemap output
export const revalidate = 60 * 60; // 1 hour

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

const toDateOr = (v: unknown, fallback: Date): Date => {
  if (!v) return fallback;
  const d = new Date(String(v));
  return Number.isNaN(d.getTime()) ? fallback : d;
};

const pfx = (lang: SupportedLanguage, path: string) => {
  const p = (path || "/").startsWith("/") ? path : `/${path}`;
  return p === "/" ? `/${lang}` : `/${lang}${p}`;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = (await getPublicSettings()) as Partial<SettingsInterface>;
  const base = getSiteUrl(settings).replace(/\/$/, "");
  const now = new Date();

  const enabled = langsFromSettings(settings);
  const langs = enabled.length ? enabled : ([DEFAULT_LANG] as SupportedLanguage[]);
  const buildAlternates = (
    path: string
  ): NonNullable<MetadataRoute.Sitemap[number]["alternates"]> => ({
    languages: {
      ...Object.fromEntries(langs.map((lang) => [lang, `${base}${pfx(lang, path)}`])),
      "x-default": `${base}${pfx(DEFAULT_LANG, path)}`,
    },
  });
  const buildEntries = (path: string, lastModified: Date): MetadataRoute.Sitemap =>
    langs.map((lang) => ({
      url: `${base}${pfx(lang, path)}`,
      lastModified,
      alternates: buildAlternates(path),
    }));

  const staticPaths = UNIQUE(
    Object.values(ROUTES)
      .map((r) => r.path)
      .filter(isIndexablePath)
      .filter((p) => !NOINDEX_PATHS.has(p))
  );

  const staticEntries: MetadataRoute.Sitemap = staticPaths.flatMap((p) => buildEntries(p, now));

  const userService = new UserService();
  const pageService = new PageService();
  const newsletterService = new NewsletterService();
  const relatedBusinessService = new RelatedBusinessService();

  const [teamMemberEntries, newsletterEntries, relatedBusinessEntries] =
    await Promise.all([
      (async (): Promise<MetadataRoute.Sitemap> => {
        const sections = (await pageService.getPageByKey(
          TEAM_PAGE_SETTINGS_KEYS.SECTIONS
        )) as
          | TEAM_PAGE_SETTINGS_TYPES[typeof TEAM_PAGE_SETTINGS_KEYS.SECTIONS]
          | null;

        if (!sections) return [];

        const blocks: TeamBlock[] = await userService.getTeamMembersOrdered(sections);

        const lastModBySlug = new Map<string, Date>();

        for (const blk of blocks ?? []) {
          const members = Array.isArray((blk as any)?.members) ? (blk as any).members : [];
          for (const m of members) {
            const username = String(m?.username || "").trim();
            const id = String(m?._id || "").trim();
            const slug = username || id;
            if (!slug) continue;

            const lm = toDateOr(m?.updatedAt ?? m?.createdAt, now);
            const prev = lastModBySlug.get(slug);
            if (!prev || lm > prev) lastModBySlug.set(slug, lm);
          }
        }

        const slugs = Array.from(lastModBySlug.entries());
        return slugs.flatMap(([slug, lastModified]) =>
          buildEntries(`/team-members/${encodeURIComponent(slug)}`, lastModified)
        );
      })(),

      (async (): Promise<MetadataRoute.Sitemap> => {
        const out: MetadataRoute.Sitemap = [];
        const limit = 100;
        let page = 1;
        let guard = 0;

        while (guard++ < 200) {
          const { newsletters, hasMore } =
            await newsletterService.getAllNewsletters("", page, limit);

          const list = Array.isArray(newsletters) ? newsletters : [];
          for (const n of list as any[]) {
            const id = String(n?._id || "").trim();
            if (!id) continue;

            const lastModified = toDateOr(n?.updatedAt ?? n?.createdAt, now);
            out.push(...buildEntries(`/newsletters/${encodeURIComponent(id)}`, lastModified));
          }

          if (!hasMore || list.length === 0) break;
          page += 1;
        }

        return out;
      })(),

      (async (): Promise<MetadataRoute.Sitemap> => {
        const out: MetadataRoute.Sitemap = [];
        const limit = 100;
        let page = 1;
        let guard = 0;

        while (guard++ < 200) {
          const { businesses, hasMore } =
            await relatedBusinessService.getAllBusinesses("", page, limit, [], true);

          const list = Array.isArray(businesses) ? businesses : [];
          for (const b of list as any[]) {
            if (b?.isActive === false) continue;

            const slug = String(b?.slug || "").trim();
            if (!slug) continue;

            const lastModified = toDateOr(b?.updatedAt ?? b?.createdAt, now);
            out.push(...buildEntries(`/related-businesses/${encodeURIComponent(slug)}`, lastModified));
          }

          if (!hasMore || list.length === 0) break;
          page += 1;
        }

        return out;
      })(),
    ]);

  const byUrl = new Map<
    string,
    {
      url: string;
      lastModified: Date;
      alternates?: MetadataRoute.Sitemap[number]["alternates"];
    }
  >();

  const push = (items: MetadataRoute.Sitemap) => {
    for (const it of items) {
      const lm = toDateOr((it as any)?.lastModified, now);
      const prev = byUrl.get(it.url);
      if (!prev || lm > prev.lastModified) {
        byUrl.set(it.url, { url: it.url, lastModified: lm, alternates: it.alternates });
      }
    }
  };

  push(staticEntries);
  push(teamMemberEntries);
  push(newsletterEntries);
  push(relatedBusinessEntries);

  return Array.from(byUrl.values())
    .sort((a, b) => a.url.localeCompare(b.url))
    .map((x) => ({ url: x.url, lastModified: x.lastModified, alternates: x.alternates }));
}

// src/app/layout.tsx
export const dynamic = "force-dynamic";

import React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { headers, cookies } from "next/headers";
import "@/styles/globals.css";

import { SettingsProvider } from "@/providers/SettingsProvider";
import LayoutContent from "./layout-content";

import {
  getPublicSettings,
  getSeo,
  getSiteFavicon,
  getSiteName,
  getSiteUrl,
  toAbsoluteUrl,
} from "@/utils/server/publicSiteSettings";
import type { SettingsInterface } from "@/config/CMS/settings/settingKeys";

import { DEFAULT_LANG } from "@/i18n/languages";
import { langsFromSettings, langResolve } from "@/middlewares/langMiddleware";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  const siteName = getSiteName(settings);
  const siteUrl = getSiteUrl(settings).replace(/\/$/, "");
  const siteFavicon = getSiteFavicon(settings);
  const faviconUrl = toAbsoluteUrl(siteFavicon, siteUrl);
  const { description, keywords, ogImageRaw } = getSeo(settings);
  const metaTitle =
    settings?.seoSettings?.metaTitle?.trim() || siteName;
  const ogImage = ogImageRaw ? toAbsoluteUrl(ogImageRaw, siteUrl) : undefined;

  return {
    metadataBase: new URL(siteUrl),
    applicationName: siteName,
    title: { default: metaTitle, template: `%s | ${siteName}` },
    description,
    keywords,
    icons: {
      icon: [{ url: faviconUrl }],
      shortcut: [{ url: faviconUrl }],
    },
    openGraph: {
      title: metaTitle,
      description,
      url: siteUrl,
      siteName,
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: metaTitle,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const settings = (await getPublicSettings()) as Partial<SettingsInterface>;

  const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim();

  const h = await headers();
  const c = await cookies();

  const cookieLang = (c.get("language")?.value || "").trim();
  const requested = (h.get("x-lang-requested") || cookieLang || DEFAULT_LANG).trim();

  const enabled = langsFromSettings(settings);
  const htmlLang = langResolve(requested, enabled);

  return (
    <html lang={htmlLang}>
      <head>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { anonymize_ip: true });
              `}
            </Script>
          </>
        )}
      </head>

      <body style={{ margin: 0, padding: 0, width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <AntdRegistry>
          <SettingsProvider settings={settings}>
            <LayoutContent>{children}</LayoutContent>
          </SettingsProvider>
        </AntdRegistry>
        <Analytics />
      </body>
    </html>
  );
}

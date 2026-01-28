export const dynamic = "force-dynamic";

import "antd/dist/antd.css";
import React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

import { SettingsProvider } from "@/providers/SettingsProvider";
import LayoutContent from "./layout-content";
import { getPublicSettings, getSiteName, getSiteUrl, getSeo, toAbsoluteUrl } from "@/utils/server/publicSiteSettings";


export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();

  const siteName = getSiteName(settings);
  const siteUrl = getSiteUrl(settings);
  const { description, keywords, ogImageRaw } = getSeo(settings);
  const ogImage = toAbsoluteUrl(ogImageRaw, siteUrl);

  return {
    metadataBase: new URL(siteUrl),
    alternates: { canonical: siteUrl },
    title: siteName,
    description,
    keywords,

    openGraph: {
      title: siteName,
      description,
      images: [{ url: ogImage }],
      type: "website",
      url: siteUrl,
    },

    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      images: [ogImage],
    },
  };
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getPublicSettings({ syncRoles: true });

  const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim();

  return (
    <html lang="en">
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
        <SettingsProvider settings={settings}>
          <LayoutContent>{children}</LayoutContent>
        </SettingsProvider>

        <Analytics />
      </body>
    </html>
  );
}

// src/app/page.tsx
export const dynamic = "force-dynamic";

import React from "react";
import type { Metadata } from "next";
import HomePageContent from "./content";

import {
  HOME_PAGE_SETTINGS_KEYS,
  type HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";

import { getPageSettings } from "@/utils/server/pageSettings";
import { valuesOf } from "@/utils/typed";
import type { SectionProps } from "@/config/CMS/fields/SECTION_SETTINGS";

import {
  getPublicSettings,
  getSiteName,
  getSiteUrl,
  getSeo,
  toAbsoluteUrl,
} from "@/utils/server/publicSiteSettings";

const defaultSection: SectionProps = { enabled: false };

const defaults: HOME_PAGE_SETTINGS_TYPES = {
  [HOME_PAGE_SETTINGS_KEYS.HERO_BANNER]: [],

  [HOME_PAGE_SETTINGS_KEYS.PROMO_SHOWCASE]: {
    section: defaultSection,
    items: [],
  },

  [HOME_PAGE_SETTINGS_KEYS.RELATED_BUSINESS]: {
    section: defaultSection,
  },

  [HOME_PAGE_SETTINGS_KEYS.SERVICES_SECTION]: {
    section: defaultSection,
    items: [],
  },

  [HOME_PAGE_SETTINGS_KEYS.ABOUT_US_SECTION]: {
    section: defaultSection,
    lead: undefined,
    panel: undefined,
    stats: [],
    ctas: [],
    pillars: [],
  },

  [HOME_PAGE_SETTINGS_KEYS.FAQS_SECTION]: {
    section: defaultSection,
    items: [],
  },

  [HOME_PAGE_SETTINGS_KEYS.NEWSLETTER_SECTION]: {
    section: defaultSection,
  },

  [HOME_PAGE_SETTINGS_KEYS.TESTIMONIALS_SECTION]: {
    section: defaultSection,
    items: [],
  },
};

async function loadData() {
  return getPageSettings({
    keys: valuesOf(HOME_PAGE_SETTINGS_KEYS),
    defaults,
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();

  const siteName = getSiteName(settings);
  const siteUrl = getSiteUrl(settings).replace(/\/$/, "");
  const { description, keywords, ogImageRaw } = getSeo(settings);

  const ogImage = ogImageRaw ? toAbsoluteUrl(ogImageRaw, siteUrl) : undefined;
  const canonical = `${siteUrl}/`;

  return {
    title: { absolute: siteName },
    description,
    keywords,
    alternates: { canonical },

    openGraph: {
      title: siteName,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "website",
      url: canonical,
    },

    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: siteName,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}


const HomePage = async () => {
  const data = await loadData();
  return <HomePageContent data={data} />;
};

export default HomePage;

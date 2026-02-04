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
  buildPageMetadataFromRequest,
  type LangSearchParams,
} from "@/utils/server/metadata/buildPageMetadata";

import { getPublicRelatedBusinesses } from "@/utils/server/publicRelatedBusinesses";
import type { RelatedBusinessAPI } from "@/models/RelatedBusinessModel";

import { getPublicNewsletters } from "@/utils/server/publicNewsletters";
import type { INewsletterAPI } from "@/models/Newsletter";

const defaultSection: SectionProps = { enabled: false };

const defaults: HOME_PAGE_SETTINGS_TYPES = {
  [HOME_PAGE_SETTINGS_KEYS.HERO_BANNER]: [],
  [HOME_PAGE_SETTINGS_KEYS.PROMO_SHOWCASE]: { section: defaultSection, items: [] },
  [HOME_PAGE_SETTINGS_KEYS.RELATED_BUSINESS]: { section: defaultSection },
  [HOME_PAGE_SETTINGS_KEYS.SERVICES_SECTION]: { section: defaultSection, items: [] },
  [HOME_PAGE_SETTINGS_KEYS.ABOUT_US_SECTION]: {
    section: defaultSection,
    lead: undefined,
    panel: undefined,
    stats: [],
    ctas: [],
    pillars: [],
  },
  [HOME_PAGE_SETTINGS_KEYS.FAQS_SECTION]: { section: defaultSection, items: [] },
  [HOME_PAGE_SETTINGS_KEYS.NEWSLETTER_SECTION]: { section: defaultSection },
  [HOME_PAGE_SETTINGS_KEYS.TESTIMONIALS_SECTION]: { section: defaultSection, items: [] },
};

async function loadData() {
  return getPageSettings({
    keys: valuesOf(HOME_PAGE_SETTINGS_KEYS),
    defaults,
  });
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: LangSearchParams;
}): Promise<Metadata> {
  const base = await buildPageMetadataFromRequest({
    searchParams,
    path: "/",
    preferFallbackTitle: true,
  });

  const siteTitle =
    typeof base.openGraph?.title === "string" ? base.openGraph.title : undefined;

  return {
    ...base,
    title: { absolute: siteTitle || "Home" },
  };
}

const HomePage = async () => {
  const data = await loadData();

  const relatedBusinesses: RelatedBusinessAPI[] = await getPublicRelatedBusinesses({
    limit: 6,
    fetchLimit: 50,
    includeInactive: false,
  });

  const newsletters: INewsletterAPI[] = await getPublicNewsletters({
    limit: 6,
    search: "",
  });

  return (
    <HomePageContent
      data={data}
      relatedBusinesses={relatedBusinesses}
      newsletters={newsletters}
    />
  );
};

export default HomePage;

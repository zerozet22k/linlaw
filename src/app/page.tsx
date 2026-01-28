// src/app/page.tsx
export const dynamic = "force-dynamic";

import React from "react";
import HomePageContent from "./content";

import {
  HOME_PAGE_SETTINGS_KEYS,
  type HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";

import { getPageSettings } from "@/utils/server/pageSettings";
import { valuesOf } from "@/utils/typed";
import type { SectionProps } from "@/config/CMS/fields/SECTION_SETTINGS";

const defaultSection: SectionProps = { enabled: false };

const HomePage = async () => {
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

  const data = await getPageSettings({
    keys: valuesOf(HOME_PAGE_SETTINGS_KEYS),
    defaults,
  });

  return <HomePageContent data={data} />;
};

export default HomePage;

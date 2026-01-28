/* NEWSLETTER_PAGE_SETTINGS */
export const dynamic = "force-dynamic";

import React from "react";
import NewsletterContent from "./content";

import {
  NEWSLETTER_PAGE_SETTINGS_KEYS,
  type NEWSLETTER_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/NEWSLETTER_PAGE_SETTINGS";

import { getPageSettings } from "@/utils/server/pageSettings";
import { valuesOf } from "@/utils/typed";

const NewsletterPage = async () => {
  const defaults: NEWSLETTER_PAGE_SETTINGS_TYPES = {
    [NEWSLETTER_PAGE_SETTINGS_KEYS.SECTIONS]: {
      maxNewslettersCount: 50,
    },
  };

  const data = await getPageSettings({
    keys: valuesOf(NEWSLETTER_PAGE_SETTINGS_KEYS),
    defaults,
  });

  return <NewsletterContent data={data} />;
};

export default NewsletterPage;

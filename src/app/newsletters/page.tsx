/* NEWSLETTER_PAGE_SETTINGS */
export const dynamic = "force-dynamic";

import React from "react";
import type { Metadata } from "next";
import NewsletterContent from "./content";

import {
  NEWSLETTER_PAGE_SETTINGS_KEYS,
  type NEWSLETTER_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/NEWSLETTER_PAGE_SETTINGS";

import { getPageSettings } from "@/utils/server/pageSettings";
import { valuesOf } from "@/utils/typed";
import { buildPageMetadata, getLang } from "@/utils/server/metadata/buildPageMetadata";

const defaults: NEWSLETTER_PAGE_SETTINGS_TYPES = {
  [NEWSLETTER_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: undefined,
  [NEWSLETTER_PAGE_SETTINGS_KEYS.SECTIONS]: {
    maxNewslettersCount: 50,
  },
};

async function loadData() {
  return getPageSettings({
    keys: valuesOf(NEWSLETTER_PAGE_SETTINGS_KEYS),
    defaults,
  });
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { lang?: string };
}): Promise<Metadata> {
  const data = await loadData();
  const lang = getLang(searchParams);

  return buildPageMetadata({
    path: "/newsletters",
    lang,
    pageContent: data[NEWSLETTER_PAGE_SETTINGS_KEYS.PAGE_CONTENT],
  });
}


const NewsletterPage = async () => {
  const data = await loadData();
  return <NewsletterContent data={data} />;
};

export default NewsletterPage;

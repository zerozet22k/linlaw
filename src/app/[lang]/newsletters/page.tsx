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
import { buildPageMetadataFromRequest } from "@/utils/server/metadata/buildPageMetadata";
import NewsletterService from "@/services/NewsletterService";
import type { INewsletterAPI } from "@/models/Newsletter";

const defaults: NEWSLETTER_PAGE_SETTINGS_TYPES = {
  [NEWSLETTER_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: undefined,
  [NEWSLETTER_PAGE_SETTINGS_KEYS.SECTIONS]: {
    maxNewslettersCount: 50,
  },
};

async function loadData() {
  const data = await getPageSettings({
    keys: valuesOf(NEWSLETTER_PAGE_SETTINGS_KEYS),
    defaults,
  });

  const limit = Math.max(
    1,
    Number(data[NEWSLETTER_PAGE_SETTINGS_KEYS.SECTIONS]?.maxNewslettersCount ?? 6)
  );

  const newsletterService = new NewsletterService();
  const { newsletters, hasMore } = await newsletterService.getAllNewsletters("", 1, limit);

  return {
    data,
    initialNewsletters: JSON.parse(JSON.stringify(newsletters ?? [])) as INewsletterAPI[],
    initialHasMore: hasMore,
  };
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const { data } = await loadData();

  return buildPageMetadataFromRequest({
    params,
    path: "/newsletters",
    pageContent: data[NEWSLETTER_PAGE_SETTINGS_KEYS.PAGE_CONTENT],
  });
}

const NewsletterPage = async () => {
  const { data, initialNewsletters, initialHasMore } = await loadData();
  return (
    <NewsletterContent
      data={data}
      initialNewsletters={initialNewsletters}
      initialHasMore={initialHasMore}
    />
  );
};

export default NewsletterPage;

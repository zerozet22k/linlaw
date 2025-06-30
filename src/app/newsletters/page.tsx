export const dynamic = "force-dynamic";

import React from "react";
import NewsletterContent from "./content";
import PageService from "@/services/PageService";
import { NEWSLETTER_PAGE_SETTINGS_KEYS } from "@/config/CMS/pages/keys/NEWSLETTER_PAGE_SETTINGS";
import { newsletterTranslations } from "@/translations"; // ✅ Use merged translations

const getDefaultNewsletterData = () => ({
  [NEWSLETTER_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
    title: newsletterTranslations.title,
    subtitle: newsletterTranslations.subtitle,
    description: newsletterTranslations.description,
    backgroundImage: "https://source.unsplash.com/1600x900/?newsletter",
  },
  [NEWSLETTER_PAGE_SETTINGS_KEYS.SECTIONS]: {
    maxNewslettersCount: 8,
  },
});

const fetchNewsletterData = async () => {
  const pageService = new PageService();
  const fetchedData = await pageService.getPagesByKeys(
    Object.values(NEWSLETTER_PAGE_SETTINGS_KEYS)
  );

  return {
    ...getDefaultNewsletterData(),
    ...fetchedData,
  };
};

const NewsletterPage = async () => {
  const data = await fetchNewsletterData();
  return <NewsletterContent data={data} />;
};

export default NewsletterPage;

export const dynamic = "force-dynamic";
import React from "react";
import NewsletterContent from "./content";
import PageService from "@/services/PageService";
import { NEWSLETTER_PAGE_SETTINGS_KEYS } from "@/config/CMS/pages/keys/NEWSLETTER_PAGE_SETTINGS";
import { newsletterPageTranslations } from "@/translations"; // Import centralized texts

const getDefaultNewsletterData = () => ({
  [NEWSLETTER_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
    title: newsletterPageTranslations.title,
    subtitle: newsletterPageTranslations.subtitle,
    description: newsletterPageTranslations.description,
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
  const defaultData = getDefaultNewsletterData();
  return { ...defaultData, ...fetchedData };
};

const NewsletterPage = async () => {
  const data = await fetchNewsletterData();
  return <NewsletterContent data={data} />;
};

export default NewsletterPage;

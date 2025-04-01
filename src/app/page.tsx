import React from "react";
import HomePageContent from "./content";
import PageService from "@/services/PageService";
import { HOME_PAGE_SETTINGS_KEYS } from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";

// Import our translation objects
import {
  homePageHeroTranslations,
  testimonialTranslations,
  homePageAdTranslations,
  homePageFaqTranslations,
} from "@/translations";

const getDefaultHomePageData = () => ({
  [HOME_PAGE_SETTINGS_KEYS.HERO_BANNER]: [
    {
      images: {
        desktop: "/images/bagan.jpg",
        tablet: "/images/bagan-tablet.jpg",
        mobile: "/images/bagan-mobile.jpg",
      },
      header: homePageHeroTranslations.header,
      description: homePageHeroTranslations.description,
      textAlign: "left",
    },
  ],
  [HOME_PAGE_SETTINGS_KEYS.CONTACT_US]: {
    address: "123 Main Street, Yangon, Myanmar",
    phone: "+95 9 123456789",
    email: "contact@lincolnmyanmar.com",
    mapLink: "https://maps.google.com",
  },
  [HOME_PAGE_SETTINGS_KEYS.TESTIMONIALS]: [
    {
      name: testimonialTranslations.testimonial1.name,
      comment: testimonialTranslations.testimonial1.comment,
    },
  ],
  [HOME_PAGE_SETTINGS_KEYS.ADS]: [
    {
      title: homePageAdTranslations.title,
      subtitle: homePageAdTranslations.subtitle,
      description: homePageAdTranslations.description,
      contacts: [{ name: "Office", number: "+95 9 987654321" }],
      image: "/images/special-offer.jpg",
    },
  ],
  [HOME_PAGE_SETTINGS_KEYS.FAQS]: [
    {
      question: homePageFaqTranslations.faq1.question,
      answer: homePageFaqTranslations.faq1.answer,
    },
    {
      question: homePageFaqTranslations.faq2.question,
      answer: homePageFaqTranslations.faq2.answer,
    },
  ],
});

const fetchHomePageData = async () => {
  const pageService = new PageService();
  const fetchedData = await pageService.getPagesByKeys(
    Object.values(HOME_PAGE_SETTINGS_KEYS)
  );
  const defaultData = getDefaultHomePageData();
  const mergedData = {
    ...defaultData,
    ...fetchedData,
  };

  return mergedData;
};

const HomePage = async () => {
  const data = await fetchHomePageData();
  return <HomePageContent data={data} />;
};

export default HomePage;

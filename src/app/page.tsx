import React from "react";
import HomePageContent from "./content";
import PageService from "@/services/PageService";
import { HOME_PAGE_SETTINGS_KEYS } from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";

// Import our translation objects
import {
  heroTranslations,
  testimonialTranslations,
  adTranslations,
  faqTranslations,
  servicesTranslations,
  aboutUsTranslations,
} from "@/translations";

const getDefaultHomePageData = () => ({
  [HOME_PAGE_SETTINGS_KEYS.HERO_BANNER]: [
    {
      images: {
        desktop: "/images/bagan.jpg",
        tablet: "/images/bagan-tablet.jpg",
        mobile: "/images/bagan-mobile.jpg",
      },
      header: heroTranslations.header,
      description: heroTranslations.description,
      textAlign: "left",
    },
  ],
  [HOME_PAGE_SETTINGS_KEYS.CONTACT_US]: {
    address: "123 Main Street, Yangon, Myanmar",
    phone: "+95 9 123456789",
    email: "contact@lincolnmyanmar.com",
    mapLink: "https://maps.google.com",
  },
  [HOME_PAGE_SETTINGS_KEYS.TESTIMONIALS_SECTION]: testimonialTranslations,
  [HOME_PAGE_SETTINGS_KEYS.FAQS_SECTION]: faqTranslations,
  [HOME_PAGE_SETTINGS_KEYS.SERVICES_SECTION]: servicesTranslations,
  [HOME_PAGE_SETTINGS_KEYS.ABOUT_US_SECTION]: aboutUsTranslations,
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

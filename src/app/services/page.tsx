export const dynamic = "force-dynamic";
import React from "react";
import ServicesContent from "./content";
import PageService from "@/services/PageService";
import { SERVICES_PAGE_SETTINGS_KEYS } from "@/config/CMS/pages/keys/SERVICES_PAGE_SETTINGS";
import { servicesPageTranslations } from "@/translations"; // Import centralized translations

const getDefaultServiceData = () => ({
  [SERVICES_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
    title: servicesPageTranslations.pageContent.title,
    subtitle: servicesPageTranslations.pageContent.subtitle,
    description: servicesPageTranslations.pageContent.description,
    // Other non-localized data remains defined locally:
    backgroundImage: "https://source.unsplash.com/1600x900/?law,justice,legal",
  },
  [SERVICES_PAGE_SETTINGS_KEYS.SECTIONS]: [
    {
      title: servicesPageTranslations.sections[0].title,
      description: servicesPageTranslations.sections[0].description,
      icon: "BankOutlined",
      iconColor: "#1890ff",
    },
  ],
});

const fetchServicesData = async () => {
  const pageService = new PageService();
  const fetchedData = await pageService.getPagesByKeys(
    Object.values(SERVICES_PAGE_SETTINGS_KEYS)
  );

  const defaultData = getDefaultServiceData();
  const mergedData = {
    ...defaultData,
    ...fetchedData,
  };

  return mergedData;
};

const ServicesPage = async () => {
  const data = await fetchServicesData();
  return <ServicesContent data={data} />;
};

export default ServicesPage;

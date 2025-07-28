import React from "react";
import HomePageContent from "./content";
import PageService from "@/services/PageService";
import { HOME_PAGE_SETTINGS_KEYS } from "@/config/CMS/pages/keys/HOME_PAGE_SETTINGS";

const fetchHomePageData = async () => {
  const pageService = new PageService();
  const fetchedData = await pageService.getPagesByKeys(
    Object.values(HOME_PAGE_SETTINGS_KEYS)
  );

  const mergedData = {
    ...fetchedData,
  };

  return mergedData;
};

const HomePage = async () => {
  const data = await fetchHomePageData();
  return <HomePageContent data={data} />;
};

export default HomePage;

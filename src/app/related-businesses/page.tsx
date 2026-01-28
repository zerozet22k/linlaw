/* RELATED_BUSINESSES_PAGE_SETTINGS */
export const dynamic = "force-dynamic";

import React from "react";
import RelatedBusinessesContent from "./content";

import {
  RELATED_BUSINESSES_PAGE_SETTINGS_KEYS,
  type RELATED_BUSINESSES_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/RELATED_BUSINESSES_PAGE_SETTINGS";

import { getPageSettings } from "@/utils/server/pageSettings";
import { valuesOf } from "@/utils/typed";

const RelatedBusinessesPage = async () => {
  const defaults: RELATED_BUSINESSES_PAGE_SETTINGS_TYPES = {
    [RELATED_BUSINESSES_PAGE_SETTINGS_KEYS.SECTIONS]: {
      maxBusinessesCount: 50,
      includeInactive: 0,
    },
  };

  const data = await getPageSettings({
    keys: valuesOf(RELATED_BUSINESSES_PAGE_SETTINGS_KEYS),
    defaults,
  });

  return <RelatedBusinessesContent data={data} />;
};

export default RelatedBusinessesPage;

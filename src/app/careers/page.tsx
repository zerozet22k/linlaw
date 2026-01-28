// app/careers/page.tsx
export const dynamic = "force-dynamic";

import React from "react";
import CareersContent from "./content";

import {
  CAREER_PAGE_SETTINGS_KEYS,
  type CAREER_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/CAREER_PAGE_SETTINGS";

import { getPageSettings } from "@/utils/server/pageSettings";
import { valuesOf } from "@/utils/typed";
const CareersPage = async () => {
  const defaults: CAREER_PAGE_SETTINGS_TYPES = {
    [CAREER_PAGE_SETTINGS_KEYS.JOBS_SECTION]: {
      section: undefined,
      items: [],
    },
  };

  const data = await getPageSettings({
    keys: valuesOf(CAREER_PAGE_SETTINGS_KEYS),
    defaults,
  });

  return <CareersContent data={data} />;
};

export default CareersPage;

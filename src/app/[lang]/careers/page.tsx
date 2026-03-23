export const dynamic = "force-dynamic";
export const revalidate = 0;

import type { Metadata } from "next";
import React from "react";
import CareersContent from "./content";

import {
  CAREER_PAGE_SETTINGS_KEYS,
  type CAREER_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/CAREER_PAGE_SETTINGS";

import { getPageSettings } from "@/utils/server/pageSettings";
import { getPublicCareers } from "@/utils/server/publicCareers";
import { valuesOf } from "@/utils/typed";
import { buildPageMetadataFromRequest } from "@/utils/server/metadata/buildPageMetadata";

const defaults: CAREER_PAGE_SETTINGS_TYPES = {
  [CAREER_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: undefined,
};

async function loadData() {
  const [pageSettings, careers] = await Promise.all([
    getPageSettings({
      keys: valuesOf(CAREER_PAGE_SETTINGS_KEYS),
      defaults,
    }),
    getPublicCareers(),
  ]);

  return { pageSettings, careers };
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const { pageSettings } = await loadData();

  return buildPageMetadataFromRequest({
    params,
    path: "/careers",
    pageContent: pageSettings[CAREER_PAGE_SETTINGS_KEYS.PAGE_CONTENT],
  });
}

const CareersPage = async () => {
  const { pageSettings, careers } = await loadData();

  return (
    <CareersContent
      pageContent={pageSettings[CAREER_PAGE_SETTINGS_KEYS.PAGE_CONTENT]}
      jobs={careers}
    />
  );
};

export default CareersPage;

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
import { valuesOf } from "@/utils/typed";
import { buildPageMetadataFromRequest } from "@/utils/server/metadata/buildPageMetadata";

const defaults: CAREER_PAGE_SETTINGS_TYPES = {
  [CAREER_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: undefined,
  [CAREER_PAGE_SETTINGS_KEYS.JOBS_SECTION]: {
    section: undefined,
    items: [],
  },
};

async function loadData() {
  return getPageSettings({
    keys: valuesOf(CAREER_PAGE_SETTINGS_KEYS),
    defaults,
  });
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const data = await loadData();

  return buildPageMetadataFromRequest({
    params,
    path: "/careers",
    pageContent: data[CAREER_PAGE_SETTINGS_KEYS.PAGE_CONTENT],
  });
}

const CareersPage = async () => {
  const data = await loadData();
  return <CareersContent data={data} />;
};

export default CareersPage;

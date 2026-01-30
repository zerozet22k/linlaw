/* RELATED_BUSINESSES_PAGE_SETTINGS */
export const dynamic = "force-dynamic";

import React from "react";
import type { Metadata } from "next";
import RelatedBusinessesContent from "./content";

import {
  RELATED_BUSINESSES_PAGE_SETTINGS_KEYS,
  type RELATED_BUSINESSES_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/RELATED_BUSINESSES_PAGE_SETTINGS";

import { getPageSettings } from "@/utils/server/pageSettings";
import { valuesOf } from "@/utils/typed";
import { buildPageMetadata } from "@/utils/server/metadata/buildPageMetadata";

const defaults: RELATED_BUSINESSES_PAGE_SETTINGS_TYPES = {
  [RELATED_BUSINESSES_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: undefined,
  [RELATED_BUSINESSES_PAGE_SETTINGS_KEYS.SECTIONS]: {
    maxBusinessesCount: 50,
    includeInactive: 0,
  },
};

async function loadData() {
  return getPageSettings({
    keys: valuesOf(RELATED_BUSINESSES_PAGE_SETTINGS_KEYS),
    defaults,
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await loadData();

  return buildPageMetadata({
    path: "/related-businesses",
    fallbackTitle: "Related Businesses",
    pageContent: data[RELATED_BUSINESSES_PAGE_SETTINGS_KEYS.PAGE_CONTENT],
  });
}

const RelatedBusinessesPage = async () => {
  const data = await loadData();
  return <RelatedBusinessesContent data={data} />;
};

export default RelatedBusinessesPage;

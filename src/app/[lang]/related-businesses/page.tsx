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
import { buildPageMetadataFromRequest } from "@/utils/server/metadata/buildPageMetadata";
import { getPublicRelatedBusinesses } from "@/utils/server/publicRelatedBusinesses";
import type { RelatedBusinessAPI } from "@/models/RelatedBusinessModel";

const defaults: RELATED_BUSINESSES_PAGE_SETTINGS_TYPES = {
  [RELATED_BUSINESSES_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: undefined,
  [RELATED_BUSINESSES_PAGE_SETTINGS_KEYS.SECTIONS]: {
    maxBusinessesCount: 50,
    includeInactive: 0,
  },
};

async function loadData() {
  const data = await getPageSettings({
    keys: valuesOf(RELATED_BUSINESSES_PAGE_SETTINGS_KEYS),
    defaults,
  });

  const sections = data[RELATED_BUSINESSES_PAGE_SETTINGS_KEYS.SECTIONS];
  const limit = Math.max(1, Number(sections?.maxBusinessesCount ?? 50));
  const includeInactive = Number(sections?.includeInactive ?? 0) === 1;

  const initialItems = await getPublicRelatedBusinesses({
    limit,
    fetchLimit: Math.max(limit, 50),
    includeInactive,
  });

  return {
    data,
    initialItems: initialItems as RelatedBusinessAPI[],
  };
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const { data } = await loadData();

  return buildPageMetadataFromRequest({
    params,
    path: "/related-businesses",
    pageContent: data[RELATED_BUSINESSES_PAGE_SETTINGS_KEYS.PAGE_CONTENT],
  });
}

const RelatedBusinessesPage = async () => {
  const { data, initialItems } = await loadData();
  return <RelatedBusinessesContent data={data} initialItems={initialItems} />;
};

export default RelatedBusinessesPage;

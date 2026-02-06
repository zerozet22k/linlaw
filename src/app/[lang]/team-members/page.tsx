export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import type { Metadata } from "next";
import TeamContent from "./content";

import {
  TEAM_PAGE_SETTINGS_KEYS,
  type TEAM_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/TEAM_PAGE_SETTINGS";

import { getPageSettings } from "@/utils/server/pageSettings";
import { valuesOf } from "@/utils/typed";
import { buildPageMetadataFromRequest } from "@/utils/server/metadata/buildPageMetadata";

const defaults: TEAM_PAGE_SETTINGS_TYPES = {
  [TEAM_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: undefined,
  [TEAM_PAGE_SETTINGS_KEYS.SECTIONS]: {
    maxMembersCount: 8,
    teamGroups: [],
  },
};

async function loadData() {
  return getPageSettings({
    keys: valuesOf(TEAM_PAGE_SETTINGS_KEYS),
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
    path: "/team-members",
    pageContent: data[TEAM_PAGE_SETTINGS_KEYS.PAGE_CONTENT],
  });
}

const TeamMembersPage = async () => {
  const data = await loadData();
  return <TeamContent data={data} />;
};

export default TeamMembersPage;

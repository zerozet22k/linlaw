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
import { buildPageMetadata } from "@/utils/server/metadata/buildPageMetadata";

import { cookies } from "next/headers";
import { DEFAULT_LANG, type SupportedLanguage } from "@/i18n/languages";

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

const getLang = (searchParams?: { lang?: string }): SupportedLanguage => {
  const fromQuery = searchParams?.lang;
  const fromCookie = cookies().get("language")?.value;
  return (fromQuery || fromCookie || DEFAULT_LANG) as SupportedLanguage;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { lang?: string };
}): Promise<Metadata> {
  const data = await loadData();
  const lang = getLang(searchParams);

  return buildPageMetadata({
    path: "/team-members",
    lang,
    pageContent: data[TEAM_PAGE_SETTINGS_KEYS.PAGE_CONTENT],
  });
}

const TeamMembersPage = async () => {
  const data = await loadData();
  return <TeamContent data={data} />;
};

export default TeamMembersPage;

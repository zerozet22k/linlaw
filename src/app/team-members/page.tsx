export const dynamic = "force-dynamic";
import React from "react";
import TeamContent from "./content";
import PageService from "@/services/PageService";
import { TEAM_PAGE_SETTINGS_KEYS } from "@/config/CMS/pages/keys/TEAM_PAGE_SETTINGS";
import { teamPageTranslations } from "@/translations";

const getDefaultTeamData = () => ({
  [TEAM_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
    title: teamPageTranslations.title,
    subtitle: teamPageTranslations.subtitle,
    description: teamPageTranslations.description,
    backgroundImage: "https://source.unsplash.com/1600x900/?team,office",
  },
  [TEAM_PAGE_SETTINGS_KEYS.SECTIONS]: {
    maxMembersCount: 8,
    members: [],
  },
});

const fetchTeamData = async () => {
  const pageService = new PageService();
  const fetchedData = await pageService.getPagesByKeys(
    Object.values(TEAM_PAGE_SETTINGS_KEYS)
  );
  const defaultData = getDefaultTeamData();
  const mergedData = {
    ...defaultData,
    ...fetchedData,
  };
  return mergedData;
};

const TeamMembersPage = async () => {
  const data = await fetchTeamData();
  return <TeamContent data={data} />;
};

export default TeamMembersPage;

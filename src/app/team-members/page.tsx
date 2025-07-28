export const dynamic = "force-dynamic";

import React from "react";
import TeamContent from "./content";
import PageService from "@/services/PageService";
import { TEAM_PAGE_SETTINGS_KEYS } from "@/config/CMS/pages/keys/TEAM_PAGE_SETTINGS";

const getDefaultTeamData = () => ({
  [TEAM_PAGE_SETTINGS_KEYS.SECTIONS]: {
    maxMembersCount: 8,
    members: [],
    positionOrder: [],
    intraPositionSort: "manual",
  },
});

const fetchTeamData = async () => {
  const pageService = new PageService();
  const fetchedData = await pageService.getPagesByKeys(
    Object.values(TEAM_PAGE_SETTINGS_KEYS)
  );
  return { ...getDefaultTeamData(), ...fetchedData };
};

const TeamMembersPage = async () => {
  const data = await fetchTeamData();
  return <TeamContent data={data} />;
};

export default TeamMembersPage;

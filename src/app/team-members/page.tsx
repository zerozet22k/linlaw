export const dynamic = "force-dynamic";

import React from "react";
import TeamContent from "./content";

import {
  TEAM_PAGE_SETTINGS_KEYS,
  type TEAM_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/TEAM_PAGE_SETTINGS";

import { getPageSettings } from "@/utils/server/pageSettings";
import { valuesOf } from "@/utils/typed";
const TeamMembersPage = async () => {
  const defaults: TEAM_PAGE_SETTINGS_TYPES = {
    [TEAM_PAGE_SETTINGS_KEYS.SECTIONS]: {
      maxMembersCount: 8,
      teamGroups: [
      ],
    },
  };

  const data = await getPageSettings({
    keys: valuesOf(TEAM_PAGE_SETTINGS_KEYS),
    defaults,
  });

  return <TeamContent data={data} />;
};

export default TeamMembersPage;

// TeamPageSettings.ts
import {
  FormType,
  GeneralConfig,
  NestedFieldType,
  JsonDesign,
} from "../../settings";
import { LanguageJson } from "@/utils/getTranslatedText";
import {
  SHARED_PAGE_CONTENT_FIELDS,
  SHARED_PAGE_DESIGN_FIELDS,
} from "./shared/sharedPageConfig";
import { SharedPageContentType, SharedPageDesignType } from "./shared/sharedPageTypes";

const pageName = "Team";

export const TEAM_PAGE_SETTINGS_KEYS = {
  PAGE_CONTENT: `${pageName}-page-content`,
  DESIGN: `${pageName}-design`,
  SECTIONS: `${pageName}-sections`,
} as const;

export const TEAM_PAGE_SETTINGS: GeneralConfig<typeof TEAM_PAGE_SETTINGS_KEYS> =
  {
    [TEAM_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
      label: "Page Content",
      type: NestedFieldType.JSON,
      design: JsonDesign.PARENT,
      fields: SHARED_PAGE_CONTENT_FIELDS,
    },
    [TEAM_PAGE_SETTINGS_KEYS.DESIGN]: {
      label: "Page Design",
      type: NestedFieldType.JSON,
      design: JsonDesign.PARENT,
      fields: SHARED_PAGE_DESIGN_FIELDS,
    },
    [TEAM_PAGE_SETTINGS_KEYS.SECTIONS]: {
      label: "Sections",
      type: NestedFieldType.JSON,
      design: JsonDesign.PARENT,
      fields: {
        maxMembersCount: {
          label: "Max Team Members Count",
          guide: "Maximum number of team members displayed.",
          formType: FormType.NUMBER,
        },
        memberRole: {
          label: "Member Role",
          guide: "Select the role assigned to team members.",
          formType: FormType.ROLE_SELECTOR,
        },
      },
    },
  };

export type TEAM_PAGE_SETTINGS_TYPES = {
  [TEAM_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: SharedPageContentType;
  [TEAM_PAGE_SETTINGS_KEYS.DESIGN]: SharedPageDesignType;
  [TEAM_PAGE_SETTINGS_KEYS.SECTIONS]: {
    maxMembersCount: number;
    memberRole: string;
  };
};

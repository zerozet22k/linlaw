import {
  FormType,
  GeneralConfig,
  NestedFieldType,
  JsonDesign,
  ArrayDesign,
  ArrayFunctionality,
  ModalBehaviorType,
} from "../../settings";
import {
  SHARED_PAGE_CONTENT_FIELDS,
  SHARED_PAGE_DESIGN_FIELDS,
} from "./shared/sharedPageConfig";
import {
  SharedPageContentType,
  SharedPageDesignType,
} from "./shared/sharedPageTypes";

const pageName = "Team";

/* ─ Keys ─ */
export const TEAM_PAGE_SETTINGS_KEYS = {
  PAGE_CONTENT: `${pageName}-page-content`,
  DESIGN: `${pageName}-design`,
  SECTIONS: `${pageName}-sections`,
} as const;

/* ─ Settings ─ */
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
        label: "Max Team Members (total)",
        guide: "Hard limit across all teams. 0 = no limit.",
        formType: FormType.NUMBER,
      },

      teamGroups: {
        label: "Teams",
        keyLabel: "Team",
        type: NestedFieldType.ARRAY,
        arrayDesign: ArrayDesign.CARD,
        arrayFunctionalities: [ArrayFunctionality.SORTABLE], 
        modalBehavior: { [ModalBehaviorType.OPEN_IN_MODAL]: false, [ModalBehaviorType.ITEM_MODAL]: true },
        fields: {
          teamName: {
            label: "Team Name",
            guide: "E.g. Protax, Lawlin",
            formType: FormType.TEXT,
          },
          members: {
            label: "Members",
            guide: "Pick users for this team (drag = manual order)",
            formType: FormType.USERS_SELECTOR,
          },
          intraSort: {
            label: "Order Within Team",
            guide: "How to sort these members",
            formType: FormType.SELECT,
            options: [
              { label: "Manual (picker order)", value: "manual" },
              { label: "Hire date ↑ (oldest first)", value: "createdAsc" },
              { label: "Hire date ↓ (newest first)", value: "createdDesc" },
            ],
          },
        },
      },
    },
  },
};

/* ─ Types ─ */
export type TEAM_PAGE_SETTINGS_TYPES = {
  [TEAM_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: SharedPageContentType;
  [TEAM_PAGE_SETTINGS_KEYS.DESIGN]: SharedPageDesignType;
  [TEAM_PAGE_SETTINGS_KEYS.SECTIONS]: {
    maxMembersCount?: number;
    teamGroups: Array<{
      teamName: string;
      members: string[];
      intraSort: "manual" | "createdAsc" | "createdDesc";
    }>;
  };
};

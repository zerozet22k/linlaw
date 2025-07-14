import {
  FormType,
  GeneralConfig,
  NestedFieldType,
  JsonDesign,
  ArrayDesign,
  ArrayFunctionality,
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
          label: "Max Team Members",
          guide: "Hard limit after grouping. 0 / empty = no limit.",
          formType: FormType.NUMBER,
        },

        members: {
          label: "Members",
          guide: "Pick users (drag = manual order).",
          formType: FormType.USERS_SELECTOR,
        },

        positionOrder: {
          label: "Position Order",
          keyLabel: "Position",
          type: NestedFieldType.ARRAY,
          arrayDesign: ArrayDesign.FLAT,
          arrayFunctionalities: [ArrayFunctionality.SORTABLE],
          fields: {
            value: {
              label: "Position Title",
              guide: "CEO, CTO, Manager, Intern …",
              formType: FormType.TEXT,
            },
          },
        },

        intraPositionSort: {
          label: "Order Inside Position",
          formType: FormType.SELECT,
          options: [
            { label: "Hire date ↑ (oldest first)", value: "createdAsc" },
            { label: "Hire date ↓ (newest first)", value: "createdDesc" },
            {
              label: "Manual (same order as picker)",
              value: "manual",
            },
          ],
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
    members: string[];
    positionOrder: { value: string }[];
    intraPositionSort: "createdAsc" | "createdDesc" | "manual";
  };
};

import {
    GeneralConfig,
    NestedFieldType,
    JsonDesign,
} from "../../settings";
import { SHARED_PAGE_CONTENT_FIELDS } from "./shared/sharedPageConfig";
import { SharedPageContentType } from "./shared/sharedPageTypes";

const pageName = "careers";

export const CAREER_PAGE_SETTINGS_KEYS = {
    PAGE_CONTENT: `${pageName}-page-content`,
} as const;

export const CAREER_PAGE_SETTINGS: GeneralConfig<typeof CAREER_PAGE_SETTINGS_KEYS> =
{
    [CAREER_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
        label: "Page Content",
        type: NestedFieldType.JSON,
        design: JsonDesign.PARENT,
        fields: SHARED_PAGE_CONTENT_FIELDS,
    },
};

export type CAREER_PAGE_SETTINGS_TYPES = {
    [CAREER_PAGE_SETTINGS_KEYS.PAGE_CONTENT]?: SharedPageContentType;
};

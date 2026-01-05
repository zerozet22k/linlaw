// RELATED_BUSINESSES_PAGE_SETTINGS.ts
import { FormType, GeneralConfig, NestedFieldType, JsonDesign } from "../../settings";

import { SHARED_PAGE_CONTENT_FIELDS } from "./shared/sharedPageConfig";
import { SharedPageContentType } from "./shared/sharedPageTypes";

const pageName = "related-businesses";

export const RELATED_BUSINESSES_PAGE_SETTINGS_KEYS = {
    PAGE_CONTENT: `${pageName}-page-content`,
    SECTIONS: `${pageName}-sections`,
} as const;

export const RELATED_BUSINESSES_PAGE_SETTINGS: GeneralConfig<
    typeof RELATED_BUSINESSES_PAGE_SETTINGS_KEYS
> = {
    [RELATED_BUSINESSES_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
        label: "Page Content",
        type: NestedFieldType.JSON,
        design: JsonDesign.PARENT,
        fields: SHARED_PAGE_CONTENT_FIELDS,
    },

    [RELATED_BUSINESSES_PAGE_SETTINGS_KEYS.SECTIONS]: {
        label: "Sections",
        type: NestedFieldType.JSON,
        design: JsonDesign.PARENT,
        fields: {
            maxBusinessesCount: {
                label: "Max Businesses Count",
                guide: "Maximum number of related businesses displayed on the page.",
                formType: FormType.NUMBER,
            },
            includeInactive: {
                label: "Include Inactive",
                guide: "0 = active only, 1 = include inactive businesses.",
                formType: FormType.NUMBER,
            },
        },
    },
};

export type RELATED_BUSINESSES_PAGE_SETTINGS_TYPES = {
    [RELATED_BUSINESSES_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: SharedPageContentType;
    [RELATED_BUSINESSES_PAGE_SETTINGS_KEYS.SECTIONS]: {
        maxBusinessesCount: number;
        includeInactive: number;
    };
};

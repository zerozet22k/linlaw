// NewsletterPageSettings.ts
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

const pageName = "Newsletter";

export const NEWSLETTER_PAGE_SETTINGS_KEYS = {
  PAGE_CONTENT: `${pageName}-page-content`,
  DESIGN: `${pageName}-design`,
  SECTIONS: `${pageName}-sections`,
} as const;

export const NEWSLETTER_PAGE_SETTINGS: GeneralConfig<
  typeof NEWSLETTER_PAGE_SETTINGS_KEYS
> = {
  [NEWSLETTER_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
    label: "Page Content",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    fields: SHARED_PAGE_CONTENT_FIELDS,
  },
  [NEWSLETTER_PAGE_SETTINGS_KEYS.DESIGN]: {
    label: "Page Design",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    fields: SHARED_PAGE_DESIGN_FIELDS,
  },
  [NEWSLETTER_PAGE_SETTINGS_KEYS.SECTIONS]: {
    label: "Sections",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    fields: {
      maxNewslettersCount: {
        label: "Max Newsletters Count",
        guide: "Maximum number of newsletters displayed on the page.",
        formType: FormType.NUMBER,
      },
    },
  },
};

export type NEWSLETTER_PAGE_SETTINGS_TYPES = {
  [NEWSLETTER_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: SharedPageContentType;
  [NEWSLETTER_PAGE_SETTINGS_KEYS.DESIGN]: SharedPageDesignType;
  [NEWSLETTER_PAGE_SETTINGS_KEYS.SECTIONS]: {
    maxNewslettersCount: number;
  };
};

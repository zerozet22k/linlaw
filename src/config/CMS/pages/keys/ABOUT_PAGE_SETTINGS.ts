// AboutUsPageSettings.ts
import {
  FormType,
  GeneralConfig,
  NestedFieldType,
  JsonDesign,
  ArrayDesign,
  ArrayFunctionality,
  ModalBehaviorType,
} from "../../settings";
import { LanguageJson } from "@/utils/getTranslatedText";
import {
  SHARED_PAGE_CONTENT_FIELDS,
  SHARED_PAGE_DESIGN_FIELDS,
} from "./shared/sharedPageConfig";
import { SharedPageContentType, SharedPageDesignType } from "./shared/sharedPageTypes";

const pageName = "AboutUs";

export const ABOUT_PAGE_SETTINGS_KEYS = {
  PAGE_CONTENT: `${pageName}-page-content`,
  DESIGN: `${pageName}-design`,
  SECTIONS: `${pageName}-sections`,
} as const;

export const ABOUT_PAGE_SETTINGS: GeneralConfig<
  typeof ABOUT_PAGE_SETTINGS_KEYS
> = {
  [ABOUT_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
    label: "Page Content",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    fields: SHARED_PAGE_CONTENT_FIELDS,
  },
  [ABOUT_PAGE_SETTINGS_KEYS.DESIGN]: {
    label: "Page Design",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    fields: SHARED_PAGE_DESIGN_FIELDS,
  },
  [ABOUT_PAGE_SETTINGS_KEYS.SECTIONS]: {
    label: "Sections",
    type: NestedFieldType.ARRAY,
    keyLabel: "Section",
    arrayDesign: ArrayDesign.CARD,
    arrayFunctionalities: [
      ArrayFunctionality.SORTABLE,
      ArrayFunctionality.FILTERABLE,
    ],
    modalBehavior: {
      [ModalBehaviorType.OPEN_IN_MODAL]: false,
      [ModalBehaviorType.ITEM_MODAL]: true,
    },
    fields: {
      title: {
        label: "Section Title",
        guide: "Title for the section.",
        formType: FormType.LANGUAGE_JSON_TEXT,
      },
      description: {
        label: "Section Description",
        guide: "Brief description of the section.",
        formType: FormType.LANGUAGE_JSON_TEXTAREA,
      },
      icon: {
        label: "Icon",
        guide: "Choose an icon for the section.",
        formType: FormType.ICON_SELECTOR,
      },
      image: {
        label: "Image",
        guide: "Optional image for the section.",
        formType: FormType.IMAGE_SELECTOR,
      },
      sm: {
        label: "Small Screen (sm)",
        guide: "Column width for small screens (mobile).",
        formType: FormType.NUMBER,
      },
      md: {
        label: "Medium Screen (md)",
        guide: "Column width for medium screens (tablet).",
        formType: FormType.NUMBER,
      },
      lg: {
        label: "Large Screen (lg)",
        guide: "Column width for large screens (desktop).",
        formType: FormType.NUMBER,
      },
      xl: {
        label: "Extra Large Screen (xl)",
        guide: "Column width for extra-large screens (widescreen).",
        formType: FormType.NUMBER,
      },
    },
  },
};

export type ABOUT_PAGE_SETTINGS_TYPES = {
  [ABOUT_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: SharedPageContentType;
  [ABOUT_PAGE_SETTINGS_KEYS.DESIGN]: SharedPageDesignType;
  [ABOUT_PAGE_SETTINGS_KEYS.SECTIONS]: {
    title: LanguageJson;
    description: LanguageJson;
    icon: string;
    image?: string;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  }[];
};

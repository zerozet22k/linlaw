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

const pageName = "Services";

export const SERVICES_PAGE_SETTINGS_KEYS = {
  PAGE_CONTENT: `${pageName}-page-content`,
  DESIGN: `${pageName}-design`,
  SECTIONS: `${pageName}-sections`,
} as const;

export const SERVICES_PAGE_SETTINGS: GeneralConfig<
  typeof SERVICES_PAGE_SETTINGS_KEYS
> = {
  [SERVICES_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
    label: "Page Content",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    fields: SHARED_PAGE_CONTENT_FIELDS,
  },
  [SERVICES_PAGE_SETTINGS_KEYS.DESIGN]: {
    label: "Page Design",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    fields: SHARED_PAGE_DESIGN_FIELDS,
  },
  [SERVICES_PAGE_SETTINGS_KEYS.SECTIONS]: {
    label: "Sections",
    type: NestedFieldType.ARRAY,
    keyLabel: "Service",
    arrayDesign: ArrayDesign.PARENT,
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
        label: "Service Title",
        guide: "Title for the service.",
        formType: FormType.LANGUAGE_JSON_TEXT,
      },
      description: {
        label: "Service Description",
        guide: "Brief description of the service.",
        formType: FormType.LANGUAGE_JSON_TEXTAREA,
      },
      icon: {
        label: "Service Icon",
        guide: "Select an icon for the service.",
        formType: FormType.ICON_SELECTOR,
      },
      iconColor: {
        label: "Icon Color",
        guide: "Color of the service icon.",
        formType: FormType.COLOR,
      },
      image: {
        label: "Service Image",
        guide: "Optional image for the service.",
        formType: FormType.IMAGE_SELECTOR,
      },
    },
  },
};

export type SERVICES_PAGE_SETTINGS_TYPES = {
  [SERVICES_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: SharedPageContentType;
  [SERVICES_PAGE_SETTINGS_KEYS.DESIGN]: SharedPageDesignType;
  [SERVICES_PAGE_SETTINGS_KEYS.SECTIONS]: {
    title: LanguageJson;
    description: LanguageJson;
    icon: string;
    iconColor: string;
    image?: string;
  }[];
};

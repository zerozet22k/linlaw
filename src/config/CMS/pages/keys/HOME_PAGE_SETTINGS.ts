// config/CMS/pages/keys/HOME_PAGE_SETTINGS.ts
import {
  FormType, GeneralConfig, NestedFieldType, JsonDesign, ArrayDesign,
  ArrayFunctionality, ModalBehaviorType, TextAlign, ChildArrayDesign, ResponsiveImagesType,
  TEXT_ALIGN_OPTIONS,
} from "../../settings";
import { LanguageJson } from "@/utils/getTranslatedText";
import { SECTION, SectionProps } from "../../fields/SECTION_SETTINGS";

const pageName = "home";

export const HOME_PAGE_SETTINGS_KEYS = {
  HERO_BANNER: `${pageName}-hero-banner`,
  RELATED_BUSINESS: `${pageName}-related-business`,
  SERVICES_SECTION: `${pageName}-services-section`,
  ABOUT_US_SECTION: `${pageName}-about-us-section`,
  FAQS_SECTION: `${pageName}-faqs-section`,
  NEWSLETTER_SECTION: `${pageName}-newsletter-section`,
  TESTIMONIALS_SECTION: `${pageName}-testimonials-section`,
} as const;

export const HOME_PAGE_SETTINGS: GeneralConfig<typeof HOME_PAGE_SETTINGS_KEYS> = {
  [HOME_PAGE_SETTINGS_KEYS.HERO_BANNER]: {
    label: "Hero Banners",
    type: NestedFieldType.ARRAY,
    keyLabel: "Banner",
    arrayDesign: ArrayDesign.PARENT,
    arrayFunctionalities: [ArrayFunctionality.SORTABLE, ArrayFunctionality.FILTERABLE],
    childArrayDesign: ChildArrayDesign.TABLE,
    modalBehavior: {
      [ModalBehaviorType.OPEN_IN_MODAL]: false,
      [ModalBehaviorType.ITEM_MODAL]: true,
    },
    fields: {
      images: { label: "Banner Images", guide: "Images for desktop/tablet/mobile.", formType: FormType.RESPONSIVE_IMAGES },
      header: { label: "Banner Header", guide: "Main headline text for this banner.", formType: FormType.LANGUAGE_JSON_TEXT },
      description: { label: "Banner Description", guide: "Optional description text for this banner.", formType: FormType.LANGUAGE_JSON_TEXTAREA },
      textAlign: {
        label: "Text Alignment",
        guide: "Position the text (left or right).",
        formType: FormType.SELECT,
        options: TEXT_ALIGN_OPTIONS,
      },
    },
  },


  [HOME_PAGE_SETTINGS_KEYS.RELATED_BUSINESS]: {
    label: "Related Businesses",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    fields: {
      section: SECTION,
    },
  },

  [HOME_PAGE_SETTINGS_KEYS.SERVICES_SECTION]: {
    label: "Services Section",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,

    fields: {
      section: SECTION,
      items: {
        label: "Service Items",
        type: NestedFieldType.ARRAY,
        keyLabel: "Service",
        arrayDesign: ArrayDesign.FLAT_OUTSIDE,
        arrayFunctionalities: [ArrayFunctionality.SORTABLE, ArrayFunctionality.FILTERABLE],
        modalBehavior: { [ModalBehaviorType.OPEN_IN_MODAL]: false, [ModalBehaviorType.ITEM_MODAL]: true },
        fields: {
          title: { label: "Service Title", formType: FormType.LANGUAGE_JSON_TEXT },
          description: { label: "Service Description", formType: FormType.LANGUAGE_JSON_TEXTAREA },
          icon: { label: "Service Icon", formType: FormType.ICON_SELECTOR },
          iconColor: { label: "Icon Color", formType: FormType.COLOR },
        },
      },
    },
  },

  [HOME_PAGE_SETTINGS_KEYS.ABOUT_US_SECTION]: {
    label: "About Us Section",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    fields: {
      section: SECTION,
      items: {
        label: "About Us Blocks",
        type: NestedFieldType.ARRAY,
        keyLabel: "About Block",
        arrayDesign: ArrayDesign.FLAT_OUTSIDE,
        arrayFunctionalities: [ArrayFunctionality.SORTABLE, ArrayFunctionality.FILTERABLE],
        modalBehavior: { [ModalBehaviorType.OPEN_IN_MODAL]: false, [ModalBehaviorType.ITEM_MODAL]: true },
        fields: {
          title: { label: "Block Title", formType: FormType.LANGUAGE_JSON_TEXT },
          description: { label: "Block Description", formType: FormType.LANGUAGE_JSON_TEXTAREA },
          icon: { label: "Icon", formType: FormType.ICON_SELECTOR },
        },
      },
    },
  },

  [HOME_PAGE_SETTINGS_KEYS.FAQS_SECTION]: {
    label: "FAQ Section",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    fields: {
      section: SECTION,
      items: {
        label: "FAQs List",
        type: NestedFieldType.ARRAY,
        keyLabel: "FAQ",
        arrayDesign: ArrayDesign.FLAT_OUTSIDE,
        arrayFunctionalities: [ArrayFunctionality.SORTABLE, ArrayFunctionality.FILTERABLE],
        modalBehavior: { [ModalBehaviorType.OPEN_IN_MODAL]: false, [ModalBehaviorType.ITEM_MODAL]: true },
        fields: {
          question: { label: "Question", formType: FormType.LANGUAGE_JSON_TEXT },
          answer: { label: "Answer", formType: FormType.LANGUAGE_JSON_TEXTAREA },
          list: {
            label: "Extra Perks List (optional)",
            type: NestedFieldType.ARRAY,
            keyLabel: "Perk",
            arrayDesign: ArrayDesign.FLAT_OUTSIDE,
            arrayFunctionalities: [ArrayFunctionality.SORTABLE, ArrayFunctionality.FILTERABLE],
            modalBehavior: { [ModalBehaviorType.OPEN_IN_MODAL]: false, [ModalBehaviorType.ITEM_MODAL]: false },
            fields: {
              answer: { label: "Perk Text", formType: FormType.LANGUAGE_JSON_TEXTAREA },
            },
          },
        },
      },
    },
  },


  [HOME_PAGE_SETTINGS_KEYS.NEWSLETTER_SECTION]: {
    label: "Newsletter Section",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    fields: {
      section: SECTION,
    },
  },
  [HOME_PAGE_SETTINGS_KEYS.TESTIMONIALS_SECTION]: {
    label: "Testimonials Section",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    fields: {
      section: SECTION,
      items: {
        label: "Testimonial Entries",
        type: NestedFieldType.ARRAY,
        keyLabel: "Testimonial",
        arrayDesign: ArrayDesign.FLAT_OUTSIDE,
        arrayFunctionalities: [ArrayFunctionality.SORTABLE, ArrayFunctionality.FILTERABLE],
        modalBehavior: { [ModalBehaviorType.OPEN_IN_MODAL]: false, [ModalBehaviorType.ITEM_MODAL]: true },
        fields: {
          name: { label: "Name", formType: FormType.LANGUAGE_JSON_TEXT },
          comment: { label: "Comment", formType: FormType.LANGUAGE_JSON_TEXTAREA },
          title: { label: "Job Title", formType: FormType.TEXT },
          company: { label: "Company", formType: FormType.TEXT },
          avatar: { label: "Avatar Image", formType: FormType.IMAGE_SELECTOR },
        },
      },
    },
  },

};

export type HOME_PAGE_SETTINGS_TYPES = {
  [HOME_PAGE_SETTINGS_KEYS.HERO_BANNER]: {
    images: ResponsiveImagesType;
    header: LanguageJson;
    description: LanguageJson;
    textAlign: TextAlign;
  }[];

  [HOME_PAGE_SETTINGS_KEYS.RELATED_BUSINESS]: {
    section?: SectionProps;
  };[HOME_PAGE_SETTINGS_KEYS.SERVICES_SECTION]: {
    section?: SectionProps;
    items: {
      title: LanguageJson;
      description: LanguageJson;
      icon: string;
      iconColor: string;
    }[];
  };

  [HOME_PAGE_SETTINGS_KEYS.ABOUT_US_SECTION]: {
    section?: SectionProps;
    items: {
      title: LanguageJson;
      description: LanguageJson;
      icon: string;
    }[];
  };

  [HOME_PAGE_SETTINGS_KEYS.FAQS_SECTION]: {
    section?: SectionProps;
    items: {
      question: LanguageJson;
      answer: LanguageJson;
      list: { answer: LanguageJson }[];
    }[];
  };

  [HOME_PAGE_SETTINGS_KEYS.NEWSLETTER_SECTION]: {
    section?: SectionProps;
  };
  [HOME_PAGE_SETTINGS_KEYS.TESTIMONIALS_SECTION]: {
    section?: SectionProps;
    items: {
      name: LanguageJson;
      comment: LanguageJson;
      title: string;
      company: string;
      avatar: string;
    }[];
  };
};

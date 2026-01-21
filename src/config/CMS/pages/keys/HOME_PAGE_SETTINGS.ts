// config/CMS/pages/keys/HOME_PAGE_SETTINGS.ts
import {
  FormType,
  GeneralConfig,
  NestedFieldType,
  JsonDesign,
  ArrayDesign,
  ArrayFunctionality,
  ModalBehaviorType,
  TextAlign,
  ChildArrayDesign,
  ResponsiveImagesType,
  TEXT_ALIGN_OPTIONS,

  // generalized options (from your settings file)
  HORIZONTAL_SIDE_OPTIONS,
  FLOW_DIRECTION_OPTIONS,
  BUTTON_VARIANT_OPTIONS,
  LINK_TARGET_OPTIONS,
  OVERLAY_OPACITY_GUIDE,

  // strongly-typed values
  HorizontalSideValue,
  FlowDirectionValue,
  ButtonVariantValue,
  LinkTargetModeValue,
} from "../../settings";

import { LanguageJson } from "@/utils/getTranslatedText";
import { SECTION, SectionProps } from "../../fields/SECTION_SETTINGS";

const pageName = "home";

export const HOME_PAGE_SETTINGS_KEYS = {
  HERO_BANNER: `${pageName}-hero-banner`,
  PROMO_SHOWCASE: `${pageName}-promo-showcase`,
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
      images: {
        label: "Banner Images",
        guide: "Images for desktop/tablet/mobile.",
        formType: FormType.RESPONSIVE_IMAGES,
      },
      header: {
        label: "Banner Header",
        guide: "Main headline text for this banner.",
        formType: FormType.LANGUAGE_JSON_TEXT,
      },
      description: {
        label: "Banner Description",
        guide: "Optional description text for this banner.",
        formType: FormType.LANGUAGE_JSON_TEXTAREA,
      },
      textAlign: {
        label: "Text Alignment",
        guide: "Position the text (left / center / right).",
        formType: FormType.SELECT,
        options: TEXT_ALIGN_OPTIONS,
      },
    },
  },

  [HOME_PAGE_SETTINGS_KEYS.PROMO_SHOWCASE]: {
    label: "Promo Showcase",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    slots: { extra: ["section"], body: ["items"] },
    fields: {
      section: SECTION,
      items: {
        label: "Items",
        type: NestedFieldType.ARRAY,
        keyLabel: "Highlight",
        arrayDesign: ArrayDesign.FLAT_OUTSIDE,
        arrayFunctionalities: [ArrayFunctionality.SORTABLE],
        modalBehavior: {
          [ModalBehaviorType.OPEN_IN_MODAL]: false,
          [ModalBehaviorType.ITEM_MODAL]: true,
        },
        fields: {
          image: {
            label: "Background Image",
            guide: "Image shown on the image side.",
            formType: FormType.IMAGE_SELECTOR,
          },
          imageTitle: {
            label: "Image Headline",
            guide: "Large title shown on the image (optional).",
            formType: FormType.TEXT,
          },
          panelTitle: {
            label: "Content Title",
            guide: "Title shown in the panel (optional).",
            formType: FormType.TEXT,
          },
          panelText: {
            label: "Content Description",
            guide: "Short description shown in the panel (optional).",
            formType: FormType.TEXTAREA,
          },

          // ===== New promo controls (generic options) =====
          imageSide: {
            label: "Image Side",
            guide: "Auto alternates by row; Left/Right forces the side.",
            formType: FormType.SELECT,
            options: HORIZONTAL_SIDE_OPTIONS as any,
          },

          overlayDirection: {
            label: "Overlay Direction",
            guide: "Auto follows image side; or force LTR/RTL.",
            formType: FormType.SELECT,
            options: FLOW_DIRECTION_OPTIONS as any,
          },
          overlayOpacity: {
            label: "Overlay Opacity",
            guide: OVERLAY_OPACITY_GUIDE,
            formType: FormType.NUMBER,
          },

          accentColor: {
            label: "Accent Color",
            guide: "Bars + accents (optional).",
            formType: FormType.COLOR,
          },

          panelBg: {
            label: "Panel Background",
            guide: 'Color "#0b0b0b" or CSS gradient "linear-gradient(...)" (optional).',
            formType: FormType.TEXT,
          },
          panelTextColor: {
            label: "Panel Text Color",
            guide: "Optional (title + body).",
            formType: FormType.COLOR,
          },
          panelAlign: {
            label: "Panel Text Align",
            guide: "Left / Center / Right (optional).",
            formType: FormType.SELECT,
            options: TEXT_ALIGN_OPTIONS as any,
          },

          minHeightDesktop: {
            label: "Min Height (Desktop)",
            guide: "px number. Example: 360",
            formType: FormType.NUMBER,
          },
          minHeightMobile: {
            label: "Min Height (Mobile)",
            guide: "px number. Example: 240",
            formType: FormType.NUMBER,
          },

          link: {
            label: "Button Link",
            guide: "Where the button takes the user (URL or page path).",
            formType: FormType.TEXT,
          },
          buttonText: {
            label: "Button Label",
            guide: "Text shown on the button.",
            formType: FormType.TEXT,
          },
          buttonVariant: {
            label: "Button Variant",
            guide: "Primary / Default / Dashed / Link / Text (optional).",
            formType: FormType.SELECT,
            options: BUTTON_VARIANT_OPTIONS as any,
          },
          linkTarget: {
            label: "Open Link",
            guide: "Same tab / New tab (optional).",
            formType: FormType.SELECT,
            options: LINK_TARGET_OPTIONS as any,
          },
        },
      },
    },
  },

  [HOME_PAGE_SETTINGS_KEYS.RELATED_BUSINESS]: {
    label: "Related Businesses",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    slots: { extra: ["section"] },
    fields: {
      section: SECTION,
    },
  },

  [HOME_PAGE_SETTINGS_KEYS.SERVICES_SECTION]: {
    label: "Services Section",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    slots: { extra: ["section"], body: ["items"] },
    fields: {
      section: SECTION,
      items: {
        label: "Items",
        type: NestedFieldType.ARRAY,
        keyLabel: "Service",
        arrayDesign: ArrayDesign.FLAT_OUTSIDE,
        arrayFunctionalities: [ArrayFunctionality.SORTABLE, ArrayFunctionality.FILTERABLE],
        modalBehavior: {
          [ModalBehaviorType.OPEN_IN_MODAL]: false,
          [ModalBehaviorType.ITEM_MODAL]: true,
        },
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
    slots: { extra: ["section"], body: ["lead", "panel", "stats", "ctas", "pillars"] },
    fields: {
      section: SECTION,

      lead: {
        label: "Lead (Top Left Card)",
        type: NestedFieldType.JSON,
        design: JsonDesign.FLAT,
        fields: {
          title: { label: "Title", formType: FormType.LANGUAGE_JSON_TEXT },
          subtitle: { label: "Subtitle", formType: FormType.LANGUAGE_JSON_TEXT },
          description: { label: "Description", formType: FormType.LANGUAGE_JSON_TEXTAREA },
          icon: { label: "Icon", formType: FormType.ICON_SELECTOR },
          iconColor: { label: "Icon Color", formType: FormType.COLOR },
        },
      },

      panel: {
        label: "Right Panel (Top Right Card)",
        type: NestedFieldType.JSON,
        design: JsonDesign.FLAT,
        fields: {
          title: { label: "Title", formType: FormType.LANGUAGE_JSON_TEXT },
          description: { label: "Description", formType: FormType.LANGUAGE_JSON_TEXTAREA },
          panelBgImage: { label: "Background Image", formType: FormType.IMAGE_SELECTOR },
          panelAccentColor: { label: "Accent Color", formType: FormType.COLOR },
        },
      },

      stats: {
        label: "Stats (Up to 3)",
        type: NestedFieldType.ARRAY,
        keyLabel: "Stat",
        arrayDesign: ArrayDesign.FLAT_OUTSIDE,
        arrayFunctionalities: [ArrayFunctionality.SORTABLE],
        modalBehavior: {
          [ModalBehaviorType.OPEN_IN_MODAL]: false,
          [ModalBehaviorType.ITEM_MODAL]: true,
        },
        fields: {
          statValue: { label: "Value", guide: 'Example: "10+ years"', formType: FormType.TEXT },
          statLabel: { label: "Label", formType: FormType.LANGUAGE_JSON_TEXT },
        },
      },

      ctas: {
        label: "Buttons (Up to 3)",
        type: NestedFieldType.ARRAY,
        keyLabel: "Button",
        arrayDesign: ArrayDesign.FLAT_OUTSIDE,
        arrayFunctionalities: [ArrayFunctionality.SORTABLE],
        modalBehavior: {
          [ModalBehaviorType.OPEN_IN_MODAL]: false,
          [ModalBehaviorType.ITEM_MODAL]: true,
        },
        fields: {
          ctaHref: { label: "Link", guide: 'Example: "/contact"', formType: FormType.TEXT },
          ctaText: { label: "Text", formType: FormType.LANGUAGE_JSON_TEXT },
          ctaVariant: {
            label: "Variant",
            formType: FormType.SELECT,
            options: BUTTON_VARIANT_OPTIONS as any,
          },
          linkTarget: {
            label: "Open Link",
            guide: "Same tab / New tab (optional).",
            formType: FormType.SELECT,
            options: LINK_TARGET_OPTIONS as any,
          },
        },
      },

      pillars: {
        label: "Pillars (Cards Below)",
        type: NestedFieldType.ARRAY,
        keyLabel: "Pillar",
        arrayDesign: ArrayDesign.FLAT_OUTSIDE,
        arrayFunctionalities: [ArrayFunctionality.SORTABLE, ArrayFunctionality.FILTERABLE],
        modalBehavior: {
          [ModalBehaviorType.OPEN_IN_MODAL]: false,
          [ModalBehaviorType.ITEM_MODAL]: true,
        },
        fields: {
          title: { label: "Title", formType: FormType.LANGUAGE_JSON_TEXT },
          description: { label: "Description", formType: FormType.LANGUAGE_JSON_TEXTAREA },
          icon: { label: "Icon", formType: FormType.ICON_SELECTOR },
          iconColor: { label: "Icon Color", formType: FormType.COLOR },
        },
      },
    },
  },

  [HOME_PAGE_SETTINGS_KEYS.FAQS_SECTION]: {
    label: "FAQ Section",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    slots: { extra: ["section"], body: ["items"] },
    fields: {
      section: SECTION,
      items: {
        label: "Items",
        type: NestedFieldType.ARRAY,
        keyLabel: "FAQ",
        arrayDesign: ArrayDesign.FLAT_OUTSIDE,
        arrayFunctionalities: [ArrayFunctionality.SORTABLE, ArrayFunctionality.FILTERABLE],
        modalBehavior: {
          [ModalBehaviorType.OPEN_IN_MODAL]: false,
          [ModalBehaviorType.ITEM_MODAL]: true,
        },
        fields: {
          question: { label: "Question", formType: FormType.LANGUAGE_JSON_TEXT },
          answer: { label: "Answer", formType: FormType.LANGUAGE_JSON_TEXTAREA },
          list: {
            label: "Extra Perks List (optional)",
            type: NestedFieldType.ARRAY,
            keyLabel: "Perk",
            arrayDesign: ArrayDesign.FLAT_OUTSIDE,
            arrayFunctionalities: [ArrayFunctionality.SORTABLE, ArrayFunctionality.FILTERABLE],
            modalBehavior: {
              [ModalBehaviorType.OPEN_IN_MODAL]: false,
              [ModalBehaviorType.ITEM_MODAL]: false,
            },
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
    slots: { extra: ["section"] },
    fields: {
      section: SECTION,
    },
  },

  [HOME_PAGE_SETTINGS_KEYS.TESTIMONIALS_SECTION]: {
    label: "Testimonials Section",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    slots: { extra: ["section"], body: ["items"] },
    fields: {
      section: SECTION,
      items: {
        label: "Items",
        type: NestedFieldType.ARRAY,
        keyLabel: "Testimonial",
        arrayDesign: ArrayDesign.FLAT_OUTSIDE,
        arrayFunctionalities: [ArrayFunctionality.SORTABLE, ArrayFunctionality.FILTERABLE],
        modalBehavior: {
          [ModalBehaviorType.OPEN_IN_MODAL]: false,
          [ModalBehaviorType.ITEM_MODAL]: true,
        },
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

  [HOME_PAGE_SETTINGS_KEYS.PROMO_SHOWCASE]: {
    section?: SectionProps;
    items: {
      image: string;
      imageTitle?: string;
      panelTitle?: string;
      panelText?: string;

      imageSide?: HorizontalSideValue;
      overlayDirection?: FlowDirectionValue;
      overlayOpacity?: number;

      accentColor?: string;

      panelBg?: string;
      panelTextColor?: string;
      panelAlign?: TextAlign;

      minHeightDesktop?: number;
      minHeightMobile?: number;

      link?: string;
      buttonText?: string;
      buttonVariant?: ButtonVariantValue;
      linkTarget?: LinkTargetModeValue;
    }[];
  };

  [HOME_PAGE_SETTINGS_KEYS.RELATED_BUSINESS]: {
    section?: SectionProps;
  };

  [HOME_PAGE_SETTINGS_KEYS.SERVICES_SECTION]: {
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

    lead?: {
      title?: LanguageJson;
      subtitle?: LanguageJson;
      description?: LanguageJson;
      icon?: string;
      iconColor?: string;
    };

    panel?: {
      title?: LanguageJson;
      description?: LanguageJson;
      panelBgImage?: string;
      panelAccentColor?: string;
    };

    stats?: {
      statValue?: string;
      statLabel?: LanguageJson;
    }[];

    ctas?: {
      ctaHref?: string;
      ctaText?: LanguageJson;
      ctaVariant?: ButtonVariantValue;
      linkTarget?: LinkTargetModeValue;
    }[];

    pillars?: {
      title?: LanguageJson;
      description?: LanguageJson;
      icon?: string;
      iconColor?: string;
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

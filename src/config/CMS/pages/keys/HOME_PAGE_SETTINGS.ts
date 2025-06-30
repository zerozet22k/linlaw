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
} from "../../settings";
import { LanguageJson } from "@/utils/getTranslatedText";

const pageName = "Home";

export const HOME_PAGE_SETTINGS_KEYS = {
  HERO_BANNER: `${pageName}-hero-banner`,
  CONTACT_US: `${pageName}-contact-us`,
  TESTIMONIALS_SECTION: `${pageName}-testimonials-section`,
  ADS: `${pageName}-ads`,
  FAQS_SECTION: `${pageName}-faqs-section`,
  CARDS: `${pageName}-cards`,
  SERVICES_SECTION: `${pageName}-services-section`,
  ABOUT_US_SECTION: `${pageName}-about-us-section`,
} as const;

export const HOME_PAGE_SETTINGS: GeneralConfig<typeof HOME_PAGE_SETTINGS_KEYS> =
  {
    [HOME_PAGE_SETTINGS_KEYS.HERO_BANNER]: {
      label: "Hero Banners",
      type: NestedFieldType.ARRAY,
      keyLabel: "Banner",
      arrayDesign: ArrayDesign.PARENT,
      arrayFunctionalities: [
        ArrayFunctionality.SORTABLE,
        ArrayFunctionality.FILTERABLE,
      ],
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
          guide: "Position the text (left or right).",
          formType: FormType.SELECT,
          options: [
            { label: "Left", value: "left" },
            { label: "Right", value: "right" },
          ],
        },
      },
    },

    [HOME_PAGE_SETTINGS_KEYS.CONTACT_US]: {
      label: "Contact Us Information",
      type: NestedFieldType.JSON,
      design: JsonDesign.PARENT,
      visibility: "public",
      fields: {
        address: {
          label: "Contact Address",
          guide: "The physical address for contact.",
          formType: FormType.TEXT,
        },
        phone: {
          label: "Contact Phone",
          guide: "The phone number for contact.",
          formType: FormType.TEXT,
        },
        email: {
          label: "Contact Email",
          guide: "The email address for contact.",
          formType: FormType.TEXT,
        },
        mapLink: {
          label: "Google Maps Link",
          guide: "Embed link for the Google Maps location.",
          formType: FormType.TEXT,
        },
      },
    },

    [HOME_PAGE_SETTINGS_KEYS.TESTIMONIALS_SECTION]: {
      label: "Testimonials Section",
      type: NestedFieldType.JSON,
      design: JsonDesign.PARENT,
      fields: {
        title: {
          label: "Testimonials Section Title",
          guide: "E.g., 'Happy Customers', 'What Our Clients Say'",
          formType: FormType.LANGUAGE_JSON_TEXT,
        },
        description: {
          label: "Testimonials Description",
          guide: "Optional subtitle shown under the title.",
          formType: FormType.LANGUAGE_JSON_TEXTAREA,
        },
        testimonials: {
          label: "Testimonial Entries",
          type: NestedFieldType.ARRAY,
          keyLabel: "Testimonial",
          arrayDesign: ArrayDesign.FLAT_OUTSIDE,
          arrayFunctionalities: [
            ArrayFunctionality.SORTABLE,
            ArrayFunctionality.FILTERABLE,
          ],
          modalBehavior: {
            [ModalBehaviorType.OPEN_IN_MODAL]: false,
            [ModalBehaviorType.ITEM_MODAL]: true,
          },
          fields: {
            name: {
              label: "Name",
              guide: "The name of the person providing the testimonial.",
              formType: FormType.LANGUAGE_JSON_TEXT,
            },
            comment: {
              label: "Comment",
              guide: "The testimonial comment.",
              formType: FormType.LANGUAGE_JSON_TEXTAREA,
            },
            title: {
              label: "Job Title",
              guide: "E.g., Owner, CEO, Manager",
              formType: FormType.TEXT,
            },
            company: {
              label: "Company Name",
              guide: "E.g., Ford, Acme Inc.",
              formType: FormType.TEXT,
            },
            avatar: {
              label: "Avatar Image",
              guide: "Photo of the customer",
              formType: FormType.IMAGE_SELECTOR,
            },
          },
        },
      },
    },

    [HOME_PAGE_SETTINGS_KEYS.ADS]: {
      label: "Homepage Ads",
      type: NestedFieldType.ARRAY,
      keyLabel: "Ad",
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
        image: {
          label: "Ad Image",
          guide: "Image for the advertisement.",
          formType: FormType.IMAGE_SELECTOR,
        },
        title: {
          label: "Ad Title",
          guide: "Title of the advertisement.",
          formType: FormType.LANGUAGE_JSON_TEXT,
        },
        subtitle: {
          label: "Ad Subtitle",
          guide: "Subtitle of the advertisement.",
          formType: FormType.LANGUAGE_JSON_TEXT,
        },
        description: {
          label: "Ad Description",
          guide: "Description of the advertisement.",
          formType: FormType.LANGUAGE_JSON_TEXT,
        },
        contacts: {
          label: "Contact Numbers",
          type: NestedFieldType.ARRAY,
          keyLabel: "Contact",
          arrayDesign: ArrayDesign.FLAT_OUTSIDE,
          arrayFunctionalities: [ArrayFunctionality.SORTABLE],
          fields: {
            name: {
              label: "Contact Name",
              guide: "Name of the contact for the ad.",
              formType: FormType.TEXT,
            },
            number: {
              label: "Phone Number",
              guide: "Phone number for the ad contact.",
              formType: FormType.TEXT,
            },
          },
        },
      },
    },

    [HOME_PAGE_SETTINGS_KEYS.CARDS]: {
      label: "Info Cards",
      type: NestedFieldType.ARRAY,
      keyLabel: "Card",
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
          label: "Card Title",
          guide: "Title for the information card.",
          formType: FormType.LANGUAGE_JSON_TEXT,
        },
        description: {
          label: "Card Description",
          guide: "Short description for the information card.",
          formType: FormType.LANGUAGE_JSON_TEXTAREA,
        },
        images: {
          label: "Card Images",
          type: NestedFieldType.ARRAY,
          keyLabel: "Image",
          arrayDesign: ArrayDesign.FLAT_OUTSIDE,
          fields: {
            imageUrl: {
              label: "Image URL",
              guide: "Image Url for the image",
              formType: FormType.IMAGE_SELECTOR,
            },
          },
        },
      },
    },
    [HOME_PAGE_SETTINGS_KEYS.FAQS_SECTION]: {
      label: "FAQ Section",
      type: NestedFieldType.JSON,
      design: JsonDesign.PARENT,
      fields: {
        title: {
          label: "FAQ Section Title",
          guide: "The main title text for the FAQ section.",
          formType: FormType.LANGUAGE_JSON_TEXT,
        },
        description: {
          label: "FAQ Section Description",
          guide: "A short description under the FAQ title.",
          formType: FormType.LANGUAGE_JSON_TEXTAREA,
        },
        backgroundImage: {
          label: "Background Image",
          guide: "The background image for the FAQ section.",
          formType: FormType.IMAGE_SELECTOR,
        },
        items: {
          label: "FAQs List",
          type: NestedFieldType.ARRAY,
          keyLabel: "FAQ",
          arrayDesign: ArrayDesign.FLAT_OUTSIDE,
          arrayFunctionalities: [
            ArrayFunctionality.SORTABLE,
            ArrayFunctionality.FILTERABLE,
          ],
          modalBehavior: {
            [ModalBehaviorType.OPEN_IN_MODAL]: false,
            [ModalBehaviorType.ITEM_MODAL]: true,
          },
          fields: {
            question: {
              label: "Question",
              guide: "The frequently asked question shown to users.",
              formType: FormType.LANGUAGE_JSON_TEXT,
            },
            answer: {
              label: "Answer",
              guide: "The response displayed when question is clicked.",
              formType: FormType.LANGUAGE_JSON_TEXTAREA,
            },
            list: {
              label: "Extra Perks List (optional)",
              type: NestedFieldType.ARRAY,
              keyLabel: "Perk",
              arrayDesign: ArrayDesign.FLAT_OUTSIDE,
              arrayFunctionalities: [
                ArrayFunctionality.SORTABLE,
                ArrayFunctionality.FILTERABLE,
              ],
              modalBehavior: {
                [ModalBehaviorType.OPEN_IN_MODAL]: false,
                [ModalBehaviorType.ITEM_MODAL]: false,
              },
              fields: {
                answer: {
                  label: "Perk Text",
                  guide: "Additional points related to this FAQ item.",
                  formType: FormType.LANGUAGE_JSON_TEXTAREA,
                },
              },
            },
          },
        },
      },
    },

    [HOME_PAGE_SETTINGS_KEYS.SERVICES_SECTION]: {
      label: "Services Section",
      type: NestedFieldType.JSON,
      design: JsonDesign.PARENT,
      fields: {
        title: {
          label: "Services Section Title",
          guide: "E.g., 'Our Legal Services'",
          formType: FormType.LANGUAGE_JSON_TEXT,
        },
        description: {
          label: "Services Section Description",
          guide: "Optional description under the title.",
          formType: FormType.LANGUAGE_JSON_TEXTAREA,
        },
        items: {
          label: "Service Items",
          type: NestedFieldType.ARRAY,
          keyLabel: "Service",
          arrayDesign: ArrayDesign.FLAT_OUTSIDE,
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
              guide: "Ant-Design icon name (e.g., BankOutlined).",
              formType: FormType.ICON_SELECTOR,
            },
            iconColor: {
              label: "Icon Color",
              guide: "Color of the icon.",
              formType: FormType.COLOR,
            },
          },
        },
      },
    },

    [HOME_PAGE_SETTINGS_KEYS.ABOUT_US_SECTION]: {
      label: "About Us Section",
      type: NestedFieldType.JSON,
      design: JsonDesign.PARENT,
      fields: {
        title: {
          label: "About Us Title",
          guide: "E.g., 'About Our Firm'",
          formType: FormType.LANGUAGE_JSON_TEXT,
        },
        description: {
          label: "About Us Description",
          guide: "Optional subtitle or intro for this section.",
          formType: FormType.LANGUAGE_JSON_TEXTAREA,
        },
        items: {
          label: "About Us Blocks",
          type: NestedFieldType.ARRAY,
          keyLabel: "About Block",
          arrayDesign: ArrayDesign.FLAT_OUTSIDE,
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
              label: "Block Title",
              guide: "Title of this about section block.",
              formType: FormType.LANGUAGE_JSON_TEXT,
            },
            description: {
              label: "Block Description",
              guide: "Description of this about section block.",
              formType: FormType.LANGUAGE_JSON_TEXTAREA,
            },
            icon: {
              label: "Icon",
              guide: "Ant Design icon name, e.g., UserOutlined",
              formType: FormType.ICON_SELECTOR,
            },
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

  [HOME_PAGE_SETTINGS_KEYS.CONTACT_US]: {
    address: string;
    phone: string;
    email: string;
    mapLink: string;
  };

  [HOME_PAGE_SETTINGS_KEYS.TESTIMONIALS_SECTION]: {
    title: LanguageJson;
    description?: LanguageJson;
    testimonials: {
      name: LanguageJson;
      comment: LanguageJson;
      title: string;
      company: string;
      avatar: string;
    }[];
  };

  [HOME_PAGE_SETTINGS_KEYS.ADS]: {
    title: LanguageJson;
    subtitle: LanguageJson;
    description: LanguageJson;
    contacts: {
      name: string;
      number: string;
    }[];
    image: string;
  }[];
  [HOME_PAGE_SETTINGS_KEYS.SERVICES_SECTION]: {
    title: LanguageJson;
    description?: LanguageJson;
    items: {
      title: LanguageJson;
      description: LanguageJson;
      icon: string;
      iconColor: string;
    }[];
  };

  [HOME_PAGE_SETTINGS_KEYS.ABOUT_US_SECTION]: {
    title: LanguageJson;
    description?: LanguageJson;
    items: {
      title: LanguageJson;
      description: LanguageJson;
      icon: string;
    }[];
  };

  [HOME_PAGE_SETTINGS_KEYS.FAQS_SECTION]: {
    title: LanguageJson;
    description: LanguageJson;
    backgroundImage: string;
    items: {
      question: LanguageJson;
      answer: LanguageJson;
      list: {
        answer: LanguageJson;
      }[];
    }[];
  };

  [HOME_PAGE_SETTINGS_KEYS.CARDS]: {
    title: LanguageJson;
    description: LanguageJson;
    images: {
      imageUrl: string;
    }[];
  }[];
};

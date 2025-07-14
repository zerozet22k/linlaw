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
  RELATED_BUSINESS: `${pageName}-related-business`,
  FAQS_SECTION: `${pageName}-faqs-section`,
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
    [HOME_PAGE_SETTINGS_KEYS.RELATED_BUSINESS]: {
      label: "Related Businesses",
      keyLabel: "Business",
      type: NestedFieldType.ARRAY,
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
          label: "Banner Image",
          guide:
            "Main display image for the business (e.g., storefront, logo, banner).",
          formType: FormType.IMAGE_SELECTOR,
        },
        title: {
          label: "Business Name",
          guide: "Name of the business or brand.",
          formType: FormType.LANGUAGE_JSON_TEXT,
        },
        subtitle: {
          label: "Short Tagline",
          guide: "Catchy subtitle or motto (1–2 lines max).",
          formType: FormType.LANGUAGE_JSON_TEXT,
        },
        description: {
          label: "Business Description",
          guide:
            "Short paragraph describing this business. Avoid excessive text.",
          formType: FormType.LANGUAGE_JSON_TEXT,
        },
        website: {
          label: "Website Link (Optional)",
          guide: "Link to the official website, if available.",
          formType: FormType.TEXT,
        },
        address: {
          label: "Address",
          guide: "Physical address of the business.",
          formType: FormType.TEXTAREA,
        },
        email: {
          label: "Contact Email",
          guide: "Email address for enquiries.",
          formType: FormType.TEXT,
        },
        mapLink: {
          label: "Google Maps Link",
          guide: "Embed or shareable map link.",
          formType: FormType.TEXT,
        },
        operatingHours: {
          label: "Operating Hours",
          keyLabel: "Day",
          type: NestedFieldType.ARRAY,
          arrayDesign: ArrayDesign.FLAT_OUTSIDE,
          fields: {
            day: {
              label: "Day of Week",
              formType: FormType.SELECT,
              options: [
                { label: "Monday", value: "Monday" },
                { label: "Tuesday", value: "Tuesday" },
                { label: "Wednesday", value: "Wednesday" },
                { label: "Thursday", value: "Thursday" },
                { label: "Friday", value: "Friday" },
                { label: "Saturday", value: "Saturday" },
                { label: "Sunday", value: "Sunday" },
              ],
            },
            open: {
              label: "Opens At",
              formType: FormType.TEXT,
            },
            close: {
              label: "Closes At",
              formType: FormType.TEXT,
            },
          },
        },
        contacts: {
          label: "Contact Numbers",
          keyLabel: "Contact",
          type: NestedFieldType.ARRAY,
          arrayDesign: ArrayDesign.FLAT_OUTSIDE,
          arrayFunctionalities: [ArrayFunctionality.SORTABLE],
          fields: {
            name: {
              label: "Contact Name",
              guide: "Person or role (e.g., Manager, Receptionist).",
              formType: FormType.TEXT,
            },
            number: {
              label: "Phone Number",
              guide: "Direct phone number to reach this contact.",
              formType: FormType.TEXT,
            },
          },
        },
        tags: {
          label: "Tags / Categories",
          guide: "Add keywords like 'Legal', 'Accounting', 'Real Estate', etc.",
          type: NestedFieldType.ARRAY,
          keyLabel: "Tag",
          arrayDesign: ArrayDesign.FLAT_OUTSIDE,
          fields: {
            value: {
              label: "Tag Name",
              guide: "Short label for category or tag.",
              formType: FormType.TEXT,
            },
          },
        },
        socialLinks: {
          label: "Social Links",
          keyLabel: "Link",
          type: NestedFieldType.ARRAY,
          arrayDesign: ArrayDesign.FLAT_OUTSIDE,
          fields: {
            platform: {
              label: "Platform",
              formType: FormType.SELECT,
              options: [
                { label: "Facebook", value: "facebook" },
                { label: "Instagram", value: "instagram" },
                { label: "Twitter", value: "twitter" },
                { label: "LinkedIn", value: "linkedin" },
              ],
            },
            url: {
              label: "URL",
              formType: FormType.TEXT,
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

  [HOME_PAGE_SETTINGS_KEYS.RELATED_BUSINESS]: {
    title: LanguageJson;
    subtitle?: LanguageJson;
    description?: LanguageJson;
    image: string;
    website?: string;
    address?: string;
    email?: string;
    mapLink?: string;
    operatingHours?: { day: string; open: string; close: string }[];
    socialLinks?: { platform: string; url: string }[];
    contacts: { name: string; number: string }[];
    tags?: { value: string }[];
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

};

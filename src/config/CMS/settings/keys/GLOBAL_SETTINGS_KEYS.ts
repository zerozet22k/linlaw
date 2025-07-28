  import {
    FormType,
    NestedFieldType,
    JsonDesign,
    GeneralConfig,
    ArrayDesign,
  } from "..";

  export const WEEK_DAYS = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ] as const;
  export type DayOfWeek = (typeof WEEK_DAYS)[number];

  export const GLOBAL_SETTINGS_KEYS = {
    SITE_SETTINGS: "siteSettings",
    BUSINESS_INFO: "businessInfo",
  } as const;

  export const GLOBAL_SETTINGS: GeneralConfig<typeof GLOBAL_SETTINGS_KEYS> = {
    [GLOBAL_SETTINGS_KEYS.SITE_SETTINGS]: {
      label: "Site Settings",
      visibility: "public",
      type: NestedFieldType.JSON,
      design: JsonDesign.PARENT,
      fields: {
        siteName: { label: "Site Name", formType: FormType.TEXT },
        siteUrl: { label: "Site URL", formType: FormType.URL },
        siteLogo: { label: "Site Logo", formType: FormType.IMAGE_SELECTOR },
        siteBanner: { label: "Banner", formType: FormType.IMAGE_SELECTOR },
      },
    },

    [GLOBAL_SETTINGS_KEYS.BUSINESS_INFO]: {
      label: "Business Information",
      visibility: "public",
      type: NestedFieldType.JSON,
      design: JsonDesign.PARENT,
      fields: {
        address: { label: "Address", formType: FormType.TEXTAREA },
        mapLink: { label: "Google Map URL", formType: FormType.URL },
        phoneNumber: { label: "Phone", formType: FormType.TEXT },
        email: { label: "Email", formType: FormType.EMAIL },

        openingHours: {
          label: "Opening Hours",
          keyLabel: "Day",
          type: NestedFieldType.ARRAY,
          arrayDesign: ArrayDesign.FLAT_OUTSIDE,
          fields: {
            day: {
              label: "Day",
              formType: FormType.SELECT,
              options: WEEK_DAYS.map((d) => ({ label: d, value: d })),
            },
            opens: { label: "Opens", formType: FormType.TEXT },
            closes: { label: "Closes", formType: FormType.TEXT },
          },
        },
      },
    },
  };

  export type GLOBAL_SETTINGS_TYPES = {
    [GLOBAL_SETTINGS_KEYS.SITE_SETTINGS]: {
      siteName: string;
      siteUrl: string;
      siteLogo?: string;
      siteBanner?: string;
    };

    [GLOBAL_SETTINGS_KEYS.BUSINESS_INFO]: {
      address?: string;
      mapLink?: string;
      phoneNumber?: string;
      email?: string;
      openingHours?: { day: DayOfWeek; opens: string; closes: string }[];
    };
  };

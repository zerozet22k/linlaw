import {
  FormType,
  GeneralConfig,
  NestedFieldType,
  JsonDesign,
  ArrayDesign,
  ArrayFunctionality,
  FieldDesign,
} from "..";

export const MAIL_SETTINGS_KEYS = {
  APP_EMAIL: "appEmail",
  BREVO: "brevo",
} as const;

export const MAIL_SETTINGS: GeneralConfig<typeof MAIL_SETTINGS_KEYS> = {
  [MAIL_SETTINGS_KEYS.APP_EMAIL]: {
    label: "System Email",
    guide: "Enter the system email for receiving notifications.",
    formType: FormType.EMAIL,
    parentDesign: FieldDesign.PARENT,
    visibility: "private",
  },
  [MAIL_SETTINGS_KEYS.BREVO]: {
    label: "Brevo Settings",
    type: NestedFieldType.ARRAY,
    keyLabel: "Brevo Account",
    arrayDesign: ArrayDesign.PARENT,
    arrayFunctionalities: [
      ArrayFunctionality.SORTABLE,
      ArrayFunctionality.FILTERABLE,
    ],
    fields: {
      apiKey: {
        label: "Brevo API Key",
        guide: "Enter your Brevo API key (for REST API calls).",
        formType: FormType.TEXT,
      },
      smtpKey: {
        label: "Brevo SMTP Key",
        guide: "Enter your Brevo SMTP key (for SMTP authentication).",
        formType: FormType.TEXT,
      },
      accountEmail: {
        label: "Account Email",
        guide: "Enter your verified account email for Brevo.",
        formType: FormType.EMAIL,
      },
    },
  },
};

export type MAIL_SETTINGS_TYPES = {
  [MAIL_SETTINGS_KEYS.APP_EMAIL]: string;
  [MAIL_SETTINGS_KEYS.BREVO]: {
    apiKey: string;
    smtpKey: string;
    accountEmail: string;
  }[];
};

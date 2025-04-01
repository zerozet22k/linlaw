import {
  FormType,
  GeneralConfig,
  NestedFieldType,
  JsonDesign,
  JsonFunctionality,
  FieldDesign,
} from "..";

export const MAIL_SETTINGS_KEYS = {
  GMAIL: "gmail",
  OUTLOOK: "outlook",
  SENDGRID: "sendgrid",
  ADMIN_EMAIL: "adminEmail",
  BREVO: "brevo",
  MAILERSEND: "mailersend",
} as const;

export const MAIL_SETTINGS: GeneralConfig<typeof MAIL_SETTINGS_KEYS> = {
  [MAIL_SETTINGS_KEYS.GMAIL]: {
    label: "Gmail Settings",
    type: NestedFieldType.JSON,
    visibility: "private",
    design: JsonDesign.PARENT,
    fields: {
      user: {
        label: "Gmail User",
        guide: "Enter your Gmail email address.",
        formType: FormType.EMAIL,
      },
      password: {
        label: "Gmail Password",
        guide: "Enter your Gmail App Password (not your regular password).",
        formType: FormType.TEXT,
      },
    },
  },
  [MAIL_SETTINGS_KEYS.OUTLOOK]: {
    label: "Outlook Settings",
    type: NestedFieldType.JSON,
    visibility: "private",
    design: JsonDesign.PARENT,
    fields: {
      user: {
        label: "Outlook User",
        guide: "Enter your Outlook email address.",
        formType: FormType.EMAIL,
      },
      password: {
        label: "Outlook Password",
        guide: "Enter your Outlook App Password (not your regular password).",
        formType: FormType.TEXT,
      },
    },
  },
  [MAIL_SETTINGS_KEYS.SENDGRID]: {
    label: "SendGrid Settings",
    type: NestedFieldType.JSON,
    visibility: "private",
    design: JsonDesign.PARENT,
    fields: {
      apiKey: {
        label: "SendGrid API Key",
        guide: "Enter your SendGrid API key.",
        formType: FormType.TEXT,
      },
    },
  },
  [MAIL_SETTINGS_KEYS.ADMIN_EMAIL]: {
    label: "Admin Email",
    guide: "Enter the admin email for receiving notifications.",
    formType: FormType.EMAIL,
    parentDesign: FieldDesign.PARENT,
    visibility: "private",
  },
  [MAIL_SETTINGS_KEYS.BREVO]: {
    label: "Brevo Settings",
    type: NestedFieldType.JSON,
    visibility: "private",
    design: JsonDesign.PARENT,
    fields: {
      apiKey: {
        label: "Brevo API Key",
        guide: "Enter your Brevo API key.",
        formType: FormType.TEXT,
      },
    },
  },
  [MAIL_SETTINGS_KEYS.MAILERSEND]: {
    label: "Mailersend Settings",
    type: NestedFieldType.JSON,
    visibility: "private",
    design: JsonDesign.PARENT,
    fields: {
      apiKey: {
        label: "Mailersend API Key",
        guide: "Enter your Mailersend API key.",
        formType: FormType.TEXT,
      },
    },
  },
};

export type MAIL_SETTINGS_TYPES = {
  [MAIL_SETTINGS_KEYS.GMAIL]: {
    user: string;
    password: string;
  };
  [MAIL_SETTINGS_KEYS.OUTLOOK]: {
    user: string;
    password: string;
  };
  [MAIL_SETTINGS_KEYS.SENDGRID]: {
    apiKey: string;
  };
  [MAIL_SETTINGS_KEYS.ADMIN_EMAIL]: string;
  [MAIL_SETTINGS_KEYS.BREVO]: {
    apiKey: string;
  };
  [MAIL_SETTINGS_KEYS.MAILERSEND]: {
    apiKey: string;
  };
};

import nodemailer, { SendMailOptions } from "nodemailer";
import SettingService from "@/services/SettingService";
import { MAIL_SETTINGS_KEYS } from "@/config/CMS/settings/keys/MAIL_KEYS";
import { SettingsInterface } from "@/config/CMS/settings/settingKeys";

const settingService = new SettingService();

export type BrevoAccount = {
  smtpKey: string;
  smtpUser?: string;
  accountEmail: string;
};

export default class MailService {
  private brevoAccounts: BrevoAccount[] = [];
  private appEmail: string | undefined;
  private initialized: Promise<void>;

  constructor() {
    this.initialized = this.init();
  }

  private async init() {
    try {
      const settings = (await settingService.getAllSettings()) as SettingsInterface;
      this.appEmail = settings[MAIL_SETTINGS_KEYS.APP_EMAIL];
      this.brevoAccounts = (settings[MAIL_SETTINGS_KEYS.BREVO] as BrevoAccount[]) || [];

      if (!this.appEmail) {
        console.error("APP_EMAIL is not configured.");
      }

      if (this.brevoAccounts.length === 0) {
        console.error("No Brevo account configured.");
      }
    } catch (error) {
      console.error("Error initializing mail service:", error);
    }
  }

  private async ensureInitialized() {
    await this.initialized;
  }

  private createTransporter(account: BrevoAccount): nodemailer.Transporter {
    return nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: account.smtpUser || "893d65001@smtp-brevo.com",
        pass: account.smtpKey,
      },
    });
  }

  private async sendWithFallback(
    mailOptions: Omit<SendMailOptions, "from">
  ) {
    await this.ensureInitialized();

    if (!this.brevoAccounts.length) {
      throw new Error("No Brevo account configured.");
    }

    let lastError: unknown;

    for (const account of this.brevoAccounts) {
      try {
        const transporter = this.createTransporter(account);

        return await transporter.sendMail({
          ...mailOptions,
          from: account.accountEmail,
        });
      } catch (error) {
        lastError = error;
        console.error(`Brevo send failed for ${account.accountEmail}:`, error);
      }
    }

    throw lastError || new Error("All Brevo accounts failed to send email.");
  }

  public async receiveMail(
    subject: string,
    text: string,
    attachments?: SendMailOptions["attachments"]
  ) {
    if (!this.appEmail) {
      await this.ensureInitialized();
    }

    if (!this.appEmail) {
      throw new Error("Email configuration is incomplete.");
    }

    return this.sendWithFallback({
      to: this.appEmail,
      subject,
      text,
      attachments,
    });
  }

  public async sendMail(
    to: string | string[],
    subject: string,
    text: string,
    attachments?: SendMailOptions["attachments"]
  ) {
    return this.sendWithFallback({
      to,
      subject,
      text,
      attachments,
    });
  }
}
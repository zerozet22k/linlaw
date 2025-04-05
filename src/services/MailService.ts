import nodemailer, { SendMailOptions } from "nodemailer";
import SettingService from "@/services/SettingService";
import { MAIL_SETTINGS_KEYS } from "@/config/CMS/settings/keys/MAIL_KEYS";
import { SettingsInterface } from "@/config/CMS/settings/settingKeys";

const settingService = new SettingService();

export type BrevoAccount = {
  apiKey: string;
  smtpKey: string;
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
      console.log("Loaded system email:", settings[MAIL_SETTINGS_KEYS.APP_EMAIL]);
      this.appEmail = settings[MAIL_SETTINGS_KEYS.APP_EMAIL];
      this.brevoAccounts = settings[MAIL_SETTINGS_KEYS.BREVO] as BrevoAccount[];
      if (!this.appEmail) {
        console.error("❌ System email (APP_EMAIL) is not configured.");
      }
      if (!this.brevoAccounts || this.brevoAccounts.length === 0) {
        console.error("❌ No Brevo account configured.");
      }
    } catch (error) {
      console.error("❌ Error initializing mail service:", error);
    }
  }

  private async ensureInitialized() {
    await this.initialized;
  }

  private async getBrevoRemainingLimit(account: BrevoAccount): Promise<number> {
    try {
      const response = await fetch("https://api.brevo.com/v3/account", {
        method: "GET",
        headers: {
          accept: "application/json",
          "api-key": account.apiKey,
        },
      });
      const data = await response.json();
      console.log("Brevo account data:", data);
      if (data.plan) {
        const limit = data.plan.limit || 300;
        const used = data.plan.emailsSentToday ?? data.plan.used ?? 0;
        return limit - used;
      }
      return 0;
    } catch (error) {
      console.error("❌ Error fetching Brevo account usage:", error);
      return 0;
    }
  }

  private async selectBrevoAccount(): Promise<BrevoAccount | null> {
    for (const account of this.brevoAccounts) {
      const remaining = await this.getBrevoRemainingLimit(account);
      console.log(`Remaining quota for ${account.accountEmail}:`, remaining);
      if (remaining > 0) {
        return account;
      }
    }
    return null;
  }

  private createTransporter(account: BrevoAccount): nodemailer.Transporter {
    const smtpUser = "893d65001@smtp-brevo.com";
    return nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: account.smtpKey,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  public async receiveMail(
    subject: string,
    text: string,
    attachments?: SendMailOptions["attachments"]
  ) {
    await this.ensureInitialized();
    if (!this.appEmail) {
      throw new Error("❌ Email configuration is incomplete.");
    }
    const account = await this.selectBrevoAccount();
    if (!account) {
      throw new Error("❌ No Brevo account has remaining quota.");
    }
    const transporter = this.createTransporter(account);
    const mailOptions: SendMailOptions = {
      from: account.accountEmail,
      to: this.appEmail,
      subject,
      text,
      attachments,
    };
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Email sent:", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ Error sending email:", error);
      throw error;
    }
  }

  public async sendMail(
    to: string | string[],
    subject: string,
    text: string,
    attachments?: SendMailOptions["attachments"]
  ) {
    await this.ensureInitialized();
    const account = await this.selectBrevoAccount();
    if (!account) {
      throw new Error("❌ No Brevo account has remaining quota.");
    }
    const transporter = this.createTransporter(account);
    const mailOptions: SendMailOptions = {
      from: account.accountEmail,
      to,
      subject,
      text,
      attachments,
    };
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Email sent:", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ Error sending email to", to, ":", error);
      throw error;
    }
  }
}

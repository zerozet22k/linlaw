import { NextResponse } from "next/server";
import MailService from "@/services/MailService";
import UserService from "@/services/UserService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";

const handleSendEmails = async (
  req: Request,
  user: any,
  params: { id: string }
) => {
  try {
    const body = await req.json();
    const { subject, message } = body;

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required." },
        { status: 400 }
      );
    }

    const userService = new UserService();
    const { users } = await userService.getAllUsers();

    const mailService = new MailService();
    const errors: Array<{ email: string; error: string }> = [];

    for (const user of users) {
      try {
        const fullMessage = message;
        await mailService.sendMail(user.email, subject, fullMessage);
      } catch (error: any) {
        errors.push({ email: user.email, error: error.message });
        console.error(`Error sending email to ${user.email}:`, error);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { message: "Emails sent with some errors", errors },
        { status: 207 }
      );
    }

    return NextResponse.json(
      { message: "Emails sent successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending emails:", error);
    return NextResponse.json(
      { error: "Failed to send emails. Please try again later." },
      { status: 500 }
    );
  }
};

export const POST = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, user) => handleSendEmails(req, user, context.params),
    true,
    [APP_PERMISSIONS.ADMIN],
    false
  )(request);

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
    const { subject, message, userIds } = body;
    if (
      !subject ||
      !message ||
      !userIds ||
      !Array.isArray(userIds) ||
      userIds.length === 0
    ) {
      return NextResponse.json(
        { error: "Subject, message, and at least one user ID are required." },
        { status: 400 }
      );
    }

    const userService = new UserService();
    const users = await userService.getUsersByIds(userIds);
    if (!users || users.length === 0) {
      return NextResponse.json({ error: "No users found." }, { status: 404 });
    }

    const mailService = new MailService();
    const results = await Promise.allSettled(
      users.map((u: any) => mailService.sendMail(u.email, subject, message))
    );

    const errors: Array<{ email: string; error: string }> = [];
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        errors.push({
          email: users[index].email,
          error: result.reason?.message || String(result.reason),
        });
        console.error(
          `Error sending email to ${users[index].email}:`,
          result.reason
        );
      }
    });

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

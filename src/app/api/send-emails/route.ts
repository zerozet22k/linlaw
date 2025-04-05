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
    // Parse and validate the request body
    const body = await req.json();
    const { subject, message } = body;

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required." },
        { status: 400 }
      );
    }

    // Retrieve all users from the UserService
    const userService = new UserService();
    const { users } = await userService.getAllUsers();

    // Initialize the MailService
    const mailService = new MailService();

    // Send emails to all users in parallel and capture the results.
    const results = await Promise.allSettled(
      users.map((u: any) => mailService.sendMail(u.email, subject, message))
    );

    // Collect any errors for failed email sends
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

    // If there were any errors, return a 207 (Multi-Status) with the details.
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

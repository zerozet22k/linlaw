// app/api/contact-us/route.ts  (server handler - Next 13/14 app router)

import { NextResponse } from "next/server";
import MailService from "@/services/MailService";

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 min
const MAX_REQUESTS = 5;

export const POST = async (request: Request) => {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const timestamps = rateLimitMap.get(ip) || [];

    const recentTimestamps = timestamps.filter(
      (ts) => now - ts < RATE_LIMIT_WINDOW
    );
    recentTimestamps.push(now);
    rateLimitMap.set(ip, recentTimestamps);

    if (recentTimestamps.length > MAX_REQUESTS) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Parse body
    const body = await request.json();
    const { name = "", phone = "", email, subject, message } = body;

    if (!email || !subject || !message || !name) {
      return NextResponse.json(
        { error: "Name, email, subject and message are required." },
        { status: 400 }
      );
    }

    const mailService = new MailService();

    const fullMessage = [
      `Sender Name : ${name}`,
      `Sender Email: ${email}`,
      `Phone       : ${phone || "N/A"}`,
      "",
      message,
    ].join("\n");

    await mailService.receiveMail(subject, fullMessage);

    return NextResponse.json(
      { message: "Email sent successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
};

import { NextResponse } from "next/server";

import { APP_PERMISSIONS } from "@/config/permissions";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import AdminAnalyticsService from "@/services/AdminAnalyticsService";
import { normalizeAnalyticsRange } from "@/types/adminAnalytics";

const adminAnalyticsService = new AdminAnalyticsService();

async function handleGetAnalytics(request: Request) {
  try {
    const url = new URL(request.url);
    const range = normalizeAnalyticsRange(url.searchParams.get("range"));
    const snapshot = await adminAnalyticsService.getSnapshot(range);

    return NextResponse.json(snapshot);
  } catch (error) {
    console.error("Error loading admin analytics:", error);
    return NextResponse.json(
      { error: "Failed to load analytics." },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware(
    (req) => handleGetAnalytics(req),
    true,
    [APP_PERMISSIONS.VIEW_DASHBOARD]
  )(request);

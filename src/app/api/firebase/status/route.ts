import { NextResponse } from "next/server";

import FirebaseService from "@/ThirdPartyServices/FirebaseService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";

const firebaseService = FirebaseService.getInstance();

async function handleGetStatus() {
  try {
    const ready = await firebaseService.isFirebaseAvailable();
    return NextResponse.json({ ready }, { status: 200 });
  } catch (error) {
    console.error("Firebase status error:", error);
    return NextResponse.json({ ready: false }, { status: 200 });
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware(
    () => handleGetStatus(),
    true,
    [
      APP_PERMISSIONS.ADMIN,
      APP_PERMISSIONS.EDIT_SETTINGS,
      APP_PERMISSIONS.UPLOAD_FILE,
      APP_PERMISSIONS.SYNC_FILES,
      APP_PERMISSIONS.UPLOAD_NEWSLETTER_ATTACHMENT,
    ],
    false
  )(request);

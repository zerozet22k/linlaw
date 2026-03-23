import { NextResponse } from "next/server";
import FirebaseService from "@/ThirdPartyServices/FirebaseService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";

const firebaseService = FirebaseService.getInstance();

const CORS_CONFIG = [
  {
    origin: ["*"],
    responseHeader: ["Content-Type"],
    method: ["GET", "POST", "PUT", "DELETE"],
    maxAgeSeconds: 3600,
  },
];

async function handleSetCors() {
  try {
    await firebaseService.initFirebase();
    const bucket = firebaseService.getBucket();
    await bucket.setCorsConfiguration(CORS_CONFIG);
    const [meta] = await bucket.getMetadata();
    return NextResponse.json(
      { success: true, cors: meta.cors ?? CORS_CONFIG },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("set-cors error:", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

export const POST = async (request: Request) =>
  withAuthMiddleware(
    () => handleSetCors(),
    true,
    [APP_PERMISSIONS.ADMIN]
  )(request);

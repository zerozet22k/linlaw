import { NextResponse } from "next/server";
import FirebaseService from "@/ThirdPartyServices/FirebaseService";
import { extractUserMediaPath } from "@/utils/userMediaUrl";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const firebaseService = FirebaseService.getInstance();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const rawPath = url.searchParams.get("path");
    const filePath = extractUserMediaPath(rawPath);

    if (!filePath) {
      return NextResponse.json({ error: "Invalid media path" }, { status: 400 });
    }

    await firebaseService.initFirebase();
    const file = firebaseService.getBucket().file(filePath);
    const [exists] = await file.exists();

    if (!exists) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    const [metadata] = await file.getMetadata();
    const [buffer] = await file.download();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": metadata.contentType || "application/octet-stream",
        "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Failed to serve user media:", error);
    return NextResponse.json({ error: "Failed to load media" }, { status: 500 });
  }
}

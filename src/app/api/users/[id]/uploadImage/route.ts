import { NextResponse } from "next/server";
import FirebaseService from "@/ThirdPartyServices/FirebaseService";
import UserService from "@/services/UserService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";
import { User } from "@/models/UserModel";

const firebaseService = FirebaseService.getInstance();
const userService = new UserService();

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = new Set(["image/png", "image/jpeg"]);

function parseImageDataUrl(value: unknown): {
  contentType: string;
  buffer: Buffer;
} | null {
  if (typeof value !== "string") return null;

  const match = value.match(/^data:(image\/(?:png|jpeg));base64,([A-Za-z0-9+/=\r\n]+)$/);
  if (!match) return null;

  const contentType = match[1];
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) return null;

  try {
    const buffer = Buffer.from(match[2], "base64");
    if (!buffer.length || buffer.length > MAX_IMAGE_BYTES) return null;
    return { contentType, buffer };
  } catch {
    return null;
  }
}

async function uploadImage(
  request: Request,
  _currentUser: User,
  params: { id: string }
) {
  let uploadedFile: ReturnType<ReturnType<typeof firebaseService.getBucket>["file"]> | null = null;

  try {
    const targetUser = await userService.getUserById(params.id);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    if (type !== "avatar" && type !== "cover") {
      return NextResponse.json(
        { error: "Invalid type. Must be 'avatar' or 'cover'." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsed = parseImageDataUrl(body?.imageDataUrl);
    if (!parsed) {
      return NextResponse.json(
        { error: "Invalid image. Use a PNG/JPEG image up to 5 MB." },
        { status: 400 }
      );
    }

    await firebaseService.initFirebase();
    const bucket = firebaseService.getBucket();

    const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
    const extension = parsed.contentType === "image/png" ? "png" : "jpg";
    const folder = type === "avatar" ? "profile_images" : "cover_images";
    const filePath = `${folder}/${params.id}/${timestamp}.${extension}`;

    const file = bucket.file(filePath);
    uploadedFile = file;

    await file.save(parsed.buffer, {
      resumable: false,
      metadata: {
        contentType: parsed.contentType,
        cacheControl: "public,max-age=31536000,immutable",
      },
    });

    const fieldKey = type === "avatar" ? "avatar" : "cover_image";
    const updatedUser = await userService.updateUser(params.id, {
      [fieldKey]: filePath,
    } as Partial<User>);

    if (!updatedUser) {
      await file.delete({ ignoreNotFound: true }).catch(() => undefined);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        storedPath: filePath,
        imageUrl: `/api/user-media?path=${encodeURIComponent(filePath)}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to upload user image:", error);
    if (uploadedFile) {
      await uploadedFile.delete({ ignoreNotFound: true }).catch(() => undefined);
    }
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

export const POST = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, user) => uploadImage(req, user, context.params),
    true,
    [APP_PERMISSIONS.UPLOAD_FILE, APP_PERMISSIONS.EDIT_USER]
  )(request);

import { NextResponse } from "next/server";

import RelatedBusinessService from "@/services/RelatedBusinessService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS, checkPermission } from "@/config/permissions";
import type { User } from "@/models/UserModel";

const toPlain = (value: unknown) => JSON.parse(JSON.stringify(value));

async function handleGet(
  req: Request,
  { params }: { params: { slug: string } },
  user: User | null
) {
  const service = new RelatedBusinessService();
  const { searchParams } = new URL(req.url);

  const includeInactive =
    !!user &&
    checkPermission(
      user,
      [APP_PERMISSIONS.VIEW_RELATED_BUSINESSES, APP_PERMISSIONS.ADMIN],
      false
    ) &&
    (searchParams.get("includeInactive") === "1" ||
      searchParams.get("includeInactive") === "true");

  const business = await service.getBusinessBySlug(params.slug, includeInactive);
  if (!business) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(toPlain(business));
}

export const GET = async (
  request: Request,
  context: { params: { slug: string } }
) =>
  withAuthMiddleware(
    (req, user) => handleGet(req, context, user),
    false
  )(request);

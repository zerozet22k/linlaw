import { NextResponse } from "next/server";
import { Types } from "mongoose";

import RelatedBusinessService from "@/services/RelatedBusinessService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS, checkPermission } from "@/config/permissions";
import type { User } from "@/models/UserModel";

const toPlain = (value: unknown) => JSON.parse(JSON.stringify(value));

async function handleGet(
  _req: Request,
  { params }: { params: { id: string } },
  user: User | null
) {
  if (!Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const service = new RelatedBusinessService();
  const business = await service.getBusinessById(params.id);

  if (!business) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const canViewInactive =
    !!user &&
    checkPermission(
      user,
      [APP_PERMISSIONS.VIEW_RELATED_BUSINESSES, APP_PERMISSIONS.ADMIN],
      false
    );

  if (!business.isActive && !canViewInactive) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(toPlain(business));
}

async function handlePut(req: Request, { params }: { params: { id: string } }) {
  if (!Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const service = new RelatedBusinessService();
  const body = await req.json();

  try {
    const updated = await service.updateBusiness(params.id, body);
    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(toPlain(updated));
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { message: "Slug already exists" },
        { status: 409 }
      );
    }

    console.error("RelatedBusiness PUT error:", error);
    return NextResponse.json(
      { message: "Failed to update related business" },
      { status: 500 }
    );
  }
}

async function handleDelete(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const service = new RelatedBusinessService();
  const deleted = await service.deleteBusiness(params.id);

  if (!deleted) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export const GET = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, user) => handleGet(req, context, user),
    false
  )(request);

export const PUT = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req) => handlePut(req, context),
    true,
    [APP_PERMISSIONS.EDIT_RELATED_BUSINESS]
  )(request);

export const DELETE = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req) => handleDelete(req, context),
    true,
    [APP_PERMISSIONS.DELETE_RELATED_BUSINESS]
  )(request);

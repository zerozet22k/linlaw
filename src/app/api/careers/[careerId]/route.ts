import { NextResponse } from "next/server";
import { Types } from "mongoose";

import CareerService from "@/services/CareerService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS, checkPermission } from "@/config/permissions";
import type { User } from "@/models/UserModel";

const service = new CareerService();
const toPlain = (value: unknown) => JSON.parse(JSON.stringify(value));

async function handleGet(
  _request: Request,
  params: { careerId: string },
  user: User | null
) {
  if (!Types.ObjectId.isValid(params.careerId)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const career = await service.getCareerById(params.careerId);
  if (!career) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const canViewInactive =
    !!user &&
    checkPermission(user, [APP_PERMISSIONS.VIEW_CAREER, APP_PERMISSIONS.ADMIN], false);

  if (!career.isActive && !canViewInactive) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(toPlain(career));
}

async function handleUpdate(request: Request, params: { careerId: string }) {
  if (!Types.ObjectId.isValid(params.careerId)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const body = await request.json();
  const updated = await service.updateCareer(params.careerId, body);

  if (!updated) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(toPlain(updated));
}

async function handleDelete(_request: Request, params: { careerId: string }) {
  if (!Types.ObjectId.isValid(params.careerId)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const deleted = await service.deleteCareer(params.careerId);
  if (!deleted) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export const GET = async (
  request: Request,
  context: { params: { careerId: string } }
) =>
  withAuthMiddleware(
    (req, user) => handleGet(req, context.params, user),
    false
  )(request);

export const PUT = async (
  request: Request,
  context: { params: { careerId: string } }
) =>
  withAuthMiddleware(
    (req) => handleUpdate(req, context.params),
    true,
    [APP_PERMISSIONS.EDIT_CAREER]
  )(request);

export const DELETE = async (
  request: Request,
  context: { params: { careerId: string } }
) =>
  withAuthMiddleware(
    (req) => handleDelete(req, context.params),
    true,
    [APP_PERMISSIONS.DELETE_CAREER]
  )(request);

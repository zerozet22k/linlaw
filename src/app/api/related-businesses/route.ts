import { NextResponse } from "next/server";
import { Types } from "mongoose";

import RelatedBusinessService from "@/services/RelatedBusinessService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS, checkPermission } from "@/config/permissions";
import type { User } from "@/models/UserModel";

const toPlain = (value: unknown) => JSON.parse(JSON.stringify(value));

const parseSelectedIds = (searchParams: URLSearchParams): string[] => {
  const raw = [
    ...searchParams.getAll("selected"),
    ...searchParams.getAll("selected[]"),
  ]
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const selected: string[] = [];

  for (const id of raw) {
    if (!Types.ObjectId.isValid(id) || seen.has(id)) continue;
    seen.add(id);
    selected.push(id);
  }

  return selected;
};

async function handleGet(req: Request, user: User | null) {
  const service = new RelatedBusinessService();
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";
  const pageRaw = Number(searchParams.get("page") || "1");
  const limitRaw = Number(searchParams.get("limit") || "10");

  const canViewInactive =
    !!user &&
    checkPermission(
      user,
      [APP_PERMISSIONS.VIEW_RELATED_BUSINESSES, APP_PERMISSIONS.ADMIN],
      false
    );

  const includeInactive =
    canViewInactive &&
    (searchParams.get("includeInactive") === "1" ||
      searchParams.get("includeInactive") === "true");

  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  const limit =
    Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 100) : 10;
  const selected = canViewInactive ? parseSelectedIds(searchParams) : [];

  const { businesses, hasMore } = await service.getAllBusinesses(
    search,
    page,
    limit,
    selected,
    includeInactive
  );

  return NextResponse.json({
    businesses: businesses.map(toPlain),
    hasMore,
  });
}

async function handleCreate(req: Request) {
  const service = new RelatedBusinessService();
  const body = await req.json();

  if (!body?.slug || !body?.title) {
    return NextResponse.json(
      { message: "slug and title are required" },
      { status: 400 }
    );
  }

  try {
    const created = await service.createBusiness(body);
    return NextResponse.json(toPlain(created), { status: 201 });
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { message: "Slug already exists" },
        { status: 409 }
      );
    }

    console.error("RelatedBusiness POST error:", error);
    return NextResponse.json(
      { message: "Failed to create related business" },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware((req, user) => handleGet(req, user), false)(request);

export const POST = async (request: Request) =>
  withAuthMiddleware((req) => handleCreate(req), true, [
    APP_PERMISSIONS.CREATE_RELATED_BUSINESS,
  ])(request);

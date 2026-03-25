import { NextResponse } from "next/server";
import { Types } from "mongoose";

import CareerService from "@/services/CareerService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS, checkPermission } from "@/config/permissions";
import type { User } from "@/models/UserModel";
import {
  FieldErrors,
  hasMeaningfulLanguageValue,
  isValidYmd,
} from "@/utils/validation/formValidation";

const service = new CareerService();
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

async function handleGet(request: Request, user: User | null) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";

  const pageRaw = Number(searchParams.get("page") || "1");
  const limitRaw = Number(searchParams.get("limit") || "20");
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  const limit =
    Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 200) : 20;

  const includeInactiveRequested =
    searchParams.get("includeInactive") === "1" ||
    searchParams.get("includeInactive") === "true";

  const canViewInactive =
    !!user &&
    checkPermission(user, [APP_PERMISSIONS.VIEW_CAREER, APP_PERMISSIONS.ADMIN], false);

  const selected = canViewInactive ? parseSelectedIds(searchParams) : [];
  const { careers, hasMore } = await service.getAllCareers(
    search,
    page,
    limit,
    selected,
    includeInactiveRequested && canViewInactive
  );

  return NextResponse.json({
    careers: careers.map(toPlain),
    hasMore,
  });
}

async function handleCreate(request: Request) {
  const body = await request.json();

  const fieldErrors: FieldErrors = {};

  if (!hasMeaningfulLanguageValue(body?.title)) {
    fieldErrors.title = "Please enter a title.";
  }
  if (body?.postedAt && !isValidYmd(body.postedAt)) {
    fieldErrors.postedAt = "Use YYYY-MM-DD format.";
  }
  if (body?.closingDate && !isValidYmd(body.closingDate)) {
    fieldErrors.closingDate = "Use YYYY-MM-DD format.";
  }

  if (Object.keys(fieldErrors).length) {
    return NextResponse.json(
      { message: "Please correct the highlighted fields.", fieldErrors },
      { status: 400 }
    );
  }

  const created = await service.createCareer(body);
  return NextResponse.json(toPlain(created), { status: 201 });
}

export const GET = async (request: Request) =>
  withAuthMiddleware((req, user) => handleGet(req, user), false)(request);

export const POST = async (request: Request) =>
  withAuthMiddleware((req) => handleCreate(req), true, [
    APP_PERMISSIONS.CREATE_CAREER,
  ])(request);

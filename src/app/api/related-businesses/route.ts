import { NextResponse } from "next/server";
import { Types } from "mongoose";
import RelatedBusinessService from "@/services/RelatedBusinessService";

const toPlain = (v: any) => JSON.parse(JSON.stringify(v));

const parseSelectedIds = (searchParams: URLSearchParams): string[] => {
  const raw = [
    ...searchParams.getAll("selected"),
    ...searchParams.getAll("selected[]"),
  ]
    .flatMap((s) => s.split(","))
    .map((s) => s.trim())
    .filter(Boolean);

  // keep only valid ObjectId strings + de-dupe
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of raw) {
    if (!Types.ObjectId.isValid(id)) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
};

export async function GET(req: Request) {
  const service = new RelatedBusinessService();
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";

  const pageRaw = Number(searchParams.get("page") || "1");
  const limitRaw = Number(searchParams.get("limit") || "10");

  const includeInactiveRaw = searchParams.get("includeInactive");
  const includeInactive =
    includeInactiveRaw === "1" || includeInactiveRaw === "true";

  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  const limit =
    Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 100) : 10;

  const selected = parseSelectedIds(searchParams);

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

export async function POST(req: Request) {
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
  } catch (err: any) {
    if (err?.code === 11000) {
      return NextResponse.json(
        { message: "Slug already exists" },
        { status: 409 }
      );
    }
    console.error("RelatedBusiness POST error:", err);
    return NextResponse.json(
      { message: "Failed to create related business" },
      { status: 500 }
    );
  }
}

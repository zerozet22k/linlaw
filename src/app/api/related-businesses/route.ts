import { NextResponse } from "next/server";
import RelatedBusinessRepository from "@/repositories/RelatedBusinessRepository";

const toPlain = (v: any) => JSON.parse(JSON.stringify(v));

export async function GET(req: Request) {
  const repo = new RelatedBusinessRepository();
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";
  const pageRaw = Number(searchParams.get("page") || "1");
  const limitRaw = Number(searchParams.get("limit") || "10");
  const includeInactive = searchParams.get("includeInactive") === "1";

  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  const limit =
    Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 100) : 10;

  const { businesses, hasMore } = await repo.findAll(
    search,
    page,
    limit,
    includeInactive
  );

  return NextResponse.json({
    businesses: businesses.map(toPlain),
    hasMore,
  });
}

// NOTE: lock this down with auth/permissions in your app
export async function POST(req: Request) {
  const repo = new RelatedBusinessRepository();
  const body = await req.json();

  if (!body?.slug || !body?.title) {
    return NextResponse.json(
      { message: "slug and title are required" },
      { status: 400 }
    );
  }

  try {
    const created = await repo.create(body);
    return NextResponse.json(toPlain(created), { status: 201 });
  } catch (err: any) {
    // duplicate key (slug)
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

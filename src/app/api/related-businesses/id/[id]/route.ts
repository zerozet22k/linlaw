import { NextResponse } from "next/server";
import { Types } from "mongoose";
import RelatedBusinessService from "@/services/RelatedBusinessService";

const toPlain = (v: any) => JSON.parse(JSON.stringify(v));

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const service = new RelatedBusinessService();
  const business = await service.getBusinessById(params.id);

  if (!business) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(toPlain(business));
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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
  } catch (err: any) {
    if (err?.code === 11000) {
      return NextResponse.json(
        { message: "Slug already exists" },
        { status: 409 }
      );
    }
    console.error("RelatedBusiness PUT error:", err);
    return NextResponse.json(
      { message: "Failed to update related business" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

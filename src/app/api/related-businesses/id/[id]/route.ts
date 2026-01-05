import { NextResponse } from "next/server";
import { Types } from "mongoose";
import RelatedBusinessRepository from "@/repositories/RelatedBusinessRepository";

const toPlain = (v: any) => JSON.parse(JSON.stringify(v));


export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const repo = new RelatedBusinessRepository();
  const business = await repo.findById(new Types.ObjectId(params.id));
  console.log(business,params.id)
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

  const repo = new RelatedBusinessRepository();
  const body = await req.json();

  try {
    const updated = await repo.update(new Types.ObjectId(params.id), body);

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

  const repo = new RelatedBusinessRepository();
  const deleted = await repo.delete(new Types.ObjectId(params.id));

  if (!deleted) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import RelatedBusinessService from "@/services/RelatedBusinessService";

const toPlain = (v: any) => JSON.parse(JSON.stringify(v));

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const service = new RelatedBusinessService();
  const { searchParams } = new URL(req.url);

  const includeInactiveRaw = searchParams.get("includeInactive");
  const includeInactive =
    includeInactiveRaw === "1" || includeInactiveRaw === "true";

  const business = await service.getBusinessBySlug(params.slug, includeInactive);

  if (!business) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(toPlain(business));
}

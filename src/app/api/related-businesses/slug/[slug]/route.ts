import { NextResponse } from "next/server";
import RelatedBusinessRepository from "@/repositories/RelatedBusinessRepository";

const toPlain = (v: any) => JSON.parse(JSON.stringify(v));

export async function GET(
    req: Request,
    { params }: { params: { slug: string } }
) {
    const repo = new RelatedBusinessRepository();
    const { searchParams } = new URL(req.url);

    // optional: allow admin/testing to fetch inactive
    const includeInactive = searchParams.get("includeInactive") === "1";

    const business = await repo.findBySlug(params.slug, includeInactive);

    if (!business) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(toPlain(business));
}

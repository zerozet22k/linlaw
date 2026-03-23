import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      message: "This endpoint has moved to /api/roles/sync-system.",
      movedTo: "/api/roles/sync-system",
    },
    { status: 410 }
  );
}

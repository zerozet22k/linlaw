import { NextResponse } from "next/server";

import { getPublicSettings, getSiteFavicon } from "@/utils/server/publicSiteSettings";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const settings = await getPublicSettings();
  const favicon = getSiteFavicon(settings).trim() || "/images/logo.svg";
  const url = new URL(favicon, request.url);

  return NextResponse.redirect(url, 307);
}

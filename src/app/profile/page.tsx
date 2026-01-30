export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import React from "react";

import { buildPageMetadata, getLang } from "@/utils/server/metadata/buildPageMetadata";
import UserProfileContent from "./content";

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { lang?: string };
}): Promise<Metadata> {
  const lang = getLang(searchParams);
  return buildPageMetadata({
    path: "/profile",
    lang,
    noindex: true,
  });
}


export default function Page() {
  return <UserProfileContent />;
}

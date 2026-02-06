export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import React from "react";

import { buildPageMetadataFromRequest } from "@/utils/server/metadata/buildPageMetadata";
import UserProfileContent from "./content";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  return buildPageMetadataFromRequest({
    params,
    path: "/profile",
    noindex: true,
  });
}

export default function Page() {
  return <UserProfileContent />;
}

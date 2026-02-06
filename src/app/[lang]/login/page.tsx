export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import React from "react";
import LoginContent from "./content";

import { buildPageMetadataFromRequest } from "@/utils/server/metadata/buildPageMetadata";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  return buildPageMetadataFromRequest({
    params,
    path: "/login",
    noindex: true,
  });
}

export default function Page() {
  return <LoginContent />;
}

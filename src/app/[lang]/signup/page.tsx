export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import React from "react";
import SignupContent from "./content";

import { buildPageMetadataFromRequest } from "@/utils/server/metadata/buildPageMetadata";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  return buildPageMetadataFromRequest({
    params,
    path: "/signup",
    fallbackTitle: "Sign Up",
    noindex: true,
  });
}

export default function SignupPage() {
  return <SignupContent />;
}

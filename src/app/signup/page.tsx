export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import React from "react";
import SignupContent from "./content";

import { buildPageMetadata, getLang } from "@/utils/server/metadata/buildPageMetadata";

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { lang?: string };
}): Promise<Metadata> {
  const lang = getLang(searchParams);

  return buildPageMetadata({
    path: "/signup",
    lang,
    fallbackTitle: "Sign Up",
    noindex: true,
  });
}


export default function SignupPage() {
  return <SignupContent />;
}

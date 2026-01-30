export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import React from "react";
import SignupContent from "./content";

import { buildPageMetadata } from "@/utils/server/metadata/buildPageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: "/signup",
    fallbackTitle: "Sign Up",
    title: "Sign Up",
    noindex: true,
  });
}

export default function SignupPage() {
  return <SignupContent />;
}

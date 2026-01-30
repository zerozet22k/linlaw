export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import React from "react";
import { buildPageMetadata } from "@/utils/server/metadata/buildPageMetadata";
import LoginContent from "./content";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: "/login",
    fallbackTitle: "Login",
    title: "Login",
    noindex: true,
  });
}

export default function Page() {
  return <LoginContent />;
}

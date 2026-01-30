export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import React from "react";

import { buildPageMetadata } from "@/utils/server/metadata/buildPageMetadata";
import UserProfileContent from "./content";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: "/profile",
    fallbackTitle: "Profile",
    title: "Profile",
    noindex: true,
  });
}

export default function Page() {
  return <UserProfileContent />;
}

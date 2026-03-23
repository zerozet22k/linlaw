import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import TeamMemberContent from "./content";
import { buildPageMetadataFromRequest } from "@/utils/server/metadata/buildPageMetadata";
import { shortText } from "@/utils/textUtils";
import { getRequestOrigin } from "@/utils/server/requestOrigin";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { lang: string; username: string };
}): Promise<Metadata> {
  const origin = await getRequestOrigin();
  const rawUsername = String(params?.username || "").trim();
  const usernameForFetch = encodeURIComponent(rawUsername);

  let personName = "Team Member";
  let bio = "";
  let ogImageRaw: string | undefined;
  let canonicalSlug = rawUsername;

  try {
    if (origin && rawUsername) {
      const res = await fetch(`${origin}/api/team/${usernameForFetch}`, {
        cache: "no-store",
      });

      if (res.ok) {
        const u: any = await res.json();

        const uname = String(u?.username || "").trim();
        if (uname) canonicalSlug = uname;

        const who = String(u?.name ?? u?.username ?? "").trim();
        if (who) personName = who;

        bio = String(u?.bio ?? "").trim();

        const img = String(u?.cover_image ?? u?.avatar ?? "").trim();
        if (img) ogImageRaw = img;
      }
    }
  } catch {}

  const desc = shortText(bio) || undefined;

  return buildPageMetadataFromRequest({
    params,
    path: `/team-members/${encodeURIComponent(canonicalSlug)}`,
    title: personName,
    description: desc,
    ogImageRaw,
    type: "profile",
    preferFallbackTitle: false,
  });
}

export default async function Page({
  params,
}: {
  params: { lang: string; username: string };
}) {
  const rawUsername = String(params?.username || "").trim();
  const origin = await getRequestOrigin();

  try {
    if (origin && rawUsername) {
      const res = await fetch(`${origin}/api/team/${encodeURIComponent(rawUsername)}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const u: any = await res.json();
        const canonicalSlug = String(u?.username || "").trim();
        if (canonicalSlug && canonicalSlug !== rawUsername) {
          redirect(`/${params.lang}/team-members/${encodeURIComponent(canonicalSlug)}`);
        }
      }
    }
  } catch {}

  return <TeamMemberContent />;
}

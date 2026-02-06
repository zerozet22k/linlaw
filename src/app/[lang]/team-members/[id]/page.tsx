import React from "react";
import type { Metadata } from "next";

import TeamMemberContent from "./content";
import { buildPageMetadataFromRequest } from "@/utils/server/metadata/buildPageMetadata";
import { shortText } from "@/utils/textUtils";
import { getRequestOrigin } from "@/utils/server/requestOrigin";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { lang: string; id: string };
}): Promise<Metadata> {
  const origin = await getRequestOrigin();
  const rawId = String(params?.id || "").trim();
  const idForFetch = encodeURIComponent(rawId);

  let personName = "Team Member";
  let bio = "";
  let ogImageRaw: string | undefined;

  try {
    if (origin && rawId) {
      const res = await fetch(`${origin}/api/team/${idForFetch}`, {
        cache: "no-store",
      });

      if (res.ok) {
        const u: any = await res.json();

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
    path: `/team-members/${rawId}`,
    title: personName,
    description: desc,
    ogImageRaw,
    type: "profile",
    preferFallbackTitle: false,
  });
}

export default function Page() {
  return <TeamMemberContent />;
}

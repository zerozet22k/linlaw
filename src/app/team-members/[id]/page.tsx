export const dynamic = "force-dynamic";

import React from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import TeamMemberContent from "./content";

import { buildPageMetadata } from "@/utils/server/metadata/buildPageMetadata";

function shortText(input: string, max = 160) {
  const s = String(input || "").trim().replace(/\s+/g, " ");
  if (!s) return "";
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

function getRequestOrigin() {
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  const proto = h.get("x-forwarded-proto") || "https";
  return host ? `${proto}://${host}` : "";
}

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const origin = getRequestOrigin();
  const idForFetch = encodeURIComponent(params.id);

  let personName = "Team Member";
  let bio = "";
  let ogImageRaw: string | undefined;

  try {
    if (origin) {
      const res = await fetch(`${origin}/api/team/${idForFetch}`, { cache: "no-store" });
      if (res.ok) {
        const u: any = await res.json();

        const who = String(u?.name ?? u?.username ?? "").trim();
        if (who) personName = who;

        bio = String(u?.bio ?? "").trim();

        // optional: promote a better OG image if you have it
        const img = String(u?.cover_image ?? u?.avatar ?? "").trim();
        if (img) ogImageRaw = img;
      }
    }
  } catch { }

  const desc = shortText(bio);

  return buildPageMetadata({
    path: `/team-members/${params.id}`,
    fallbackTitle: "Team Member",
    title: personName,
    description: desc || undefined,
    ogImageRaw,
    type: "profile",
  });
}

export default function Page() {
  return <TeamMemberContent />;
}

import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import TeamMemberContent from "./content";
import { buildPageMetadataFromRequest } from "@/utils/server/metadata/buildPageMetadata";
import { shortText } from "@/utils/textUtils";
import dbConnect from "@/db";
import UserService from "@/services/UserService";

const _userService = new UserService();

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { lang: string; username: string };
}): Promise<Metadata> {
  const rawUsername = String(params?.username || "").trim();

  let personName = "Team Member";
  let bio = "";
  let ogImageRaw: string | undefined;
  let canonicalSlug = rawUsername;

  try {
    if (rawUsername) {
      await dbConnect();
      const u = await _userService.getUserByIdOrUsername(rawUsername);

      if (u) {
        const uname = String((u as any).username || "").trim();
        if (uname) canonicalSlug = uname;

        const who = String((u as any).name ?? (u as any).username ?? "").trim();
        if (who) personName = who;

        bio = String((u as any).bio ?? "").trim();

        const img = String((u as any).cover_image ?? (u as any).avatar ?? "").trim();
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

  try {
    if (rawUsername) {
      await dbConnect();
      const u = await _userService.getUserByIdOrUsername(rawUsername);
      if (u) {
        const canonicalSlug = String((u as any).username || "").trim();
        if (canonicalSlug && canonicalSlug !== rawUsername) {
          redirect(`/${params.lang}/team-members/${encodeURIComponent(canonicalSlug)}`);
        }
      }
    }
  } catch {}

  return <TeamMemberContent />;
}

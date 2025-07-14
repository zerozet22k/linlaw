import { NextResponse } from "next/server";
import UserService from "@/services/UserService";
import PageService from "@/services/PageService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";

import {
  TEAM_PAGE_SETTINGS_KEYS,
  TEAM_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/TEAM_PAGE_SETTINGS";
import { TeamBlock } from "@/models/TeamBlock";

const userService = new UserService();
const pageService = new PageService();

async function handle(_req: Request) {
  try {
    const sections = (await pageService.getPageByKey(
      TEAM_PAGE_SETTINGS_KEYS.SECTIONS
    )) as
      | TEAM_PAGE_SETTINGS_TYPES[typeof TEAM_PAGE_SETTINGS_KEYS.SECTIONS]
      | null;

    if (!sections) {
      return NextResponse.json(
        { error: "Team page not found" },
        { status: 404 }
      );
    }

    const blocks: TeamBlock[] = await userService.getTeamMembersOrdered(
      sections
    );

    return NextResponse.json(blocks);
  } catch (err) {
    console.error("Error fetching team list:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = (req: Request) => withAuthMiddleware(handle, false)(req);

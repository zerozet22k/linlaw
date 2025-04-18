import { NextResponse } from "next/server";
import UserService from "@/services/UserService";
import PageService from "@/services/PageService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { TEAM_PAGE_SETTINGS_KEYS } from "@/config/CMS/pages/keys/TEAM_PAGE_SETTINGS";
import { User } from "@/models/UserModel";

const userService = new UserService();
const pageService = new PageService();

async function handleGetAllUsersRequest(_req: Request) {
  try {
    const teamSections = await pageService.getPageByKey(
      TEAM_PAGE_SETTINGS_KEYS.SECTIONS
    );
    if (!teamSections) {
      return NextResponse.json(
        { error: "Team page not found" },
        { status: 404 }
      );
    }
    console.log(teamSections);
    const memberIds: string[] | undefined = teamSections.members;

    const users: User[] =
      Array.isArray(memberIds) && memberIds.length
        ? await userService.getUsersByIds(memberIds)
        : [];
    return NextResponse.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = (req: Request) =>
  withAuthMiddleware(handleGetAllUsersRequest, false)(req);

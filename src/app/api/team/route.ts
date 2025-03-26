import { NextResponse } from "next/server";
import UserService from "@/services/UserService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import PageService from "@/services/PageService";
import {
  TEAM_PAGE_SETTINGS_KEYS,
} from "@/config/CMS/pages/keys/TEAM_PAGE_SETTINGS";

const userService = new UserService();
const pageService = new PageService();

async function handleGetAllUsersRequest(request: Request) {
  try {
    const teamPage = await pageService.getPageByKey(
      TEAM_PAGE_SETTINGS_KEYS.SECTIONS
    );
    if (!teamPage) {
      return NextResponse.json(
        { error: "Team page not found" },
        { status: 404 }
      );
    }
    
    const memberRole = teamPage.memberRole;
    if (!memberRole) {
      return NextResponse.json(
        { error: "Member role is not defined" },
        { status: 404 }
      );
    }

    const users = await userService.getUsersByRole(memberRole);

    if (!users) {
      return NextResponse.json(
        { error: "No users found for the given role" },
        { status: 404 }
      );
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware(handleGetAllUsersRequest, false)(request);

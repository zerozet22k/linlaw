import { NextResponse } from "next/server";
import UserService from "@/services/UserService";
import RoleService from "@/services/RoleService";
import FileService from "@/services/FileService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS, checkPermission } from "@/config/permissions";
import { User } from "@/models/UserModel";

const userService = new UserService();
const roleService = new RoleService();
const fileService = new FileService();

async function handlePublicRequest(request: Request, user: User) {
  try {
    const body = await request.json();
    const {
      type,
      searchQuery = "",
      fileType = "",
      uploadedByUserId = "",
      page,
      limit,
      selected = [],
    } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Missing required parameter: type" },
        { status: 400 }
      );
    }

    
    switch (type) {
      case "users": {
        if (!checkPermission(user, [APP_PERMISSIONS.VIEW_USERS], true)) {
          return NextResponse.json(
            { error: "Forbidden: Insufficient permissions" },
            { status: 403 }
          );
        }
        const { users, hasMore } = await userService.getAllUsers(
          searchQuery,
          page,
          limit,
          selected
        );
        return NextResponse.json({ items: users, hasMore }, { status: 200 });
      }

      case "roles": {
        if (!checkPermission(user, [APP_PERMISSIONS.VIEW_ROLES], true)) {
          return NextResponse.json(
            { error: "Forbidden: Insufficient permissions" },
            { status: 403 }
          );
        }
        const { roles, hasMore } = await roleService.getAllRoles(
          searchQuery,
          page,
          limit,
          selected
        );
        return NextResponse.json({ items: roles, hasMore }, { status: 200 });
      }

      case "files": {
        if (!checkPermission(user, [APP_PERMISSIONS.VIEW_FILES], true)) {
          return NextResponse.json(
            { error: "Forbidden: Insufficient permissions" },
            { status: 403 }
          );
        }
        const { files, hasMore } = await fileService.getAllFiles(
          searchQuery ?? undefined,
          fileType ?? undefined,
          uploadedByUserId ?? undefined,
          page,
          limit,
          selected
        );
        return NextResponse.json({ items: files, hasMore }, { status: 200 });
      }

      default:
        return NextResponse.json(
          { error: "Invalid type parameter" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("❌ Error in handlePublicRequest:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}



export const POST = async (request: Request) =>
  withAuthMiddleware(
    async (req, user) => handlePublicRequest(req, user), 
    true 
  )(request);

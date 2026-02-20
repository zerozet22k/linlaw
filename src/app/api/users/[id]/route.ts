import { NextResponse } from "next/server";
import UserService from "@/services/UserService";
import RoleService from "@/services/RoleService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";
import { User } from "@/models/UserModel";
import { RoleType } from "@/models/RoleModel";
import { getHighestRoleWithPermission } from "@/utils/roleUtils";

const userService = new UserService();
const roleService = new RoleService();

async function handleGetUserRequest(
  _request: Request,
  _currentUser: User,
  params: { id: string }
) {
  try {
    const targetUser = await userService.getUserById(params.id);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(targetUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleUpdateUserRequest(
  request: Request,
  currentUser: User,
  params: { id: string }
) {
  try {

    const targetUser = await userService.getUserById(params.id);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = await request.json();


    if (data.role_ids) {


      const highestEditableRole = getHighestRoleWithPermission(
        currentUser,
        APP_PERMISSIONS.BIND_ROLE
      );
      if (!highestEditableRole) {
        return NextResponse.json(
          { error: "You do not have permission to bind roles." },
          { status: 403 }
        );
      }
      const roles = await roleService.getRolesByIds(data.role_ids);
      if (roles.length !== data.role_ids.length) {
        return NextResponse.json(
          { error: "One or more selected roles were not found." },
          { status: 400 }
        );
      }


      const oldRoleIds = targetUser.roles.map((role: any) =>
        role._id.toString()
      );


      for (const role of roles) {
        if (
          !oldRoleIds.includes(role._id.toString()) &&
          role.level >= highestEditableRole.level
        ) {
          return NextResponse.json(
            {
              error:
                "You cannot bind roles that are above or equal to your authority.",
            },
            { status: 403 }
          );
        }
      }
    }

    const updatedUser = await userService.updateUser(params.id, data);
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleDeleteUserRequest(
  _request: Request,
  currentUser: User,
  params: { id: string }
) {
  try {
    const targetUser = await userService.getUserById(params.id);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.roles.some((role: any) => role.type === RoleType.SYSTEM)) {
      return NextResponse.json(
        { error: "You cannot delete a user with a system role." },
        { status: 403 }
      );
    }

    const highestDeletableRole = getHighestRoleWithPermission(
      currentUser,
      APP_PERMISSIONS.DELETE_USER
    );
    if (!highestDeletableRole) {
      return NextResponse.json(
        { error: "You do not have permission to delete users." },
        { status: 403 }
      );
    }

    const targetHighest = Math.max(
      ...targetUser.roles.map((r: any) => r.level)
    );
    if (targetHighest >= highestDeletableRole.level) {
      return NextResponse.json(
        { error: "You do not have permission to delete this user." },
        { status: 403 }
      );
    }
    const deletedUser = await userService.deleteUser(params.id);
    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, user) => handleGetUserRequest(req, user, context.params),
    true,
    [APP_PERMISSIONS.VIEW_USERS]
  )(request);

export const PUT = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, user) => handleUpdateUserRequest(req, user, context.params),
    true,
    [APP_PERMISSIONS.EDIT_USER]
  )(request);

export const DELETE = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, user) => handleDeleteUserRequest(req, user, context.params),
    true,
    [APP_PERMISSIONS.DELETE_USER]
  )(request);

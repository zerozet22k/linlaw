import { NextResponse } from "next/server";
import UserService from "@/services/UserService";
import RoleService from "@/services/RoleService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";
import { User } from "@/models/UserModel";
import { getHighestRoleWithPermission } from "@/utils/roleUtils";
import {
  FieldErrors,
  generateUsername,
  isEmailLikeUsername,
  isValidUsername,
} from "@/utils/validation/formValidation";

const userService = new UserService();
const roleService = new RoleService();

async function handleGetAllUsersRequest(_request: Request, _currentUser: User) {
  try {
    const users = (await userService.getAllUsers()).users;
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleCreateUserRequest(request: Request, currentUser: User) {
  try {
    const data = await request.json();

    const fieldErrors: FieldErrors = {};
    const name = String(data?.name || "").trim();
    const email = String(data?.email || "").trim().toLowerCase();
    const password = String(data?.password || "");
    const username = String(data?.username || "").trim() || generateUsername(name);
    const roleIds = Array.isArray(data?.role_ids) ? data.role_ids : [];

    if (!name) fieldErrors.name = "Name is required.";
    if (!email) fieldErrors.email = "Email is required.";
    if (!password) fieldErrors.password = "Password is required.";
    if (!roleIds.length) fieldErrors.role_ids = "Please select at least one role.";

    if (!username) {
      fieldErrors.username = "Username is required.";
    } else if (isEmailLikeUsername(username)) {
      fieldErrors.username = "Username cannot be an email address.";
    } else if (!isValidUsername(username)) {
      fieldErrors.username = "Use lowercase letters, numbers, and hyphens only.";
    }

    if (Object.keys(fieldErrors).length) {
      return NextResponse.json(
        { message: "Please correct the highlighted fields.", fieldErrors },
        { status: 400 }
      );
    }

    if (roleIds.length) {
      const highestEditableRole = getHighestRoleWithPermission(
        currentUser,
        APP_PERMISSIONS.BIND_ROLE
      );
      if (!highestEditableRole) {
        return NextResponse.json(
          {
            message: "You do not have permission to bind roles.",
            fieldErrors: { role_ids: "You do not have permission to bind roles." },
          },
          { status: 403 }
        );
      }
      const roles = await roleService.getRolesByIds(roleIds);
      if (roles.length !== roleIds.length) {
        return NextResponse.json(
          {
            message: "One or more selected roles were not found.",
            fieldErrors: { role_ids: "One or more selected roles were not found." },
          },
          { status: 400 }
        );
      }
      for (const role of roles) {
        if (role.level >= highestEditableRole.level) {
          return NextResponse.json(
            {
              message:
                "You cannot bind roles that are above or equal to your authority.",
              fieldErrors: {
                role_ids:
                  "You cannot bind roles that are above or equal to your authority.",
              },
            },
            { status: 403 }
          );
        }
      }
    }

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        {
          message: "User already exists with this email.",
          fieldErrors: { email: "User already exists with this email." },
        },
        { status: 400 }
      );
    }

    const existingUsername = await userService.getUserByUsername(username);
    if (existingUsername) {
      return NextResponse.json(
        {
          message: "Username is already taken.",
          fieldErrors: { username: "Username is already taken." },
        },
        { status: 400 }
      );
    }

    const newUser = await userService.createUser({
      ...data,
      name,
      email,
      username,
      role_ids: roleIds,
    });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware((req, user) => handleGetAllUsersRequest(req, user), true, [
    APP_PERMISSIONS.VIEW_USERS,
  ])(request);

export const POST = async (request: Request) =>
  withAuthMiddleware(
    (_req, user) => handleCreateUserRequest(request, user),
    true,
    [APP_PERMISSIONS.CREATE_USER]
  )(request);

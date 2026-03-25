import { NextResponse } from "next/server";
import RoleService from "@/services/RoleService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import {
  APP_PERMISSIONS,
  AppPermissionType,
  FREE_PERMISSIONS,
} from "@/config/permissions";
import { getHighestRoleWithPermission } from "@/utils/roleUtils";
import { FieldErrors } from "@/utils/validation/formValidation";

const roleService = new RoleService();

async function handleGetAllRolesRequest(_user: any) {
  try {
    const roles = (await roleService.getAllRoles()).roles;
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleCreateRoleRequest(request: Request, user: any) {
  try {
    const body = await request.json();
    const { name, type, permissions, level } = body;
    const fieldErrors: FieldErrors = {};

    if (!String(name || "").trim()) fieldErrors.name = "Role name is required.";
    if (!type) fieldErrors.type = "Role type is required.";
    if (!Array.isArray(permissions) || permissions.length === 0) {
      fieldErrors.permissions = "Select at least one permission.";
    }
    if (level === undefined || level === null || String(level).trim?.() === "") {
      fieldErrors.level = "Role level is required.";
    }

    if (Object.keys(fieldErrors).length) {
      return NextResponse.json(
        { message: "Please correct the highlighted fields.", fieldErrors },
        { status: 400 }
      );
    }
    const highestEditableRole = getHighestRoleWithPermission(
      user,
      APP_PERMISSIONS.EDIT_ROLE
    );
    if (!highestEditableRole) {
      return NextResponse.json(
        { message: "Insufficient permissions" },
        { status: 403 }
      );
    }
    if (level >= highestEditableRole.level) {
      return NextResponse.json(
        {
          message: `Role level must be strictly less than ${highestEditableRole.level}`,
          fieldErrors: {
            level: `Role level must be strictly less than ${highestEditableRole.level}`,
          },
        },
        { status: 400 }
      );
    }
    const userPermissions = Array.from(
      new Set(user.roles.flatMap((r: any) => r.permissions))
    );
    const invalidPerms = permissions.filter(
      (perm: AppPermissionType) =>
        !FREE_PERMISSIONS.includes(perm) && !userPermissions.includes(perm)
    );
    if (invalidPerms.length > 0) {
      return NextResponse.json(
        {
          message: `You cannot delegate permission(s): ${invalidPerms.join(
            ", "
          )}`,
          fieldErrors: {
            permissions: `You cannot delegate permission(s): ${invalidPerms.join(", ")}`,
          },
        },
        { status: 400 }
      );
    }
    const newRole = await roleService.createRole(body);
    return NextResponse.json(newRole, { status: 201 });
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json(
        {
          message: "Role name already exists.",
          fieldErrors: { name: "Role name already exists." },
        },
        { status: 409 }
      );
    }
    console.error("Error creating role:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware((_req, user) => handleGetAllRolesRequest(user), true, [
    APP_PERMISSIONS.VIEW_ROLES,
  ])(request);

export const POST = async (request: Request) =>
  withAuthMiddleware(
    (_req, user) => handleCreateRoleRequest(request, user),
    true,
    [APP_PERMISSIONS.CREATE_ROLE]
  )(request);

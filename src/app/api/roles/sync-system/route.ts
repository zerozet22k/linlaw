import { NextResponse } from "next/server";
import { RoleType } from "@/models/RoleModel";
import RoleRepository from "@/repositories/RoleRepository";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";
import { User } from "@/models/UserModel";
import { Types } from "mongoose";

const roleRepository = new RoleRepository();

async function handleSyncSystemRoles(
  _request: Request,
  user: User | null
): Promise<NextResponse> {
  try {
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user has SYSTEM role
    const userRoleId = Array.isArray(user.role_ids) && user.role_ids.length > 0 
      ? user.role_ids[0] 
      : null;
    
    if (!userRoleId) {
      return NextResponse.json(
        { error: "User has no role assigned" },
        { status: 403 }
      );
    }

    const userRole = await roleRepository.findById(
      userRoleId instanceof Types.ObjectId ? userRoleId : new Types.ObjectId(String(userRoleId))
    );
    
    if (!userRole || userRole.type !== RoleType.SYSTEM) {
      return NextResponse.json(
        { error: "Only SYSTEM role accounts can sync all roles" },
        { status: 403 }
      );
    }

    // Get all available permissions from APP_PERMISSIONS
    const allPermissions = Object.values(APP_PERMISSIONS) as string[];

    // Fetch all roles
    const result = await roleRepository.findAll();
    const allRoles = result.roles;
    
    if (!allRoles || allRoles.length === 0) {
      return NextResponse.json(
        { error: "No roles found in system" },
        { status: 404 }
      );
    }

    // Sync all roles with all permissions
    const syncedRoles = [];
    for (const role of allRoles) {
      // Use repository method directly to bypass nonPermissionsEditable check
      const updatedRole = await roleRepository.updatePermissionsSystem(
        role._id,
        allPermissions
      );
      syncedRoles.push(updatedRole);
    }

    return NextResponse.json(
      {
        message: `All ${syncedRoles.length} roles synced successfully`,
        rolesCount: syncedRoles.length,
        permissionsCount: allPermissions.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error syncing system roles:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to sync system roles" },
      { status: 500 }
    );
  }
}

export const POST = async (request: Request) =>
  withAuthMiddleware(
    (req, user) => handleSyncSystemRoles(req, user),
    true,
    [APP_PERMISSIONS.ADMIN],
    false
  )(request);

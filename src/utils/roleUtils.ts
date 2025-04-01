import { User, UserAPI } from "@/models/UserModel";
import { Role, RoleAPI } from "@/models/RoleModel";
import { AppPermissionType } from "@/config/permissions";

export function getHighestRoleWithPermission(
  user: UserAPI | User | null,
  permission: AppPermissionType
): RoleAPI | Role | null {
  if (!user?.roles?.length) return null;

  const rolesWithPermission = user.roles.filter((role) =>
    role.permissions.includes(permission)
  );
  if (rolesWithPermission.length === 0) return null;

  return rolesWithPermission.reduce((highest, role) =>
    role.level > highest.level ? role : highest
  );
}

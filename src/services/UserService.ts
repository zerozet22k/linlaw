import { User } from "../models/UserModel";
import {
  userRepository,
  roleRepository,
  cacheRepository,
  toObjectId,
} from "@/repositories";
import { Role, RoleType } from "@/models/RoleModel";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { APP_PERMISSIONS, GUEST_APP_PERMISSIONS } from "@/config/permissions";
import { DeviceToken } from "@/models/Users/DeviceToken";
import {
  TEAM_PAGE_SETTINGS_KEYS,
  TEAM_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/keys/TEAM_PAGE_SETTINGS";
import { TeamBlock } from "@/models/TeamBlock";
import { Types } from "mongoose";
import {
  AnalyticsRange,
  getAnalyticsRangeDays,
  InternalAnalyticsSnapshot,
} from "@/types/adminAnalytics";

type TeamSectionsType =
  TEAM_PAGE_SETTINGS_TYPES[typeof TEAM_PAGE_SETTINGS_KEYS.SECTIONS];

function daysAgoUtc(daysAgo: number): Date {
  const now = new Date();
  const date = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date;
}

function buildDateSeries(days: number): string[] {
  const start = daysAgoUtc(days - 1);
  return Array.from({ length: days }, (_, index) => {
    const point = new Date(start);
    point.setUTCDate(start.getUTCDate() + index);
    return point.toISOString().slice(0, 10);
  });
}

class UserService {
  async getAllUsers(
    searchQuery = "",
    page?: number,
    limit?: number,
    selected: string[] = []
  ): Promise<{ users: User[]; hasMore: boolean }> {
    const selectedObjectIds = selected.map(toObjectId);
    return userRepository.findAll(searchQuery, page, limit, selectedObjectIds);
  }

  async getAuthUserByEmail(email: string): Promise<User | null> {
    return userRepository.findAuthUserByEmail(email);
  }
  async getAuthUserById(userId: string): Promise<User | null> {
    const userObjectId = toObjectId(userId);
    return userRepository.findAuthUserById(userObjectId);
  }
  async getUserByEmail(email: string): Promise<Partial<User> | null> {
    return userRepository.findByEmail(email);
  }
  async getUserByUsername(username: string): Promise<User | null> {
    return userRepository.findByUsername(username);
  }
  async updateUserAvatar(
    userId: string,
    avatarUrl: string
  ): Promise<User | null> {
    const userObjectId = toObjectId(userId);
    return userRepository.updateUserAvatar(userObjectId, avatarUrl);
  }
  async getUsersByRole(roleId: string): Promise<User[]> {
    const roleObjectId = toObjectId(roleId);
    return userRepository.findByRole(roleObjectId);
  }

  async getUserById(userId: string): Promise<User | null> {
    const userObjectId = toObjectId(userId);
    return userRepository.findById(userObjectId);
  }

  async getUserByIdOrUsername(identity: string): Promise<User | null> {
    const raw = String(identity || "").trim();
    if (!raw) return null;

    if (Types.ObjectId.isValid(raw) && raw.length === 24) {
      const byId = await this.getUserById(raw);
      if (byId) return byId;
    }

    return userRepository.findByUsername(raw);
  }

  async getUsersByIds(userIds: string[]): Promise<User[]> {
    const objectIds = userIds.map((id) => toObjectId(id));
    return userRepository.findByIds(objectIds);
  }

  async getAnalyticsSnapshot(
    range: AnalyticsRange
  ): Promise<InternalAnalyticsSnapshot> {
    const days = getAnalyticsRangeDays(range);
    const rangeStart = daysAgoUtc(days - 1);
    const sevenDayStart = daysAgoUtc(6);
    const thirtyDayStart = daysAgoUtc(29);

    const [guestRole, systemRole] = await Promise.all([
      roleRepository.findByRoleType(RoleType.GUEST),
      roleRepository.findByRoleType(RoleType.SYSTEM),
    ]);

    const [
      totalUsers,
      guestUsers,
      systemUsers,
      recentSignups7d,
      recentSignups30d,
      recentSignupsInRange,
      deviceSummary,
      signupTrendRaw,
      recentUsers,
    ] = await Promise.all([
      userRepository.countAll(),
      guestRole ? userRepository.countByRoleId(guestRole._id) : 0,
      systemRole ? userRepository.countByRoleId(systemRole._id) : 0,
      userRepository.countCreatedSince(sevenDayStart),
      userRepository.countCreatedSince(thirtyDayStart),
      userRepository.countCreatedSince(rangeStart),
      userRepository.getDeviceSummary(),
      userRepository.getSignupTrendSince(rangeStart),
      userRepository.getRecentUsers(6),
    ]);

    const signupTrendMap = new Map(
      signupTrendRaw.map((point) => [point.date, point.users])
    );

    return {
      totalUsers,
      guestUsers,
      staffUsers: Math.max(totalUsers - guestUsers, 0),
      systemUsers,
      recentSignups7d,
      recentSignups30d,
      recentSignupsInRange,
      usersWithDevices: deviceSummary.usersWithDevices,
      storedDevices: deviceSummary.storedDevices,
      signupTrend: buildDateSeries(days).map((date) => ({
        date,
        users: signupTrendMap.get(date) ?? 0,
      })),
      recentUsers: recentUsers.map((user) => {
        const createdAt =
          (user as any).createdAt ??
          (user as any).created_at ??
          null;

        return {
          id: user._id.toString(),
          name: String(user.name || "").trim() || user.username,
          username: user.username,
          email: user.email,
          avatar: user.avatar || null,
          createdAt: createdAt ? new Date(createdAt).toISOString() : null,
          roles: (user.roles ?? []).map((role) => role.name),
        };
      }),
    };
  }

  async getTeamMembersOrdered(
    sections: TeamSectionsType
  ): Promise<TeamBlock[]> {
    const { maxMembersCount, teamGroups = [] } = sections;
    const result: TeamBlock[] = [];

    for (const group of teamGroups) {
      if (!group.members.length) continue;

      const ids = group.members.map(toObjectId);
      const users = await userRepository.findByIdsPreserveOrder(ids);

      if (group.intraSort === "createdAsc") {
        users.sort((a, b) => +a.created_at - +b.created_at);
      } else if (group.intraSort === "createdDesc") {
        users.sort((a, b) => +b.created_at - +a.created_at);
      }

      result.push({
        teamName: group.teamName,
        members: users,
      });
    }

    // 3️⃣ global cap
    if (maxMembersCount && maxMembersCount > 0) {
      let remaining = maxMembersCount;
      for (const block of result) {
        if (remaining <= 0) {
          block.members = [];
          continue;
        }
        if (block.members.length > remaining) {
          block.members = block.members.slice(0, remaining);
        }
        remaining -= block.members.length;
      }
      return result.filter((b) => b.members.length);
    }

    return result;
  }
  async setupDefaultRolesAndSystemUser(userData: Partial<User>): Promise<void> {
    let systemRole = await roleRepository.findByRoleType(RoleType.SYSTEM);

    if (!systemRole) {
      systemRole = await roleRepository.create({
        name: "System Admin",
        type: RoleType.SYSTEM,
        permissions: Object.values(APP_PERMISSIONS),
        color: "red",
        nonPermissionsEditable: true,
        level: 100,
      });
    }

    let guestRole = await roleRepository.findByRoleType(RoleType.GUEST);

    if (!guestRole) {
      guestRole = await roleRepository.create({
        name: "Guest",
        type: RoleType.GUEST,
        permissions: GUEST_APP_PERMISSIONS,
        color: "gray",
        nonPermissionsEditable: true,
        level: 1,
      });
    }

    const existingSystemUser = await userRepository.findByRoleTypeOrEmail(
      RoleType.SYSTEM,
      userData.email!
    );

    if (!existingSystemUser) {
      const { hashedPassword, salt } = this.hashPassword(userData.password!);
      userData.hashedPassword = hashedPassword;
      userData.salt = salt;
      delete userData.password;

      userData.role_ids = [systemRole._id];

      await userRepository.create(userData);
    }
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const { hashedPassword, salt } = this.hashPassword(userData.password!);
    userData.hashedPassword = hashedPassword;
    userData.salt = salt;
    delete userData.password;

    return userRepository.create(userData);
  }

  async signup(userData: Partial<User>): Promise<User> {
    const { hashedPassword, salt } = this.hashPassword(userData.password!);
    userData.hashedPassword = hashedPassword;
    userData.salt = salt;
    delete userData.password;

    const guestRole = await roleRepository.findByRoleType(RoleType.GUEST);

    if (!guestRole) {
      throw new Error("Guest role is missing. Please set up default roles.");
    }

    userData.role_ids = [guestRole._id];

    return userRepository.create(userData);
  }
  async syncRolePermissions(force: boolean = false): Promise<void> {
    const lastSyncTime = await cacheRepository.get<number>("lastRoleSyncTime");

    const ONE_HOUR = 60 * 60 * 1000;

    if (!force && lastSyncTime && Date.now() - lastSyncTime < ONE_HOUR) {
      console.log("Skipping role sync, recently updated.");
      return;
    }

    const systemRole = await roleRepository.findByRoleType(RoleType.SYSTEM);
    const guestRole = await roleRepository.findByRoleType(RoleType.GUEST);

    const updates: Promise<Role | null>[] = [];

    if (systemRole) {
      updates.push(
        roleRepository.updatePermissionsSystem(
          systemRole._id,
          Object.values(APP_PERMISSIONS)
        )
      );
    }

    if (guestRole) {
      updates.push(
        roleRepository.updatePermissionsSystem(
          guestRole._id,
          GUEST_APP_PERMISSIONS
        )
      );
    }
    await cacheRepository.set("lastRoleSyncTime", Date.now(), ONE_HOUR);
  }

  async updateUser(
    userId: string,
    updateData: Partial<User>
  ): Promise<User | null> {
    const userObjectId = toObjectId(userId);
    if (updateData.password) {
      const { hashedPassword, salt } = this.hashPassword(updateData.password);
      updateData.hashedPassword = hashedPassword;
      updateData.salt = salt;

      delete updateData.password;
    }

    return userRepository.update(userObjectId, updateData);
  }

  async deleteUser(userId: string): Promise<User | null> {
    const userObjectId = toObjectId(userId);
    return userRepository.delete(userObjectId);
  }
  async saveDeviceToken(
    userId: string,
    deviceName: string,
    refreshToken: string
  ): Promise<void> {
    const userObjectId = toObjectId(userId);
    return userRepository.saveDeviceToken(
      userObjectId,
      deviceName,
      refreshToken
    );
  }

  async findDeviceToken(
    userId: string,
    refreshToken: string
  ): Promise<boolean> {
    const userObjectId = toObjectId(userId);
    return userRepository.findDeviceToken(userObjectId, refreshToken);
  }

  async deleteDeviceToken(userId: string, refreshToken: string): Promise<void> {
    const userObjectId = toObjectId(userId);
    return userRepository.deleteDeviceToken(userObjectId, refreshToken);
  }

  async getAllUserDevices(userId: string): Promise<DeviceToken[]> {
    const userObjectId = toObjectId(userId);
    return userRepository.getAllDevices(userObjectId);
  }
  async findRefreshToken(refreshToken: string): Promise<User | null> {
    return userRepository.findRefreshToken(refreshToken);
  }
  private hashPassword(password: string): {
    hashedPassword: string;
    salt: string;
  } {
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);
    return { hashedPassword, salt };
  }

  verifyPassword(inputPassword: string, user: User): boolean {
    const hash = crypto
      .pbkdf2Sync(inputPassword, user.salt, 1000, 64, `sha512`)
      .toString(`hex`);
    return user.hashedPassword === hash;
  }

  generateAccessToken(userId: string) {
    const expiresIn = "1h";
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn });

    const expirationTime = Date.now() + 3600 * 1000;

    return { token, expirationTime };
  }

  generateRefreshToken(userId: string) {
    const expiresIn = "30d";
    const token = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn,
    });

    const expirationTime = Date.now() + 30 * 24 * 3600 * 1000;

    return { token, expirationTime };
  }
  async purgeAllDeviceTokens(userId: string): Promise<void> {
    const userObjectId = toObjectId(userId);

    try {
      await userRepository.purgeDeviceTokensByUserId(userObjectId);
      console.log(`All device tokens for user ${userId} have been purged.`);
    } catch (error) {
      console.error(`Failed to purge device tokens for user ${userId}:`, error);
      throw new Error("Failed to purge device tokens.");
    }
  }
  async purgeAllDevices(): Promise<void> {
    try {
      await userRepository.purgeAllDeviceTokens();
      console.log("All device tokens for all users have been purged.");
    } catch (error) {
      console.error("Failed to purge device tokens for all users:", error);
      throw new Error("Failed to purge device tokens for all users.");
    }
  }
}

export default UserService;

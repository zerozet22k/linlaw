import dbConnect from "@/db";
import UserModel, { User } from "../models/UserModel";
import { Types, Model } from "mongoose";
import { roleRepository } from ".";
import { RoleType } from "@/models/RoleModel";
import { DeviceToken } from "@/models/Users/DeviceToken";

class UserRepository {
  private userModel: Model<User>;

  constructor() {
    this.userModel = UserModel;
  }
  async findAuthUserByEmail(email: string): Promise<User | null> {
    await dbConnect();
    return this.userModel.findOne({ email }).select("+hashedPassword +salt").populate("roles").exec();
  }
  async findAuthUserById(id: Types.ObjectId): Promise<User | null> {
    await dbConnect();
    return this.userModel
      .findById(id)
      .populate("roles")
      .exec();
  }

  async findAll(
    searchQuery = "",
    page?: number,
    limit?: number,
    selected: Types.ObjectId[] = []
  ): Promise<{ users: User[]; hasMore: boolean }> {
    await dbConnect();

    const queryConditions: any = {};

    if (selected.length) {
      queryConditions._id = { $in: selected };
    }

    if (searchQuery) {
      queryConditions.$or = [
        { name: new RegExp(searchQuery, "i") },
        { username: new RegExp(searchQuery, "i") },
        { email: new RegExp(searchQuery, "i") },
      ];
    }

    let query = this.userModel.find(queryConditions);

    if (page !== undefined && limit !== undefined) {
      query = query.skip((page - 1) * limit).limit(limit);
    }

    const users = await query
      .populate("roles")
      .exec();

    const totalUsers = await this.userModel.countDocuments(queryConditions);

    return {
      users,
      hasMore:
        page !== undefined && limit !== undefined
          ? page * limit < totalUsers
          : false,
    };
  }

  async findById(id: Types.ObjectId): Promise<User | null> {
    await dbConnect();
    return this.userModel
      .findById(id)
      .populate("roles")
      .exec();
  }
  async findByIds(ids: Types.ObjectId[]): Promise<User[]> {
    await dbConnect();
    return this.userModel
      .find({ _id: { $in: ids } })
      .populate("roles")
      .exec();
  }
  async findByIdsPreserveOrder(ids: Types.ObjectId[]): Promise<User[]> {
    if (!ids.length) return [];

    await dbConnect();
    const users = await this.userModel
      .find({ _id: { $in: ids } })
      .populate("roles")
      .exec();

    const rank = new Map(ids.map((id, i) => [id.toString(), i]));
    users.sort(
      (a: User, b: User) =>
        (rank.get(a._id.toString()) ?? 0) - (rank.get(b._id.toString()) ?? 0)
    );
    return users;
  }
  async findByRole(roleId: Types.ObjectId): Promise<User[]> {
    await dbConnect();

    return this.userModel
      .find({ role_ids: { $in: [roleId] } })
      .populate("roles")
      .exec();
  }

  async findByEmail(email: string): Promise<Partial<User> | null> {
    await dbConnect();
    return this.userModel
      .findOne({ email })
      .populate("roles")
      .exec();
  }

  async findByUsername(username: string): Promise<User | null> {
    await dbConnect();
    return this.userModel
      .findOne({ username: String(username || "").trim() })
      .populate("roles")
      .exec();
  }

  async create(userData: Partial<User>): Promise<User> {
    await dbConnect();
    const user = new this.userModel(userData);
    return user.save();
  }

  async countAll(): Promise<number> {
    await dbConnect();
    return this.userModel.countDocuments({});
  }

  async countByRoleId(roleId: Types.ObjectId): Promise<number> {
    await dbConnect();
    return this.userModel.countDocuments({ role_ids: { $in: [roleId] } });
  }

  async countCreatedSince(date: Date): Promise<number> {
    await dbConnect();
    return this.userModel.countDocuments({
      $or: [{ createdAt: { $gte: date } }, { created_at: { $gte: date } }],
    } as any);
  }

  async getDeviceSummary(): Promise<{
    storedDevices: number;
    usersWithDevices: number;
  }> {
    await dbConnect();

    const [summary] = await this.userModel
      .aggregate([
        {
          $project: {
            deviceCount: { $size: { $ifNull: ["$devices", []] } },
          },
        },
        {
          $group: {
            _id: null,
            storedDevices: { $sum: "$deviceCount" },
            usersWithDevices: {
              $sum: {
                $cond: [{ $gt: ["$deviceCount", 0] }, 1, 0],
              },
            },
          },
        },
      ])
      .exec();

    return {
      storedDevices: summary?.storedDevices ?? 0,
      usersWithDevices: summary?.usersWithDevices ?? 0,
    };
  }

  async getSignupTrendSince(date: Date): Promise<
    {
      date: string;
      users: number;
    }[]
  > {
    await dbConnect();

    const rows = await this.userModel
      .aggregate([
        {
          $addFields: {
            analyticsCreatedAt: { $ifNull: ["$createdAt", "$created_at"] },
          },
        },
        {
          $match: {
            analyticsCreatedAt: { $gte: date },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$analyticsCreatedAt",
                timezone: "UTC",
              },
            },
            users: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .exec();

    return rows.map((row) => ({
      date: String(row._id),
      users: Number(row.users ?? 0),
    }));
  }

  async getRecentUsers(limit = 5): Promise<User[]> {
    await dbConnect();
    return this.userModel
      .find({})
      .sort({ createdAt: -1, created_at: -1 } as any)
      .limit(limit)
      .populate("roles")
      .exec();
  }

  async update(
    id: Types.ObjectId,
    updateData: Partial<User>
  ): Promise<User | null> {
    await dbConnect();

    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate("roles")
      .exec();
  }

  async delete(id: Types.ObjectId): Promise<User | null> {
    await dbConnect();
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async saveDeviceToken(
    userId: Types.ObjectId,
    deviceName: string,
    token: string
  ): Promise<void> {
    await dbConnect();
    const user = await this.userModel.findById(userId);

    if (!user) throw new Error("User not found");

    if (!user.devices) {
      user.devices = [];
    }

    user.devices.push({ deviceName, token, createdAt: new Date() });
    await user.save();
  }

  async findDeviceToken(userId: Types.ObjectId, token: string): Promise<boolean> {
    await dbConnect();
    const exists = await this.userModel.exists({
      _id: userId,
      "devices.token": token,
    });
    return !!exists;
  }

  async deleteDeviceToken(
    userId: Types.ObjectId,
    token: string
  ): Promise<void> {
    await dbConnect();
    await this.userModel
      .updateOne({ _id: userId }, { $pull: { devices: { token } } })
      .exec();
  }

  async getAllDevices(userId: Types.ObjectId): Promise<DeviceToken[]> {
    await dbConnect();
    const user = await this.userModel.findById(userId).select("devices").exec();
    if (!user) throw new Error("User not found");

    return user.devices;
  }
  async findRefreshToken(refreshToken: string): Promise<User | null> {
    await dbConnect();

    return this.userModel.findOne({ "devices.token": refreshToken }).exec();
  }
  async findByRoleTypeOrEmail(
    roleType: RoleType,
    email: string
  ): Promise<User | null> {
    await dbConnect();

    const role = await roleRepository.findByRoleType(roleType);
    if (!role) return null;

    return this.userModel
      .findOne({
        $or: [{ role_ids: { $in: [role._id] } }, { email }],
      })


      .populate("roles")
      .exec();
  }
  async purgeDeviceTokensByUserId(userId: Types.ObjectId): Promise<void> {
    await dbConnect();
    const user = await this.userModel.findById(userId);

    if (!user) throw new Error("User not found");

    user.devices = [];

    await user.save();
  }
  async purgeAllDeviceTokens(): Promise<void> {
    await dbConnect();
    await this.userModel
      .updateMany({}, { $set: { devices: [] }, $unset: { tokens: "" } })
      .exec();
  }
  async updateUserAvatar(
    id: Types.ObjectId,
    avatarUrl: string
  ): Promise<User | null> {
    await dbConnect();
    return this.userModel
      .findByIdAndUpdate(id, { avatar: avatarUrl }, { new: true })
      .select("avatar")
      .exec();
  }
}

export default UserRepository;

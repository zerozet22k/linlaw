import dbConnect from "@/db";
import { Model, Types } from "mongoose";
import CareerModel, { Career } from "@/models/CareerModel";

class CareerRepository {
  private model: Model<Career>;

  constructor() {
    this.model = CareerModel;
  }

  async countDocuments(): Promise<number> {
    await dbConnect();
    return this.model.countDocuments().exec();
  }

  async findAll(
    searchQuery = "",
    page?: number,
    limit?: number,
    selected: Types.ObjectId[] = [],
    includeInactive = false
  ): Promise<{ careers: Career[]; hasMore: boolean }> {
    await dbConnect();

    const queryConditions: Record<string, any> = {};
    if (!includeInactive) {
      queryConditions.isActive = true;
    }

    if (searchQuery.trim()) {
      const rx = new RegExp(searchQuery, "i");
      queryConditions.$or = [
        { department: rx },
        { location: rx },
        { "title.en": rx },
        { "title.th": rx },
        { "title.zh": rx },
        { "summary.en": rx },
        { "summary.th": rx },
        { "summary.zh": rx },
      ];
    }

    let query = this.model.find(queryConditions).sort({ order: 1, createdAt: -1 });

    if (page !== undefined && limit !== undefined) {
      query = query.skip((page - 1) * limit).limit(limit);
    }

    const searchResults = await query.exec();
    const totalMatching = await this.model.countDocuments(queryConditions);
    const hasMore =
      page !== undefined && limit !== undefined
        ? page * limit < totalMatching
        : false;

    let selectedDocs: Career[] = [];
    if (selected.length) {
      selectedDocs = await this.findByIdsPreserveOrder(selected);
    }

    const mergedMap = new Map<string, Career>();
    for (const doc of searchResults) {
      mergedMap.set(doc._id.toString(), doc);
    }
    for (const doc of selectedDocs) {
      mergedMap.set(doc._id.toString(), doc);
    }

    return {
      careers: Array.from(mergedMap.values()),
      hasMore,
    };
  }

  async findById(id: Types.ObjectId): Promise<Career | null> {
    await dbConnect();
    return this.model.findById(id).exec();
  }

  async findByIdsPreserveOrder(ids: Types.ObjectId[]): Promise<Career[]> {
    if (!ids.length) return [];

    await dbConnect();
    const docs = await this.model.find({ _id: { $in: ids } }).exec();
    const rank = new Map(ids.map((id, index) => [id.toString(), index]));

    docs.sort(
      (a, b) =>
        (rank.get(a._id.toString()) ?? 0) - (rank.get(b._id.toString()) ?? 0)
    );

    return docs;
  }

  async create(data: Partial<Career>): Promise<Career> {
    await dbConnect();
    const doc = new this.model(data);
    return doc.save();
  }

  async createMany(data: Partial<Career>[]): Promise<Career[]> {
    await dbConnect();
    if (!data.length) return [];
    return this.model.insertMany(data, { ordered: true });
  }

  async update(
    id: Types.ObjectId,
    updateData: Partial<Career>
  ): Promise<Career | null> {
    await dbConnect();
    return this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id: Types.ObjectId): Promise<Career | null> {
    await dbConnect();
    return this.model.findByIdAndDelete(id).exec();
  }
}

export default CareerRepository;

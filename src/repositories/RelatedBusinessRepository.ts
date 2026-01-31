import dbConnect from "@/db";
import RelatedBusinessModel, {
  RelatedBusiness,
} from "../models/RelatedBusinessModel";
import { Model, Types } from "mongoose";

class RelatedBusinessRepository {
  private model: Model<RelatedBusiness>;

  constructor() {
    this.model = RelatedBusinessModel;
  }

  async findAll(
    searchQuery = "",
    page?: number,
    limit?: number,
    selected: Types.ObjectId[] = [],
    includeInactive = false
  ): Promise<{ businesses: RelatedBusiness[]; hasMore: boolean }> {
    await dbConnect();

    const queryConditions: any = {};
    if (!includeInactive) queryConditions.isActive = true;

    if (searchQuery.trim()) {
      const rx = new RegExp(searchQuery, "i");
      queryConditions.$or = [
        { slug: rx },
        { website: rx },
        { email: rx },
        { address: rx },
        { "title.en": rx },
        { "title.th": rx },
      ];
    }

    // main query (paged)
    let query = this.model.find(queryConditions).sort({ order: 1, createdAt: -1 });

    if (page !== undefined && limit !== undefined) {
      query = query.skip((page - 1) * limit).limit(limit);
    }

    const searchResults = await query.exec();

    const totalMatching = await this.model.countDocuments(queryConditions);
    const mainHasMore =
      page !== undefined && limit !== undefined
        ? page * limit < totalMatching
        : false;

    // selected docs (always included)
    // - intentionally NOT applying isActive filter here
    // - preserve order of `selected` array
    let selectedDocs: RelatedBusiness[] = [];
    if (selected.length) {
      selectedDocs = await this.findByIdsPreserveOrder(selected);
    }

    // merge + de-dupe (stable order like RoleRepository)
    const mergedMap = new Map<string, RelatedBusiness>();

    for (const doc of searchResults) {
      mergedMap.set(doc._id.toString(), doc);
    }
    for (const doc of selectedDocs) {
      mergedMap.set(doc._id.toString(), doc);
    }

    return {
      businesses: Array.from(mergedMap.values()),
      hasMore: mainHasMore,
    };
  }

  async findById(id: Types.ObjectId): Promise<RelatedBusiness | null> {
    await dbConnect();
    return this.model.findById(id).exec();
  }

  async findByIds(ids: Types.ObjectId[]): Promise<RelatedBusiness[]> {
    await dbConnect();
    return this.model.find({ _id: { $in: ids } }).exec();
  }

  async findByIdsPreserveOrder(
    ids: Types.ObjectId[]
  ): Promise<RelatedBusiness[]> {
    if (!ids.length) return [];

    await dbConnect();
    const docs = await this.model.find({ _id: { $in: ids } }).exec();

    const rank = new Map(ids.map((id, i) => [id.toString(), i]));
    docs.sort(
      (a, b) =>
        (rank.get(a._id.toString()) ?? 0) - (rank.get(b._id.toString()) ?? 0)
    );

    return docs;
  }

  async findBySlug(
    slug: string,
    includeInactive = false
  ): Promise<RelatedBusiness | null> {
    await dbConnect();
    const query: any = { slug };
    if (!includeInactive) query.isActive = true;
    return this.model.findOne(query).exec();
  }

  async create(data: Partial<RelatedBusiness>): Promise<RelatedBusiness> {
    await dbConnect();
    const doc = new this.model(data);
    return doc.save();
  }

  async update(
    id: Types.ObjectId,
    updateData: Partial<RelatedBusiness>
  ): Promise<RelatedBusiness | null> {
    await dbConnect();
    return this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id: Types.ObjectId): Promise<RelatedBusiness | null> {
    await dbConnect();
    return this.model.findByIdAndDelete(id).exec();
  }
}

export default RelatedBusinessRepository;

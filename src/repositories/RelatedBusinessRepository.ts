import dbConnect from "@/db";
import RelatedBusinessModel, { RelatedBusiness } from "../models/RelatedBusinessModel";
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
        includeInactive = false
    ): Promise<{ businesses: RelatedBusiness[]; hasMore: boolean }> {
        await dbConnect();

        const query: any = {};
        if (!includeInactive) query.isActive = true;

        if (searchQuery) {
            const rx = new RegExp(searchQuery, "i");
            query.$or = [
                { slug: rx },
                { website: rx },
                { email: rx },
                { address: rx },
                // common language keys:
                { "title.en": rx },
                { "title.th": rx },
            ];
        }

        let q = this.model.find(query).sort({ order: 1, createdAt: -1 });

        if (page !== undefined && limit !== undefined) {
            q = q.skip((page - 1) * limit).limit(limit);
        }

        const businesses = await q.exec();
        const totalMatching = await this.model.countDocuments(query);

        const hasMore =
            page !== undefined && limit !== undefined
                ? page * limit < totalMatching
                : false;

        return { businesses, hasMore };
    }

    async findById(id: Types.ObjectId): Promise<RelatedBusiness | null> {
        await dbConnect();
        return this.model.findById(id).exec();
    }

    async findBySlug(slug: string, includeInactive = false): Promise<RelatedBusiness | null> {
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

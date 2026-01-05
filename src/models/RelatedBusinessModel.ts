import mongoose, { Schema, Document, Types } from "mongoose";

export const relatedBusinessModelName = "RelatedBusiness";

export type SocialPlatform = "facebook" | "instagram" | "twitter" | "linkedin";

export interface RelatedBusinessBase {
    slug: string;
    title: any;
    subtitle?: any;
    description?: any;

    image?: string;
    website?: string;
    address?: string;
    email?: string;
    mapLink?: string;

    operatingHours?: { day: string; open: string; close: string }[];
    contacts?: { name: string; number: string }[];
    tags?: { value: string }[];
    socialLinks?: { platform: SocialPlatform | string; url: string }[];


    order?: number;
    isActive?: boolean;
}

export interface RelatedBusiness extends RelatedBusinessBase, Document {
    _id: Types.ObjectId;
}

export interface RelatedBusinessAPI extends RelatedBusinessBase {
    _id: string;
    createdAt?: string;
    updatedAt?: string;
}

const relatedBusinessSchema = new Schema<RelatedBusiness>(
    {
        slug: { type: String, required: true, unique: true, trim: true },


        title: { type: Schema.Types.Mixed, required: true },
        subtitle: { type: Schema.Types.Mixed },
        description: { type: Schema.Types.Mixed },

        image: { type: String },
        website: { type: String },
        address: { type: String },
        email: { type: String },
        mapLink: { type: String },
        operatingHours: {
            type: [
                {
                    day: { type: String, required: true },
                    open: { type: String, required: true },
                    close: { type: String, required: true },
                },
            ],
            default: [],
        },

        contacts: {
            type: [
                {
                    name: { type: String, required: true },
                    number: { type: String, required: true },
                },
            ],
            default: [],
        },

        tags: {
            type: [{ value: { type: String, required: true } }],
            default: [],
        },

        socialLinks: {
            type: [
                {
                    platform: { type: String, required: true },
                    url: { type: String, required: true },
                },
            ],
            default: [],
        },

        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);


relatedBusinessSchema.index({ slug: 1 }, { unique: true });
relatedBusinessSchema.index({ isActive: 1, order: 1, createdAt: -1 });

const RelatedBusinessModel =
    mongoose.models?.[relatedBusinessModelName] ||
    mongoose.model<RelatedBusiness>(relatedBusinessModelName, relatedBusinessSchema);

export default RelatedBusinessModel;

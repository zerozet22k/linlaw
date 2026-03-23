import mongoose, { Document, Schema, Types } from "mongoose";
import type { LanguageJson } from "@/i18n/types";
import { careerModelName } from ".";

export const CAREER_EMPLOYMENT_TYPES = [
  "fullTime",
  "partTime",
  "contract",
  "internship",
  "temporary",
  "freelance",
  "remote",
  "hybrid",
  "onsite",
] as const;

export type CareerEmploymentType =
  (typeof CAREER_EMPLOYMENT_TYPES)[number];

export const CAREER_SALARY_PERIODS = ["year", "month", "day", "hour"] as const;
export type CareerSalaryPeriod = (typeof CAREER_SALARY_PERIODS)[number];

export interface CareerTag {
  value: string;
}

export interface CareerTextBlock {
  text: LanguageJson;
}

export interface CareerSalary {
  currency?: string;
  min?: number;
  max?: number;
  period?: CareerSalaryPeriod;
}

export interface CareerBase {
  title: LanguageJson;
  summary?: LanguageJson;
  department?: string;
  location?: string;
  employmentType?: CareerEmploymentType;
  tags?: CareerTag[];
  postedAt?: string;
  closingDate?: string;
  salary?: CareerSalary;
  description?: LanguageJson;
  responsibilities?: CareerTextBlock[];
  requirements?: CareerTextBlock[];
  benefits?: CareerTextBlock[];
  order?: number;
  isActive?: boolean;
}

export interface Career extends CareerBase, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface CareerAPI extends CareerBase {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

const tagSchema = new Schema<CareerTag>(
  {
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const textBlockSchema = new Schema<CareerTextBlock>(
  {
    text: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const salarySchema = new Schema<CareerSalary>(
  {
    currency: { type: String, trim: true },
    min: { type: Number },
    max: { type: Number },
    period: {
      type: String,
      enum: CAREER_SALARY_PERIODS,
    },
  },
  { _id: false }
);

const careerSchema = new Schema<Career>(
  {
    title: { type: Schema.Types.Mixed, required: true },
    summary: { type: Schema.Types.Mixed },
    department: { type: String, trim: true },
    location: { type: String, trim: true },
    employmentType: {
      type: String,
      enum: CAREER_EMPLOYMENT_TYPES,
    },
    tags: {
      type: [tagSchema],
      default: [],
    },
    postedAt: { type: String, trim: true },
    closingDate: { type: String, trim: true },
    salary: {
      type: salarySchema,
      default: undefined,
    },
    description: { type: Schema.Types.Mixed },
    responsibilities: {
      type: [textBlockSchema],
      default: [],
    },
    requirements: {
      type: [textBlockSchema],
      default: [],
    },
    benefits: {
      type: [textBlockSchema],
      default: [],
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

careerSchema.index({ isActive: 1, order: 1, createdAt: -1 });
careerSchema.index({ "title.en": 1, department: 1, location: 1 });

const CareerModel =
  mongoose.models?.[careerModelName] ||
  mongoose.model<Career>(careerModelName, careerSchema);

export default CareerModel;

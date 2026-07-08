import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICompany extends Document {
    ycId: number;
    name: string;
    slug: string;
    domain?: string;
    logoUrl?: string;
    oneLiner?: string;
    longDescription?: string;
    batch?: string;
    isHiring: boolean;
    tags: string[];
    teamSize?: number;
    status?: string;
    industry?: string;
    stage?: string;
    location?: string;
    launchedAt?: Date;
    ycUrl?: string;
    lastSyncedAt: Date;
}

const companySchema: Schema<ICompany> = new Schema({
    ycId: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true },
    domain: { type: String, trim: true, lowercase: true },
    logoUrl: { type: String },
    oneLiner: { type: String },
    longDescription: { type: String },
    batch: { type: String },
    isHiring: { type: Boolean, default: false },
    tags: [{ type: String }],
    teamSize: { type: Number },
    status: { type: String },
    industry: { type: String },
    stage: { type: String },
    location: { type: String },
    launchedAt: { type: Date },
    ycUrl: { type: String },
    lastSyncedAt: { type: Date, default: Date.now },
});

companySchema.index({ name: "text" });

export const Company: Model<ICompany> = mongoose.model<ICompany>("Company", companySchema);
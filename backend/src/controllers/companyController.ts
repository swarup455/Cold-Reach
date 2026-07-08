import type { Request, Response } from "express";
import { Company } from "../models/companyModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getCompanies = asyncHandler(async (req: Request, res: Response) => {
    const { batch, isHiring, tag, search, page = "1", limit = "90" } = req.query;

    const filter: Record<string, unknown> = {};

    if (batch) filter.batch = batch;
    if (isHiring !== undefined) filter.isHiring = isHiring === "true";
    if (tag) filter.tags = tag;
    if (search) {
        filter.name = { $regex: search as string, $options: "i" };
    }

    const pageNum = Math.max(parseInt(page as string, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit as string, 10) || 60, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const [companies, total] = await Promise.all([
        Company.find(filter).sort({ lastSyncedAt: -1 }).skip(skip).limit(limitNum),
        Company.countDocuments(filter),
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                companies,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum),
                },
            },
            "Companies fetched successfully"
        )
    );
});

const getCompanyById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    const company = await Company.findById(id);
    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    return res.status(200).json(new ApiResponse(200, company, "Company fetched successfully"));
});

export { getCompanies, getCompanyById };
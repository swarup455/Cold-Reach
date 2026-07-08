import type { Request, Response } from "express";
import { Company } from "../models/companyModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getCompanies = asyncHandler(async (req: Request, res: Response) => {
    const {
        batch,
        hiring,
        industry,
        teamSize,
        location,
        tags,
        sort,
        search,
        page = "1",
        limit = "90",
    } = req.query;

    const filter: Record<string, any> = {};

    if (batch) {
        filter.batch = batch;
    }

    if (hiring) {
        filter.isHiring = hiring === "yes";
    }

    if (industry) {
        filter.industry = {
            $in: (industry as string).split(","),
        };
    }

    if (location) {
        filter.location = {
            $regex: location as string,
            $options: "i",
        };
    }

    if (tags) {
        filter.tags = {
            $in: (tags as string).split(","),
        };
    }

    if (search) {
        filter.name = {
            $regex: search as string,
            $options: "i",
        };
    }

    if (teamSize) {
        switch (teamSize) {
            case "1-10":
                filter.teamSize = { $gte: 1, $lte: 10 };
                break;
            case "11-50":
                filter.teamSize = { $gte: 11, $lte: 50 };
                break;
            case "51-200":
                filter.teamSize = { $gte: 51, $lte: 200 };
                break;
            case "201-500":
                filter.teamSize = { $gte: 201, $lte: 500 };
                break;
            case "500+":
                filter.teamSize = { $gte: 501 };
                break;
        }
    }

    let sortOption: Record<string, 1 | -1> = {
        lastSyncedAt: -1,
    };

    switch (sort) {
        case "name":
            sortOption = { name: 1 };
            break;
        case "hiring":
            sortOption = { isHiring: -1 };
            break;
        case "teamSize":
            sortOption = { teamSize: -1 };
            break;
    }

    const pageNum = Math.max(parseInt(page as string, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit as string, 10) || 90, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const [companies, total] = await Promise.all([
        Company.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum),
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

    return res
        .status(200)
        .json(new ApiResponse(200, company, "Company fetched successfully"));
});

export { getCompanies, getCompanyById };
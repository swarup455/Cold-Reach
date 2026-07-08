import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { User, type IUser } from "../models/authModel.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

interface DecodedToken extends JwtPayload {
    _id: string;
    email: string;
    name: string;
}

export const verifyJWT = asyncHandler(
    async (req: Request, _res: Response, next: NextFunction) => {
        const token =
            req.cookies?.token ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request — no token provided");
        }

        let decoded: DecodedToken;
        try {
            decoded = jwt.verify(
                token,
                process.env.TOKEN_SECRET as string
            ) as DecodedToken;
        } catch (error) {
            throw new ApiError(401, "Invalid or expired token");
        }

        const user = await User.findById(decoded._id).select("-password");

        if (!user) {
            throw new ApiError(401, "Invalid token — user not found");
        }

        req.user = user;
        next();
    }
);
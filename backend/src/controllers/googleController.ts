import type { Request, Response } from "express";
import oauth2Client from "../config/googleOAuth.js";
import { User } from "../models/authModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

export const connectGoogle = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized request");
        }
        const state = jwt.sign(
            {
                userId: req.user._id,
            },
            process.env.TOKEN_SECRET!,
            {
                expiresIn: "10m",
            }
        );

        const url = oauth2Client.generateAuthUrl({
            access_type: "offline",
            prompt: "consent",
            scope: [
                "https://www.googleapis.com/auth/gmail.send",
            ],
            state,
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    url,
                },
                "Google authorization URL generated."
            )
        );
    }
);

export const googleCallback = asyncHandler(
    async (req: Request, res: Response) => {
        const code = req.query.code as string;
        const state = req.query.state as string;

        const { userId } = jwt.verify(
            state,
            process.env.TOKEN_SECRET!
        ) as {
            userId: string;
        };

        if (!code || !state) {
            throw new ApiError(400, "Invalid Google callback");
        }

        const { tokens } = await oauth2Client.getToken(code);

        if (!tokens.refresh_token) {
            throw new ApiError(
                400,
                "Refresh token not received from Google"
            );
        }

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        user.gmailConnected = true;

        if (tokens.refresh_token) {
            user.gmailRefreshToken = tokens.refresh_token;
        }

        await user.save();

        return res.redirect(
            `${process.env.CORS_ORIGIN}/onboarding?gmail=connected`
        );
    }
);

export const getGoogleStatus = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized request");
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    gmailConnected: req.user.gmailConnected,
                },
                "Google connection status fetched successfully."
            )
        );
    }
);

export const disconnectGoogle = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized request");
        }

        await User.findByIdAndUpdate(req.user._id, {
            gmailConnected: false,
            gmailRefreshToken: null,
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "Google account disconnected successfully."
            )
        );
    }
);

export const sendEmail = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized request");
        }

        const { to, subject, html } = req.body;

        if (!to || !subject || !html) {
            throw new ApiError(
                400,
                "To, subject and html are required."
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "Email endpoint is ready."
            )
        );
    }
);
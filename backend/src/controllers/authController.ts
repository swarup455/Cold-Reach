import type { Request, Response } from "express";
import { User } from "../models/authModel.js";
import redis from "../utils/redis.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendOTPEmail } from "../utils/mailer.js";
import { uploadBufferToCloudinary } from "../config/cloudinary.js";

const OTP_EXPIRY_SECONDS = 180;

const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const JSON_FIELDS = [
    "location",
    "education",
    "experience",
    "skills",
    "projects",
    "certifications",
    "jobPreferences",
    "preferredLocations",
];

const PLAIN_FIELDS = [
    "phoneNumber",
    "dateOfBirth",
    "headline",
    "bio",
    "yearsOfExperience",
    "employmentStatus",
    "linkedin",
    "github",
    "portfolio",
];

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "Name, email and password are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        if (existingUser.isVerified) {
            throw new ApiError(409, "User with this email already exists");
        }
        existingUser.name = name;
        existingUser.password = password;
        await existingUser.save();

        const otp = generateOTP();
        await redis.set(`email-verify:${existingUser._id}`, otp, { ex: OTP_EXPIRY_SECONDS });
        await sendOTPEmail(email, otp);

        return res.status(200).json(new ApiResponse(200, existingUser, "OTP resent to email"));
    }

    const user = await User.create({ name, email, password });

    const otp = generateOTP();
    await redis.set(`email-verify:${user._id}`, otp, { ex: OTP_EXPIRY_SECONDS });
    await sendOTPEmail(email, otp);

    const createdUser = await User.findById(user._id).select("-password");

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User registered. OTP sent to email."));
});

const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        throw new ApiError(400, "userId and otp are required");
    }

    const storedOTP = await redis.get(`email-verify:${userId}`);

    if (!storedOTP) {
        throw new ApiError(400, "OTP expired or not found. Please request a new one.");
    }
    console.log("storedOTP:", storedOTP, typeof storedOTP, "| incoming otp:", otp, typeof otp);

    if (String(storedOTP) !== String(otp).trim()) {
        throw new ApiError(400, "Invalid OTP");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { isVerified: true },
        { new: true }
    ).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await redis.del(`email-verify:${userId}`);

    return res.status(200).json(new ApiResponse(200, user, "Email verified successfully"));
});

const resendOTP = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
        throw new ApiError(400, "User is already verified");
    }

    const otp = generateOTP();
    await redis.set(`email-verify:${userId}`, otp, { ex: OTP_EXPIRY_SECONDS });
    await sendOTPEmail(user.email, otp);

    return res.status(200).json(new ApiResponse(200, {}, "New OTP sent to email"));
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    if (!user.isVerified) {
        throw new ApiError(403, "Please verify your email before logging in");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const token = user.generateToken();
    const loggedInUser = await User.findById(user._id).select("-password");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .cookie("token", token, options)
        .json(new ApiResponse(200, { user: loggedInUser, token }, "Login successful"));
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .clearCookie("token", options)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

function parseField(key: string, value: unknown) {
    if (!JSON_FIELDS.includes(key)) return value;

    if (typeof value !== "string") return value;

    try {
        return JSON.parse(value);
    } catch {
        throw new ApiError(400, `Invalid JSON provided for field: ${key}`);
    }
}

const updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const files = req.files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;

    const updates: Record<string, unknown> = {};

    for (const field of PLAIN_FIELDS) {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    }

    for (const field of JSON_FIELDS) {
        if (req.body[field] !== undefined) {
            updates[field] = parseField(field, req.body[field]);
        }
    }

    const profilePhotoFile = files?.profilePhoto?.[0];
    if (profilePhotoFile) {
        const result = await uploadBufferToCloudinary(
            profilePhotoFile.buffer,
            "profile-photos"
        );
        updates.profilePhoto = result.secure_url;
    } else if (req.body.profilePhoto !== undefined) {
        updates.profilePhoto = req.body.profilePhoto;
    }

    const resumeFile = files?.resume?.[0];
    if (resumeFile) {
        const result = await uploadBufferToCloudinary(resumeFile.buffer, "resumes");
        updates.resumeUrl = result.secure_url;
    } else if (req.body.resumeUrl !== undefined) {
        updates.resumeUrl = req.body.resumeUrl;
    }

    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, "No valid fields provided to update");
    }

    updates.isProfileComplete = true;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true, context: "query" }
    ).select("-password");

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
        throw new ApiError(404, "User not found");
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .clearCookie("token", options)
        .json(new ApiResponse(200, {}, "Account deleted successfully"));
});

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Current user fetched successfully"));
});

export {
    registerUser,
    verifyOTP,
    resendOTP,
    loginUser,
    logoutUser,
    updateProfile,
    getCurrentUser,
    deleteAccount,
};
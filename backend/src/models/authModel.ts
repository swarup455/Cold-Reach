import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";

interface IEducation {
    level: string;
    degree?: string;
    institution: string;
    fieldOfStudy?: string;
    startYear?: number;
    endYear?: number;
    cgpaOrPercentage?: number;
}

interface IExperience {
    company: string;
    role: string;
    startDate: Date;
    endDate?: Date;
    isCurrent: boolean;
    description?: string;
}

interface IProject {
    title: string;
    description?: string;
    techStack?: string[];
    link?: string;
}

interface ICertification {
    name: string;
    issuingBody?: string;
    date?: Date;
    credentialLink?: string;
}

interface IJobPreferences {
    desiredRole?: string;
    employmentType?: "full-time" | "internship" | "contract";
    workMode?: "remote" | "hybrid" | "onsite";
    expectedSalary?: number;
    noticePeriodDays?: number;
    preferredLocations?: string[];
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
    isProfileComplete: boolean;
    gmailConnected: boolean;
    gmailRefreshToken?: string;

    profilePhoto?: string;
    phoneNumber?: string;
    location?: {
        city?: string;
        state?: string;
        country?: string;
    };
    dateOfBirth?: Date;

    headline?: string;
    bio?: string;
    yearsOfExperience?: number;
    employmentStatus?: "employed" | "open-to-work" | "student" | "fresher";

    education: IEducation[];
    experience: IExperience[];
    skills: string[];
    projects: IProject[];
    certifications: ICertification[];

    linkedin?: string;
    github?: string;
    portfolio?: string;
    resumeUrl?: string;

    jobPreferences?: IJobPreferences;

    isPasswordCorrect(password: string): Promise<boolean>;
    generateToken(): string;
}

const educationSchema = new Schema<IEducation>(
    {
        level: { type: String, required: true },
        degree: { type: String },
        institution: { type: String, required: true },
        fieldOfStudy: { type: String },
        startYear: { type: Number },
        endYear: { type: Number },
        cgpaOrPercentage: { type: Number },
    },
    { _id: false }
);

const experienceSchema = new Schema<IExperience>(
    {
        company: { type: String, required: true },
        role: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        isCurrent: { type: Boolean, default: false },
        description: { type: String },
    },
    { _id: false }
);

const projectSchema = new Schema<IProject>(
    {
        title: { type: String, required: true },
        description: { type: String },
        techStack: [{ type: String }],
        link: { type: String },
    },
    { _id: false }
);

const certificationSchema = new Schema<ICertification>(
    {
        name: { type: String, required: true },
        issuingBody: { type: String },
        date: { type: Date },
        credentialLink: { type: String },
    },
    { _id: false }
);

const jobPreferencesSchema = new Schema<IJobPreferences>(
    {
        desiredRole: { type: String },
        employmentType: {
            type: String,
            enum: ["full-time", "internship", "contract"],
        },
        workMode: {
            type: String,
            enum: ["remote", "hybrid", "onsite"],
        },
        expectedSalary: { type: Number },
        noticePeriodDays: { type: Number },
        preferredLocations: [{ type: String }],
    },
    { _id: false }
);

const userSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        gmailConnected: {
            type: Boolean,
            default: false,
        },

        gmailRefreshToken: {
            type: String,
            default: null,
        },
        isVerified: { type: Boolean },
        isProfileComplete: { type: Boolean, default: false },
        profilePhoto: { type: String },
        phoneNumber: { type: String },
        location: {
            city: { type: String },
            state: { type: String },
            country: { type: String },
        },
        dateOfBirth: { type: Date },

        headline: { type: String },
        bio: { type: String },
        yearsOfExperience: { type: Number, default: 0 },
        employmentStatus: {
            type: String,
            enum: ["employed", "open-to-work", "student", "fresher"],
        },

        education: [educationSchema],
        experience: [experienceSchema],
        skills: [{ type: String }],
        projects: [projectSchema],
        certifications: [certificationSchema],

        linkedin: { type: String },
        github: { type: String },
        portfolio: { type: String },
        resumeUrl: { type: String },

        jobPreferences: jobPreferencesSchema,
    },
    { timestamps: true }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.index(
    { createdAt: 1 },
    {
        expireAfterSeconds: 600,
        partialFilterExpression: { isVerified: false },
    }
);

userSchema.methods.isPasswordCorrect = async function (
    password: string
): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function (): string {
    const options: any = {
        expiresIn: (process.env.TOKEN_EXPIRY || "7d") as SignOptions["expiresIn"],
    };

    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
        },
        process.env.TOKEN_SECRET as string,
        options
    );
};

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
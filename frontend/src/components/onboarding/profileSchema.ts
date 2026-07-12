import { z } from "zod";

// ---------- Reusable field helpers ----------

// Required URL field
export const urlField = z
    .string()
    .trim()
    .min(1, "This field is required")
    .url("Enter a valid URL");

// Optional URL field — empty string is allowed, but if something is entered it must be a valid URL
export const optionalUrlField = z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || z.string().url().safeParse(val).success, {
        message: "Enter a valid URL",
    });

// A field that holds either a newly selected File (fresh upload) or an existing URL string (already-uploaded value)
const fileOrUrlField = (message: string) =>
    z.union([
        z.instanceof(File),
        z.string().trim().url(message),
    ]);

// Same as above but optional (empty string allowed, field can be skipped)
const optionalFileOrUrlField = z.union([
    z.instanceof(File),
    z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
]);

// Required numeric field that rejects empty string / NaN instead of silently coercing to 0
const requiredNumber = (message: string) =>
    z.preprocess(
        (val) => (val === "" || val === null || val === undefined ? undefined : val),
        z.coerce.number({ error: message })
    );

// Required "select" style field: disallows the empty-string placeholder from being treated as valid
const requiredEnum = <T extends [string, ...string[]]>(values: T, message: string) =>
    z
        .enum(values)
        .refine((val) => val !== "", { message });

// ---------- Sub-schemas ----------

export const educationSchema = z
    .object({
        level: z.string().trim().min(1, "Level is required"),
        degree: z.string().trim().min(1, "Degree is required"),
        institution: z.string().trim().min(1, "Institution is required"),
        fieldOfStudy: z.string().trim().min(1, "Field of study is required"),
        startYear: requiredNumber("Start year is required")
            .pipe(z.number().int().min(1950, "Enter a valid start year").max(2100, "Enter a valid start year")),
        endYear: requiredNumber("End year is required")
            .pipe(z.number().int().min(1950, "Enter a valid end year").max(2100, "Enter a valid end year")),
        cgpaOrPercentage: requiredNumber("CGPA/percentage is required").pipe(
            z.number().min(0, "Cannot be negative").max(100, "Cannot exceed 100")
        ),
    })
    .superRefine((data, ctx) => {
        if (data.endYear < data.startYear) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "End year cannot be before start year",
                path: ["endYear"],
            });
        }
    });

export const experienceSchema = z
    .object({
        company: z.string().trim().min(1, "Company is required"),
        role: z.string().trim().min(1, "Role is required"),
        startDate: z.string().trim().min(1, "Start date is required"),
        endDate: z.string().trim().optional().or(z.literal("")),
        isCurrent: z.boolean().default(false),
        description: z.string().trim().min(1, "Description is required"),
    })
    .superRefine((data, ctx) => {
        if (!data.isCurrent && !data.endDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "End date is required unless this is your current role",
                path: ["endDate"],
            });
        }

        if (data.endDate && !data.isCurrent) {
            const start = new Date(data.startDate);
            const end = new Date(data.endDate);
            if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end < start) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "End date cannot be before start date",
                    path: ["endDate"],
                });
            }
        }

        if (data.isCurrent && data.endDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Current role should not have an end date",
                path: ["endDate"],
            });
        }
    });

export const projectSchema = z.object({
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().trim().min(1, "Description is required"),
    techStack: z.array(z.string()).min(1, "Add at least one technology"),
    link: optionalUrlField,
});

export const certificationSchema = z.object({
    name: z.string().trim().min(1, "Certification name is required"),
    issuingBody: z.string().trim().min(1, "Issuing body is required"),
    date: z.string().trim().min(1, "Date is required"),
    credentialLink: optionalUrlField,
});

export const jobPreferencesSchema = z.object({
    desiredRole: z.string().trim().min(1, "Desired role is required"),
    employmentType: requiredEnum(
        ["full-time", "internship", "contract", ""],
        "Employment type is required"
    ),
    workMode: requiredEnum(["remote", "hybrid", "onsite", ""], "Work mode is required"),
    expectedSalary: requiredNumber("Expected salary is required").pipe(
        z.number().min(0, "Cannot be negative")
    ),
    noticePeriodDays: requiredNumber("Notice period is required").pipe(
        z.number().min(0, "Cannot be negative")
    ),
    preferredLocations: z.array(z.string()).min(1, "Add at least one preferred location"),
});

// ---------- Root schema ----------

export const profileDetailsSchema = z.object({
    fullName: z.string().trim().min(1, "Full name is required"),
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),

    profilePhoto: optionalFileOrUrlField,
    phoneNumber: z.string().trim().min(1, "Phone number is required"),
    location: z.object({
        city: z.string().trim().min(1, "City is required"),
        state: z.string().trim().min(1, "State is required"),
        country: z.string().trim().min(1, "Country is required"),
    }),
    dateOfBirth: z.string().trim().min(1, "Date of birth is required"),

    headline: z
        .string()
        .trim()
        .min(1, "Headline is required")
        .max(120, "Keep your headline under 120 characters"),
    bio: z
        .string()
        .trim()
        .min(1, "Bio is required")
        .max(500, "Keep your bio under 500 characters"),
    yearsOfExperience: requiredNumber("Years of experience is required").pipe(
        z.number().min(0, "Cannot be negative").max(60, "Enter a valid number of years")
    ),
    employmentStatus: requiredEnum(
        ["employed", "open-to-work", "student", "fresher", ""],
        "Employment status is required"
    ),

    education: z.array(educationSchema).min(1, "Add at least one education entry"),
    experience: z.array(experienceSchema).default([]),
    skills: z.array(z.string()).min(1, "Add at least one skill"),
    projects: z.array(projectSchema).min(1, "Add at least one project"),
    certifications: z.array(certificationSchema).default([]),

    linkedin: optionalUrlField,
    github: optionalUrlField,
    portfolio: optionalUrlField,
    resumeUrl: fileOrUrlField("Upload your resume"),

    jobPreferences: jobPreferencesSchema,

    googleConnected: z.boolean().refine((val) => val === true, {
        message: "Connect your Google account to continue",
    }),
});

export type ProfileDetailsValues = z.infer<typeof profileDetailsSchema>;
export type ProfileDetailsInput = z.input<typeof profileDetailsSchema>;

export interface ProfileDetailsProps {
    fullName: string;
    email: string;
    isGoogleConnected: boolean;
    onConnectGoogle: () => void | Promise<void>;
    onSubmit: (values: ProfileDetailsValues) => void | Promise<void>;
    defaultValues?: Partial<ProfileDetailsInput>;
    isLoading?: boolean;
    errorMessage?: string | null;
}

export interface GoogleConnectStepProps {
    isGoogleConnected: boolean;
    onConnectGoogle: () => void | Promise<void>;
}

export function buildDefaultValues(
    fullName: string,
    email: string,
    isGoogleConnected: boolean,
    overrides?: Partial<ProfileDetailsInput>
): ProfileDetailsInput {
    return {
        fullName,
        email,
        profilePhoto: "",
        phoneNumber: "",
        location: { city: "", state: "", country: "" },
        dateOfBirth: "",
        headline: "",
        bio: "",
        yearsOfExperience: "" as unknown as number,
        employmentStatus: "",
        education: [],
        experience: [],
        skills: [],
        projects: [],
        certifications: [],
        linkedin: "",
        github: "",
        portfolio: "",
        resumeUrl: "",
        jobPreferences: {
            desiredRole: "",
            employmentType: "",
            workMode: "",
            expectedSalary: "" as unknown as number,
            noticePeriodDays: "" as unknown as number,
            preferredLocations: [],
        },
        googleConnected: isGoogleConnected,
        ...overrides,
    };
}
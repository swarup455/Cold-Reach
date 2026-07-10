import { useEffect, useState, type KeyboardEvent } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Loader2, X } from "lucide-react";
import { GoogleConnectStep } from "./GoogleConnectStep";
import BasicInfoStep from "./BasicInfoStep";
import EducationStep from "./EducationStep";
import ExperienceStep from "./ExperienceStep";
import SkillsStep from "./SkillsStep";
import ProjectsStep from "./ProjectsStep";
import CertificationsStep from "./CertificationsStep";
import JobPreferencesStep from "./JobPreferencesStep";
import LinksStep from "./LinksStep";

const urlField = z
    .string()
    .trim()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal(""));

const educationSchema = z.object({
    level: z.string().trim().min(1, "Level is required"),
    degree: z.string().trim().optional().or(z.literal("")),
    institution: z.string().trim().min(1, "Institution is required"),
    fieldOfStudy: z.string().trim().optional().or(z.literal("")),
    startYear: z.coerce.number().int().optional(),
    endYear: z.coerce.number().int().optional(),
    cgpaOrPercentage: z.coerce.number().optional(),
});

const experienceSchema = z.object({
    company: z.string().trim().min(1, "Company is required"),
    role: z.string().trim().min(1, "Role is required"),
    startDate: z.string().trim().min(1, "Start date is required"),
    endDate: z.string().trim().optional().or(z.literal("")),
    isCurrent: z.boolean().default(false),
    description: z.string().trim().optional().or(z.literal("")),
});

const projectSchema = z.object({
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().trim().optional().or(z.literal("")),
    techStack: z.array(z.string()).default([]),
    link: urlField,
});

const certificationSchema = z.object({
    name: z.string().trim().min(1, "Certification name is required"),
    issuingBody: z.string().trim().optional().or(z.literal("")),
    date: z.string().trim().optional().or(z.literal("")),
    credentialLink: urlField,
});

const jobPreferencesSchema = z.object({
    desiredRole: z.string().trim().optional().or(z.literal("")),
    employmentType: z.enum(["full-time", "internship", "contract"]).optional(),
    workMode: z.enum(["remote", "hybrid", "onsite"]).optional(),
    expectedSalary: z.coerce.number().min(0).optional(),
    noticePeriodDays: z.coerce.number().min(0).optional(),
    preferredLocations: z.array(z.string()).default([]),
});

export const profileDetailsSchema = z.object({
    fullName: z.string(),
    email: z.string(),

    profilePhoto: urlField,
    phoneNumber: z.string().trim().optional().or(z.literal("")),
    location: z.object({
        city: z.string().trim().optional().or(z.literal("")),
        state: z.string().trim().optional().or(z.literal("")),
        country: z.string().trim().optional().or(z.literal("")),
    }),
    dateOfBirth: z.string().trim().optional().or(z.literal("")),

    headline: z
        .string()
        .trim()
        .max(120, "Keep your headline under 120 characters")
        .optional()
        .or(z.literal("")),
    bio: z
        .string()
        .trim()
        .max(500, "Keep your bio under 500 characters")
        .optional()
        .or(z.literal("")),
    yearsOfExperience: z.coerce.number().min(0, "Cannot be negative").optional(),
    employmentStatus: z
        .enum(["employed", "open-to-work", "student", "fresher"])
        .optional(),

    education: z.array(educationSchema).default([]),
    experience: z.array(experienceSchema).default([]),
    skills: z.array(z.string()).default([]),
    projects: z.array(projectSchema).default([]),
    certifications: z.array(certificationSchema).default([]),

    linkedin: urlField,
    github: urlField,
    portfolio: urlField,
    resumeUrl: urlField,

    jobPreferences: jobPreferencesSchema,

    googleConnected: z.boolean().refine((val) => val === true, {
        message: "Connect your Google account to continue",
    }),
});

export type ProfileDetailsValues = z.infer<typeof profileDetailsSchema>;
export type ProfileDetailsInput = z.input<typeof profileDetailsSchema>;


function buildDefaultValues(
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
        yearsOfExperience: undefined,
        employmentStatus: undefined,
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
            employmentType: undefined,
            workMode: undefined,
            expectedSalary: undefined,
            noticePeriodDays: undefined,
            preferredLocations: [],
        },
        googleConnected: isGoogleConnected,
        ...overrides,
    };
}

const inputClasses =
    "bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500";


export function SectionHeading({
    icon: Icon,
    title,
    action,
}: {
    icon: typeof GraduationCap;
    title: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {title}
                </h2>
            </div>
            {action}
        </div>
    );
}

interface TagListFieldProps {
    label: string;
    values: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
}

export function TagListField({ label, values, onChange, placeholder }: TagListFieldProps) {
    const [draft, setDraft] = useState("");

    const addTag = () => {
        const trimmed = draft.trim();
        if (trimmed && !values.includes(trimmed)) {
            onChange([...values, trimmed]);
        }
        setDraft("");
    };

    const removeTag = (tag: string) => {
        onChange(values.filter((v) => v !== tag));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder ?? `Add ${label.toLowerCase()} and press Enter`}
                    className={inputClasses}
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    className="shrink-0 border-slate-300 dark:border-slate-700"
                >
                    Add
                </Button>
            </div>
            {values.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {values.map((tag) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="flex items-center gap-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                aria-label={`Remove ${tag}`}
                                className="ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}

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

const STEPS = [
    { key: "google", label: "Google" },
    { key: "basic", label: "Basic Info" },
    { key: "education", label: "Education" },
    { key: "experience", label: "Experience" },
    { key: "skills", label: "Skills" },
    { key: "projects", label: "Projects" },
    { key: "certifications", label: "Certifications" },
    { key: "jobPreferences", label: "Preferences" },
    { key: "links", label: "Links" },
] as const;

function StepTracker({ currentStep }: { currentStep: number }) {
    return (
        <div className="mb-8">
            <div className="flex items-center">
                {STEPS.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    return (
                        <div key={step.key} className="flex flex-1 items-center last:flex-none">
                            <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${isCompleted
                                        ? "bg-blue-600 text-white"
                                        : isActive
                                            ? "border-2 border-blue-600 text-blue-600 dark:text-blue-400"
                                            : "border border-slate-300 text-slate-400 dark:border-slate-700 dark:text-slate-500"
                                    }`}
                            >
                                {isCompleted ? "✓" : index + 1}
                            </div>
                            {index < STEPS.length - 1 && (
                                <div
                                    className={`mx-2 h-0.5 flex-1 ${isCompleted ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"
                                        }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="mt-1.5 hidden sm:flex">
                {STEPS.map((step) => (
                    <span
                        key={step.key}
                        className="flex-1 text-center text-[11px] text-slate-500 dark:text-slate-400"
                    >
                        {step.label}
                    </span>
                ))}
            </div>
        </div>
    );
}

export function ProfileDetails({
    fullName,
    email,
    isGoogleConnected,
    onConnectGoogle,
    onSubmit,
    defaultValues,
    isLoading = false,
    errorMessage = null,
}: ProfileDetailsProps) {
    const methods = useForm<ProfileDetailsInput>({
        resolver: zodResolver(profileDetailsSchema),
        defaultValues: buildDefaultValues(fullName, email, isGoogleConnected, defaultValues),
        mode: "onSubmit",
    });
    const { handleSubmit, setValue } = methods;

    const [currentStep, setCurrentStep] = useState(0);
    const isLastStep = currentStep === STEPS.length - 1;
    const isFirstStep = currentStep === 0;

    const goNext = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
    const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

    useEffect(() => {
        setValue("googleConnected", isGoogleConnected, { shouldValidate: true });
    }, [isGoogleConnected, setValue]);

    const submitHandler = handleSubmit((values) => onSubmit(values as unknown as ProfileDetailsValues));

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <GoogleConnectStep
                        isGoogleConnected={isGoogleConnected}
                        onConnectGoogle={onConnectGoogle}
                    />
                );
            case 1:
                return <BasicInfoStep fullName={fullName} email={email} />;
            case 2:
                return <EducationStep />;
            case 3:
                return <ExperienceStep />;
            case 4:
                return <SkillsStep />;
            case 5:
                return <ProjectsStep />;
            case 6:
                return <CertificationsStep />;
            case 7:
                return <JobPreferencesStep />;
            case 8:
                return <LinksStep />;
            default:
                return null;
        }
    };
    return (
        <FormProvider {...methods}>
            <StepTracker currentStep={currentStep} />
            <form onSubmit={submitHandler} noValidate className="space-y-10">
                {renderStep()}

                {errorMessage && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
                )}

                <div className="flex items-center justify-between gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={goBack}
                        disabled={isFirstStep}
                        className="border-slate-300 dark:border-slate-700"
                    >
                        Back
                    </Button>

                    {isLastStep ? (
                        <Button
                            type="submit"
                            size="xl"
                            disabled={isLoading}
                            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving profile...
                                </>
                            ) : (
                                "Save and continue"
                            )}
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={goNext}
                            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                        >
                            Next
                        </Button>
                    )}
                </div>
            </form>
        </FormProvider>
    );
}
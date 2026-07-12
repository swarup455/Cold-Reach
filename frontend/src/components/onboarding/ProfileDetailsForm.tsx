import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { profileDetailsSchema, buildDefaultValues, type ProfileDetailsValues, type ProfileDetailsInput } from "./profileSchema";

import { GoogleConnectStep } from "./steps/GoogleConnectStep";
import BasicInfoLinksStep from "./steps/BasicInfoLinksStep";
import EducationExperienceStep from "./steps/EducationExperienceStep";
import SkillsProjectsCertsStep from "./steps/SkillsProjectsCertsStep";
import JobPreferencesStep from "./steps/JobPreferencesStep";

import type { ProfileDetailsProps } from "./profileSchema";

const STEPS = [
    { key: "google", label: "Google", mobileLabel: "Google" },
    { key: "basic", label: "Basic Info & Links", mobileLabel: "Basic" },
    { key: "eduExp", label: "Education & Experience", mobileLabel: "Edu/Exp" },
    { key: "skillsProjectsCerts", label: "Skills, Projects & Certs", mobileLabel: "Skills" },
    { key: "jobPreferences", label: "Preferences", mobileLabel: "Prefs" },
];

const STEP_FIELDS: (keyof ProfileDetailsInput)[][] = [
    ["googleConnected"],
    [
        "profilePhoto",
        "phoneNumber",
        "dateOfBirth",
        "employmentStatus",
        "location",
        "yearsOfExperience",
        "headline",
        "bio",
        "linkedin",
        "github",
        "portfolio",
        "resumeUrl",
    ],
    ["education", "experience"],
    ["skills", "projects", "certifications"],
    ["jobPreferences"],
];

function StepTracker({ currentStep }: { currentStep: number }) {
    return (
        <div className="mb-6 w-full px-1">
            <div className="flex w-full items-start justify-between">
                {STEPS.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    const isLast = index === STEPS.length - 1;

                    return (
                        <div
                            key={step.key}
                            className={`flex items-start ${isLast ? "flex-none" : "flex-1"}`}
                        >
                            <div className="flex w-16 shrink-0 flex-col items-center sm:w-20">
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors sm:h-9 sm:w-9 sm:text-sm ${isCompleted
                                        ? "bg-blue-600 text-white"
                                        : isActive
                                            ? "border-2 border-blue-600 text-blue-600 dark:text-blue-400"
                                            : "border border-slate-300 text-slate-400 dark:border-slate-700 dark:text-slate-500"
                                        }`}
                                >
                                    {isCompleted ? "✓" : index + 1}
                                </div>

                                <span
                                    className={`mt-1 text-center text-[10px] leading-tight wrap-break sm:text-[11px] ${isActive
                                        ? "font-semibold text-blue-600 dark:text-blue-400"
                                        : "text-slate-500 dark:text-slate-400"
                                        }`}
                                >
                                    <span className="sm:hidden">{step.mobileLabel}</span>
                                    <span className="hidden sm:inline">{step.label}</span>
                                </span>
                            </div>

                            {!isLast && (
                                <div
                                    className={`mt-4 h-0.5 flex-1 shrink self-start ${isCompleted ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"
                                        }`}
                                />
                            )}
                        </div>
                    );
                })}
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

    useEffect(() => {
        if (defaultValues) {
            methods.reset(buildDefaultValues(fullName, email, isGoogleConnected, defaultValues));
        }
    }, [defaultValues]);

    const { handleSubmit, setValue, trigger } = methods;

    const [currentStep, setCurrentStep] = useState(0);
    const [isValidatingStep, setIsValidatingStep] = useState(false);
    const isLastStep = currentStep === STEPS.length - 1;
    const isFirstStep = currentStep === 0;

    const goNext = async () => {
        setIsValidatingStep(true);
        const isStepValid = await trigger(STEP_FIELDS[currentStep]);
        setIsValidatingStep(false);
        if (isStepValid) {
            setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
        } else {
            toast.error("Please fix the highlighted fields before continuing.");
        }
    };
    const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

    useEffect(() => {
        setValue("googleConnected", isGoogleConnected, { shouldValidate: true });
    }, [isGoogleConnected, setValue]);

    const submitHandler = handleSubmit((values) =>
        onSubmit(values as unknown as ProfileDetailsValues)
    );

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
                return <BasicInfoLinksStep fullName={fullName} email={email} />;
            case 2:
                return <EducationExperienceStep />;
            case 3:
                return <SkillsProjectsCertsStep />;
            case 4:
                return <JobPreferencesStep />;
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
                            disabled={isValidatingStep}
                            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                        >
                            {isValidatingStep ? "Checking..." : "Next"}
                        </Button>
                    )}
                </div>
            </form>
        </FormProvider>
    );
}
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Link2 } from "lucide-react";

import { InputField } from "@/components/form/InputField";
import { TextareaField } from "@/components/form/TextareaField";
import { SelectField } from "@/components/form/SelectField";
import { SectionHeading } from "@/components/form/SectionHeading";
import { FileUploadField } from "@/components/form/FileUploadField";

import type { ProfileDetailsInput } from "../profileSchema";

const disabledInputClasses =
    "cursor-not-allowed border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400";

const EMPLOYMENT_STATUS_OPTIONS = [
    { label: "Employed", value: "employed" },
    { label: "Open to work", value: "open-to-work" },
    { label: "Student", value: "student" },
    { label: "Fresher", value: "fresher" },
];

interface BasicInfoLinksStepProps {
    fullName: string;
    email: string;
}

const BasicInfoLinksStep = ({ fullName, email }: BasicInfoLinksStepProps) => {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<ProfileDetailsInput>();

    return (
        <div className="space-y-10">
            {/* ---------- Basic information ---------- */}
            <section className="space-y-4">
                <SectionHeading icon={Sparkles} title="Basic information" />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-slate-300">Full name</Label>
                        <Input value={fullName} disabled readOnly className={disabledInputClasses} />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-slate-300">Email</Label>
                        <Input value={email} disabled readOnly className={disabledInputClasses} />
                    </div>

                    <div className="sm:col-span-2">
                        <Controller
                            control={control}
                            name="profilePhoto"
                            render={({ field }) => (
                                <FileUploadField
                                    label="Profile photo"
                                    accept="image/*"
                                    file={field.value instanceof File ? field.value : null}
                                    onChange={field.onChange}
                                    error={errors.profilePhoto?.message as string | undefined}
                                />
                            )}
                        />
                    </div>

                    <InputField
                        label="Phone number"
                        placeholder="+91 98765 43210"
                        {...register("phoneNumber")}
                        error={errors.phoneNumber?.message}
                    />

                    <InputField
                        label="Date of birth"
                        type="date"
                        {...register("dateOfBirth")}
                        error={errors.dateOfBirth?.message}
                    />

                    <Controller
                        control={control}
                        name="employmentStatus"
                        render={({ field }) => (
                            <SelectField
                                label="Employment status"
                                placeholder="Select status"
                                value={field.value}
                                onValueChange={field.onChange}
                                options={EMPLOYMENT_STATUS_OPTIONS}
                                error={errors.employmentStatus?.message}
                            />
                        )}
                    />

                    <InputField
                        label="City"
                        placeholder="City"
                        {...register("location.city")}
                        error={errors.location?.city?.message}
                    />

                    <InputField
                        label="State"
                        placeholder="State"
                        {...register("location.state")}
                        error={errors.location?.state?.message}
                    />

                    <InputField
                        label="Country"
                        placeholder="Country"
                        {...register("location.country")}
                        error={errors.location?.country?.message}
                    />

                    <InputField
                        label="Years of experience"
                        type="number"
                        min={0}
                        placeholder="0"
                        {...register("yearsOfExperience")}
                        error={errors.yearsOfExperience?.message}
                    />

                    <div className="sm:col-span-2">
                        <InputField
                            label="Headline"
                            placeholder="e.g. Frontend Engineer building delightful UIs"
                            {...register("headline")}
                            error={errors.headline?.message}
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <TextareaField
                            label="Bio"
                            rows={4}
                            placeholder="Tell us a little about yourself"
                            {...register("bio")}
                            error={errors.bio?.message}
                        />
                    </div>
                </div>
            </section>

            {/* ---------- Links ---------- */}
            <section className="space-y-4">
                <SectionHeading icon={Link2} title="Links" />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InputField
                        label="LinkedIn"
                        placeholder="https://linkedin.com/in/..."
                        {...register("linkedin")}
                        error={errors.linkedin?.message}
                    />

                    <InputField
                        label="GitHub"
                        placeholder="https://github.com/..."
                        {...register("github")}
                        error={errors.github?.message}
                    />

                    <InputField
                        label="Portfolio"
                        placeholder="https://..."
                        {...register("portfolio")}
                        error={errors.portfolio?.message}
                    />

                    <div className="sm:col-span-2">
                        <Controller
                            control={control}
                            name="resumeUrl"
                            render={({ field }) => (
                                <FileUploadField
                                    label="Resume"
                                    accept=".pdf,.doc,.docx"
                                    file={field.value instanceof File ? field.value : null}
                                    onChange={field.onChange}
                                    error={errors.resumeUrl?.message as string | undefined}
                                />
                            )}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BasicInfoLinksStep;
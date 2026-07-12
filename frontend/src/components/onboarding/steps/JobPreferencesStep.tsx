import { Controller, useFormContext } from "react-hook-form";
import { Settings2 } from "lucide-react";

import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import { TagListField } from "@/components/form/TagListField";
import { SectionHeading } from "@/components/form/SectionHeading";

import type { ProfileDetailsInput } from "../profileSchema";

const EMPLOYMENT_TYPE_OPTIONS = [
    { label: "Full-time", value: "full-time" },
    { label: "Internship", value: "internship" },
    { label: "Contract", value: "contract" },
];

const WORK_MODE_OPTIONS = [
    { label: "Remote", value: "remote" },
    { label: "Hybrid", value: "hybrid" },
    { label: "Onsite", value: "onsite" },
];

const JobPreferencesStep = () => {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<ProfileDetailsInput>();

    return (
        <section className="space-y-4">
            <SectionHeading icon={Settings2} title="Job preferences" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                    label="Desired role"
                    placeholder="e.g. Frontend Engineer"
                    {...register("jobPreferences.desiredRole")}
                    error={errors.jobPreferences?.desiredRole?.message}
                />

                <Controller
                    control={control}
                    name="jobPreferences.employmentType"
                    render={({ field }) => (
                        <SelectField
                            label="Employment type"
                            placeholder="Select type"
                            value={field.value}
                            onValueChange={field.onChange}
                            options={EMPLOYMENT_TYPE_OPTIONS}
                            error={errors.jobPreferences?.employmentType?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="jobPreferences.workMode"
                    render={({ field }) => (
                        <SelectField
                            label="Work mode"
                            placeholder="Select mode"
                            value={field.value}
                            onValueChange={field.onChange}
                            options={WORK_MODE_OPTIONS}
                            error={errors.jobPreferences?.workMode?.message}
                        />
                    )}
                />

                <InputField
                    label="Expected salary"
                    type="number"
                    min={0}
                    placeholder="e.g. 1200000"
                    {...register("jobPreferences.expectedSalary")}
                    error={errors.jobPreferences?.expectedSalary?.message}
                />

                <InputField
                    label="Notice period (days)"
                    type="number"
                    min={0}
                    placeholder="e.g. 30"
                    {...register("jobPreferences.noticePeriodDays")}
                    error={errors.jobPreferences?.noticePeriodDays?.message}
                />

                <div className="sm:col-span-2">
                    <Controller
                        control={control}
                        name="jobPreferences.preferredLocations"
                        render={({ field }) => (
                            <TagListField
                                label="Preferred locations"
                                values={field.value ?? []}
                                onChange={field.onChange}
                                placeholder="e.g. Bengaluru, and press Enter"
                                error={errors.jobPreferences?.preferredLocations?.message}
                            />
                        )}
                    />
                </div>
            </div>
        </section>
    );
};

export default JobPreferencesStep;
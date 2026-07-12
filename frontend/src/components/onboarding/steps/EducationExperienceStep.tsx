import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap, Briefcase, Plus, Trash2 } from "lucide-react";

import { InputField } from "@/components/form/InputField";
import { TextareaField } from "@/components/form/TextareaField";
import { SectionHeading } from "@/components/form/SectionHeading";
import { EmptyState } from "@/components/form/EmptyState";

import type { ProfileDetailsInput } from "../profileSchema";

const emptyEducation = {
    level: "",
    degree: "",
    institution: "",
    fieldOfStudy: "",
    startYear: undefined,
    endYear: undefined,
    cgpaOrPercentage: undefined,
};

const emptyExperience = {
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
};

const EducationExperienceStep = () => {
    const {
        register,
        control,
        watch,
        formState: { errors },
    } = useFormContext<ProfileDetailsInput>();

    const educationArray = useFieldArray({ control, name: "education" });
    const experienceArray = useFieldArray({ control, name: "experience" });

    return (
        <div className="space-y-10">
            {/* ---------- Education ---------- */}
            <section className="space-y-4">
                <SectionHeading
                    icon={GraduationCap}
                    title="Education"
                    action={
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => educationArray.append(emptyEducation)}
                            className="border-slate-300 dark:border-slate-700"
                        >
                            <Plus className="mr-1.5 h-4 w-4" />
                            Add
                        </Button>
                    }
                />

                {educationArray.fields.length === 0 && (
                    <EmptyState message="No education added yet." />
                )}

                {educationArray.fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="relative space-y-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                    >
                        <button
                            type="button"
                            onClick={() => educationArray.remove(index)}
                            aria-label="Remove education entry"
                            className="absolute right-3 top-3 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>

                        <div className="grid grid-cols-1 gap-4 pr-6 sm:grid-cols-2">
                            <InputField
                                label="Level"
                                placeholder="e.g. Bachelor's"
                                {...register(`education.${index}.level`)}
                                error={errors.education?.[index]?.level?.message}
                            />

                            <InputField
                                label="Degree"
                                placeholder="e.g. B.Tech"
                                {...register(`education.${index}.degree`)}
                                error={errors.education?.[index]?.degree?.message}
                            />

                            <InputField
                                label="Institution"
                                placeholder="e.g. IIT Delhi"
                                {...register(`education.${index}.institution`)}
                                error={errors.education?.[index]?.institution?.message}
                            />

                            <InputField
                                label="Field of study"
                                placeholder="e.g. Computer Science"
                                {...register(`education.${index}.fieldOfStudy`)}
                                error={errors.education?.[index]?.fieldOfStudy?.message}
                            />

                            <InputField
                                label="Start year"
                                type="number"
                                placeholder="2019"
                                {...register(`education.${index}.startYear`)}
                                error={errors.education?.[index]?.startYear?.message}
                            />

                            <InputField
                                label="End year"
                                type="number"
                                placeholder="2023"
                                {...register(`education.${index}.endYear`)}
                                error={errors.education?.[index]?.endYear?.message}
                            />

                            <div className="sm:col-span-2">
                                <InputField
                                    label="CGPA / Percentage"
                                    type="number"
                                    step="0.01"
                                    placeholder="e.g. 8.5"
                                    {...register(`education.${index}.cgpaOrPercentage`)}
                                    error={errors.education?.[index]?.cgpaOrPercentage?.message}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* ---------- Experience ---------- */}
            <section className="space-y-4">
                <SectionHeading
                    icon={Briefcase}
                    title="Experience"
                    action={
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => experienceArray.append(emptyExperience)}
                            className="border-slate-300 dark:border-slate-700"
                        >
                            <Plus className="mr-1.5 h-4 w-4" />
                            Add
                        </Button>
                    }
                />

                {experienceArray.fields.length === 0 && (
                    <EmptyState message="No experience added yet." />
                )}

                {experienceArray.fields.map((field, index) => {
                    const isCurrent = watch(`experience.${index}.isCurrent`);
                    return (
                        <div
                            key={field.id}
                            className="relative space-y-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                        >
                            <button
                                type="button"
                                onClick={() => experienceArray.remove(index)}
                                aria-label="Remove experience entry"
                                className="absolute right-3 top-3 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>

                            <div className="grid grid-cols-1 gap-4 pr-6 sm:grid-cols-2">
                                <InputField
                                    label="Company"
                                    placeholder="e.g. Acme Inc."
                                    {...register(`experience.${index}.company`)}
                                    error={errors.experience?.[index]?.company?.message}
                                />

                                <InputField
                                    label="Role"
                                    placeholder="e.g. Software Engineer"
                                    {...register(`experience.${index}.role`)}
                                    error={errors.experience?.[index]?.role?.message}
                                />

                                <InputField
                                    label="Start date"
                                    type="date"
                                    {...register(`experience.${index}.startDate`)}
                                    error={errors.experience?.[index]?.startDate?.message}
                                />

                                <InputField
                                    label="End date"
                                    type="date"
                                    disabled={Boolean(isCurrent)}
                                    {...register(`experience.${index}.endDate`)}
                                    className="disabled:cursor-not-allowed disabled:opacity-50"
                                    error={errors.experience?.[index]?.endDate?.message}
                                />

                                <div className="flex items-center gap-2 sm:col-span-2">
                                    <Controller
                                        control={control}
                                        name={`experience.${index}.isCurrent`}
                                        render={({ field: currentField }) => (
                                            <Checkbox
                                                id={`current-${index}`}
                                                checked={currentField.value}
                                                onCheckedChange={currentField.onChange}
                                            />
                                        )}
                                    />
                                    <Label
                                        htmlFor={`current-${index}`}
                                        className="text-sm font-normal text-slate-600 dark:text-slate-400"
                                    >
                                        I currently work here
                                    </Label>
                                </div>

                                <div className="sm:col-span-2">
                                    <TextareaField
                                        label="Description"
                                        rows={3}
                                        placeholder="What did you work on?"
                                        {...register(`experience.${index}.description`)}
                                        error={errors.experience?.[index]?.description?.message}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>
        </div>
    );
};

export default EducationExperienceStep;
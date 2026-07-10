import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import type { ProfileDetailsInput } from "./ProfileDetailsForm";

const inputClasses =
    "bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500";
const labelClasses = "text-slate-700 dark:text-slate-300";

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-xs text-red-600 dark:text-red-400">{message}</p>;
}

function SectionHeading({
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

function EmptyState({ message }: { message: string }) {
    return (
        <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            {message}
        </p>
    );
}

const emptyEducation = {
    level: "",
    degree: "",
    institution: "",
    fieldOfStudy: "",
    startYear: undefined,
    endYear: undefined,
    cgpaOrPercentage: undefined,
};

const EducationStep = () => {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<ProfileDetailsInput>();

    const educationArray = useFieldArray({ control, name: "education" });

    return (
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
                        <div className="space-y-2">
                            <Label className={labelClasses}>Level</Label>
                            <Input
                                {...register(`education.${index}.level`)}
                                placeholder="e.g. Bachelor's"
                                className={inputClasses}
                            />
                            <FieldError message={errors.education?.[index]?.level?.message} />
                        </div>
                        <div className="space-y-2">
                            <Label className={labelClasses}>Degree</Label>
                            <Input
                                {...register(`education.${index}.degree`)}
                                placeholder="e.g. B.Tech"
                                className={inputClasses}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className={labelClasses}>Institution</Label>
                            <Input
                                {...register(`education.${index}.institution`)}
                                placeholder="e.g. IIT Delhi"
                                className={inputClasses}
                            />
                            <FieldError message={errors.education?.[index]?.institution?.message} />
                        </div>
                        <div className="space-y-2">
                            <Label className={labelClasses}>Field of study</Label>
                            <Input
                                {...register(`education.${index}.fieldOfStudy`)}
                                placeholder="e.g. Computer Science"
                                className={inputClasses}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className={labelClasses}>Start year</Label>
                            <Input
                                type="number"
                                {...register(`education.${index}.startYear`)}
                                placeholder="2019"
                                className={inputClasses}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className={labelClasses}>End year</Label>
                            <Input
                                type="number"
                                {...register(`education.${index}.endYear`)}
                                placeholder="2023"
                                className={inputClasses}
                            />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label className={labelClasses}>CGPA / Percentage</Label>
                            <Input
                                type="number"
                                step="0.01"
                                {...register(`education.${index}.cgpaOrPercentage`)}
                                placeholder="e.g. 8.5"
                                className={inputClasses}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default EducationStep;
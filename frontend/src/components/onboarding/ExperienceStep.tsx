import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Briefcase, Plus, Trash2 } from "lucide-react";
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
    icon: typeof Briefcase;
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

const emptyExperience = {
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
};

const ExperienceStep = () => {
    const {
        register,
        control,
        watch,
        formState: { errors },
    } = useFormContext<ProfileDetailsInput>();

    const experienceArray = useFieldArray({ control, name: "experience" });

    return (
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
                            <div className="space-y-2">
                                <Label className={labelClasses}>Company</Label>
                                <Input
                                    {...register(`experience.${index}.company`)}
                                    placeholder="e.g. Acme Inc."
                                    className={inputClasses}
                                />
                                <FieldError message={errors.experience?.[index]?.company?.message} />
                            </div>
                            <div className="space-y-2">
                                <Label className={labelClasses}>Role</Label>
                                <Input
                                    {...register(`experience.${index}.role`)}
                                    placeholder="e.g. Software Engineer"
                                    className={inputClasses}
                                />
                                <FieldError message={errors.experience?.[index]?.role?.message} />
                            </div>
                            <div className="space-y-2">
                                <Label className={labelClasses}>Start date</Label>
                                <Input
                                    type="date"
                                    {...register(`experience.${index}.startDate`)}
                                    className={inputClasses}
                                />
                                <FieldError message={errors.experience?.[index]?.startDate?.message} />
                            </div>
                            <div className="space-y-2">
                                <Label className={labelClasses}>End date</Label>
                                <Input
                                    type="date"
                                    disabled={Boolean(isCurrent)}
                                    {...register(`experience.${index}.endDate`)}
                                    className={`${inputClasses} disabled:cursor-not-allowed disabled:opacity-50`}
                                />
                            </div>
                            <div className="flex items-center gap-2 sm:col-span-2">
                                <Controller
                                    control={control}
                                    name={`experience.${index}.isCurrent`}
                                    render={({ field }) => (
                                        <Checkbox
                                            id={`current-${index}`}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
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
                            <div className="space-y-2 sm:col-span-2">
                                <Label className={labelClasses}>Description</Label>
                                <Textarea
                                    {...register(`experience.${index}.description`)}
                                    rows={3}
                                    placeholder="What did you work on?"
                                    className={inputClasses}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
};

export default ExperienceStep;
import { Controller, useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FolderGit2, Plus, Trash2 } from "lucide-react";
import type { ProfileDetailsInput } from "./ProfileDetailsForm";
import { TagListField } from "./ProfileDetailsForm";

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
    icon: typeof FolderGit2;
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

const emptyProject = {
    title: "",
    description: "",
    techStack: [] as string[],
    link: "",
};

const ProjectsStep = () => {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<ProfileDetailsInput>();

    const projectsArray = useFieldArray({ control, name: "projects" });

    return (
        <section className="space-y-4">
            <SectionHeading
                icon={FolderGit2}
                title="Projects"
                action={
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => projectsArray.append(emptyProject)}
                        className="border-slate-300 dark:border-slate-700"
                    >
                        <Plus className="mr-1.5 h-4 w-4" />
                        Add
                    </Button>
                }
            />
            {projectsArray.fields.length === 0 && (
                <EmptyState message="No projects added yet." />
            )}
            {projectsArray.fields.map((field, index) => (
                <div
                    key={field.id}
                    className="relative space-y-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                >
                    <button
                        type="button"
                        onClick={() => projectsArray.remove(index)}
                        aria-label="Remove project"
                        className="absolute right-3 top-3 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-1 gap-4 pr-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label className={labelClasses}>Title</Label>
                            <Input
                                {...register(`projects.${index}.title`)}
                                placeholder="e.g. Personal portfolio"
                                className={inputClasses}
                            />
                            <FieldError message={errors.projects?.[index]?.title?.message} />
                        </div>
                        <div className="space-y-2">
                            <Label className={labelClasses}>Link</Label>
                            <Input
                                {...register(`projects.${index}.link`)}
                                placeholder="https://..."
                                className={inputClasses}
                            />
                            <FieldError message={errors.projects?.[index]?.link?.message} />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label className={labelClasses}>Description</Label>
                            <Textarea
                                {...register(`projects.${index}.description`)}
                                rows={3}
                                placeholder="What does this project do?"
                                className={inputClasses}
                            />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label className={labelClasses}>Tech stack</Label>
                            <Controller
                                control={control}
                                name={`projects.${index}.techStack`}
                                render={({ field }) => (
                                    <TagListField
                                        label="technology"
                                        values={field.value ?? []}
                                        onChange={field.onChange}
                                        placeholder="e.g. React, and press Enter"
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default ProjectsStep;
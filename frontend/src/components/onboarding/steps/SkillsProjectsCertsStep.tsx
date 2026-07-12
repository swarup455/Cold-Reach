import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sparkles, FolderGit2, Award, Plus, Trash2 } from "lucide-react";

import { InputField } from "@/components/form/InputField";
import { TextareaField } from "@/components/form/TextareaField";
import { TagListField } from "@/components/form/TagListField";
import { SectionHeading } from "@/components/form/SectionHeading";
import { EmptyState } from "@/components/form/EmptyState";

import type { ProfileDetailsInput } from "../profileSchema";

const emptyProject = {
    title: "",
    description: "",
    techStack: [] as string[],
    link: "",
};

const emptyCertification = {
    name: "",
    issuingBody: "",
    date: "",
    credentialLink: "",
};

const SkillsProjectsCertsStep = () => {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<ProfileDetailsInput>();

    const projectsArray = useFieldArray({ control, name: "projects" });
    const certificationsArray = useFieldArray({ control, name: "certifications" });

    return (
        <div className="space-y-10">
            {/* ---------- Skills ---------- */}
            <section className="space-y-4">
                <SectionHeading icon={Sparkles} title="Skills" />

                <Controller
                    control={control}
                    name="skills"
                    render={({ field }) => (
                        <TagListField
                            label="Skills"
                            values={field.value ?? []}
                            onChange={field.onChange}
                            placeholder="e.g. TypeScript, and press Enter"
                            error={errors.skills?.message}
                        />
                    )}
                />
            </section>

            {/* ---------- Projects ---------- */}
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
                            <InputField
                                label="Title"
                                placeholder="e.g. Personal portfolio"
                                {...register(`projects.${index}.title`)}
                                error={errors.projects?.[index]?.title?.message}
                            />

                            <InputField
                                label="Link"
                                placeholder="https://..."
                                {...register(`projects.${index}.link`)}
                                error={errors.projects?.[index]?.link?.message}
                            />

                            <div className="sm:col-span-2">
                                <TextareaField
                                    label="Description"
                                    rows={3}
                                    placeholder="What does this project do?"
                                    {...register(`projects.${index}.description`)}
                                    error={errors.projects?.[index]?.description?.message}
                                />
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Controller
                                    control={control}
                                    name={`projects.${index}.techStack`}
                                    render={({ field: techField }) => (
                                        <TagListField
                                            label="Tech stack"
                                            values={techField.value ?? []}
                                            onChange={techField.onChange}
                                            placeholder="e.g. React, and press Enter"
                                            error={errors.projects?.[index]?.techStack?.message}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* ---------- Certifications ---------- */}
            <section className="space-y-4">
                <SectionHeading
                    icon={Award}
                    title="Certifications"
                    action={
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => certificationsArray.append(emptyCertification)}
                            className="border-slate-300 dark:border-slate-700"
                        >
                            <Plus className="mr-1.5 h-4 w-4" />
                            Add
                        </Button>
                    }
                />

                {certificationsArray.fields.length === 0 && (
                    <EmptyState message="No certifications added yet." />
                )}

                {certificationsArray.fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="relative space-y-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                    >
                        <button
                            type="button"
                            onClick={() => certificationsArray.remove(index)}
                            aria-label="Remove certification"
                            className="absolute right-3 top-3 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>

                        <div className="grid grid-cols-1 gap-4 pr-6 sm:grid-cols-2">
                            <InputField
                                label="Name"
                                placeholder="e.g. AWS Certified Developer"
                                {...register(`certifications.${index}.name`)}
                                error={errors.certifications?.[index]?.name?.message}
                            />

                            <InputField
                                label="Issuing body"
                                placeholder="e.g. Amazon Web Services"
                                {...register(`certifications.${index}.issuingBody`)}
                                error={errors.certifications?.[index]?.issuingBody?.message}
                            />

                            <InputField
                                label="Date"
                                type="date"
                                {...register(`certifications.${index}.date`)}
                                error={errors.certifications?.[index]?.date?.message}
                            />

                            <InputField
                                label="Credential link"
                                placeholder="https://..."
                                {...register(`certifications.${index}.credentialLink`)}
                                error={errors.certifications?.[index]?.credentialLink?.message}
                            />
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default SkillsProjectsCertsStep;
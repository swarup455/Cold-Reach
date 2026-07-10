import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, Plus, Trash2 } from "lucide-react";
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
    icon: typeof Award;
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

const emptyCertification = {
    name: "",
    issuingBody: "",
    date: "",
    credentialLink: "",
};

const CertificationsStep = () => {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<ProfileDetailsInput>();

    const certificationsArray = useFieldArray({ control, name: "certifications" });

    return (
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
                        <div className="space-y-2">
                            <Label className={labelClasses}>Name</Label>
                            <Input
                                {...register(`certifications.${index}.name`)}
                                placeholder="e.g. AWS Certified Developer"
                                className={inputClasses}
                            />
                            <FieldError message={errors.certifications?.[index]?.name?.message} />
                        </div>
                        <div className="space-y-2">
                            <Label className={labelClasses}>Issuing body</Label>
                            <Input
                                {...register(`certifications.${index}.issuingBody`)}
                                placeholder="e.g. Amazon Web Services"
                                className={inputClasses}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className={labelClasses}>Date</Label>
                            <Input
                                type="date"
                                {...register(`certifications.${index}.date`)}
                                className={inputClasses}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className={labelClasses}>Credential link</Label>
                            <Input
                                {...register(`certifications.${index}.credentialLink`)}
                                placeholder="https://..."
                                className={inputClasses}
                            />
                            <FieldError
                                message={errors.certifications?.[index]?.credentialLink?.message}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default CertificationsStep;
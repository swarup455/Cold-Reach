import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link2 } from "lucide-react";
import type { ProfileDetailsInput } from "./ProfileDetailsForm";

const inputClasses =
    "bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500";
const labelClasses = "text-slate-700 dark:text-slate-300";

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-xs text-red-600 dark:text-red-400">{message}</p>;
}

function SectionHeading({ icon: Icon, title }: { icon: typeof Link2; title: string }) {
    return (
        <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h2>
        </div>
    );
}

const LinksStep = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext<ProfileDetailsInput>();

    return (
        <section className="space-y-4">
            <SectionHeading icon={Link2} title="Links" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label className={labelClasses}>LinkedIn</Label>
                    <Input
                        {...register("linkedin")}
                        placeholder="https://linkedin.com/in/..."
                        className={inputClasses}
                    />
                    <FieldError message={errors.linkedin?.message} />
                </div>
                <div className="space-y-2">
                    <Label className={labelClasses}>GitHub</Label>
                    <Input
                        {...register("github")}
                        placeholder="https://github.com/..."
                        className={inputClasses}
                    />
                    <FieldError message={errors.github?.message} />
                </div>
                <div className="space-y-2">
                    <Label className={labelClasses}>Portfolio</Label>
                    <Input
                        {...register("portfolio")}
                        placeholder="https://..."
                        className={inputClasses}
                    />
                    <FieldError message={errors.portfolio?.message} />
                </div>
                <div className="space-y-2">
                    <Label className={labelClasses}>Resume URL</Label>
                    <Input
                        {...register("resumeUrl")}
                        placeholder="https://..."
                        className={inputClasses}
                    />
                    <FieldError message={errors.resumeUrl?.message} />
                </div>
            </div>
        </section>
    );
};

export default LinksStep;
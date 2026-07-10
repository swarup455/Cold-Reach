import { Controller, useFormContext } from "react-hook-form";
import { Sparkles } from "lucide-react";
import type { ProfileDetailsInput } from "./ProfileDetailsForm";
import { TagListField } from "./ProfileDetailsForm";

function SectionHeading({ icon: Icon, title }: { icon: typeof Sparkles; title: string }) {
    return (
        <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h2>
        </div>
    );
}

const SkillsStep = () => {
    const { control } = useFormContext<ProfileDetailsInput>();

    return (
        <section className="space-y-4">
            <SectionHeading icon={Sparkles} title="Skills" />
            <Controller
                control={control}
                name="skills"
                render={({ field }) => (
                    <TagListField
                        label="skill"
                        values={field.value ?? []}
                        onChange={field.onChange}
                        placeholder="e.g. TypeScript, and press Enter"
                    />
                )}
            />
        </section>
    );
};

export default SkillsStep;
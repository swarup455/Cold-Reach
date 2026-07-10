import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Settings2 } from "lucide-react";
import type { ProfileDetailsInput } from "./ProfileDetailsForm";
import { TagListField } from "./ProfileDetailsForm";

const inputClasses =
    "bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500";
const labelClasses = "text-slate-700 dark:text-slate-300";

function SectionHeading({ icon: Icon, title }: { icon: typeof Settings2; title: string }) {
    return (
        <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h2>
        </div>
    );
}

const JobPreferencesStep = () => {
    const { register, control } = useFormContext<ProfileDetailsInput>();

    return (
        <section className="space-y-4">
            <SectionHeading icon={Settings2} title="Job preferences" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label className={labelClasses}>Desired role</Label>
                    <Input
                        {...register("jobPreferences.desiredRole")}
                        placeholder="e.g. Frontend Engineer"
                        className={inputClasses}
                    />
                </div>
                <div className="space-y-2">
                    <Label className={labelClasses}>Employment type</Label>
                    <Controller
                        control={control}
                        name="jobPreferences.employmentType"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className={inputClasses}>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="full-time">Full-time</SelectItem>
                                    <SelectItem value="internship">Internship</SelectItem>
                                    <SelectItem value="contract">Contract</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <Label className={labelClasses}>Work mode</Label>
                    <Controller
                        control={control}
                        name="jobPreferences.workMode"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className={inputClasses}>
                                    <SelectValue placeholder="Select mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="remote">Remote</SelectItem>
                                    <SelectItem value="hybrid">Hybrid</SelectItem>
                                    <SelectItem value="onsite">Onsite</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <Label className={labelClasses}>Expected salary</Label>
                    <Input
                        type="number"
                        min={0}
                        {...register("jobPreferences.expectedSalary")}
                        placeholder="e.g. 1200000"
                        className={inputClasses}
                    />
                </div>
                <div className="space-y-2">
                    <Label className={labelClasses}>Notice period (days)</Label>
                    <Input
                        type="number"
                        min={0}
                        {...register("jobPreferences.noticePeriodDays")}
                        placeholder="e.g. 30"
                        className={inputClasses}
                    />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <Label className={labelClasses}>Preferred locations</Label>
                    <Controller
                        control={control}
                        name="jobPreferences.preferredLocations"
                        render={({ field }) => (
                            <TagListField
                                label="location"
                                values={field.value ?? []}
                                onChange={field.onChange}
                                placeholder="e.g. Bengaluru, and press Enter"
                            />
                        )}
                    />
                </div>
            </div>
        </section>
    );
};

export default JobPreferencesStep;
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import type { ProfileDetailsInput } from "./ProfileDetailsForm";

const inputClasses =
    "bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500";
const labelClasses = "text-slate-700 dark:text-slate-300";

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-xs text-red-600 dark:text-red-400">{message}</p>;
}

function SectionHeading({ icon: Icon, title }: { icon: typeof Sparkles; title: string }) {
    return (
        <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h2>
        </div>
    );
}

interface BasicInfoStepProps {
    fullName: string;
    email: string;
}

const BasicInfoStep = ({ fullName, email }: BasicInfoStepProps) => {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<ProfileDetailsInput>();

    return (
        <section className="space-y-4">
            <SectionHeading icon={Sparkles} title="Basic information" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label className={labelClasses}>Full name</Label>
                    <Input
                        value={fullName}
                        disabled
                        readOnly
                        className="cursor-not-allowed border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                    />
                </div>
                <div className="space-y-2">
                    <Label className={labelClasses}>Email</Label>
                    <Input
                        value={email}
                        disabled
                        readOnly
                        className="cursor-not-allowed border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                    />
                </div>
                <div className="space-y-2">
                    <Label className={labelClasses}>Profile photo URL</Label>
                    <Input
                        {...register("profilePhoto")}
                        placeholder="https://..."
                        className={inputClasses}
                    />
                    <FieldError message={errors.profilePhoto?.message} />
                </div>
                <div className="space-y-2">
                    <Label className={labelClasses}>Phone number</Label>
                    <Input
                        {...register("phoneNumber")}
                        placeholder="+91 98765 43210"
                        className={inputClasses}
                    />
                </div>
                <div className="space-y-2">
                    <Label className={labelClasses}>Date of birth</Label>
                    <Input type="date" {...register("dateOfBirth")} className={inputClasses} />
                </div>
                <div className="space-y-2">
                    <Label className={labelClasses}>Employment status</Label>
                    <Controller
                        control={control}
                        name="employmentStatus"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className={inputClasses}>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="employed">Employed</SelectItem>
                                    <SelectItem value="open-to-work">Open to work</SelectItem>
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="fresher">Fresher</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <Label className={labelClasses}>City</Label>
                    <Input {...register("location.city")} placeholder="City" className={inputClasses} />
                </div>
                <div className="space-y-2">
                    <Label className={labelClasses}>State</Label>
                    <Input {...register("location.state")} placeholder="State" className={inputClasses} />
                </div>
                <div className="space-y-2">
                    <Label className={labelClasses}>Country</Label>
                    <Input {...register("location.country")} placeholder="Country" className={inputClasses} />
                </div>
                <div className="space-y-2">
                    <Label className={labelClasses}>Years of experience</Label>
                    <Input
                        type="number"
                        min={0}
                        {...register("yearsOfExperience")}
                        placeholder="0"
                        className={inputClasses}
                    />
                    <FieldError message={errors.yearsOfExperience?.message} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <Label className={labelClasses}>Headline</Label>
                    <Input
                        {...register("headline")}
                        placeholder="e.g. Frontend Engineer building delightful UIs"
                        className={inputClasses}
                    />
                    <FieldError message={errors.headline?.message} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <Label className={labelClasses}>Bio</Label>
                    <Textarea
                        {...register("bio")}
                        rows={4}
                        placeholder="Tell us a little about yourself"
                        className={inputClasses}
                    />
                    <FieldError message={errors.bio?.message} />
                </div>
            </div>
        </section>
    );
};

export default BasicInfoStep;
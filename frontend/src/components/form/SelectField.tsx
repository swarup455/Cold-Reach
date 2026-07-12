import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Option {
    label: string;
    value: string;
}

interface SelectFieldProps {
    label: string;
    placeholder?: string;
    value?: string;
    onValueChange: (value: string | null) => void;
    error?: string;
    options: Option[];
    className?: string;
}

const inputClasses =
    "w-full bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500";

const labelClasses = "text-slate-700 dark:text-slate-300";

export function SelectField({
    label,
    placeholder,
    value,
    onValueChange,
    error,
    options,
    className,
}: SelectFieldProps) {
    return (
        <div className={className ?? "space-y-2"}>
            <Label className={labelClasses}>{label}</Label>

            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className={inputClasses}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent>
                    {options.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {error && (
                <p className="text-xs text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}
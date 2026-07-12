import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputFieldProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const inputClasses =
    "bg-white dark:bg-slate-950 w-full border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500";

export function InputField({
    label,
    error,
    className,
    ...props
}: InputFieldProps) {
    return (
        <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-300">
                {label}
            </Label>

            <Input
                className={`${inputClasses} ${className ?? ""}`}
                {...props}
            />

            {error && (
                <p className="text-xs text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}
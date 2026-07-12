import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TextareaFieldProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
}

const textareaClasses =
    "bg-white dark:bg-slate-950 w-full border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500";

const labelClasses =
    "text-slate-700 dark:text-slate-300";

export function TextareaField({
    label,
    error,
    className,
    ...props
}: TextareaFieldProps) {
    return (
        <div className="space-y-2">
            <Label className={labelClasses}>
                {label}
            </Label>

            <Textarea
                {...props}
                className={`${textareaClasses} ${className ?? ""}`}
            />

            {error && (
                <p className="text-xs text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}
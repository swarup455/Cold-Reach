import { useState, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

const inputClasses =
    "w-full bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500";

const badgeClasses =
    "flex items-center gap-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

const removeButtonClasses =
    "ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200";

interface TagListFieldProps {
    label: string;
    values: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    error?: string;
}

export function TagListField({
    label,
    values,
    onChange,
    placeholder,
    error,
}: TagListFieldProps) {
    const [draft, setDraft] = useState("");

    const addTag = () => {
        const tag = draft.trim();

        if (!tag) return;

        if (!values.some((value) => value.toLowerCase() === tag.toLowerCase())) {
            onChange([...values, tag]);
        }

        setDraft("");
    };

    const removeTag = (tag: string) => {
        onChange(values.filter((value) => value !== tag));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
        }
    };

    return (
        <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-300">
                {label}
            </Label>

            <div className="flex gap-2">
                <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                        placeholder ??
                        `Add ${label.toLowerCase()} and press Enter`
                    }
                    className={inputClasses}
                />

                <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    className="shrink-0 border-slate-300 dark:border-slate-700"
                >
                    Add
                </Button>
            </div>

            {!!values.length && (
                <div className="flex flex-wrap gap-2">
                    {values.map((tag) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className={badgeClasses}
                        >
                            {tag}

                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                aria-label={`Remove ${tag}`}
                                className={removeButtonClasses}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            {error && (
                <p className="text-xs text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}
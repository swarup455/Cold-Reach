import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, X } from "lucide-react";

interface FileUploadFieldProps {
    label: string;
    accept?: string;
    file?: File | null;
    error?: string;
    onChange: (file: File | null) => void;
}

const dropzoneClasses =
    "flex w-full items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-4 text-left transition-colors hover:border-blue-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-blue-500 dark:hover:bg-slate-900";

export function FileUploadField({
    label,
    accept,
    file,
    error,
    onChange,
}: FileUploadFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.files?.[0] ?? null);
    };

    const removeFile = () => {
        onChange(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-300">{label}</Label>

            {file ? (
                <div className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="h-4 w-4 shrink-0 text-blue-600" />
                        <span className="truncate text-sm text-slate-700 dark:text-slate-300">
                            {file.name}
                        </span>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={removeFile}
                        className="h-7 w-7 shrink-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className={dropzoneClasses}
                >
                    <UploadCloud className="h-5 w-5 shrink-0 text-slate-400" />

                    <span className="flex min-w-0 flex-1 items-center gap-1.5 text-sm">
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                            Click to upload
                        </span>
                        <span className="hidden text-slate-500 dark:text-slate-400 sm:inline">
                            or drag and drop
                        </span>
                    </span>

                    <span className="shrink-0 rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300">
                        Browse
                    </span>

                    <input
                        ref={inputRef}
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </button>
            )}

            {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}
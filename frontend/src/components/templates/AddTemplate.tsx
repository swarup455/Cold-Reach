import { useEffect, useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Bold,
    Italic,
    Underline,
    List,
    FileText,
    Braces,
} from "lucide-react";
import { FaLinkedin as Linkedin, FaGithub as Github } from "react-icons/fa";
import type { EmailTemplate } from "./TemplateCard";

const inputClasses =
    "bg-white dark:bg-slate-950 w-full border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500";
const labelClasses = "text-slate-700 dark:text-slate-300";

const VARIABLES = ["founderName", "company", "referrerName", "role"];

interface AddTemplateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (template: Omit<EmailTemplate, "id" | "createdAt">) => void;
    initialData?: EmailTemplate | null;
}

function ToolbarButton({
    icon: Icon,
    onClick,
    label,
}: {
    icon: typeof Bold;
    onClick: () => void;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
            <Icon className="h-4 w-4" />
        </button>
    );
}

function ToggleRow({
    icon: Icon,
    label,
    description,
    checked,
    onCheckedChange,
}: {
    icon: typeof FileText;
    label: string;
    description: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-900/60">
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800">
                    <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {label}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
                </div>
            </div>
            <Switch checked={checked} onCheckedChange={onCheckedChange} />
        </div>
    );
}

function VariablePicker({ onInsert }: { onInsert: (variable: string) => void }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
            >
                <Braces className="h-3.5 w-3.5" />
                Insert variable
            </button>

            {open && (
                <div className="absolute right-0 top-full z-10 mt-1 w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-md dark:border-slate-800 dark:bg-slate-900">
                    {VARIABLES.map((variable) => (
                        <button
                            key={variable}
                            type="button"
                            onClick={() => {
                                onInsert(variable);
                                setOpen(false);
                            }}
                            className="block w-full rounded-md px-2 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            {"{{" + variable + "}}"}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export function AddTemplateDialog({
    open,
    onOpenChange,
    onSave,
    initialData = null,
}: AddTemplateDialogProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const subjectRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState("");
    const [subject, setSubject] = useState("");
    const [includeResume, setIncludeResume] = useState(false);
    const [includeLinkedin, setIncludeLinkedin] = useState(false);
    const [includeGithub, setIncludeGithub] = useState(false);

    useEffect(() => {
        if (!open) return;

        setName(initialData?.name ?? "");
        setSubject(initialData?.subject ?? "");
        setIncludeResume(initialData?.includeResume ?? false);
        setIncludeLinkedin(initialData?.includeLinkedin ?? false);
        setIncludeGithub(initialData?.includeGithub ?? false);

        if (editorRef.current) {
            editorRef.current.innerHTML = initialData?.bodyHtml ?? "";
        }
    }, [open, initialData]);

    const applyFormat = (command: string) => {
        editorRef.current?.focus();
        document.execCommand(command);
    };

    const insertIntoSubject = (variable: string) => {
        const input = subjectRef.current;
        const token = `{{${variable}}}`;

        if (!input) {
            setSubject((prev) => prev + token);
            return;
        }

        const start = input.selectionStart ?? subject.length;
        const end = input.selectionEnd ?? subject.length;
        const nextValue = subject.slice(0, start) + token + subject.slice(end);

        setSubject(nextValue);

        requestAnimationFrame(() => {
            input.focus();
            const cursor = start + token.length;
            input.setSelectionRange(cursor, cursor);
        });
    };

    const insertIntoBody = (variable: string) => {
        editorRef.current?.focus();
        document.execCommand("insertText", false, `{{${variable}}}`);
    };

    const handleSave = () => {
        if (!name.trim() || !subject.trim()) return;

        onSave({
            name: name.trim(),
            subject: subject.trim(),
            bodyHtml: editorRef.current?.innerHTML ?? "",
            includeResume,
            includeLinkedin,
            includeGithub,
        });

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-2rem)] max-w-2xl sm:max-w-2xl max-h-[85vh] overflow-y-auto border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                <DialogHeader>
                    <DialogTitle className="text-slate-900 dark:text-slate-50">
                        {initialData ? "Edit template" : "New email template"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className={labelClasses}>Template name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. YC Founder Cold Email"
                            className={inputClasses}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className={labelClasses}>Subject line</Label>
                            <VariablePicker onInsert={insertIntoSubject} />
                        </div>
                        <Input
                            ref={subjectRef}
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g. Backend engineer excited about {{company}}"
                            className={inputClasses}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className={labelClasses}>Body</Label>
                        <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-800 dark:bg-slate-900/60">
                                <div className="flex items-center gap-1">
                                    <ToolbarButton
                                        icon={Bold}
                                        label="Bold"
                                        onClick={() => applyFormat("bold")}
                                    />
                                    <ToolbarButton
                                        icon={Italic}
                                        label="Italic"
                                        onClick={() => applyFormat("italic")}
                                    />
                                    <ToolbarButton
                                        icon={Underline}
                                        label="Underline"
                                        onClick={() => applyFormat("underline")}
                                    />
                                    <ToolbarButton
                                        icon={List}
                                        label="Bullet list"
                                        onClick={() => applyFormat("insertUnorderedList")}
                                    />
                                </div>
                                <VariablePicker onInsert={insertIntoBody} />
                            </div>

                            <div
                                ref={editorRef}
                                contentEditable
                                suppressContentEditableWarning
                                className="min-h-40 w-full bg-white px-3 py-2.5 text-sm text-slate-900 outline-none dark:bg-slate-950 dark:text-slate-50 empty:before:text-slate-400 empty:before:content-[attr(data-placeholder)] dark:empty:before:text-slate-500"
                                data-placeholder="Write your email content here..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <Label className={labelClasses}>Attachments &amp; links</Label>
                        <div className="space-y-2">
                            <ToggleRow
                                icon={FileText}
                                label="Attach resume PDF"
                                description="Include your uploaded resume with this email"
                                checked={includeResume}
                                onCheckedChange={setIncludeResume}
                            />
                            <ToggleRow
                                icon={Linkedin as any}
                                label="Include LinkedIn URL"
                                description="Add your LinkedIn profile link"
                                checked={includeLinkedin}
                                onCheckedChange={setIncludeLinkedin}
                            />
                            <ToggleRow
                                icon={Github as any}
                                label="Include GitHub URL"
                                description="Add your GitHub profile link"
                                checked={includeGithub}
                                onCheckedChange={setIncludeGithub}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="bg-white dark:bg-slate-950">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="border-slate-300 dark:border-slate-700"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSave}
                        className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                        {initialData ? "Save changes" : "Create template"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
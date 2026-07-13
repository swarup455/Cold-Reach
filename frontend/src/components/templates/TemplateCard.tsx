import { Mail, Pencil, Trash2, FileText } from "lucide-react";
import { FaLinkedin as Linkedin, FaGithub as Github } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    bodyHtml: string;
    includeResume: boolean;
    includeLinkedin: boolean;
    includeGithub: boolean;
    createdAt: string;
}

function stripHtml(html: string) {
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

interface TemplateCardProps {
    template: EmailTemplate;
    onEdit: (template: EmailTemplate) => void;
    onDelete: (id: string) => void;
}

export function TemplateCard({ template, onEdit, onDelete }: TemplateCardProps) {
    const preview = stripHtml(template.bodyHtml);

    return (
        <div className="flex min-w-0 flex-col gap-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800">
            <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 dark:bg-blue-500/10">
                        <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-900 dark:text-slate-100">
                            {template.name}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {template.subject}
                        </p>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => onEdit(template)}
                        aria-label="Edit template"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                        onClick={() => onDelete(template.id)}
                        aria-label="Delete template"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
                {preview || "No content yet."}
            </p>

            {(template.includeResume || template.includeLinkedin || template.includeGithub) && (
                <div className="flex flex-wrap gap-2">
                    {template.includeResume && (
                        <Badge
                            variant="secondary"
                            className="flex items-center gap-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                            <FileText className="h-3 w-3" />
                            Resume
                        </Badge>
                    )}
                    {template.includeLinkedin && (
                        <Badge
                            variant="secondary"
                            className="flex items-center gap-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                            <Linkedin className="h-3 w-3" />
                            LinkedIn
                        </Badge>
                    )}
                    {template.includeGithub && (
                        <Badge
                            variant="secondary"
                            className="flex items-center gap-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                            <Github className="h-3 w-3" />
                            GitHub
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}
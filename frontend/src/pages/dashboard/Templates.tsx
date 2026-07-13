import { useState } from "react";
import { Plus, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateCard, type EmailTemplate } from "@/components/templates/TemplateCard";
import { AddTemplateDialog } from "@/components/templates/AddTemplate";

const DEMO_TEMPLATES: EmailTemplate[] = [
    {
        id: "1",
        name: "YC Founder Cold Email",
        subject: "Backend engineer excited about {{company}}",
        bodyHtml:
            "<p>Hi {{founderName}},</p><p>I've been following {{company}} since your launch and would love to help build out your backend infra. I recently shipped a Redis-backed job queue system handling 10k+ requests/min.</p><p>Would love 15 minutes to chat.</p>",
        includeResume: true,
        includeLinkedin: true,
        includeGithub: true,
        createdAt: "2026-07-01",
    },
    {
        id: "2",
        name: "Follow-up after no response",
        subject: "Re: Backend engineer excited about {{company}}",
        bodyHtml:
            "<p>Hi {{founderName}},</p><p>Just floating this back to the top of your inbox in case it got buried. Still very interested in {{company}}!</p>",
        includeResume: false,
        includeLinkedin: true,
        includeGithub: false,
        createdAt: "2026-07-05",
    },
    {
        id: "3",
        name: "Referral intro email",
        subject: "Intro via {{referrerName}} — backend engineer",
        bodyHtml:
            "<p>Hi {{founderName}},</p><p>{{referrerName}} suggested I reach out — I'm a backend engineer with experience in Node.js, MongoDB, and LangChain, and I think there could be a great fit with {{company}}.</p>",
        includeResume: true,
        includeLinkedin: false,
        includeGithub: true,
        createdAt: "2026-07-08",
    },
];

const TemplatesPage = () => {
    const [templates, setTemplates] = useState<EmailTemplate[]>(DEMO_TEMPLATES);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

    const openCreateDialog = () => {
        setEditingTemplate(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (template: EmailTemplate) => {
        setEditingTemplate(template);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setTemplates((prev) => prev.filter((t) => t.id !== id));
    };

    const handleSave = (data: Omit<EmailTemplate, "id" | "createdAt">) => {
        if (editingTemplate) {
            setTemplates((prev) =>
                prev.map((t) => (t.id === editingTemplate.id ? { ...t, ...data } : t))
            );
        } else {
            setTemplates((prev) => [
                {
                    ...data,
                    id: crypto.randomUUID(),
                    createdAt: new Date().toISOString().slice(0, 10),
                },
                ...prev,
            ]);
        }
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <div className="mx-auto w-full max-w-5xl">
                <div className="mb-8 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                            Email templates
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Create and manage reusable cold email templates
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={openCreateDialog}
                        className="flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                        <Plus className="h-4 w-4" />
                        New template
                    </Button>
                </div>

                {templates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-16 text-center dark:border-slate-700 dark:bg-slate-900">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                            <Mail className="h-5 w-5 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            No templates yet. Create your first one to get started.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {templates.map((template) => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                onEdit={openEditDialog}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            <AddTemplateDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSave={handleSave}
                initialData={editingTemplate}
            />
        </div>
    );
};

export default TemplatesPage;
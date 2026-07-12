import type { ComponentType } from "react";

interface SectionHeadingProps {
    icon: ComponentType<{ className?: string }>;
    title: string;
    action?: React.ReactNode;
}

export function SectionHeading({ icon: Icon, title, action }: SectionHeadingProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {title}
                </h2>
            </div>
            {action}
        </div>
    );
}
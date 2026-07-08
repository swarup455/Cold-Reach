import { Globe, Briefcase, Users, Send } from "lucide-react";
import type { Company } from "@/api/companyApi";

interface CompanyCardProps {
    company: Company;
    onClick?: (company: Company) => void;
}

export function CompanyCard({ company, onClick }: CompanyCardProps) {
    const initials = company.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
        console.log(company)

    return (
        <div
            onClick={() => onClick?.(company)}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={(e) => {
                if (onClick && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onClick(company);
                }
            }}
            className="group flex justify-between w-full flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700 cursor-pointer"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    {company.logoUrl ? (
                        <img
                            src={company.logoUrl}
                            alt={`${company.name} logo`}
                            className="h-10 w-10 rounded-lg border border-slate-200 object-cover dark:border-slate-800"
                        />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-medium text-white">
                            {initials}
                        </div>
                    )}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                            {company.name}
                        </h3>
                        {company.domain && (
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                <Globe className="h-3 w-3" />
                                {company.domain}
                            </div>
                        )}
                    </div>
                </div>

                {company.isHiring && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        <Briefcase className="h-3 w-3" />
                        Hiring
                    </span>
                )}
            </div>

            {company.oneLiner && (
                <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                    {company.oneLiner}
                </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
                {company.batch && (
                    <span className="w-fit rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                        {company.batch}
                    </span>
                )}
                {company.teamSize !== undefined && company.teamSize > 0 && (
                    <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <Users className="h-3 w-3" />
                        {company.teamSize}
                    </span>
                )}
                {company.tags?.slice(0, 2).map((tag) => (
                    <span
                        key={tag}
                        className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-950 dark:text-blue-300"
                    >
                        {tag}
                    </span>
                ))}
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    console.log("Send demo mail to:", company.name);
                    // TODO: wire up actual send logic here
                }}
                className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700"
            >
                <Send className="h-3 w-3" />
                Send Personalized Mail
            </button>
        </div>
    );
}

export function CompanyCardSkeleton() {
    return (
        <div className="flex w-full flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
                <div className="space-y-2">
                    <div className="h-3.5 w-28 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                    <div className="h-3 w-20 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                </div>
            </div>
            <div className="h-3 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
    );
}
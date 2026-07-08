import { useState } from "react";
import { Search, Inbox, AlertCircle, RefreshCw } from "lucide-react";
import { useCompanies } from "@/hooks/useCompanies";
import { CompanyCard, CompanyCardSkeleton } from "@/components/company/CompanyCard";
import type { Company } from "@/api/companyApi";

const STATUS_FILTERS: { label: string; value: string | undefined }[] = [
    { label: "All", value: undefined },
    { label: "Added", value: "added" },
    { label: "Enriched", value: "enriched" },
    { label: "Draft ready", value: "draft-ready" },
    { label: "Sent", value: "sent" },
];

const Startups = () => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [page, setPage] = useState(1);

    const { companies, pagination, loading, error, refetch } = useCompanies({
        search: search || undefined,
        page,
        limit: 90,
    });

    const handleCompanyClick = (company: Company) => {
        // Wire up to a detail drawer/page later
        console.log("Selected company:", company);
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                        Startups
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {pagination ? `${pagination.total} companies in your pipeline` : "Loading your pipeline"}
                    </p>
                </div>

                <div className="relative w-full sm:w-72">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search companies..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-500"
                    />
                </div>
            </div>

            {/* Status filter tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
                {STATUS_FILTERS.map((f) => (
                    <button
                        key={f.label}
                        onClick={() => {
                            setStatus(f.value);
                            setPage(1);
                        }}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${status === f.value
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Error state */}
            {error && (
                <div className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950">
                    <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                    </div>
                    <button
                        onClick={refetch}
                        className="flex items-center gap-1.5 rounded-md bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                    >
                        <RefreshCw className="h-3 w-3" />
                        Retry
                    </button>
                </div>
            )}

            {/* Loading state */}
            {loading && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <CompanyCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && companies.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
                    <Inbox className="h-8 w-8 text-slate-400" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        No companies yet
                    </p>
                    <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
                        {search || status
                            ? "Nothing matches your current filters. Try clearing them."
                            : "Fetch companies from Y Combinator or add one manually to get started."}
                    </p>
                </div>
            )}

            {/* Company grid */}
            {!loading && !error && companies.length > 0 && (
                <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {companies.map((company) => (
                            <CompanyCard key={company._id} company={company} onClick={handleCompanyClick} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                disabled={page === 1}
                                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                                disabled={page === pagination.totalPages}
                                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Startups;
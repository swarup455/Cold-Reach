// src/hooks/useFilterParams.ts
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { DEFAULT_FILTERS, type FilterState, type SortValue } from "@/types/filters";

function parseList(value: string | null): string[] {
    return value ? value.split(",").filter(Boolean) : [];
}

/**
 * Reads FilterState out of the current URL search params, and exposes a
 * setter that patches individual fields, writes them back to the URL
 * (replacing history, no scroll jump), and resets pagination to page 1.
 */
export function useFilterParams() {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters: FilterState = useMemo(
        () => ({
            hiring: (searchParams.get("hiring") as FilterState["hiring"]) ?? undefined,
            batch: searchParams.get("batch") ?? undefined,
            industry: parseList(searchParams.get("industry")),
            teamSize: searchParams.get("teamSize") ?? undefined,
            location: searchParams.get("location") ?? undefined,
            tags: parseList(searchParams.get("tags")),
            sort: (searchParams.get("sort") as SortValue) ?? DEFAULT_FILTERS.sort,
        }),
        [searchParams]
    );

    const setFilter = useCallback(
        <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    const isEmpty =
                        value === undefined ||
                        value === "" ||
                        (Array.isArray(value) && value.length === 0);

                    if (isEmpty) {
                        next.delete(key);
                    } else if (Array.isArray(value)) {
                        next.set(key, value.join(","));
                    } else {
                        next.set(key, String(value));
                    }
                    // Any filter change restarts pagination.
                    next.set("page", "1");
                    return next;
                },
                { replace: true }
            );
        },
        [setSearchParams]
    );

    const clearFilters = useCallback(() => {
        setSearchParams({}, { replace: true });
    }, [setSearchParams]);

    const activeCount = useMemo(() => {
        let n = 0;
        if (filters.hiring) n++;
        if (filters.batch) n++;
        if (filters.teamSize) n++;
        if (filters.location) n++;
        n += filters.industry.length;
        n += filters.tags.length;
        return n;
    }, [filters]);

    return { filters, setFilter, clearFilters, activeCount };
}
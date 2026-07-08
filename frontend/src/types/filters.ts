// src/types/filters.ts

export type HiringValue = "yes" | "no" | undefined;

export type SortValue =
    | "best-match"
    | "hiring-first"
    | "newest-batch"
    | "smallest-team"
    | "largest-team"
    | "az";

export interface FilterState {
    hiring: HiringValue;
    batch: string | undefined; // e.g. "W26"
    industry: string[]; // multi-select
    teamSize: string | undefined; // e.g. "11-50"
    location: string | undefined; // single-select, fetched from public API
    tags: string[]; // multi-select
    sort: SortValue;
}

export const DEFAULT_FILTERS: FilterState = {
    hiring: undefined,
    batch: undefined,
    industry: [],
    teamSize: undefined,
    location: undefined,
    tags: [],
    sort: "best-match",
};

export const HIRING_OPTIONS: { label: string; value: HiringValue }[] = [
    { label: "All", value: undefined },
    { label: "Hiring", value: "yes" },
    { label: "Not hiring", value: "no" },
];

export const TEAM_SIZE_OPTIONS: { label: string; value: string }[] = [
    { label: "1–10", value: "1-10" },
    { label: "11–50", value: "11-50" },
    { label: "51–200", value: "51-200" },
    { label: "201–500", value: "201-500" },
    { label: "500+", value: "500+" },
];

export const SORT_OPTIONS: { label: string; value: SortValue }[] = [
    { label: "Best Match", value: "best-match"},
    { label: "Hiring First", value: "hiring-first"},
    { label: "Newest Batch", value: "newest-batch"},
    { label: "Smallest Team", value: "smallest-team"},
    { label: "Largest Team", value: "largest-team"},
    { label: "A → Z", value: "az"},
];

/**
 * Generates YC-style batch codes going backwards from the current season,
 * e.g. ["W26", "S25", "W25", "S24", ...]. Avoids hardcoding a list that
 * goes stale every 6 months.
 */
export function generateBatchOptions(count = 10): string[] {
    const now = new Date();
    const year = now.getFullYear();
    const isFirstHalf = now.getMonth() < 6; // Jan–Jun -> Winter batch season
    let season: "W" | "S" = isFirstHalf ? "W" : "S";
    let y = year % 100;

    const batches: string[] = [];
    for (let i = 0; i < count; i++) {
        batches.push(`${season}${y.toString().padStart(2, "0")}`);
        if (season === "S") {
            season = "W";
        } else {
            season = "S";
            y -= 1;
        }
    }
    return batches;
}
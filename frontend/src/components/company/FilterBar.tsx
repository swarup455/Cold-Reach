// src/components/filters/FilterBar.tsx
import { useMemo, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { useFilterParams } from "@/hooks/useFilterParams";
import { useLocations } from "@/hooks/useLocations";
import {
    HIRING_OPTIONS,
    TEAM_SIZE_OPTIONS,
    SORT_OPTIONS,
    generateBatchOptions,
} from "@/types/filters";
import { MultiSelectPopover } from "./MultiSelectPopover";

// Fallback lists — swap these for real values from your API/company data
// whenever you have a source for "all industries" / "all tags" in the pipeline.
const INDUSTRY_OPTIONS = [
    "Fintech",
    "Healthcare",
    "Developer Tools",
    "AI/ML",
    "Consumer",
    "B2B SaaS",
    "Climate",
    "Education",
    "Security",
    "Marketplace",
];

const TAG_OPTIONS = [
    "Remote",
    "Series A",
    "Seed",
    "Profitable",
    "Enterprise",
    "Open Source",
    "Hardware",
    "API-first",
];

interface FilterBarProps {
    className?: string;
}

export function FilterBar({ className = "" }: FilterBarProps) {
    const { filters, setFilter, clearFilters, activeCount } = useFilterParams();
    const [locationQuery, setLocationQuery] = useState("");
    const batchOptions = useMemo(() => generateBatchOptions(10), []);
    const [locationOpen, setLocationOpen] = useState(false);
    const { locations, loading: locationsLoading } = useLocations(locationQuery);

    const pillBase =
        "h-9 gap-1.5 rounded-lg border-slate-300 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800";
    const pillActive =
        "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300";

    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            {/* Filter row — horizontally scrollable on mobile, wraps on desktop */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
                {/* Hiring */}
                <Select
                    value={filters.hiring ?? "Status"}
                    onValueChange={(v) => setFilter("hiring", v === "all" ? undefined : (v as "yes" | "no"))}
                >
                    <SelectTrigger
                        className={`w-auto shrink-0 ${pillBase} ${filters.hiring ? pillActive : ""}`}
                    >
                        <SelectValue placeholder="Hiring" />
                    </SelectTrigger>
                    <SelectContent className="dark:border-slate-700 dark:bg-slate-950">
                        {HIRING_OPTIONS.map((opt) => (
                            <SelectItem key={opt.label} value={opt.value ?? "all"}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Batch */}
                <Select
                    value={filters.batch ?? "Batch"}
                    onValueChange={(v) => setFilter("batch", !v || v === "all" ? undefined : v)}
                >
                    <SelectTrigger
                        className={`w-auto shrink-0 ${pillBase} ${filters.batch ? pillActive : ""}`}
                    >
                        <SelectValue placeholder="Batch" />
                    </SelectTrigger>
                    <SelectContent className="dark:border-slate-700 dark:bg-slate-950">
                        <SelectItem value="all">All batches</SelectItem>
                        {batchOptions.map((b) => (
                            <SelectItem key={b} value={b}>
                                {b}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Industry (multi-select) */}
                <MultiSelectPopover
                    label="Industry"
                    options={INDUSTRY_OPTIONS}
                    selected={filters.industry}
                    onChange={(vals) => setFilter("industry", vals)}
                />

                {/* Team Size */}
                <Select
                    value={filters.teamSize ?? "Team size"}
                    onValueChange={(v) => setFilter("teamSize", !v || v === "all" ? undefined : v)}
                >
                    <SelectTrigger
                        className={`w-auto shrink-0 ${pillBase} ${filters.teamSize ? pillActive : ""}`}
                    >
                        <SelectValue placeholder="Team Size" />
                    </SelectTrigger>
                    <SelectContent className="dark:border-slate-700 dark:bg-slate-950">
                        <SelectItem value="all">Any size</SelectItem>
                        {TEAM_SIZE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Location — searchable single-select, fetched live from a public API */}
                <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                    <PopoverTrigger>
                        <Button
                            variant="outline"
                            size="sm"
                            className={`shrink-0 ${pillBase} ${filters.location ? pillActive : ""}`}
                        >
                            {filters.location ?? "Location"}
                            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        align="start"
                        className="w-60 p-0 dark:border-slate-700 dark:bg-slate-950"
                    >
                        <Command>
                            <CommandInput
                                placeholder="Search location..."
                                value={locationQuery}
                                onValueChange={setLocationQuery}
                            />

                            <CommandList>
                                <CommandEmpty>
                                    {locationsLoading ? "Loading..." : "No matches."}
                                </CommandEmpty>

                                <CommandGroup>
                                    {filters.location && (
                                        <CommandItem
                                            onSelect={() => {
                                                setFilter("location", undefined);
                                                setLocationQuery("");
                                                setLocationOpen(false);
                                            }}
                                            className="text-slate-500"
                                        >
                                            Clear selection
                                        </CommandItem>
                                    )}

                                    {locations.map((loc) => (
                                        <CommandItem
                                            key={loc}
                                            value={loc}
                                            onSelect={() => {
                                                setFilter("location", loc);
                                                setLocationQuery("");
                                                setLocationOpen(false);
                                            }}
                                            className="flex cursor-pointer items-center gap-2"
                                        >
                                            <span className="flex-1 text-sm">{loc}</span>

                                            {filters.location === loc && (
                                                <Check className="h-3.5 w-3.5" />
                                            )}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                {/* Tags (multi-select) */}
                <MultiSelectPopover
                    label="Tags"
                    options={TAG_OPTIONS}
                    selected={filters.tags}
                    onChange={(vals) => setFilter("tags", vals)}
                />

                {/* Divider */}
                <div className="mx-1 hidden h-6 w-px shrink-0 bg-slate-200 dark:bg-slate-800 sm:block" />

                {/* Sort By */}
                <Select
                    value={filters.sort}
                    onValueChange={(v) => setFilter("sort", v as typeof filters.sort)}
                >
                    <SelectTrigger className="w-auto shrink-0 h-9 gap-1.5 rounded-lg border-slate-300 bg-white text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent className="dark:border-slate-700 dark:bg-slate-950">
                        {SORT_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {activeCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="shrink-0 gap-1 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        <X className="h-3.5 w-3.5" />
                        Clear all
                    </Button>
                )}
            </div>

            {/* Active filter chips */}
            {activeCount > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {filters.hiring && (
                        <FilterChip
                            text={filters.hiring === "yes" ? "Hiring" : "Not hiring"}
                            onRemove={() => setFilter("hiring", undefined)}
                        />
                    )}
                    {filters.batch && (
                        <FilterChip text={filters.batch} onRemove={() => setFilter("batch", undefined)} />
                    )}
                    {filters.industry.map((i) => (
                        <FilterChip
                            key={i}
                            text={i}
                            onRemove={() =>
                                setFilter(
                                    "industry",
                                    filters.industry.filter((v) => v !== i)
                                )
                            }
                        />
                    ))}
                    {filters.teamSize && (
                        <FilterChip
                            text={TEAM_SIZE_OPTIONS.find((t) => t.value === filters.teamSize)?.label ?? filters.teamSize}
                            onRemove={() => setFilter("teamSize", undefined)}
                        />
                    )}
                    {filters.location && (
                        <FilterChip text={filters.location} onRemove={() => setFilter("location", undefined)} />
                    )}
                    {filters.tags.map((t) => (
                        <FilterChip
                            key={t}
                            text={t}
                            onRemove={() =>
                                setFilter(
                                    "tags",
                                    filters.tags.filter((v) => v !== t)
                                )
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function FilterChip({ text, onRemove }: { text: string; onRemove: () => void }) {
    return (
        <Badge
            variant="secondary"
            className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
        >
            {text}
            <button onClick={onRemove} className="ml-0.5 rounded-lg hover:text-red-600 dark:hover:text-red-400">
                <X className="h-3 w-3" />
            </button>
        </Badge>
    );
}
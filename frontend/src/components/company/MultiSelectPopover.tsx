// src/components/filters/MultiSelectPopover.tsx
import { ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

interface MultiSelectPopoverProps {
    label: string;
    icon?: string;
    options: string[];
    selected: string[];
    onChange: (values: string[]) => void;
    emptyText?: string;
}

export function MultiSelectPopover({
    label,
    icon,
    options,
    selected,
    onChange,
    emptyText = "No results.",
}: MultiSelectPopoverProps) {
    const toggle = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const buttonLabel =
        selected.length === 0
            ? label
            : selected.length === 1
                ? selected[0]
                : `${label} (${selected.length})`;

    return (
        <Popover>
            <PopoverTrigger>
                <Button
                    variant="outline"
                    size="sm"
                    className={`h-9 gap-1.5 rounded-lg border-slate-300 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 ${selected.length > 0
                            ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
                            : ""
                        }`}
                >
                    {icon && <span>{icon}</span>}
                    {buttonLabel}
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="w-56 p-0 dark:border-slate-700 dark:bg-slate-950"
            >
                <Command>
                    <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
                    <CommandList>
                        <CommandEmpty>{emptyText}</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selected.includes(option);
                                return (
                                    <CommandItem
                                        key={option}
                                        onSelect={() => toggle(option)}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <Checkbox
                                            checked={isSelected}
                                            className="pointer-events-none"
                                        />
                                        <span className="flex-1 text-sm">{option}</span>
                                        {isSelected && <Check className="h-3.5 w-3.5" />}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
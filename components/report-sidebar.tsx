"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useColumns } from "@/contexts/column-context";

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

function CollapsibleSection({
    title,
    children,
    defaultOpen = false,
}: CollapsibleSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="border border-[#d9dede] rounded-lg mb-2"
        >
            <CollapsibleTrigger className="flex w-full items-center justify-between bg-[#f1f2f3] px-3 py-2 text-sm font-medium text-[#5d6c6b] uppercase tracking-wide">
                <span>{title}</span>
                <ChevronDown
                    className={cn(
                        "h-5 w-5 shrink-0 transition-transform duration-200",
                        isOpen && "rotate-180"
                    )}
                />
            </CollapsibleTrigger>
            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <div className="p-3">{children}</div>
            </CollapsibleContent>
        </Collapsible>
    );
}

interface FieldItemProps {
    label: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    indent?: boolean;
}

function FieldItem({
    label,
    checked = true,
    onCheckedChange,
    indent = false,
}: FieldItemProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-between gap-2 py-1.5",
                indent && "pl-3"
            )}
        >
            <span className="text-sm font-normal text-[#262b2b] leading-5">
                {label}
            </span>
            <Switch
                checked={checked}
                onCheckedChange={onCheckedChange}
                className="data-[state=checked]:bg-[#158039]"
            />
        </div>
    );
}

export function ReportSidebar() {
    const { allColumns, selectedColumns, toggleColumn } = useColumns();

    const [searchQuery, setSearchQuery] = useState("");

    // Group columns by category
    const columnsByCategory = useMemo(() => {
        const grouped: Record<string, typeof allColumns> = {};
        allColumns.forEach((col) => {
            if (!grouped[col.category]) {
                grouped[col.category] = [];
            }
            grouped[col.category].push(col);
        });
        return grouped;
    }, [allColumns]);

    // Filter columns based on search
    const filteredColumnsByCategory = useMemo(() => {
        if (!searchQuery) return columnsByCategory;

        const filtered: Record<string, typeof allColumns> = {};
        Object.entries(columnsByCategory).forEach(([category, cols]) => {
            const matching = cols.filter((col) =>
                col.label.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (matching.length > 0) {
                filtered[category] = matching;
            }
        });
        return filtered;
    }, [columnsByCategory, searchQuery]);

    // Group categories by main sections
    const mainSections = useMemo(() => {
        const sections: Record<string, string[]> = {
            "Contact Info": [
                "Contact Details",
                "Personal Info",
                "Emergency Contact",
            ],
            "Compensation & Payroll": [
                "Basic Compensation",
                "Additional Pay",
                "Bonuses & Benefits",
                "Deductions",
                "Payroll Summary",
            ],
            "Leaves PTO": [
                "Leave Summary",
                "Annual Leave",
                "Sick Leave",
                "Special Leaves",
                "Leave Transactions",
            ],
            "Employment Info": ["Employment Info", "Termination Details"],
        };

        return sections;
    }, []);

    const handleColumnToggle = (columnId: string, checked: boolean) => {
        toggleColumn(columnId, checked);
    };

    return (
        <div className="bg-white flex flex-col h-full border-r border-[#d9dede]">
            {/* Search */}
            <div className="p-4 border-b border-[#d9dede] shrink-0">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#5d6c6b]" />
                    <input
                        type="text"
                        placeholder="Search fields..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-[#d9dede] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#158039]"
                    />
                </div>
            </div>

            {/* Collapsible Lists */}
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
                <div className="space-y-0">
                    {Object.entries(mainSections).map(
                        ([sectionTitle, categories]) => {
                            const sectionColumns = categories
                                .flatMap(
                                    (category) =>
                                        filteredColumnsByCategory[category] ||
                                        []
                                )
                                .filter((col) => {
                                    // Filter out dependent columns (they'll be shown under their parents)
                                    return !col.isDependentOf;
                                });

                            if (sectionColumns.length === 0) return null;

                            return (
                                <CollapsibleSection
                                    key={sectionTitle}
                                    title={sectionTitle}
                                    defaultOpen={
                                        sectionTitle === "Contact Info"
                                    }
                                >
                                    <div className="space-y-0">
                                        {sectionColumns.map((col) => {
                                            const dependents =
                                                allColumns.filter(
                                                    (c) =>
                                                        c.isDependentOf ===
                                                        col.id
                                                );

                                            return (
                                                <div key={col.id}>
                                                    <FieldItem
                                                        label={col.label}
                                                        checked={
                                                            selectedColumns[
                                                                col.id
                                                            ] ?? true
                                                        }
                                                        onCheckedChange={(
                                                            checked
                                                        ) =>
                                                            handleColumnToggle(
                                                                col.id,
                                                                checked
                                                            )
                                                        }
                                                    />
                                                    {dependents.length > 0 &&
                                                        dependents.map(
                                                            (dependent) => (
                                                                <FieldItem
                                                                    key={
                                                                        dependent.id
                                                                    }
                                                                    label={
                                                                        dependent.label
                                                                    }
                                                                    checked={
                                                                        selectedColumns[
                                                                            dependent
                                                                                .id
                                                                        ] ??
                                                                        true
                                                                    }
                                                                    onCheckedChange={(
                                                                        checked
                                                                    ) =>
                                                                        handleColumnToggle(
                                                                            dependent.id,
                                                                            checked
                                                                        )
                                                                    }
                                                                    indent
                                                                />
                                                            )
                                                        )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CollapsibleSection>
                            );
                        }
                    )}
                </div>
            </div>
        </div>
    );
}

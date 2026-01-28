"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X, Check } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAttritionFilters } from "@/contexts/attrition-filter-context";

const DEPARTMENTS = [
    "Sales",
    "Customer Service",
    "Operations",
    "IT",
    "HR",
    "Finance",
    "Other",
];

export function AttritionFilters() {
    const { filters, setFilters, clearFilters } = useAttritionFilters();
    const [localDateFrom, setLocalDateFrom] = useState<Date | undefined>(
        filters.dateFrom || undefined
    );
    const [localDateTo, setLocalDateTo] = useState<Date | undefined>(
        filters.dateTo || undefined
    );
    const [localDepartments, setLocalDepartments] = useState<string[]>(
        filters.departments || []
    );
    const [departmentPopoverOpen, setDepartmentPopoverOpen] = useState(false);

    const hasActiveFilters =
        localDateFrom || localDateTo || localDepartments.length > 0;

    const handleApply = () => {
        setFilters({
            dateFrom: localDateFrom || null,
            dateTo: localDateTo || null,
            departments: localDepartments,
        });
    };

    const handleClear = () => {
        setLocalDateFrom(undefined);
        setLocalDateTo(undefined);
        setLocalDepartments([]);
        clearFilters();
    };

    const toggleDepartment = (dept: string) => {
        setLocalDepartments((prev) =>
            prev.includes(dept)
                ? prev.filter((d) => d !== dept)
                : [...prev, dept]
        );
    };

    return (
        <div className="w-full bg-white border border-[#d9dede] rounded-xl p-6">
            <div className="flex flex-col gap-4">
                <div className="flex items-end gap-4 flex-wrap">
                    {/* Date From */}
                    <div className="flex-1 min-w-[200px]">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !localDateFrom && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {localDateFrom ? (
                                        format(localDateFrom, "PPP")
                                    ) : (
                                        <span>Date From</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 overflow-hidden" align="start">
                                <Calendar
                                    mode="single"
                                    selected={localDateFrom}
                                    defaultMonth={localDateFrom}
                                    captionLayout="dropdown"
                                    onSelect={setLocalDateFrom}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Date To */}
                    <div className="flex-1 min-w-[200px]">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !localDateTo && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {localDateTo ? (
                                        format(localDateTo, "PPP")
                                    ) : (
                                        <span>Date To</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 overflow-hidden" align="start">
                                <Calendar
                                    mode="single"
                                    selected={localDateTo}
                                    defaultMonth={localDateTo}
                                    captionLayout="dropdown"
                                    onSelect={setLocalDateTo}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Department Multi-Select */}
                    <div className="flex-1 min-w-[200px]">
                        <Popover
                            open={departmentPopoverOpen}
                            onOpenChange={setDepartmentPopoverOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                >
                                    {localDepartments.length === 0
                                        ? "Department"
                                        : localDepartments.length === 1
                                        ? localDepartments[0]
                                        : `${localDepartments.length} selected`}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[250px] p-0" align="start">
                                <div className="p-2">
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {DEPARTMENTS.map((dept) => {
                                            const isSelected =
                                                localDepartments.includes(dept);
                                            return (
                                                <button
                                                    key={dept}
                                                    type="button"
                                                    onClick={() =>
                                                        toggleDepartment(dept)
                                                    }
                                                    className={cn(
                                                        "w-full min-h-[32px] px-2 py-1.5 rounded-lg flex items-center gap-2 transition-colors text-left",
                                                        isSelected
                                                            ? "bg-[#f0fdf4]"
                                                            : "bg-white hover:bg-accent"
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            "flex h-5 w-5 items-center justify-center rounded border shrink-0",
                                                            isSelected
                                                                ? "bg-[#158039] border-[#158039]"
                                                                : "border-[#919f9d]"
                                                        )}
                                                    >
                                                        {isSelected && (
                                                            <Check className="h-3 w-3 text-white" />
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-[#262b2b]">
                                                        {dept}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-end gap-2">
                        <Button
                            onClick={handleApply}
                            className="bg-[#158039] hover:bg-[#158039]/90 text-white"
                        >
                            Apply Filters
                        </Button>
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                onClick={handleClear}
                                className="border-[#b61f27] text-[#b61f27] hover:bg-[#b61f27]/5"
                            >
                                <X className="h-4 w-4 mr-1" />
                                Clear
                            </Button>
                        )}
                    </div>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#d9dede]">
                        <span className="text-xs text-[#5d6c6b]">Active filters:</span>
                        {localDateFrom && (
                            <span className="text-xs px-2 py-1 bg-[#f1f2f3] rounded">
                                From: {format(localDateFrom, "MMM d, yyyy")}
                            </span>
                        )}
                        {localDateTo && (
                            <span className="text-xs px-2 py-1 bg-[#f1f2f3] rounded">
                                To: {format(localDateTo, "MMM d, yyyy")}
                            </span>
                        )}
                        {localDepartments.length > 0 && (
                            <span className="text-xs px-2 py-1 bg-[#f1f2f3] rounded">
                                Departments: {localDepartments.join(", ")}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

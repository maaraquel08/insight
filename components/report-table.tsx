"use client";

import { employees } from "@/app/data/sampleData";
import { useMemo } from "react";
import { useColumns } from "@/contexts/column-context";
import { useFilters } from "@/contexts/filter-context";
import { useSort } from "@/contexts/sort-context";
import { filterData } from "@/lib/filter-utils";
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Helper function to format cell value
function formatCellValue(value: unknown): string {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "number") {
        // Format currency values
        if (value > 1000) {
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(value);
        }
        return value.toString();
    }
    if (typeof value === "object") {
        // Handle arrays or objects
        if (Array.isArray(value)) {
            return value.length > 0 ? `${value.length} items` : "-";
        }
        return JSON.stringify(value);
    }
    return String(value);
}

// Helper function to compare values for sorting
function compareValues(
    a: unknown,
    b: unknown,
    direction: "asc" | "desc"
): number {
    // Handle null/undefined
    if (a === null || a === undefined) {
        return b === null || b === undefined ? 0 : 1;
    }
    if (b === null || b === undefined) {
        return -1;
    }

    // Handle numbers
    if (typeof a === "number" && typeof b === "number") {
        return direction === "asc" ? a - b : b - a;
    }

    // Handle dates (strings that look like dates)
    const dateA = typeof a === "string" ? new Date(a).getTime() : null;
    const dateB = typeof b === "string" ? new Date(b).getTime() : null;
    if (dateA !== null && !isNaN(dateA) && dateB !== null && !isNaN(dateB)) {
        return direction === "asc" ? dateA - dateB : dateB - dateA;
    }

    // Handle strings
    const strA = String(a).toLowerCase();
    const strB = String(b).toLowerCase();
    if (strA < strB) return direction === "asc" ? -1 : 1;
    if (strA > strB) return direction === "asc" ? 1 : -1;
    return 0;
}

export function ReportTable() {
    const { visibleColumns } = useColumns();
    const { filters } = useFilters();
    const { sorts, toggleSort } = useSort();

    // Filter employees based on active filters
    const filteredEmployees = useMemo(() => {
        return filterData(employees, filters);
    }, [filters]);

    // Sort employees based on active sorts (in order of clicks)
    const sortedEmployees = useMemo(() => {
        if (sorts.length === 0) {
            return filteredEmployees;
        }

        return [...filteredEmployees].sort((a, b) => {
            for (const sort of sorts) {
                const aValue = (a as Record<string, unknown>)[sort.columnId];
                const bValue = (b as Record<string, unknown>)[sort.columnId];
                const comparison = compareValues(
                    aValue,
                    bValue,
                    sort.direction
                );
                if (comparison !== 0) {
                    return comparison;
                }
            }
            return 0;
        });
    }, [filteredEmployees, sorts]);

    // Get table rows
    const tableRows = useMemo(() => {
        return sortedEmployees.map((employee) => {
            return visibleColumns.map((col) => {
                const value = (employee as Record<string, unknown>)[col.id];
                return formatCellValue(value);
            });
        });
    }, [visibleColumns, sortedEmployees]);

    // Calculate minimum table width based on columns
    const minTableWidth = useMemo(() => {
        return visibleColumns.length * 150; // 150px per column minimum
    }, [visibleColumns.length]);

    return (
        <div className="bg-white h-full w-full flex flex-col overflow-hidden overflow-x-scroll">
            <table
                className="caption-bottom text-sm w-full"
                style={{ minWidth: `${minTableWidth}px` }}
            >
                <TableHeader className="sticky top-0 z-10 bg-[#f1f2f3]">
                    <TableRow className="hover:bg-transparent border-b border-[#d9dede]">
                        {visibleColumns.map((col) => {
                            const sortConfig = sorts.find(
                                (s) => s.columnId === col.id
                            );
                            const sortIndex =
                                sortConfig !== undefined
                                    ? sorts.indexOf(sortConfig) + 1
                                    : null;

                            return (
                                <TableHead
                                    key={col.id}
                                    className="text-sm font-medium text-[#262b2b] whitespace-nowrap min-w-[150px] px-4 py-4 cursor-pointer select-none hover:bg-[#e5e7e7] transition-colors"
                                    onClick={() => toggleSort(col.id)}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{col.label}</span>
                                        {sortConfig && (
                                            <span className="flex items-center gap-1 text-xs text-[#6b7280]">
                                                {sortIndex && sortIndex > 1 && (
                                                    <span className="text-[#9ca3af]">
                                                        {sortIndex}
                                                    </span>
                                                )}
                                                <span>
                                                    {sortConfig.direction ===
                                                    "asc"
                                                        ? "↑"
                                                        : "↓"}
                                                </span>
                                            </span>
                                        )}
                                    </div>
                                </TableHead>
                            );
                        })}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableRows.map((row, rowIndex) => (
                        <TableRow
                            key={rowIndex}
                            className="border-b border-[#d9dede] hover:bg-[#f1f2f3] transition-colors"
                        >
                            {row.map((cell, cellIndex) => (
                                <TableCell
                                    key={cellIndex}
                                    className="text-sm text-[#262b2b] whitespace-nowrap px-4 py-4"
                                    title={cell}
                                >
                                    {cell}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </table>
        </div>
    );
}

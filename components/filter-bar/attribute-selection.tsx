/**
 * Attribute Selection Component
 * 
 * First step in the filter creation process.
 * Displays a searchable list of all available columns grouped by category.
 * Users select which field they want to filter on.
 */

import { Input } from "@/components/ui/input";
import { groupColumnsByCategory, getAvailableColumns } from "./utils";
import type { Column } from "./types";

interface AttributeSelectionProps {
    /** Current search term for filtering the attribute list */
    searchTerm: string;
    
    /** Callback when search term changes */
    onSearchChange: (term: string) => void;
    
    /** Callback when an attribute is selected */
    onSelectAttribute: (columnId: string) => void;
}

export function AttributeSelection({
    searchTerm,
    onSearchChange,
    onSelectAttribute,
}: AttributeSelectionProps) {
    const allColumns = getAvailableColumns();
    const searchLower = searchTerm.toLowerCase().trim();

    // Filter categories and columns based on search term
    const filteredCategories: Array<[string, Column[]]> = Array.from(
        groupColumnsByCategory()
    ).map(([category, columns]) => [
        category,
        columns.filter(
            (col) =>
                col.label.toLowerCase().includes(searchLower) ||
                category.toLowerCase().includes(searchLower)
        ),
    ]);

    const hasResults = filteredCategories.some(
        ([_, cols]) => cols.length > 0
    );

    return (
        <>
            {/* Search Input */}
            <div className="relative border-b border-weak border-solid">
                <Input
                    placeholder="Search filters..."
                    className="h-9 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    style={{ border: "none" }}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Attribute List */}
            <div className="max-h-[400px] overflow-y-auto">
                {!hasResults && searchTerm ? (
                    // No results message
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                        No filters found.
                    </div>
                ) : (
                    // Category groups with columns
                    filteredCategories.map(([category, columns]) => {
                        if (columns.length === 0) return null;

                        return (
                            <div
                                key={category}
                                className="border-b border-weak last:border-b-0"
                            >
                                {/* Category Header */}
                                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                    {category}
                                </div>

                                {/* Column List */}
                                {columns.map((column) => (
                                    <button
                                        key={column.id}
                                        onClick={() => {
                                            onSelectAttribute(column.id);
                                            onSearchChange(""); // Clear search
                                        }}
                                        className="w-full px-4 py-3 text-sm text-[#262b2b] whitespace-nowrap text-left hover:bg-accent transition-colors"
                                    >
                                        {column.label}
                                    </button>
                                ))}
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}


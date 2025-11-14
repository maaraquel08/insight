/**
 * Filter Bar Component
 *
 * Main component that orchestrates the filter creation and management UI.
 *
 * Features:
 * - Three-step filter creation process (attribute → operator → value)
 * - Visual display of active filters as chips
 * - Edit and remove filters
 * - Clear all filters
 *
 * Architecture:
 * - Uses a three-step wizard pattern for filter creation
 * - Maintains filter state through context
 * - Delegates UI rendering to specialized components
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, ChevronDown, FileDown } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChipsFilter } from "@/components/ui/chips-filter";
import { useFilters } from "@/contexts/filter-context";
import type { Filter as FilterType } from "@/components/ui/filters";
import type { FilterRule, FilterStep } from "./types";
import {
    findColumnById,
    isDateAttribute,
    isNumericAttribute,
    getAvailableColumns,
} from "./utils";
import { AttributeSelection } from "./attribute-selection";
import { OperatorSelection } from "./operator-selection";
import { ValueSelection } from "./value-selection";
import { FilterActions } from "./filter-actions";
import { useTableData } from "@/hooks/use-table-data";
import {
    downloadAsCSV,
    downloadAsXLSX,
    downloadAsPDF,
} from "@/lib/download-utils";

export function FilterBar() {
    // ========================================================================
    // STATE MANAGEMENT
    // ========================================================================

    const { filters, setFilters } = useFilters();
    const allColumns = getAvailableColumns();
    const tableData = useTableData();

    // Popover state
    const [addFilterPopoverOpen, setAddFilterPopoverOpen] = useState(false);

    // Search state for attribute selection
    const [filterSearchTerm, setFilterSearchTerm] = useState("");

    // Current filter being created/edited
    const [currentFilterRule, setCurrentFilterRule] =
        useState<FilterRule | null>(null);

    // Current step in the three-step wizard
    const [filterStep, setFilterStep] = useState<FilterStep>("attribute");

    // ========================================================================
    // HELPER FUNCTIONS
    // ========================================================================

    /**
     * Update a single field in the current filter rule
     */
    function updateFilterField(
        field: keyof FilterRule,
        value: string | string[] | undefined
    ) {
        if (!currentFilterRule) return;
        setCurrentFilterRule({ ...currentFilterRule, [field]: value });
    }

    /**
     * Reset the filter builder to initial state
     */
    function resetFilterBuilder() {
        setAddFilterPopoverOpen(false);
        setCurrentFilterRule(null);
        setFilterStep("attribute");
        setFilterSearchTerm("");
    }

    /**
     * Format filter display text (shows the column label)
     */
    function formatFilterDisplay(filter: FilterType): string {
        const column = findColumnById(filter.field);
        return column?.label || "Unknown";
    }

    // ========================================================================
    // FILTER CRUD OPERATIONS
    // ========================================================================

    /**
     * Start creating a new filter for the selected attribute
     * If a filter already exists for this attribute, edit it instead
     */
    function handleSelectAttribute(columnId: string) {
        // Check if filter already exists for this attribute
        const existingFilter = filters.find((f) => f.field === columnId);

        if (existingFilter) {
            // Edit existing filter instead of creating duplicate
            handleEditFilter(existingFilter);
            return;
        }

        // Create new filter rule
        const newRule: FilterRule = {
            id: Date.now().toString(),
            when: filters.length === 0 ? "WHEN" : "AND",
            attribute: columnId,
            operator: "",
            value: "",
            value2: undefined,
        };

        setCurrentFilterRule(newRule);
        setFilterStep("operator");
        setFilterSearchTerm("");
    }

    /**
     * Set the operator and move to value selection
     */
    function handleSelectOperator(operator: string) {
        if (!currentFilterRule) return;

        setCurrentFilterRule({
            ...currentFilterRule,
            operator,
            value: "",
            value2: undefined,
        });
        setFilterStep("value");
    }

    /**
     * Edit an existing filter
     * Converts FilterType back to FilterRule for editing
     */
    function handleEditFilter(filter: FilterType) {
        const filterIndex = filters.findIndex((f) => f.id === filter.id);
        const when =
            filterIndex === 0
                ? "WHEN"
                : (filter as FilterType & { logicalOperator?: "AND" | "OR" })
                      .logicalOperator || "AND";

        // Convert values back to string format
        let value: string | string[] = "";
        let value2: string | undefined = undefined;
        let operator = filter.operator;

        // Handle operator conversion
        if (operator === "is_any_of") {
            operator = "is";
        }

        // Handle value conversion
        if (filter.operator === "between" && filter.values.length >= 2) {
            value = String(filter.values[0]);
            value2 = String(filter.values[1]);
        } else if (filter.values.length > 0) {
            if (filter.values.length === 1) {
                value = String(filter.values[0]);
            } else {
                value = filter.values.map(String);
            }
        }

        const filterRule: FilterRule = {
            id: filter.id,
            when,
            attribute: filter.field,
            operator,
            value,
            value2,
        };

        setCurrentFilterRule(filterRule);
        setFilterStep("value");
        setAddFilterPopoverOpen(true);
    }

    /**
     * Apply the current filter rule
     * Converts FilterRule to FilterType and adds/updates in the filter list
     */
    function handleApplyFilter() {
        if (!currentFilterRule) return;

        // Validate filter completeness
        if (currentFilterRule.operator === "between") {
            if (
                !currentFilterRule.attribute ||
                !currentFilterRule.operator ||
                !currentFilterRule.value ||
                !currentFilterRule.value2
            ) {
                return;
            }
        } else {
            const hasValue = Array.isArray(currentFilterRule.value)
                ? currentFilterRule.value.length > 0
                : currentFilterRule.value && currentFilterRule.value !== "";

            if (
                !currentFilterRule.attribute ||
                !currentFilterRule.operator ||
                !hasValue
            ) {
                return;
            }
        }

        // Process values based on data type
        const isNumeric = isNumericAttribute(currentFilterRule.attribute);
        const isDate = isDateAttribute(currentFilterRule.attribute);
        let processedValues: (string | number)[] = [];

        if (
            currentFilterRule.operator === "between" &&
            currentFilterRule.value2
        ) {
            // Between operator with two values
            if (isNumeric && !isDate) {
                const valueStr = Array.isArray(currentFilterRule.value)
                    ? currentFilterRule.value[0]
                    : currentFilterRule.value;
                const num1 = parseFloat(valueStr);
                const num2 = parseFloat(currentFilterRule.value2);
                processedValues = [
                    !isNaN(num1) ? num1 : valueStr,
                    !isNaN(num2) ? num2 : currentFilterRule.value2,
                ];
            } else {
                const valueStr = Array.isArray(currentFilterRule.value)
                    ? currentFilterRule.value[0]
                    : currentFilterRule.value;
                processedValues = [valueStr, currentFilterRule.value2];
            }
        } else {
            // Single or multiple values
            const valuesToProcess = Array.isArray(currentFilterRule.value)
                ? currentFilterRule.value
                : [currentFilterRule.value];

            if (isNumeric && !isDate) {
                processedValues = valuesToProcess.map((val) => {
                    const num = parseFloat(val);
                    return !isNaN(num) ? num : val;
                });
            } else {
                processedValues = valuesToProcess;
            }
        }

        // Determine final operator
        let finalOperator = currentFilterRule.operator;
        if (
            processedValues.length > 1 &&
            (currentFilterRule.operator === "is" ||
                currentFilterRule.operator === "equals")
        ) {
            finalOperator = "is_any_of";
        }

        // Create filter object
        const filter: FilterType = {
            id: currentFilterRule.id,
            field: currentFilterRule.attribute,
            operator: finalOperator,
            values: processedValues,
        };

        // Add logical operator for non-first filters
        if (currentFilterRule.when !== "WHEN") {
            (
                filter as FilterType & { logicalOperator?: "AND" | "OR" }
            ).logicalOperator = currentFilterRule.when as "AND" | "OR";
        }

        // Update or add filter
        const existingFilterIndex = filters.findIndex(
            (f) => f.id === currentFilterRule.id
        );

        if (existingFilterIndex >= 0) {
            const updatedFilters = [...filters];
            updatedFilters[existingFilterIndex] = filter;
            setFilters(updatedFilters);
        } else {
            setFilters([...filters, filter]);
        }

        resetFilterBuilder();
    }

    /**
     * Remove a filter by ID
     */
    function handleRemoveFilter(filterId: string) {
        setFilters(filters.filter((f) => f.id !== filterId));
    }

    /**
     * Clear all filters
     */
    function handleClearFilters() {
        setFilters([]);
    }

    /**
     * Handle download actions
     */
    function handleDownload(format: "csv" | "xlsx" | "pdf") {
        const filename = `report-${new Date().toISOString().split("T")[0]}`;
        switch (format) {
            case "csv":
                downloadAsCSV(tableData, filename);
                break;
            case "xlsx":
                downloadAsXLSX(tableData, filename);
                break;
            case "pdf":
                downloadAsPDF(tableData, filename);
                break;
        }
    }

    // ========================================================================
    // NAVIGATION HANDLERS
    // ========================================================================

    function handleBackToAttributes() {
        setFilterStep("attribute");
        setCurrentFilterRule(null);
        setFilterSearchTerm("");
    }

    function handleBackToOperators() {
        setFilterStep("operator");
    }

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <div className="bg-white flex items-center justify-between py-3 px-3 border-b border-[#d9dede] shrink-0 overflow-hidden">
            {/* Left Section: Filter Controls */}
            <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                {/* Add Filter Button + Popover */}
                <Popover
                    open={addFilterPopoverOpen}
                    onOpenChange={(open) => {
                        setAddFilterPopoverOpen(open);
                        if (!open) {
                            resetFilterBuilder();
                        }
                    }}
                >
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2.5 gap-1.25 text-xs border border-border hover:bg-secondary"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add Filter
                        </Button>
                    </PopoverTrigger>

                    {/* Filter Builder Popover */}
                    <PopoverContent
                        className="w-[300px] p-0 border-weak overflow-hidden"
                        align="start"
                    >
                        {/* Step 1: Attribute Selection */}
                        {filterStep === "attribute" && (
                            <AttributeSelection
                                searchTerm={filterSearchTerm}
                                onSearchChange={setFilterSearchTerm}
                                onSelectAttribute={handleSelectAttribute}
                            />
                        )}

                        {/* Step 2: Operator Selection */}
                        {filterStep === "operator" && currentFilterRule && (
                            <OperatorSelection
                                attributeId={currentFilterRule.attribute}
                                onBack={handleBackToAttributes}
                                onSelectOperator={handleSelectOperator}
                            />
                        )}

                        {/* Step 3: Value Selection + Actions */}
                        {filterStep === "value" && currentFilterRule && (
                            <>
                                <ValueSelection
                                    filterRule={currentFilterRule}
                                    onBack={handleBackToOperators}
                                    onValueChange={(value) =>
                                        updateFilterField("value", value)
                                    }
                                    onValue2Change={(value2) =>
                                        updateFilterField("value2", value2)
                                    }
                                />
                                <FilterActions
                                    onCancel={resetFilterBuilder}
                                    onApply={handleApplyFilter}
                                />
                            </>
                        )}
                    </PopoverContent>
                </Popover>

                {/* Active Filter Chips */}
                {filters.map((filter) => {
                    const column = findColumnById(filter.field);
                    if (!column) return null;

                    // Show count badge for filters with values (including single value)
                    const count =
                        filter.values && filter.values.length > 0
                            ? filter.values.length
                            : undefined;

                    return (
                        <ChipsFilter
                            key={filter.id}
                            label={formatFilterDisplay(filter)}
                            count={count}
                            onClick={() => handleEditFilter(filter)}
                            onRemove={() => handleRemoveFilter(filter.id)}
                        />
                    );
                })}

                {/* Clear All Filters Button */}
                {filters.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2.5 gap-1.25 text-xs border border-[#b61f27] text-[#b61f27] hover:bg-[#b61f27]/5 hover:text-[#b61f27]"
                        onClick={handleClearFilters}
                    >
                        <X className="w-3.5 h-3.5" />
                        Clear Filters
                    </Button>
                )}
            </div>

            {/* Right Section: Action Buttons */}
            <div className="flex items-center gap-2 ml-4 shrink-0">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-9 border-[#b8c1c0] text-xs font-medium text-[#262b2b]"
                >
                    Share
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="bg-[#158039] hover:bg-[#158039]/90 text-white h-9 px-2 text-xs font-medium"
                            size="sm"
                        >
                            Download
                            <ChevronDown className="w-3 h-3 ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                            onClick={() => handleDownload("csv")}
                            className="cursor-pointer"
                        >
                            <FileDown className="w-4 h-4 mr-2" />
                            CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleDownload("xlsx")}
                            className="cursor-pointer"
                        >
                            <FileDown className="w-4 h-4 mr-2" />
                            Excel
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleDownload("pdf")}
                            className="cursor-pointer"
                        >
                            <FileDown className="w-4 h-4 mr-2" />
                            PDF
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

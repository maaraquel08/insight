/**
 * Value Selection Component
 *
 * Third and final step in the filter creation process.
 * Routes to the appropriate input component based on the attribute's data type.
 * Handles the header and delegates the input UI to specialized components.
 */

import { ArrowLeft } from "lucide-react";
import { findColumnById, isDateAttribute, isNumericAttribute } from "./utils";
import { DateInput } from "./value-inputs/date-input";
import { NumberInput } from "./value-inputs/number-input";
import { TextCheckboxList } from "./value-inputs/text-checkbox-list";
import type { FilterRule } from "./types";

interface ValueSelectionProps {
    /** The current filter rule being edited */
    filterRule: FilterRule;

    /** Callback to go back to operator selection */
    onBack: () => void;

    /** Callback when the value changes */
    onValueChange: (value: string | string[]) => void;

    /** Callback when the second value changes (for between operator) */
    onValue2Change: (value: string | undefined) => void;
}

export function ValueSelection({
    filterRule,
    onBack,
    onValueChange,
    onValue2Change,
}: ValueSelectionProps) {
    const column = findColumnById(filterRule.attribute);
    const isDate = isDateAttribute(filterRule.attribute);
    const isNumeric = isNumericAttribute(filterRule.attribute);
    const isBetween = filterRule.operator === "between";

    return (
        <>
            {/* Header with back button */}
            <div className="border-b border-weak px-4 py-2 flex items-center gap-2">
                <button
                    onClick={onBack}
                    className="flex items-center justify-center h-6 w-6 hover:bg-accent rounded transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium text-[#262b2b]">
                    {column?.label || "Select value"}
                </span>
            </div>

            {/* Body - Route to appropriate input type */}
            <div className="flex flex-col">
                {isDate ? (
                    // Date Input (Calendar Picker)
                    <DateInput
                        value={filterRule.value}
                        value2={filterRule.value2}
                        isBetween={isBetween}
                        onChange={onValueChange}
                        onValue2Change={onValue2Change}
                    />
                ) : isNumeric ? (
                    // Number Input
                    <NumberInput
                        value={filterRule.value}
                        value2={filterRule.value2}
                        isBetween={isBetween}
                        onChange={onValueChange}
                        onValue2Change={onValue2Change}
                    />
                ) : (
                    // Text Input (Checkbox List)
                    <TextCheckboxList
                        attributeId={filterRule.attribute}
                        value={filterRule.value}
                        onChange={onValueChange}
                    />
                )}
            </div>
        </>
    );
}

/**
 * Text Checkbox List Component
 * 
 * Displays a scrollable list of checkboxes for text value selection.
 * Supports multi-select by clicking checkboxes.
 * Values are extracted from the dataset automatically.
 * Shows selected items as chips at the top.
 */

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUniqueValuesForAttribute } from "../utils";

interface TextCheckboxListProps {
    /** The attribute/column ID to get values for */
    attributeId: string;
    
    /** Currently selected values */
    value: string | string[];
    
    /** Callback when selection changes */
    onChange: (value: string | string[]) => void;
}

export function TextCheckboxList({
    attributeId,
    value,
    onChange,
}: TextCheckboxListProps) {
    // Get all unique values for this attribute from the dataset
    const availableValues = getUniqueValuesForAttribute(attributeId);

    // Normalize current value to array for easier comparison
    const selectedValues = Array.isArray(value)
        ? value
        : value
        ? [value]
        : [];

    /**
     * Toggle a value in the selection
     */
    function handleToggle(val: string) {
        const currentValues = Array.isArray(value)
            ? value
            : value
            ? [value]
            : [];

        const isSelected = currentValues.includes(val);

        const newValues = isSelected
            ? currentValues.filter((v) => v !== val)
            : [...currentValues, val];

        // Return single value if only one selected, otherwise array
        onChange(newValues.length === 1 ? newValues[0] : newValues);
    }

    /**
     * Remove a selected value from chips
     */
    function handleRemoveChip(val: string) {
        const currentValues = Array.isArray(value)
            ? value
            : value
            ? [value]
            : [];

        const newValues = currentValues.filter((v) => v !== val);
        onChange(newValues.length === 1 ? newValues[0] : newValues.length > 0 ? newValues : []);
    }

    return (
        <div className="flex flex-col">
            {/* Selected Items as Chips */}
            {selectedValues.length > 0 && (
                <div className="border-b border-[#d9dede] px-4 py-3 max-h-[164px] overflow-y-auto">
                    <div className="flex flex-wrap gap-1.5">
                        {selectedValues.map((val) => (
                            <div
                                key={val}
                                className="bg-[#dcfce6] border border-[#158039] rounded-full px-2 py-1.5 flex items-center gap-1 shrink-0"
                            >
                                <span className="text-sm text-[#262b2b] whitespace-nowrap">
                                    {val}
                                </span>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveChip(val);
                                    }}
                                    className="flex items-center justify-center size-4 hover:bg-[#158039]/10 rounded transition-colors shrink-0"
                                >
                                    <X className="h-3 w-3 text-[#262b2b]" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* List of Available Values */}
            <div className="flex flex-col gap-0.5 p-2 max-h-[300px] overflow-y-auto">
                {availableValues.map((val) => {
                    const isSelected = selectedValues.includes(val);

                    return (
                        <button
                            key={val}
                            type="button"
                            onClick={() => handleToggle(val)}
                            className={cn(
                                "w-full min-h-[32px] px-1.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors text-left",
                                isSelected
                                    ? "bg-[#f0fdf4]"
                                    : "bg-white hover:bg-accent"
                            )}
                        >
                            {/* Checkbox */}
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

                            {/* Label */}
                            <span className="text-sm text-[#262b2b] leading-5">
                                {val}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}


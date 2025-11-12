/**
 * Text Checkbox List Component
 * 
 * Displays a scrollable list of checkboxes for text value selection.
 * Supports multi-select by clicking checkboxes.
 * Values are extracted from the dataset automatically.
 */

import { Check } from "lucide-react";
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

    return (
        <div className="max-h-[300px] overflow-y-auto">
            {availableValues.map((val) => {
                const isSelected = selectedValues.includes(val);

                return (
                    <button
                        key={val}
                        onClick={() => handleToggle(val)}
                        className="w-full px-4 py-3 text-sm text-[#262b2b] whitespace-nowrap text-left hover:bg-accent transition-colors flex items-center gap-2"
                    >
                        {/* Checkbox */}
                        <div
                            className={cn(
                                "flex h-4 w-4 items-center justify-center rounded border border-weak",
                                isSelected && "bg-[#158039] border-[#158039]"
                            )}
                        >
                            {isSelected && (
                                <Check className="h-3 w-3 text-white" />
                            )}
                        </div>

                        {/* Label */}
                        <span>{val}</span>
                    </button>
                );
            })}
        </div>
    );
}


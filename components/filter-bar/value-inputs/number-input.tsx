/**
 * Number Input Component
 * 
 * Handles numeric value selection for filters.
 * Supports both single number and number range (between) operators.
 */

import { Input } from "@/components/ui/input";

interface NumberInputProps {
    /** Current value (single number or min for range) */
    value: string | string[];
    
    /** Max value for "between" operator */
    value2?: string;
    
    /** Whether this is a range (between) operator */
    isBetween: boolean;
    
    /** Callback when value changes */
    onChange: (value: string) => void;
    
    /** Callback when second value changes (for between) */
    onValue2Change?: (value: string) => void;
}

export function NumberInput({
    value,
    value2,
    isBetween,
    onChange,
    onValue2Change,
}: NumberInputProps) {
    // Extract single value from array if needed
    const singleValue = Array.isArray(value) ? value[0] : value;

    if (isBetween) {
        // Number Range Input (Between)
        return (
            <div className="flex flex-col gap-3 p-4">
                {/* Min Value */}
                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                        Min
                    </label>
                    <Input
                        type="number"
                        placeholder="Min"
                        value={singleValue}
                        onChange={(e) => onChange(e.target.value)}
                        className="h-9"
                    />
                </div>

                {/* Max Value */}
                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                        Max
                    </label>
                    <Input
                        type="number"
                        placeholder="Max"
                        value={value2 || ""}
                        onChange={(e) => onValue2Change?.(e.target.value)}
                        className="h-9"
                    />
                </div>
            </div>
        );
    }

    // Single Number Input
    return (
        <div className="p-4">
            <Input
                type="number"
                placeholder="Value"
                value={singleValue}
                onChange={(e) => onChange(e.target.value)}
                className="h-9"
                autoFocus
            />
        </div>
    );
}


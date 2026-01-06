/**
 * Date Input Component
 * 
 * Handles date value selection for filters.
 * Supports both single date and date range (between) operators.
 */

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateForInput, parseDateString } from "../utils";

interface DateInputProps {
    /** Current value (single date or start date for range) */
    value: string | string[];
    
    /** End date for "between" operator */
    value2?: string;
    
    /** Whether this is a range (between) operator */
    isBetween: boolean;
    
    /** Callback when value changes */
    onChange: (value: string) => void;
    
    /** Callback when second value changes (for between) */
    onValue2Change?: (value: string | undefined) => void;
}

export function DateInput({
    value,
    value2,
    isBetween,
    onChange,
    onValue2Change,
}: DateInputProps) {
    // Extract single value from array if needed
    const singleValue = Array.isArray(value) ? value[0] : value;

    if (isBetween) {
        // Date Range Input (Between)
        return (
            <div className="flex flex-col gap-3 p-4">
                {/* Start Date */}
                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                        Start Date
                    </label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "h-9 w-full text-sm border-weak rounded-md justify-between font-normal",
                                    !singleValue && "text-muted-foreground"
                                )}
                            >
                                <span>
                                    {singleValue
                                        ? formatDateForInput(parseDateString(singleValue))
                                        : "Select start date"}
                                </span>
                                <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[328px] p-0" align="start">
                            <Calendar
                                className="w-full"
                                mode="single"
                                captionLayout="dropdown"
                                selected={parseDateString(singleValue)}
                                onSelect={(date) => {
                                    onChange(date ? formatDateForInput(date) : "");
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* End Date */}
                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                        End Date
                    </label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "h-9 w-full text-sm border-weak rounded-md justify-between font-normal",
                                    !value2 && "text-muted-foreground"
                                )}
                            >
                                <span>
                                    {value2
                                        ? formatDateForInput(parseDateString(value2))
                                        : "Select end date"}
                                </span>
                                <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[328px] p-0" align="start">
                            <Calendar
                                className="w-full"
                                mode="single"
                                captionLayout="dropdown"
                                selected={parseDateString(value2 || "")}
                                onSelect={(date) => {
                                    onValue2Change?.(date ? formatDateForInput(date) : undefined);
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        );
    }

    // Single Date Input
    return (
        <div className="p-4">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "h-9 w-full text-sm border-weak rounded-md justify-between font-normal",
                            !singleValue && "text-muted-foreground"
                        )}
                    >
                        <span>
                            {singleValue
                                ? formatDateForInput(parseDateString(singleValue))
                                : "Select date"}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[328px]" align="start">
                    <Calendar
                        className="w-full"
                        mode="single"
                        captionLayout="dropdown"
                        selected={parseDateString(singleValue)}
                        onSelect={(date) => {
                            onChange(date ? formatDateForInput(date) : "");
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}


/**
 * Compute Statistics Utility
 * 
 * Provides functions to calculate statistics for table columns based on data type
 */

import { isDateAttribute, isNumericAttribute } from "@/components/filter-bar/utils";

export interface ComputeStatistics {
    type: "string" | "number" | "date";
    results: Record<string, string | number>;
}

/**
 * Detect the data type of a column based on actual values
 */
function detectColumnType(
    columnId: string,
    values: unknown[]
): "string" | "number" | "date" {
    // First check metadata
    if (isDateAttribute(columnId)) {
        return "date";
    }
    if (isNumericAttribute(columnId)) {
        return "number";
    }

    // Then check actual values
    const validValues = values.filter(
        (v) => v !== null && v !== undefined && v !== ""
    );

    if (validValues.length === 0) {
        return "string"; // Default to string if no values
    }

    // Check if all values are numbers
    const allNumbers = validValues.every((v) => {
        if (typeof v === "number") return true;
        if (typeof v === "string") {
            const num = parseFloat(v);
            return !isNaN(num) && isFinite(num);
        }
        return false;
    });

    if (allNumbers) {
        return "number";
    }

    // Check if values are dates (at least 50% should be valid dates)
    const dateCount = validValues.filter((v) => {
        if (typeof v === "string") {
            // Check for common date patterns
            const datePattern = /^\d{4}-\d{2}-\d{2}/; // YYYY-MM-DD
            if (datePattern.test(v)) {
                const date = new Date(v);
                return !isNaN(date.getTime());
            }
        }
        return false;
    }).length;

    // If more than 50% are dates, treat as date column
    if (dateCount > validValues.length * 0.5) {
        return "date";
    }

    return "string";
}

/**
 * Calculate statistics for string columns
 */
function computeStringStats(values: unknown[]): Record<string, string | number> {
    const validValues = values.filter(
        (v) => v !== null && v !== undefined && v !== ""
    );

    const uniqueValues = new Set(validValues.map((v) => String(v)));
    const valueCounts = new Map<string, number>();

    validValues.forEach((v) => {
        const str = String(v);
        valueCounts.set(str, (valueCounts.get(str) || 0) + 1);
    });

    // Find most common value
    let mostCommon = "";
    let maxCount = 0;
    valueCounts.forEach((count, value) => {
        if (count > maxCount) {
            maxCount = count;
            mostCommon = value;
        }
    });

    return {
        "Total Count": validValues.length,
        "Unique Values": uniqueValues.size,
        "Most Common": mostCommon || "N/A",
        "Most Common Count": maxCount,
    };
}

/**
 * Calculate statistics for numeric columns
 */
function computeNumberStats(values: unknown[]): Record<string, string | number> {
    const numbers = values
        .map((v) => {
            if (typeof v === "number") return v;
            if (typeof v === "string") {
                // Remove currency symbols and commas
                const cleaned = v.replace(/[$,]/g, "");
                const num = parseFloat(cleaned);
                return isNaN(num) ? null : num;
            }
            return null;
        })
        .filter((v): v is number => v !== null && isFinite(v));

    if (numbers.length === 0) {
        return {
            "Total Count": 0,
            "Valid Values": 0,
        };
    }

    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    const average = sum / numbers.length;
    const median =
        sorted.length % 2 === 0
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)];

    // Format numbers for display
    const formatNumber = (num: number): string => {
        if (num >= 1000) {
            return new Intl.NumberFormat("en-US", {
                maximumFractionDigits: 2,
            }).format(num);
        }
        return num.toFixed(2);
    };

    return {
        "Total Count": numbers.length,
        "Average": formatNumber(average),
        "Median": formatNumber(median),
        "Total": formatNumber(sum),
        "Minimum": formatNumber(sorted[0]),
        "Maximum": formatNumber(sorted[sorted.length - 1]),
    };
}

/**
 * Calculate statistics for date columns
 */
function computeDateStats(values: unknown[]): Record<string, string | number> {
    const dates = values
        .map((v) => {
            if (typeof v === "string") {
                const date = new Date(v);
                return isNaN(date.getTime()) ? null : date;
            }
            return null;
        })
        .filter((v): v is Date => v !== null);

    if (dates.length === 0) {
        return {
            "Total Count": 0,
            "Valid Dates": 0,
        };
    }

    const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
    const minDate = sorted[0];
    const maxDate = sorted[sorted.length - 1];

    // Calculate date range in days
    const rangeInDays = Math.ceil(
        (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return {
        "Total Count": dates.length,
        "Earliest Date": formatDate(minDate),
        "Latest Date": formatDate(maxDate),
        "Date Range (days)": rangeInDays,
    };
}

/**
 * Compute statistics for a column
 */
export function computeColumnStatistics(
    columnId: string,
    data: Record<string, unknown>[]
): ComputeStatistics {
    const values = data.map((row) => row[columnId]);
    const type = detectColumnType(columnId, values);

    let results: Record<string, string | number>;

    switch (type) {
        case "number":
            results = computeNumberStats(values);
            break;
        case "date":
            results = computeDateStats(values);
            break;
        default:
            results = computeStringStats(values);
    }

    return {
        type,
        results,
    };
}

/**
 * Get available computation options for a column type
 */
export function getComputationOptions(
    type: "string" | "number" | "date"
): Array<{ value: string; label: string }> {
    switch (type) {
        case "number":
            return [
                { value: "count", label: "Count" },
                { value: "average", label: "Average" },
                { value: "median", label: "Median" },
                { value: "total", label: "Total" },
                { value: "minimum", label: "Minimum" },
                { value: "maximum", label: "Maximum" },
            ];
        case "date":
            return [
                { value: "count", label: "Count" },
                { value: "earliest", label: "Earliest Date" },
                { value: "latest", label: "Latest Date" },
                { value: "range", label: "Date Range (days)" },
            ];
        default:
            return [
                { value: "count", label: "Total Count" },
                { value: "unique", label: "Unique Values" },
                { value: "mostCommon", label: "Most Common" },
            ];
    }
}

/**
 * Compute a single value based on computation type
 */
export function computeValue(
    columnId: string,
    data: Record<string, unknown>[],
    computationType: string
): string | number {
    const values = data.map((row) => row[columnId]);
    const type = detectColumnType(columnId, values);

    switch (type) {
        case "number": {
            const numbers = values
                .map((v) => {
                    if (typeof v === "number") return v;
                    if (typeof v === "string") {
                        const cleaned = v.replace(/[$,]/g, "");
                        const num = parseFloat(cleaned);
                        return isNaN(num) ? null : num;
                    }
                    return null;
                })
                .filter((v): v is number => v !== null && isFinite(v));

            if (numbers.length === 0) return 0;

            const sorted = [...numbers].sort((a, b) => a - b);
            const sum = numbers.reduce((acc, val) => acc + val, 0);

            switch (computationType) {
                case "count":
                    return numbers.length;
                case "average":
                    return Number((sum / numbers.length).toFixed(2));
                case "median":
                    const median =
                        sorted.length % 2 === 0
                            ? (sorted[sorted.length / 2 - 1] +
                                  sorted[sorted.length / 2]) /
                              2
                            : sorted[Math.floor(sorted.length / 2)];
                    return Number(median.toFixed(2));
                case "total":
                    return Number(sum.toFixed(2));
                case "minimum":
                    return Number(sorted[0].toFixed(2));
                case "maximum":
                    return Number(sorted[sorted.length - 1].toFixed(2));
                default:
                    return 0;
            }
        }
        case "date": {
            const dates = values
                .map((v) => {
                    if (typeof v === "string") {
                        const date = new Date(v);
                        return isNaN(date.getTime()) ? null : date;
                    }
                    return null;
                })
                .filter((v): v is Date => v !== null);

            if (dates.length === 0) return 0;

            const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
            const minDate = sorted[0];
            const maxDate = sorted[sorted.length - 1];

            const formatDate = (date: Date): string => {
                return date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                });
            };

            switch (computationType) {
                case "count":
                    return dates.length;
                case "earliest":
                    return formatDate(minDate);
                case "latest":
                    return formatDate(maxDate);
                case "range":
                    return Math.ceil(
                        (maxDate.getTime() - minDate.getTime()) /
                            (1000 * 60 * 60 * 24)
                    );
                default:
                    return 0;
            }
        }
        default: {
            const validValues = values.filter(
                (v) => v !== null && v !== undefined && v !== ""
            );

            switch (computationType) {
                case "count":
                    return validValues.length;
                case "unique": {
                    const uniqueValues = new Set(
                        validValues.map((v) => String(v))
                    );
                    return uniqueValues.size;
                }
                case "mostCommon": {
                    const valueCounts = new Map<string, number>();
                    validValues.forEach((v) => {
                        const str = String(v);
                        valueCounts.set(str, (valueCounts.get(str) || 0) + 1);
                    });
                    let mostCommon = "";
                    let maxCount = 0;
                    valueCounts.forEach((count, value) => {
                        if (count > maxCount) {
                            maxCount = count;
                            mostCommon = value;
                        }
                    });
                    return mostCommon || "N/A";
                }
                default:
                    return 0;
            }
        }
    }
}


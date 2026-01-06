/**
 * Filter Bar Utility Functions
 *
 * This file contains helper functions for:
 * - Column categorization and filtering
 * - Data type detection (date, numeric, text)
 * - Operator determination based on data type
 * - Value extraction and formatting
 */

import type { Column, Operator } from "./types";
import { getAllColumns } from "@/app/data/column";
import { employees } from "@/app/data/sampleData";

// ============================================================================
// COLUMN HELPERS
// ============================================================================

/**
 * Get all available columns from the data model
 */
export function getAvailableColumns(): Column[] {
    return getAllColumns();
}

/**
 * Group columns by their category for organized display
 *
 * @returns Map of category names to their columns
 */
export function groupColumnsByCategory(): Map<string, Column[]> {
    const allColumns = getAvailableColumns();
    const filtered = allColumns.filter(
        (col) => col.id && !col.isParent && !col.isDependentOf
    );

    const grouped = new Map<string, Column[]>();
    filtered.forEach((col) => {
        const category = col.category || "Other";
        if (!grouped.has(category)) {
            grouped.set(category, []);
        }
        grouped.get(category)!.push(col);
    });

    return grouped;
}

/**
 * Find a column by its ID
 */
export function findColumnById(columnId: string): Column | undefined {
    return getAvailableColumns().find((col) => col.id === columnId);
}

// ============================================================================
// DATA TYPE DETECTION
// ============================================================================

/**
 * Check if an attribute represents a date field
 *
 * Detection strategies:
 * 1. Explicit format === "date"
 * 2. Column ID contains "date"
 *
 * NOTE: We do NOT check operators here to avoid circular dependency
 * with getOperatorsForAttribute()
 */
export function isDateAttribute(attribute: string): boolean {
    if (!attribute) return false;

    const column = findColumnById(attribute);
    if (!column) return false;

    // Check explicit format
    if (column.format === "date") return true;

    // Check ID pattern (e.g., dateHired, dateOfBirth, dateRegularized)
    if (column.id.toLowerCase().includes("date")) return true;

    return false;
}

/**
 * Check if an attribute represents a numeric field
 *
 * Detection strategies:
 * 1. Explicit isNumeric flag or format
 * 2. Column ID matches common numeric patterns
 *
 * NOTE: We do NOT check operators here to avoid circular dependency
 * with getOperatorsForAttribute(). Also excludes date fields.
 */
export function isNumericAttribute(attribute: string): boolean {
    if (!attribute) return false;

    const column = findColumnById(attribute);
    if (!column) return false;

    // Exclude date fields first
    if (isDateAttribute(attribute)) return false;

    // Check explicit flags
    if (
        column.isNumeric ||
        column.format === "days" ||
        column.format === "count"
    ) {
        return true;
    }

    // Check ID patterns for common numeric field names
    const numericPatterns = [
        "age",
        "salary",
        "rate",
        "pay",
        "amount",
        "balance",
        "count",
        "number",
        "quantity",
        "total",
        "service", // lengthOfService, etc.
        "hours",
        "days",
        "months",
        "years",
    ];

    const lowerId = column.id.toLowerCase();
    const matchesPattern = numericPatterns.some((pattern) =>
        lowerId.includes(pattern)
    );

    return matchesPattern;
}

// ============================================================================
// OPERATOR HELPERS
// ============================================================================

/**
 * Get appropriate operators based on the attribute's data type
 *
 * @param attribute - The column ID
 * @returns Array of available operators for this attribute
 */
export function getOperatorsForAttribute(attribute: string): Operator[] {
    if (!attribute) return [];

    const column = findColumnById(attribute);
    if (!column) return [];

    const isDate = isDateAttribute(attribute);
    const isNumeric = isNumericAttribute(attribute);

    // Numeric fields (excluding dates)
    if (isNumeric && !isDate) {
        return [
            { value: "equals", label: "Equals" },
            { value: "greater_than", label: "Greater Than" },
            { value: "less_than", label: "Less Than" },
            { value: "between", label: "Between" },
        ];
    }

    // Date fields
    if (isDate) {
        return [
            { value: "equals", label: "Equals" },
            { value: "before", label: "Before" },
            { value: "after", label: "After" },
            { value: "between", label: "Between" },
        ];
    }

    // Text fields (default)
    return [
        { value: "equals", label: "Equals" },
        { value: "not_equals", label: "Is Not Equal To" },
    ];
}

// ============================================================================
// VALUE EXTRACTION
// ============================================================================

/**
 * Extract unique values from the dataset for a given attribute
 * Used to populate multi-select dropdowns and checkboxes
 *
 * @param attribute - The column ID
 * @returns Sorted array of unique string values
 */
export function getUniqueValuesForAttribute(attribute: string): string[] {
    if (!attribute) return [];

    const values = new Set<string>();

    employees.forEach((employee) => {
        const value = (employee as Record<string, unknown>)[attribute];
        if (value !== null && value !== undefined && value !== "") {
            values.add(String(value));
        }
    });

    return Array.from(values).sort();
}

// ============================================================================
// DATE FORMATTING
// ============================================================================

/**
 * Format a Date object to YYYY-MM-DD string for input fields
 */
export function formatDateForInput(date: Date | undefined): string {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/**
 * Parse a date string into a Date object
 * Returns undefined if the string is invalid
 */
export function parseDateString(dateString: string): Date | undefined {
    if (!dateString) return undefined;

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
}

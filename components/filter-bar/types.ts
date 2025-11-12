/**
 * Filter Bar Type Definitions
 *
 * This file contains all TypeScript types and interfaces used throughout
 * the filter bar component system.
 */

/**
 * Represents a filter rule in its editing state
 * Used internally when building/editing a filter before converting to FilterType
 */
export interface FilterRule {
    /** Unique identifier for the filter rule */
    id: string;

    /** Logical operator - "WHEN" for the first filter, "AND" or "OR" for subsequent ones */
    when: string;

    /** The column/field being filtered */
    attribute: string;

    /** The comparison operator (equals, not_equals, between, etc.) */
    operator: string;

    /** The filter value(s) - can be a single value or array for multi-select */
    value: string | string[];

    /** Second value for "between" operator */
    value2?: string;
}

/**
 * The three-step filter creation process
 */
export type FilterStep = "attribute" | "operator" | "value";

/**
 * Column metadata from the data model
 */
export interface Column {
    id: string;
    label: string;
    category?: string;
    isParent?: boolean;
    isDependentOf?: string;
    isNumeric?: boolean;
    format?: string;
}

/**
 * Operator definition for a filter
 */
export interface Operator {
    value: string;
    label: string;
}

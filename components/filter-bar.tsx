/**
 * Filter Bar Component (Legacy)
 *
 * This file now serves as a compatibility layer.
 * The actual FilterBar implementation has been refactored into modular components:
 *
 * - components/filter-bar/filter-bar.tsx (main component)
 * - components/filter-bar/types.ts (type definitions)
 * - components/filter-bar/utils.ts (helper functions)
 * - components/filter-bar/*-selection.tsx (step components)
 * - components/filter-bar/value-inputs/*.tsx (input components)
 *
 * Import from here will continue to work for backward compatibility.
 */

export { FilterBar } from "./filter-bar/filter-bar";

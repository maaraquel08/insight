import type { Filter } from "@/components/ui/filters";

// Extended Filter type with logical operator support
export interface FilterWithLogic<T = unknown> extends Filter<T> {
    logicalOperator?: "AND" | "OR"; // "AND" or "OR" - undefined means it's the first filter (WHEN)
}

// Map filter field keys to actual data field names
const FIELD_MAP: Record<string, string> = {
    dateHired: "dateHired",
    company: "companyName",
    department: "department",
    employeeType: "employeeType",
    position: "position",
    location: "currentAddress", // or workArrangement?
    salary: "annualSalary",
    status: "employmentStatus",
    lastActive: "dateHired", // placeholder
    notes: "", // placeholder
};

// Helper function to get the actual field name from filter key
function getFieldName(filterKey: string): string {
    return FIELD_MAP[filterKey] || filterKey;
}

// Helper function to normalize values for comparison
function normalizeValue(value: unknown): string {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value.toLowerCase().trim();
    if (typeof value === "number") return value.toString();
    if (typeof value === "boolean") return value.toString();
    return String(value).toLowerCase().trim();
}

// Helper function to compare dates
function compareDates(date1: string, date2: string): number {
    return new Date(date1).getTime() - new Date(date2).getTime();
}

// Apply a single filter to a data item
function applyFilter<T extends Record<string, unknown>>(
    item: T,
    filter: Filter
): boolean {
    const fieldName = getFieldName(filter.field);
    const fieldValue = item[fieldName];
    const operator = filter.operator;
    const filterValues = filter.values;

    // Handle empty/not_empty operators
    if (operator === "empty") {
        return (
            fieldValue === null ||
            fieldValue === undefined ||
            fieldValue === "" ||
            (Array.isArray(fieldValue) && fieldValue.length === 0)
        );
    }

    if (operator === "not_empty") {
        return !(
            fieldValue === null ||
            fieldValue === undefined ||
            fieldValue === "" ||
            (Array.isArray(fieldValue) && fieldValue.length === 0)
        );
    }

    // If filter values are empty and operator requires values, return false
    if (filterValues.length === 0) {
        return false;
    }

    // If field value is null/undefined and operator requires a value, return false
    if (fieldValue === null || fieldValue === undefined) {
        return false;
    }

    const normalizedFieldValue = normalizeValue(fieldValue);

    switch (operator) {
        case "is":
            return normalizedFieldValue === normalizeValue(filterValues[0]);

        case "is_not":
            return normalizedFieldValue !== normalizeValue(filterValues[0]);

        case "is_any_of":
            return filterValues.some(
                (val) => normalizeValue(val) === normalizedFieldValue
            );

        case "is_not_any_of":
            return !filterValues.some(
                (val) => normalizeValue(val) === normalizedFieldValue
            );

        case "contains":
            return normalizedFieldValue.includes(
                normalizeValue(filterValues[0])
            );

        case "not_contains":
            return !normalizedFieldValue.includes(
                normalizeValue(filterValues[0])
            );

        case "starts_with":
            return normalizedFieldValue.startsWith(
                normalizeValue(filterValues[0])
            );

        case "ends_with":
            return normalizedFieldValue.endsWith(
                normalizeValue(filterValues[0])
            );

        case "equals":
            // Try numeric comparison first
            const eqFieldNum = typeof fieldValue === "number" ? fieldValue : parseFloat(String(fieldValue));
            const eqFilterNum = typeof filterValues[0] === "number" ? filterValues[0] : parseFloat(String(filterValues[0]));
            
            if (!isNaN(eqFieldNum) && !isNaN(eqFilterNum)) {
                return eqFieldNum === eqFilterNum;
            }
            
            // Fallback to string comparison
            return normalizedFieldValue === normalizeValue(filterValues[0]);

        case "not_equals":
            // Try numeric comparison first
            const neqFieldNum = typeof fieldValue === "number" ? fieldValue : parseFloat(String(fieldValue));
            const neqFilterNum = typeof filterValues[0] === "number" ? filterValues[0] : parseFloat(String(filterValues[0]));
            
            if (!isNaN(neqFieldNum) && !isNaN(neqFilterNum)) {
                return neqFieldNum !== neqFilterNum;
            }
            
            // Fallback to string comparison
            return normalizedFieldValue !== normalizeValue(filterValues[0]);

        case "greater_than":
            // Try numeric comparison first
            const gtFieldNum = typeof fieldValue === "number" ? fieldValue : parseFloat(String(fieldValue));
            const gtFilterNum = typeof filterValues[0] === "number" ? filterValues[0] : parseFloat(String(filterValues[0]));
            
            if (!isNaN(gtFieldNum) && !isNaN(gtFilterNum)) {
                return gtFieldNum > gtFilterNum;
            }
            
            // Fallback to date comparison for strings
            if (typeof fieldValue === "string" && typeof filterValues[0] === "string") {
                return compareDates(fieldValue, filterValues[0]) > 0;
            }
            return false;

        case "less_than":
            // Try numeric comparison first
            const ltFieldNum = typeof fieldValue === "number" ? fieldValue : parseFloat(String(fieldValue));
            const ltFilterNum = typeof filterValues[0] === "number" ? filterValues[0] : parseFloat(String(filterValues[0]));
            
            if (!isNaN(ltFieldNum) && !isNaN(ltFilterNum)) {
                return ltFieldNum < ltFilterNum;
            }
            
            // Fallback to date comparison for strings
            if (typeof fieldValue === "string" && typeof filterValues[0] === "string") {
                return compareDates(fieldValue, filterValues[0]) < 0;
            }
            return false;

        case "between":
            if (filterValues.length < 2) return false;

            // Try numeric comparison first
            const betweenFieldNum = typeof fieldValue === "number" ? fieldValue : parseFloat(String(fieldValue));
            const betweenStartNum = typeof filterValues[0] === "number" ? filterValues[0] : parseFloat(String(filterValues[0]));
            const betweenEndNum = typeof filterValues[1] === "number" ? filterValues[1] : parseFloat(String(filterValues[1]));
            
            if (!isNaN(betweenFieldNum) && !isNaN(betweenStartNum) && !isNaN(betweenEndNum)) {
                return betweenFieldNum >= betweenStartNum && betweenFieldNum <= betweenEndNum;
            }

            // Handle date ranges (fallback for strings)
            if (typeof fieldValue === "string" && typeof filterValues[0] === "string" && typeof filterValues[1] === "string") {
                // Skip if dates are invalid or empty
                if (!fieldValue || !filterValues[0] || !filterValues[1]) return false;
                
                const fieldDate = new Date(fieldValue).getTime();
                const startDate = new Date(filterValues[0]).getTime();
                const endDate = new Date(filterValues[1]).getTime();
                
                // Check for invalid dates
                if (isNaN(fieldDate) || isNaN(startDate) || isNaN(endDate)) return false;
                
                return fieldDate >= startDate && fieldDate <= endDate;
            }

            return false;

        case "not_between":
            if (filterValues.length < 2) return false;

            // Try numeric comparison first
            const notBetweenFieldNum = typeof fieldValue === "number" ? fieldValue : parseFloat(String(fieldValue));
            const notBetweenStartNum = typeof filterValues[0] === "number" ? filterValues[0] : parseFloat(String(filterValues[0]));
            const notBetweenEndNum = typeof filterValues[1] === "number" ? filterValues[1] : parseFloat(String(filterValues[1]));
            
            if (!isNaN(notBetweenFieldNum) && !isNaN(notBetweenStartNum) && !isNaN(notBetweenEndNum)) {
                return notBetweenFieldNum < notBetweenStartNum || notBetweenFieldNum > notBetweenEndNum;
            }

            // Handle date ranges (fallback for strings)
            if (typeof fieldValue === "string" && typeof filterValues[0] === "string" && typeof filterValues[1] === "string") {
                // Skip if dates are invalid or empty
                if (!fieldValue || !filterValues[0] || !filterValues[1]) return false;
                
                const fieldDate = new Date(fieldValue).getTime();
                const startDate = new Date(filterValues[0]).getTime();
                const endDate = new Date(filterValues[1]).getTime();
                
                // Check for invalid dates
                if (isNaN(fieldDate) || isNaN(startDate) || isNaN(endDate)) return false;
                
                return fieldDate < startDate || fieldDate > endDate;
            }

            return false;

        case "before":
            if (typeof fieldValue === "string" && typeof filterValues[0] === "string") {
                if (!fieldValue || !filterValues[0]) return false;
                const fieldDate = new Date(fieldValue).getTime();
                const compareDate = new Date(filterValues[0]).getTime();
                if (isNaN(fieldDate) || isNaN(compareDate)) return false;
                return fieldDate < compareDate;
            }
            return false;

        case "after":
            if (typeof fieldValue === "string" && typeof filterValues[0] === "string") {
                if (!fieldValue || !filterValues[0]) return false;
                const fieldDate = new Date(fieldValue).getTime();
                const compareDate = new Date(filterValues[0]).getTime();
                if (isNaN(fieldDate) || isNaN(compareDate)) return false;
                return fieldDate > compareDate;
            }
            return false;

        case "includes_all":
            if (!Array.isArray(fieldValue)) return false;
            return filterValues.every((val) =>
                (fieldValue as unknown[]).some(
                    (fv) => normalizeValue(fv) === normalizeValue(val)
                )
            );

        case "excludes_all":
            if (!Array.isArray(fieldValue)) return false;
            return !filterValues.some((val) =>
                (fieldValue as unknown[]).some(
                    (fv) => normalizeValue(fv) === normalizeValue(val)
                )
            );

        default:
            console.warn(`Unknown filter operator: ${operator}`);
            return true; // Don't filter if operator is unknown
    }
}

// Filter data based on filters array with AND/OR logic support
export function filterData<T extends Record<string, unknown>>(
    data: T[],
    filters: (Filter | FilterWithLogic)[]
): T[] {
    if (filters.length === 0) {
        return data;
    }

    return data.filter((item) => {
        // Process filters sequentially with AND/OR logic
        let result = true; // Start with true for the first filter
        
        for (let i = 0; i < filters.length; i++) {
            const filter = filters[i];
            const filterResult = applyFilter(item, filter);
            const logicalOp = (filter as FilterWithLogic).logicalOperator;
            
            if (i === 0) {
                // First filter (WHEN) - just set the result
                result = filterResult;
            } else {
                // Subsequent filters - apply AND/OR logic
                if (logicalOp === "OR") {
                    result = result || filterResult;
                } else {
                    // Default to AND if not specified
                    result = result && filterResult;
                }
            }
        }
        
        return result;
    });
}


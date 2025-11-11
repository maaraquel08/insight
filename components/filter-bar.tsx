"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChevronDown,
    Filter,
    Building2,
    Users,
    BarChart3,
    User,
    Briefcase,
    MapPin,
    DollarSign,
    Clock,
    FileText,
    Tag,
    Plus,
    Minus,
    X,
    ArrowLeft,
} from "lucide-react";
import {
    Filters,
    createFilter,
    type Filter as FilterType,
    type FilterFieldConfig,
} from "@/components/ui/filters";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useFilters } from "@/contexts/filter-context";
import { cn } from "@/lib/utils";
import { getAllColumns } from "@/app/data/column";
import { employees } from "@/app/data/sampleData";
import { Check } from "lucide-react";

const imgFilter =
    "http://localhost:3845/assets/f884bcb0d13035725e37189a5faf1371fa6041df.svg";

// Define date type options
const dateTypeOptions = [
    {
        key: "dateHired",
        label: "Date Hired",
        type: "daterange" as const,
        icon: <Calendar className="w-3.5 h-3.5" />,
    },
    {
        key: "dateResigned",
        label: "Date Resigned",
        type: "daterange" as const,
        icon: <Calendar className="w-3.5 h-3.5" />,
    },
    {
        key: "dateJoined",
        label: "Date Joined",
        type: "daterange" as const,
        icon: <Calendar className="w-3.5 h-3.5" />,
    },
    {
        key: "dateTerminated",
        label: "Date Terminated",
        type: "daterange" as const,
        icon: <Calendar className="w-3.5 h-3.5" />,
    },
    {
        key: "datePromoted",
        label: "Date Promoted",
        type: "daterange" as const,
        icon: <Calendar className="w-3.5 h-3.5" />,
    },
    {
        key: "dateReview",
        label: "Date Review",
        type: "daterange" as const,
        icon: <Calendar className="w-3.5 h-3.5" />,
    },
];

// Define filter fields configuration
const filterFields: FilterFieldConfig[] = [
    {
        key: "date",
        label: "Date",
        type: "select",
        icon: <Calendar className="w-3.5 h-3.5" />,
        // Store date type options for nested selection
        dateTypes: dateTypeOptions,
    },
    // Add date type fields to the fields array so they can be rendered as filters
    ...dateTypeOptions.map((dateType) => ({
        key: dateType.key,
        label: dateType.label,
        type: dateType.type,
        icon: dateType.icon,
    })),
    {
        key: "company",
        label: "Company",
        type: "multiselect",
        icon: <Building2 className="w-3.5 h-3.5" />,
        options: [
            { value: "Tech Solutions Inc.", label: "Tech Solutions Inc." },
        ],
    },
    {
        key: "department",
        label: "Department",
        type: "multiselect",
        icon: <Users className="w-3.5 h-3.5" />,
        options: [
            { value: "Engineering", label: "Engineering" },
            { value: "Sales", label: "Sales" },
            { value: "Human Resources", label: "Human Resources" },
            { value: "Business Development", label: "Business Development" },
            { value: "Operations", label: "Operations" },
            { value: "Technology", label: "Technology" },
        ],
    },
    {
        key: "aggregateBy",
        label: "Aggregate By",
        type: "select",
        icon: <BarChart3 className="w-3.5 h-3.5" />,
        options: [
            { value: "month", label: "Month" },
            { value: "quarter", label: "Quarter" },
            { value: "year", label: "Year" },
            { value: "week", label: "Week" },
            { value: "day", label: "Day" },
        ],
    },
    {
        key: "employeeType",
        label: "Employee Type",
        type: "multiselect",
        icon: <User className="w-3.5 h-3.5" />,
        options: [
            { value: "fulltime", label: "Full Time" },
            { value: "parttime", label: "Part Time" },
            { value: "contract", label: "Contract" },
            { value: "intern", label: "Intern" },
            { value: "freelance", label: "Freelance" },
        ],
    },
    {
        key: "position",
        label: "Position",
        type: "multiselect",
        icon: <Briefcase className="w-3.5 h-3.5" />,
        options: [
            { value: "manager", label: "Manager" },
            { value: "senior", label: "Senior" },
            { value: "mid", label: "Mid Level" },
            { value: "junior", label: "Junior" },
            { value: "executive", label: "Executive" },
            { value: "director", label: "Director" },
        ],
    },
    {
        key: "location",
        label: "Location",
        type: "multiselect",
        icon: <MapPin className="w-3.5 h-3.5" />,
        options: [
            { value: "remote", label: "Remote" },
            { value: "nyc", label: "New York" },
            { value: "sf", label: "San Francisco" },
            { value: "la", label: "Los Angeles" },
            { value: "chicago", label: "Chicago" },
            { value: "boston", label: "Boston" },
        ],
    },
    {
        key: "salary",
        label: "Salary Range",
        type: "numberrange",
        icon: <DollarSign className="w-3.5 h-3.5" />,
        min: 0,
        max: 500000,
        step: 1000,
        prefix: "$",
    },
    {
        key: "status",
        label: "Status",
        type: "select",
        icon: <Tag className="w-3.5 h-3.5" />,
        options: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "on_leave", label: "On Leave" },
            { value: "terminated", label: "Terminated" },
        ],
    },
    {
        key: "lastActive",
        label: "Last Active",
        type: "date",
        icon: <Clock className="w-3.5 h-3.5" />,
    },
    {
        key: "notes",
        label: "Notes",
        type: "text",
        icon: <FileText className="w-3.5 h-3.5" />,
        placeholder: "Search notes...",
    },
];

interface FilterRule {
    id: string;
    when: string; // "WHEN" for first, "AND" or "OR" for others
    attribute: string;
    operator: string;
    value: string | string[]; // Single value or array of values for multi-select
    value2?: string; // For "between" operator
}

// Get all available columns for attributes
const allColumns = getAllColumns();

// Group columns by category
function getColumnsByCategory() {
    const filtered = allColumns.filter(
        (col) => col.id && !col.isParent && !col.isDependentOf
    );
    const grouped = new Map<string, typeof filtered>();
    filtered.forEach((col) => {
        const category = col.category || "Other";
        if (!grouped.has(category)) {
            grouped.set(category, []);
        }
        grouped.get(category)!.push(col);
    });
    return grouped;
}

// Get unique values for a given attribute from sample data
function getUniqueValuesForAttribute(attribute: string): string[] {
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

// Get operators based on attribute type
function getOperatorsForAttribute(attribute: string) {
    if (!attribute) return [];

    const column = allColumns.find((col) => col.id === attribute);
    if (!column) return [];

    // Check if it's a date field (by format or ID pattern)
    const isDateField =
        column.format === "date" || column.id.toLowerCase().includes("date");

    // Check if it's a numeric field (by format or ID pattern)
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
        "service",
        "hours",
        "days",
        "months",
        "years",
    ];
    const lowerId = column.id.toLowerCase();
    const isNumericField =
        column.isNumeric ||
        column.format === "days" ||
        column.format === "count" ||
        numericPatterns.some((pattern) => lowerId.includes(pattern));

    // Determine operators based on column format/type
    if (isNumericField && !isDateField) {
        return [
            { value: "equals", label: "Equals" },
            { value: "greater_than", label: "Greater Than" },
            { value: "less_than", label: "Less Than" },
            { value: "between", label: "Between" },
        ];
    } else if (isDateField) {
        return [
            { value: "equals", label: "Equals" },
            { value: "before", label: "Before" },
            { value: "after", label: "After" },
            { value: "between", label: "Between" },
        ];
    } else {
        return [
            { value: "equals", label: "Equals" },
            { value: "contains", label: "Contains" },
            { value: "starts_with", label: "Starts With" },
            { value: "ends_with", label: "Ends With" },
        ];
    }
}

// Check if attribute is date type
function isDateAttribute(attribute: string): boolean {
    if (!attribute) return false;
    const column = allColumns.find((col) => col.id === attribute);
    if (!column) return false;

    // Check if format is explicitly "date"
    if (column.format === "date") return true;

    // Check if column ID contains "date" (e.g., dateHired, dateOfBirth, dateRegularized)
    if (column.id.toLowerCase().includes("date")) return true;

    // Check operators - if it has date-specific operators, it's a date field
    const operators = getOperatorsForAttribute(attribute);
    const hasDateOperators = operators.some(
        (op) => op.value === "before" || op.value === "after"
    );
    if (hasDateOperators) return true;

    return false;
}

// Check if attribute is numeric type
function isNumericAttribute(attribute: string): boolean {
    if (!attribute) return false;
    const column = allColumns.find((col) => col.id === attribute);
    if (!column) return false;

    // Check if explicitly marked as numeric
    if (
        column.isNumeric ||
        column.format === "days" ||
        column.format === "count"
    ) {
        return true;
    }

    // Check by column ID pattern for common numeric fields
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
    const isNumericField = numericPatterns.some((pattern) =>
        lowerId.includes(pattern)
    );

    if (isNumericField) return true;

    // Check operators - if it has numeric-specific operators, it's a numeric field
    const operators = getOperatorsForAttribute(attribute);
    const hasNumericOperators = operators.some(
        (op) =>
            op.value === "greater_than" ||
            op.value === "less_than" ||
            op.value === "between"
    );
    if (hasNumericOperators && !isDateAttribute(attribute)) {
        return true;
    }

    return false;
}

// Format date for input (YYYY-MM-DD)
function formatDateForInput(date: Date | undefined): string {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Parse date string to Date object
function parseDateString(dateString: string): Date | undefined {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
}

export function FilterBar() {
    const { filters, setFilters } = useFilters();
    const [addFilterPopoverOpen, setAddFilterPopoverOpen] = useState(false);
    const [filterSearchTerm, setFilterSearchTerm] = useState("");
    const [currentFilterRule, setCurrentFilterRule] =
        useState<FilterRule | null>(null);
    const [filterStep, setFilterStep] = useState<
        "attribute" | "operator" | "value"
    >("attribute");

    const updateCurrentFilterRule = (
        field: keyof FilterRule,
        value: string | string[] | undefined
    ) => {
        if (!currentFilterRule) return;
        setCurrentFilterRule({ ...currentFilterRule, [field]: value });
    };

    const updateCurrentFilterRuleMultiple = (updates: Partial<FilterRule>) => {
        if (!currentFilterRule) return;
        setCurrentFilterRule({ ...currentFilterRule, ...updates });
    };

    const handleClearFilters = () => {
        setFilters([]);
    };

    const handleRemoveFilter = (filterId: string) => {
        setFilters(filters.filter((f) => f.id !== filterId));
    };

    const handleEditFilter = (filter: FilterType) => {
        // Convert Filter back to FilterRule for editing
        const filterIndex = filters.findIndex((f) => f.id === filter.id);
        const when =
            filterIndex === 0
                ? "WHEN"
                : (filter as FilterType & { logicalOperator?: "AND" | "OR" })
                      .logicalOperator || "AND";

        // Convert values back to string format
        let value: string | string[] = "";
        let value2: string | undefined = undefined;
        let operator = filter.operator;

        // Convert "is_any_of" back to "is" for editing
        if (operator === "is_any_of") {
            operator = "is";
        }

        if (filter.operator === "between" && filter.values.length >= 2) {
            value = String(filter.values[0]);
            value2 = String(filter.values[1]);
        } else if (filter.values.length > 0) {
            // Handle array of values (for multi-select or is_any_of)
            if (filter.values.length === 1) {
                value = String(filter.values[0]);
            } else {
                // Multiple values - convert to array of strings
                value = filter.values.map(String);
            }
        }

        const filterRule: FilterRule = {
            id: filter.id,
            when,
            attribute: filter.field,
            operator,
            value,
            value2,
        };

        setCurrentFilterRule(filterRule);
        setFilterStep("value"); // Start at value step since attribute and operator are already set
        setAddFilterPopoverOpen(true);
    };

    const formatFilterDisplay = (filter: FilterType): string => {
        const column = allColumns.find((col) => col.id === filter.field);
        if (!column) return "Unknown";
        return column.label;
    };

    const handleAddFilterOption = (columnId: string) => {
        // Create a new filter rule with the selected column
        const newRule: FilterRule = {
            id: Date.now().toString(),
            when: filters.length === 0 ? "WHEN" : "AND",
            attribute: columnId,
            operator: "",
            value: "",
            value2: undefined,
        };
        setCurrentFilterRule(newRule);
        setFilterStep("operator");
        setFilterSearchTerm(""); // Clear search when moving to next step
    };

    const handleSelectOperator = (operator: string) => {
        if (!currentFilterRule) return;
        setCurrentFilterRule({
            ...currentFilterRule,
            operator,
            value: "",
            value2: undefined,
        });
        setFilterStep("value");
    };

    const handleBackToAttributes = () => {
        setFilterStep("attribute");
        setCurrentFilterRule(null);
        setFilterSearchTerm("");
    };

    const handleBackToOperators = () => {
        setFilterStep("operator");
    };

    const handleApplyFilter = () => {
        if (!currentFilterRule) return;

        // Check if filter is valid
        if (currentFilterRule.operator === "between") {
            if (
                !currentFilterRule.attribute ||
                !currentFilterRule.operator ||
                !currentFilterRule.value ||
                !currentFilterRule.value2
            ) {
                return;
            }
        } else {
            const hasValue = Array.isArray(currentFilterRule.value)
                ? currentFilterRule.value.length > 0
                : currentFilterRule.value && currentFilterRule.value !== "";
            if (
                !currentFilterRule.attribute ||
                !currentFilterRule.operator ||
                !hasValue
            ) {
                return;
            }
        }

        // Convert to Filter format
        const isNumeric = isNumericAttribute(currentFilterRule.attribute);
        const isDate = isDateAttribute(currentFilterRule.attribute);

        let processedValues: (string | number)[] = [];

        if (
            currentFilterRule.operator === "between" &&
            currentFilterRule.value2
        ) {
            if (isNumeric && !isDate) {
                const valueStr = Array.isArray(currentFilterRule.value)
                    ? currentFilterRule.value[0]
                    : currentFilterRule.value;
                const num1 = parseFloat(valueStr);
                const num2 = parseFloat(currentFilterRule.value2);
                processedValues = [
                    !isNaN(num1) ? num1 : valueStr,
                    !isNaN(num2) ? num2 : currentFilterRule.value2,
                ];
            } else {
                const valueStr = Array.isArray(currentFilterRule.value)
                    ? currentFilterRule.value[0]
                    : currentFilterRule.value;
                processedValues = [valueStr, currentFilterRule.value2];
            }
        } else {
            const valuesToProcess = Array.isArray(currentFilterRule.value)
                ? currentFilterRule.value
                : [currentFilterRule.value];

            if (isNumeric && !isDate) {
                processedValues = valuesToProcess.map((val) => {
                    const num = parseFloat(val);
                    return !isNaN(num) ? num : val;
                });
            } else {
                processedValues = valuesToProcess;
            }
        }

        let finalOperator = currentFilterRule.operator;
        if (
            processedValues.length > 1 &&
            (currentFilterRule.operator === "is" ||
                currentFilterRule.operator === "equals")
        ) {
            finalOperator = "is_any_of";
        }

        const filter: FilterType = {
            id: currentFilterRule.id,
            field: currentFilterRule.attribute,
            operator: finalOperator,
            values: processedValues,
        };

        // Add logical operator if it's not the first filter
        if (currentFilterRule.when !== "WHEN") {
            (
                filter as FilterType & { logicalOperator?: "AND" | "OR" }
            ).logicalOperator = currentFilterRule.when as "AND" | "OR";
        }

        // Check if we're editing an existing filter or adding a new one
        const existingFilterIndex = filters.findIndex(
            (f) => f.id === currentFilterRule.id
        );

        if (existingFilterIndex >= 0) {
            // Update existing filter
            const updatedFilters = [...filters];
            updatedFilters[existingFilterIndex] = filter;
            setFilters(updatedFilters);
        } else {
            // Add new filter
            setFilters([...filters, filter]);
        }

        setAddFilterPopoverOpen(false);
        setCurrentFilterRule(null);
        setFilterStep("attribute");
        setFilterSearchTerm("");
    };

    const handleCancelFilter = () => {
        setAddFilterPopoverOpen(false);
        setCurrentFilterRule(null);
        setFilterStep("attribute");
        setFilterSearchTerm("");
    };

    return (
        <div className="bg-white flex items-center justify-between py-3 px-3 border-b border-[#d9dede] shrink-0 overflow-hidden">
            <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                <Popover
                    open={addFilterPopoverOpen}
                    onOpenChange={(open) => {
                        setAddFilterPopoverOpen(open);
                        if (!open) {
                            // Reset when popover closes
                            setFilterStep("attribute");
                            setCurrentFilterRule(null);
                            setFilterSearchTerm("");
                        }
                    }}
                >
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2.5 gap-1.25 text-xs border border-border hover:bg-secondary"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add Filter
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-[300px] p-0 border-weak overflow-hidden"
                        align="start"
                    >
                        {filterStep === "attribute" && (
                            <>
                                <div className="border-b border-weak">
                                    <Input
                                        placeholder="Search filters..."
                                        className="h-9 border-0 rounded-none focus-visible:ring-0"
                                        value={filterSearchTerm}
                                        onChange={(e) =>
                                            setFilterSearchTerm(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    {(() => {
                                        const searchTerm = filterSearchTerm
                                            .toLowerCase()
                                            .trim();
                                        const filteredCategories: Array<
                                            [string, typeof allColumns]
                                        > = Array.from(
                                            getColumnsByCategory()
                                        ).map(([category, columns]) => [
                                            category,
                                            columns.filter(
                                                (col) =>
                                                    col.label
                                                        .toLowerCase()
                                                        .includes(searchTerm) ||
                                                    category
                                                        .toLowerCase()
                                                        .includes(searchTerm)
                                            ),
                                        ]);

                                        const hasResults =
                                            filteredCategories.some(
                                                ([_, cols]) => cols.length > 0
                                            );

                                        if (!hasResults && searchTerm) {
                                            return (
                                                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                                                    No filters found.
                                                </div>
                                            );
                                        }

                                        return filteredCategories.map(
                                            ([category, columns]) => {
                                                if (columns.length === 0)
                                                    return null;
                                                return (
                                                    <div
                                                        key={category}
                                                        className="border-b border-weak last:border-b-0"
                                                    >
                                                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                                            {category}
                                                        </div>
                                                        {columns.map(
                                                            (
                                                                column: (typeof allColumns)[number]
                                                            ) => (
                                                                <button
                                                                    key={
                                                                        column.id
                                                                    }
                                                                    onClick={() => {
                                                                        handleAddFilterOption(
                                                                            column.id
                                                                        );
                                                                        setFilterSearchTerm(
                                                                            ""
                                                                        );
                                                                    }}
                                                                    className="w-full px-4 py-3 text-sm text-[#262b2b] whitespace-nowrap text-left hover:bg-accent transition-colors"
                                                                >
                                                                    {
                                                                        column.label
                                                                    }
                                                                </button>
                                                            )
                                                        )}
                                                    </div>
                                                );
                                            }
                                        );
                                    })()}
                                </div>
                            </>
                        )}

                        {filterStep === "operator" && currentFilterRule && (
                            <>
                                <div className="border-b border-weak px-4 py-2 flex items-center gap-2">
                                    <button
                                        onClick={handleBackToAttributes}
                                        className="flex items-center justify-center h-6 w-6 hover:bg-accent rounded transition-colors"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </button>
                                    <span className="text-sm font-medium text-[#262b2b]">
                                        {allColumns.find(
                                            (col) =>
                                                col.id ===
                                                currentFilterRule.attribute
                                        )?.label || "Select operator"}
                                    </span>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    {getOperatorsForAttribute(
                                        currentFilterRule.attribute
                                    ).map((op) => (
                                        <button
                                            key={op.value}
                                            onClick={() => {
                                                handleSelectOperator(op.value);
                                            }}
                                            className="w-full px-4 py-3 text-sm text-[#262b2b] whitespace-nowrap text-left hover:bg-accent transition-colors"
                                        >
                                            {op.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        {filterStep === "value" && currentFilterRule && (
                            <>
                                <div className="border-b border-weak px-4 py-2 flex items-center gap-2">
                                    <button
                                        onClick={handleBackToOperators}
                                        className="flex items-center justify-center h-6 w-6 hover:bg-accent rounded transition-colors"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </button>
                                    <span className="text-sm font-medium text-[#262b2b]">
                                        {allColumns.find(
                                            (col) =>
                                                col.id ===
                                                currentFilterRule.attribute
                                        )?.label || "Select value"}
                                    </span>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    {isDateAttribute(
                                        currentFilterRule.attribute
                                    ) ? (
                                        // Date: Calendar picker
                                        currentFilterRule.operator ===
                                        "between" ? (
                                            // Between: Two date pickers
                                            <div className="flex flex-col gap-3">
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
                                                                    !currentFilterRule.value &&
                                                                        "text-muted-foreground"
                                                                )}
                                                            >
                                                                <span>
                                                                    {currentFilterRule.value
                                                                        ? formatDateForInput(
                                                                              parseDateString(
                                                                                  Array.isArray(
                                                                                      currentFilterRule.value
                                                                                  )
                                                                                      ? currentFilterRule
                                                                                            .value[0]
                                                                                      : currentFilterRule.value
                                                                              )
                                                                          )
                                                                        : "Select start date"}
                                                                </span>
                                                                <ChevronDown className="h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent
                                                            className="w-[328px] p-0"
                                                            align="start"
                                                        >
                                                            <Calendar
                                                                className="w-full"
                                                                mode="single"
                                                                captionLayout="dropdown"
                                                                selected={parseDateString(
                                                                    Array.isArray(
                                                                        currentFilterRule.value
                                                                    )
                                                                        ? currentFilterRule
                                                                              .value[0]
                                                                        : currentFilterRule.value
                                                                )}
                                                                onSelect={(
                                                                    date
                                                                ) => {
                                                                    updateCurrentFilterRule(
                                                                        "value",
                                                                        date
                                                                            ? formatDateForInput(
                                                                                  date
                                                                              )
                                                                            : ""
                                                                    );
                                                                }}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
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
                                                                    !currentFilterRule.value2 &&
                                                                        "text-muted-foreground"
                                                                )}
                                                            >
                                                                <span>
                                                                    {currentFilterRule.value2
                                                                        ? formatDateForInput(
                                                                              parseDateString(
                                                                                  currentFilterRule.value2
                                                                              )
                                                                          )
                                                                        : "Select end date"}
                                                                </span>
                                                                <ChevronDown className="h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent
                                                            className="w-[328px] p-0"
                                                            align="start"
                                                        >
                                                            <Calendar
                                                                className="w-full"
                                                                mode="single"
                                                                captionLayout="dropdown"
                                                                selected={parseDateString(
                                                                    currentFilterRule.value2 ||
                                                                        ""
                                                                )}
                                                                onSelect={(
                                                                    date
                                                                ) => {
                                                                    updateCurrentFilterRule(
                                                                        "value2",
                                                                        date
                                                                            ? formatDateForInput(
                                                                                  date
                                                                              )
                                                                            : undefined
                                                                    );
                                                                }}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setAddFilterPopoverOpen(
                                                                false
                                                            );
                                                            setCurrentFilterRule(
                                                                null
                                                            );
                                                            setFilterStep(
                                                                "attribute"
                                                            );
                                                        }}
                                                        className="flex-1 h-9 border-[#b8c1c0] text-sm font-medium text-[#262b2b]"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            handleApplyFilter();
                                                            setAddFilterPopoverOpen(
                                                                false
                                                            );
                                                        }}
                                                        className="flex-1 h-9 bg-[#158039] hover:bg-[#158039]/90 text-white text-sm font-medium"
                                                    >
                                                        Apply
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            // Single date picker
                                            <div className="flex flex-col gap-3">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "h-9 w-full text-sm border-weak rounded-md justify-between font-normal",
                                                                !currentFilterRule.value &&
                                                                    "text-muted-foreground"
                                                            )}
                                                        >
                                                            <span>
                                                                {currentFilterRule.value
                                                                    ? formatDateForInput(
                                                                          parseDateString(
                                                                              Array.isArray(
                                                                                  currentFilterRule.value
                                                                              )
                                                                                  ? currentFilterRule
                                                                                        .value[0]
                                                                                  : currentFilterRule.value
                                                                          )
                                                                      )
                                                                    : "Select date"}
                                                            </span>
                                                            <ChevronDown className="h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="p-0 w-[328px]"
                                                        align="start"
                                                    >
                                                        <Calendar
                                                            className="w-full"
                                                            mode="single"
                                                            captionLayout="dropdown"
                                                            selected={parseDateString(
                                                                Array.isArray(
                                                                    currentFilterRule.value
                                                                )
                                                                    ? currentFilterRule
                                                                          .value[0]
                                                                    : currentFilterRule.value
                                                            )}
                                                            onSelect={(
                                                                date
                                                            ) => {
                                                                updateCurrentFilterRule(
                                                                    "value",
                                                                    date
                                                                        ? formatDateForInput(
                                                                              date
                                                                          )
                                                                        : ""
                                                                );
                                                            }}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <div className="flex gap-2 pt-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setAddFilterPopoverOpen(
                                                                false
                                                            );
                                                            setCurrentFilterRule(
                                                                null
                                                            );
                                                            setFilterStep(
                                                                "attribute"
                                                            );
                                                        }}
                                                        className="flex-1 h-9 border-[#b8c1c0] text-sm font-medium text-[#262b2b]"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            handleApplyFilter();
                                                            setAddFilterPopoverOpen(
                                                                false
                                                            );
                                                        }}
                                                        className="flex-1 h-9 bg-[#158039] hover:bg-[#158039]/90 text-white text-sm font-medium"
                                                    >
                                                        Apply
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    ) : isNumericAttribute(
                                          currentFilterRule.attribute
                                      ) ? (
                                        // Numeric: Number input
                                        currentFilterRule.operator ===
                                        "between" ? (
                                            // Between: Two number inputs
                                            <div className="flex flex-col gap-3">
                                                <div>
                                                    <label className="text-xs text-muted-foreground mb-1 block">
                                                        Min
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        placeholder="Min"
                                                        value={
                                                            Array.isArray(
                                                                currentFilterRule.value
                                                            )
                                                                ? currentFilterRule
                                                                      .value[0]
                                                                : currentFilterRule.value
                                                        }
                                                        onChange={(e) => {
                                                            updateCurrentFilterRule(
                                                                "value",
                                                                e.target.value
                                                            );
                                                        }}
                                                        className="h-9"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-muted-foreground mb-1 block">
                                                        Max
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        placeholder="Max"
                                                        value={
                                                            currentFilterRule.value2 ||
                                                            ""
                                                        }
                                                        onChange={(e) => {
                                                            updateCurrentFilterRule(
                                                                "value2",
                                                                e.target.value
                                                            );
                                                        }}
                                                        className="h-9"
                                                    />
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setAddFilterPopoverOpen(
                                                                false
                                                            );
                                                            setCurrentFilterRule(
                                                                null
                                                            );
                                                            setFilterStep(
                                                                "attribute"
                                                            );
                                                        }}
                                                        className="flex-1 h-9 border-[#b8c1c0] text-sm font-medium text-[#262b2b]"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            handleApplyFilter();
                                                            setAddFilterPopoverOpen(
                                                                false
                                                            );
                                                        }}
                                                        className="flex-1 h-9 bg-[#158039] hover:bg-[#158039]/90 text-white text-sm font-medium"
                                                    >
                                                        Apply
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            // Single number input
                                            <div className="flex flex-col gap-3">
                                                <Input
                                                    type="number"
                                                    placeholder="Value"
                                                    value={
                                                        Array.isArray(
                                                            currentFilterRule.value
                                                        )
                                                            ? currentFilterRule
                                                                  .value[0]
                                                            : currentFilterRule.value
                                                    }
                                                    onChange={(e) => {
                                                        updateCurrentFilterRule(
                                                            "value",
                                                            e.target.value
                                                        );
                                                    }}
                                                    className="h-9"
                                                    autoFocus
                                                />
                                                <div className="flex gap-2 pt-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setAddFilterPopoverOpen(
                                                                false
                                                            );
                                                            setCurrentFilterRule(
                                                                null
                                                            );
                                                            setFilterStep(
                                                                "attribute"
                                                            );
                                                        }}
                                                        className="flex-1 h-9 border-[#b8c1c0] text-sm font-medium text-[#262b2b]"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            handleApplyFilter();
                                                            setAddFilterPopoverOpen(
                                                                false
                                                            );
                                                        }}
                                                        className="flex-1 h-9 bg-[#158039] hover:bg-[#158039]/90 text-white text-sm font-medium"
                                                    >
                                                        Apply
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        // Text: Multi-select with checkboxes
                                        <div className="flex flex-col gap-3">
                                            <div className="max-h-[300px] overflow-y-auto">
                                                {getUniqueValuesForAttribute(
                                                    currentFilterRule.attribute
                                                ).map((val) => {
                                                    const selectedValues =
                                                        Array.isArray(
                                                            currentFilterRule.value
                                                        )
                                                            ? currentFilterRule.value
                                                            : currentFilterRule.value
                                                            ? [
                                                                  currentFilterRule.value,
                                                              ]
                                                            : [];
                                                    const isSelected =
                                                        selectedValues.includes(
                                                            val
                                                        );

                                                    return (
                                                        <button
                                                            key={val}
                                                            onClick={() => {
                                                                const currentValues =
                                                                    Array.isArray(
                                                                        currentFilterRule.value
                                                                    )
                                                                        ? currentFilterRule.value
                                                                        : currentFilterRule.value
                                                                        ? [
                                                                              currentFilterRule.value,
                                                                          ]
                                                                        : [];

                                                                const newValues =
                                                                    isSelected
                                                                        ? currentValues.filter(
                                                                              (
                                                                                  v
                                                                              ) =>
                                                                                  v !==
                                                                                  val
                                                                          )
                                                                        : [
                                                                              ...currentValues,
                                                                              val,
                                                                          ];

                                                                updateCurrentFilterRule(
                                                                    "value",
                                                                    newValues.length ===
                                                                        1
                                                                        ? newValues[0]
                                                                        : newValues
                                                                );
                                                            }}
                                                            className="w-full px-4 py-3 text-sm text-[#262b2b] whitespace-nowrap text-left hover:bg-accent transition-colors flex items-center gap-2"
                                                        >
                                                            <div
                                                                className={cn(
                                                                    "flex h-4 w-4 items-center justify-center rounded border border-weak",
                                                                    isSelected &&
                                                                        "bg-[#158039] border-[#158039]"
                                                                )}
                                                            >
                                                                {isSelected && (
                                                                    <Check className="h-3 w-3 text-white" />
                                                                )}
                                                            </div>
                                                            <span>{val}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <div className="flex gap-2 border-t border-weak p-4">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setAddFilterPopoverOpen(
                                                            false
                                                        );
                                                        setCurrentFilterRule(
                                                            null
                                                        );
                                                        setFilterStep(
                                                            "attribute"
                                                        );
                                                    }}
                                                    className="flex-1 h-9 border-[#b8c1c0] text-sm font-medium text-[#262b2b]"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        handleApplyFilter();
                                                        setAddFilterPopoverOpen(
                                                            false
                                                        );
                                                    }}
                                                    className="flex-1 h-9 bg-[#158039] hover:bg-[#158039]/90 text-white text-sm font-medium"
                                                >
                                                    Apply
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </PopoverContent>
                </Popover>
                {filters.map((filter) => {
                    const column = allColumns.find(
                        (col) => col.id === filter.field
                    );
                    if (!column) return null;

                    return (
                        <div
                            key={filter.id}
                            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-border bg-background text-xs font-medium cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => handleEditFilter(filter)}
                        >
                            <span className="text-[#262b2b] whitespace-nowrap">
                                {formatFilterDisplay(filter)}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFilter(filter.id);
                                }}
                                className="flex items-center justify-center h-4 w-4 rounded hover:bg-destructive/10 transition-colors"
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                            </button>
                        </div>
                    );
                })}
                {filters.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2.5 gap-1.25 text-xs border border-[#b61f27] text-[#b61f27] hover:bg-[#b61f27]/5"
                        onClick={handleClearFilters}
                    >
                        <X className="w-3.5 h-3.5" />
                        Clear Filters
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-2 ml-4 shrink-0">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-9 border-[#b8c1c0] text-xs font-medium text-[#262b2b]"
                >
                    Share
                </Button>
                <Button
                    className="bg-[#158039] hover:bg-[#158039]/90 text-white h-9 px-2 text-xs font-medium"
                    size="sm"
                >
                    Download
                    <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
            </div>
        </div>
    );
}

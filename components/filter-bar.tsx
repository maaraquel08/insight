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
} from "lucide-react";
import {
    Filters,
    createFilter,
    type Filter as FilterType,
    type FilterFieldConfig,
} from "@/components/ui/filters";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
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
    value: string;
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
    const [sheetOpen, setSheetOpen] = useState(false);
    const [filterRules, setFilterRules] = useState<FilterRule[]>([
        {
            id: "1",
            when: "WHEN",
            attribute: "",
            operator: "",
            value: "",
            value2: undefined,
        },
    ]);

    const addFilterRule = () => {
        setFilterRules([
            ...filterRules,
            {
                id: Date.now().toString(),
                when: "AND", // Default to AND for new filters
                attribute: "",
                operator: "",
                value: "",
                value2: undefined,
            },
        ]);
    };

    const removeFilterRule = (id: string) => {
        if (filterRules.length > 1) {
            const newRules = filterRules.filter((rule) => rule.id !== id);
            // If we removed the first rule, make the new first rule "WHEN"
            if (filterRules[0].id === id && newRules.length > 0) {
                newRules[0].when = "WHEN";
            }
            setFilterRules(newRules);
        }
    };

    const updateFilterRule = (
        id: string,
        field: keyof FilterRule,
        value: string
    ) => {
        setFilterRules((prevRules) =>
            prevRules.map((rule) =>
                rule.id === id ? { ...rule, [field]: value } : rule
            )
        );
    };

    const updateFilterRuleMultiple = (
        id: string,
        updates: Partial<FilterRule>
    ) => {
        setFilterRules((prevRules) =>
            prevRules.map((rule) =>
                rule.id === id ? { ...rule, ...updates } : rule
            )
        );
    };

    const handleApply = () => {
        // Convert filterRules to Filter format with logical operators
        const newFilters: (FilterType & { logicalOperator?: "AND" | "OR" })[] =
            filterRules
                .filter((rule) => {
                    // For "between" operator, both value and value2 are required
                    if (rule.operator === "between") {
                        return (
                            rule.attribute &&
                            rule.operator &&
                            rule.value &&
                            rule.value2
                        );
                    }
                    // For other operators, only value is required
                    return rule.attribute && rule.operator && rule.value;
                })
                .map((rule) => {
                    // Check if this is a numeric field
                    const isNumeric = isNumericAttribute(rule.attribute);
                    const isDate = isDateAttribute(rule.attribute);

                    // Convert values to appropriate types
                    let processedValues: (string | number)[] = [];

                    if (rule.operator === "between" && rule.value2) {
                        if (isNumeric && !isDate) {
                            // Convert to numbers for numeric fields
                            const num1 = parseFloat(rule.value);
                            const num2 = parseFloat(rule.value2);
                            processedValues = [
                                !isNaN(num1) ? num1 : rule.value,
                                !isNaN(num2) ? num2 : rule.value2,
                            ];
                        } else {
                            // Keep as strings for date/text fields
                            processedValues = [rule.value, rule.value2];
                        }
                    } else {
                        if (isNumeric && !isDate) {
                            // Convert to number for numeric fields
                            const num = parseFloat(rule.value);
                            processedValues = [!isNaN(num) ? num : rule.value];
                        } else {
                            // Keep as string for date/text fields
                            processedValues = [rule.value];
                        }
                    }

                    const filter: FilterType & {
                        logicalOperator?: "AND" | "OR";
                    } = {
                        id: rule.id,
                        field: rule.attribute,
                        operator: rule.operator,
                        values: processedValues,
                    };
                    // Add logical operator if it's not the first filter (WHEN)
                    if (rule.when !== "WHEN") {
                        filter.logicalOperator = rule.when as "AND" | "OR";
                    }
                    return filter;
                });

        setFilters(newFilters as FilterType[]);
        setSheetOpen(false);
    };

    const handleCancel = () => {
        setSheetOpen(false);
    };

    const handleClearFilters = () => {
        setFilters([]);
    };

    return (
        <div className="bg-white flex items-center justify-between py-3 px-3 border-b border-[#d9dede] shrink-0 overflow-hidden">
            <div className="flex items-center gap-4 flex-1 min-w-0 overflow-hidden">
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2.5 gap-1.25 text-xs border border-border hover:bg-secondary"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add Filter
                            {filters.length > 0 && (
                                <span className="ml-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                                    {filters.length}
                                </span>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="right"
                        className="w-[360px] p-0 flex flex-col"
                    >
                        {/* Header */}
                        <SheetHeader className="flex-row items-center justify-between border-b border-weak px-4 py-4">
                            <SheetTitle className="text-base font-medium text-[#262b2b]">
                                Filter
                            </SheetTitle>
                        </SheetHeader>

                        {/* Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto">
                            {filterRules.map((rule, index) => (
                                <div
                                    key={rule.id}
                                    className={cn(
                                        "border-b border-weak p-4",
                                        index === filterRules.length - 1 &&
                                            "border-b-0"
                                    )}
                                >
                                    <div className="flex flex-col gap-3">
                                        <div className="flex flex-col gap-2">
                                            {/* WHEN/AND/OR Field */}
                                            {index === 0 ? (
                                                <Input
                                                    placeholder="WHEN"
                                                    value="WHEN"
                                                    disabled
                                                    className="h-9 text-sm border-weak rounded-md bg-gray-50"
                                                />
                                            ) : (
                                                <Select
                                                    value={rule.when}
                                                    onValueChange={(value) =>
                                                        updateFilterRule(
                                                            rule.id,
                                                            "when",
                                                            value
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="h-9 text-sm border-weak rounded-md">
                                                        <SelectValue placeholder="AND" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="AND">
                                                            AND
                                                        </SelectItem>
                                                        <SelectItem value="OR">
                                                            OR
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}

                                            {/* Attribute Dropdown */}
                                            <Select
                                                value={rule.attribute}
                                                onValueChange={(value) => {
                                                    // Update attribute and reset operator/value in a single state update
                                                    updateFilterRuleMultiple(
                                                        rule.id,
                                                        {
                                                            attribute: value,
                                                            operator: "",
                                                            value: "",
                                                        }
                                                    );
                                                }}
                                            >
                                                <SelectTrigger className="h-9 text-sm border-weak rounded-md">
                                                    <SelectValue placeholder="Attribute" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Array.from(
                                                        getColumnsByCategory()
                                                    ).map(
                                                        ([
                                                            category,
                                                            columns,
                                                        ]) => (
                                                            <SelectGroup
                                                                key={category}
                                                            >
                                                                <SelectLabel>
                                                                    {category}
                                                                </SelectLabel>
                                                                {columns.map(
                                                                    (
                                                                        column
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                column.id
                                                                            }
                                                                            value={
                                                                                column.id
                                                                            }
                                                                        >
                                                                            {
                                                                                column.label
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </SelectGroup>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>

                                            {/* Operator Dropdown */}
                                            <Select
                                                value={rule.operator}
                                                onValueChange={(value) => {
                                                    // Update operator and reset value/value2 in a single state update
                                                    updateFilterRuleMultiple(
                                                        rule.id,
                                                        {
                                                            operator: value,
                                                            value: "",
                                                            value2: undefined,
                                                        }
                                                    );
                                                }}
                                                disabled={!rule.attribute}
                                            >
                                                <SelectTrigger className="h-9 text-sm border-weak rounded-md">
                                                    <SelectValue placeholder="Operator" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {getOperatorsForAttribute(
                                                        rule.attribute
                                                    ).map((op) => (
                                                        <SelectItem
                                                            key={op.value}
                                                            value={op.value}
                                                        >
                                                            {op.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            {/* Value Field - Conditional based on attribute type */}
                                            {isDateAttribute(rule.attribute) ? (
                                                // Date: Popover with Calendar
                                                rule.operator === "between" ? (
                                                    // Between: Two date pickers
                                                    <div className="flex gap-2">
                                                        <Popover>
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    className={cn(
                                                                        "h-9 w-full text-sm border-weak rounded-md justify-between font-normal",
                                                                        !rule.value &&
                                                                            "text-muted-foreground"
                                                                    )}
                                                                    disabled={
                                                                        !rule.attribute
                                                                    }
                                                                >
                                                                    <span>
                                                                        {rule.value
                                                                            ? formatDateForInput(
                                                                                  parseDateString(
                                                                                      rule.value
                                                                                  )
                                                                              )
                                                                            : "Start Date"}
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
                                                                        rule.value
                                                                    )}
                                                                    onSelect={(
                                                                        date
                                                                    ) => {
                                                                        updateFilterRule(
                                                                            rule.id,
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
                                                        <Popover>
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    className={cn(
                                                                        "h-9 w-full text-sm border-weak rounded-md justify-between font-normal",
                                                                        !rule.value2 &&
                                                                            "text-muted-foreground"
                                                                    )}
                                                                    disabled={
                                                                        !rule.attribute
                                                                    }
                                                                >
                                                                    <span>
                                                                        {rule.value2
                                                                            ? formatDateForInput(
                                                                                  parseDateString(
                                                                                      rule.value2
                                                                                  )
                                                                              )
                                                                            : "End Date"}
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
                                                                        rule.value2 ||
                                                                            ""
                                                                    )}
                                                                    onSelect={(
                                                                        date
                                                                    ) => {
                                                                        updateFilterRule(
                                                                            rule.id,
                                                                            "value2",
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
                                                ) : (
                                                    // Single date picker
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    "h-9 w-full text-sm border-weak rounded-md justify-between font-normal",
                                                                    !rule.value &&
                                                                        "text-muted-foreground"
                                                                )}
                                                                disabled={
                                                                    !rule.attribute
                                                                }
                                                            >
                                                                <span>
                                                                    {rule.value
                                                                        ? formatDateForInput(
                                                                              parseDateString(
                                                                                  rule.value
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
                                                                    rule.value
                                                                )}
                                                                onSelect={(
                                                                    date
                                                                ) => {
                                                                    updateFilterRule(
                                                                        rule.id,
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
                                                )
                                            ) : isNumericAttribute(
                                                  rule.attribute
                                              ) ? (
                                                // Numeric: Popover with Number Input
                                                rule.operator === "between" ? (
                                                    // Between: Two number inputs
                                                    <div className="flex gap-2">
                                                        <Popover>
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    className={cn(
                                                                        "h-9 w-full text-sm border-weak rounded-md justify-between font-normal",
                                                                        !rule.value &&
                                                                            "text-muted-foreground"
                                                                    )}
                                                                    disabled={
                                                                        !rule.attribute
                                                                    }
                                                                >
                                                                    <span>
                                                                        {rule.value ||
                                                                            "Min"}
                                                                    </span>
                                                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent
                                                                className="w-auto p-3"
                                                                align="start"
                                                            >
                                                                <Input
                                                                    type="number"
                                                                    placeholder="Min"
                                                                    value={
                                                                        rule.value
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        updateFilterRule(
                                                                            rule.id,
                                                                            "value",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    }}
                                                                    autoFocus
                                                                    className="w-48"
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <Popover>
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    className={cn(
                                                                        "h-9 w-full text-sm border-weak rounded-md justify-between font-normal",
                                                                        !rule.value2 &&
                                                                            "text-muted-foreground"
                                                                    )}
                                                                    disabled={
                                                                        !rule.attribute
                                                                    }
                                                                >
                                                                    <span>
                                                                        {rule.value2 ||
                                                                            "Max"}
                                                                    </span>
                                                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent
                                                                className="w-auto p-3"
                                                                align="start"
                                                            >
                                                                <Input
                                                                    type="number"
                                                                    placeholder="Max"
                                                                    value={
                                                                        rule.value2 ||
                                                                        ""
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        updateFilterRule(
                                                                            rule.id,
                                                                            "value2",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    }}
                                                                    autoFocus
                                                                    className="w-48"
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                ) : (
                                                    // Single number input
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    "h-9 w-full text-sm border-weak rounded-md justify-between font-normal",
                                                                    !rule.value &&
                                                                        "text-muted-foreground"
                                                                )}
                                                                disabled={
                                                                    !rule.attribute
                                                                }
                                                            >
                                                                <span>
                                                                    {rule.value ||
                                                                        "Value"}
                                                                </span>
                                                                <ChevronDown className="h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent
                                                            className="w-auto p-3"
                                                            align="start"
                                                        >
                                                            <Input
                                                                type="number"
                                                                placeholder="Value"
                                                                value={
                                                                    rule.value
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    updateFilterRule(
                                                                        rule.id,
                                                                        "value",
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                                autoFocus
                                                                className="w-48"
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                )
                                            ) : (
                                                // Text: Select Dropdown with values from data
                                                <Select
                                                    value={rule.value}
                                                    onValueChange={(value) =>
                                                        updateFilterRule(
                                                            rule.id,
                                                            "value",
                                                            value
                                                        )
                                                    }
                                                    disabled={!rule.attribute}
                                                >
                                                    <SelectTrigger className="h-9 text-sm border-weak rounded-md">
                                                        <SelectValue placeholder="Value" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {getUniqueValuesForAttribute(
                                                            rule.attribute
                                                        ).map((val) => (
                                                            <SelectItem
                                                                key={val}
                                                                value={val}
                                                            >
                                                                {val}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={addFilterRule}
                                                className="flex items-center justify-center h-9 w-9 border border-[#158039] rounded-md hover:bg-[#158039]/5"
                                            >
                                                <Plus className="w-5 h-5 text-[#158039]" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    removeFilterRule(rule.id)
                                                }
                                                className="flex items-center justify-center h-9 w-9 border border-[#b61f27] rounded-md hover:bg-[#b61f27]/5"
                                            >
                                                <Minus className="w-5 h-5 text-[#b61f27]" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-weak px-4 py-3 flex items-center justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                className="h-9 px-2 border-[#b8c1c0] text-sm font-medium text-[#262b2b]"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleApply}
                                className="h-9 px-2 bg-[#158039] hover:bg-[#158039]/90 text-white text-sm font-medium"
                            >
                                Apply
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
                {filters.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2.5 gap-1.25 text-xs border border-border hover:bg-secondary"
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

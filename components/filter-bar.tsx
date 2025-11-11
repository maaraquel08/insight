"use client";

import { Button } from "@/components/ui/button";
import {
    ChevronDown,
    Filter,
    Calendar,
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
} from "lucide-react";
import {
    Filters,
    createFilter,
    type Filter as FilterType,
    type FilterFieldConfig,
} from "@/components/ui/filters";
import { useFilters } from "@/contexts/filter-context";

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

export function FilterBar() {
    const { filters, setFilters } = useFilters();

    return (
        <div className="bg-white flex items-center justify-between py-3 px-3 border-b border-[#d9dede] shrink-0 overflow-hidden">
            <div className="flex items-center gap-4 flex-1 min-w-0 overflow-hidden">
                <div className="flex-1 min-w-0 overflow-hidden">
                    <Filters
                        filters={filters}
                        fields={filterFields}
                        onChange={setFilters}
                        variant="outline"
                        size="sm"
                        radius="full"
                        className="w-full"
                        showAddButton={true}
                        addButtonText="Add filter"
                    />
                </div>
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

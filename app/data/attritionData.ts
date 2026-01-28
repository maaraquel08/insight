/**
 * Attrition Data
 * TypeScript data file for Attrition dashboard metrics and analytics
 * Supports filtering by date range and departments
 */

import type { AttritionFilters } from "@/contexts/attrition-filter-context";

export interface AttritionRecord {
    date: Date;
    department: string;
    separations: number;
    headcount: number;
    reason: string;
    type: "voluntary" | "involuntary";
    tenure: number; // months
}

const DEPARTMENTS = [
    "Sales",
    "Customer Service",
    "Operations",
    "IT",
    "HR",
    "Finance",
    "Other",
];

// Generate 3 years of historical data (36 months)
function generateHistoricalData(): AttritionRecord[] {
    const records: AttritionRecord[] = [];
    const currentDate = new Date();
    const baseHeadcounts: Record<string, number> = {
        Sales: 580,
        "Customer Service": 690,
        Operations: 460,
        IT: 230,
        HR: 115,
        Finance: 92,
        Other: 133,
    };

    const baseAttritionRates: Record<string, number> = {
        Sales: 9.8,
        "Customer Service": 8.5,
        Operations: 7.2,
        IT: 6.5,
        HR: 5.8,
        Finance: 4.2,
        Other: 7.5,
    };

    const reasons = [
        { reason: "Better Opportunity", type: "voluntary" as const, weight: 0.364 },
        { reason: "Relocation", type: "voluntary" as const, weight: 0.128 },
        { reason: "Personal Reasons", type: "voluntary" as const, weight: 0.096 },
        { reason: "Career Change", type: "voluntary" as const, weight: 0.096 },
        { reason: "Performance", type: "involuntary" as const, weight: 0.171 },
        { reason: "Misconduct", type: "involuntary" as const, weight: 0.080 },
        { reason: "AWOL", type: "involuntary" as const, weight: 0.064 },
    ];

    // Generate data for last 36 months
    for (let monthOffset = 35; monthOffset >= 0; monthOffset--) {
        const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - monthOffset,
            1
        );

        DEPARTMENTS.forEach((dept) => {
            const baseHeadcount = baseHeadcounts[dept];
            const baseRate = baseAttritionRates[dept];
            
            // Add some variation to make it realistic
            const variation = (Math.random() - 0.5) * 2; // -1 to 1
            const monthlyRate = Math.max(0.3, Math.min(1.5, (baseRate / 12) + variation * 0.1));
            const headcount = Math.round(baseHeadcount * (1 + (monthOffset - 18) * 0.01));
            const separations = Math.round((headcount * monthlyRate) / 100);

            // Distribute separations across reasons
            reasons.forEach((reasonData) => {
                const count = Math.round(separations * reasonData.weight);
                if (count > 0) {
                    records.push({
                        date: new Date(date),
                        department: dept,
                        separations: count,
                        headcount,
                        reason: reasonData.reason,
                        type: reasonData.type,
                        tenure: Math.floor(Math.random() * 60) + 1, // 1-60 months
                    });
                }
            });
        });
    }

    return records;
}

// Cache the generated data
let cachedData: AttritionRecord[] | null = null;

function getData(): AttritionRecord[] {
    if (!cachedData) {
        cachedData = generateHistoricalData();
    }
    return cachedData;
}

function filterData(
    data: AttritionRecord[],
    filters: AttritionFilters | null
): AttritionRecord[] {
    if (!filters) return data;

    let filtered = [...data];

    // Filter by date range
    if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter((record) => record.date >= fromDate);
    }

    if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter((record) => record.date <= toDate);
    }

    // Filter by departments
    if (filters.departments && filters.departments.length > 0) {
        filtered = filtered.filter((record) =>
            filters.departments!.includes(record.department)
        );
    }

    return filtered;
}

/**
 * Generate attrition trend data for the specified time period
 */
export function getAttritionTrendData(filters?: AttritionFilters | null) {
    const allData = getData();
    const filteredData = filterData(allData, filters || null);

    // Group by month
    const monthlyData = new Map<string, { separations: number; headcount: number }>();

    filteredData.forEach((record) => {
        const monthKey = `${record.date.getFullYear()}-${String(record.date.getMonth() + 1).padStart(2, "0")}`;
        const existing = monthlyData.get(monthKey) || { separations: 0, headcount: 0 };
        monthlyData.set(monthKey, {
            separations: existing.separations + record.separations,
            headcount: Math.max(existing.headcount, record.headcount), // Use max headcount for the month
        });
    });

    // Sort by date
    const sortedMonths = Array.from(monthlyData.entries()).sort(([a], [b]) =>
        a.localeCompare(b)
    );

    const months: string[] = [];
    const attritionRates: number[] = [];

    sortedMonths.forEach(([monthKey, data]) => {
        const [year, month] = monthKey.split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        months.push(date.toLocaleDateString("en-US", { month: "short" }));
        
        const rate = data.headcount > 0 ? (data.separations / data.headcount) * 100 : 0;
        attritionRates.push(parseFloat(rate.toFixed(1)));
    });

    // Calculate current attrition rate and percentage change
    const currentRate = attritionRates[attritionRates.length - 1] || 0;
    const previousRate = attritionRates[attritionRates.length - 2] || currentRate;
    const change = currentRate - previousRate;
    const changeType = change <= 0 ? "positive" : "negative";
    const changeSymbol = change <= 0 ? "↓" : "↑";

    return {
        labels: months,
        series: attritionRates,
        currentRate: currentRate.toFixed(1),
        change: Math.abs(change).toFixed(1),
        changeType,
        changeSymbol,
        description:
            changeType === "positive"
                ? "Attrition decreased, mainly among employees with less than 1 year tenure."
                : "Attrition increased, particularly in sales and customer service departments.",
    };
}

/**
 * Generate tenure and demographics data with attrition rates
 */
export function getTenureDemographicsData(filters?: AttritionFilters | null) {
    const allData = getData();
    const filteredData = filterData(allData, filters || null);

    // Aggregate data
    const totalHeadcount = filteredData.reduce(
        (sum, record) => sum + record.headcount,
        0
    ) / (filteredData.length > 0 ? filteredData.length / DEPARTMENTS.length : 1);

    // Tenure distribution
    const tenureCategories = ["<1 year", "1-3 years", "3-5 years", ">5 years"];
    const tenureDistribution = [
        Math.round(totalHeadcount * 0.35),
        Math.round(totalHeadcount * 0.28),
        Math.round(totalHeadcount * 0.22),
        Math.round(totalHeadcount * 0.15),
    ];

    // Calculate average tenure
    const averageTenure = 2.1;
    const previousAverageTenure = 2.0;
    const tenureChange =
        ((averageTenure - previousAverageTenure) / previousAverageTenure) * 100;
    const tenureChangeType = tenureChange >= 0 ? "positive" : "negative";

    // Age distribution
    const ageCategories = ["18-25", "26-35", "36-45", "46-55", "55+"];
    const ageDistribution = [
        Math.round(totalHeadcount * 0.23),
        Math.round(totalHeadcount * 0.43),
        Math.round(totalHeadcount * 0.25),
        Math.round(totalHeadcount * 0.08),
        Math.round(totalHeadcount * 0.02),
    ];

    // Gender distribution
    const genderCategories = ["Male", "Female", "Other"];
    const genderDistribution = [
        Math.round(totalHeadcount * 0.40),
        Math.round(totalHeadcount * 0.59),
        Math.round(totalHeadcount * 0.01),
    ];

    // Location/Site distribution
    const locationCategories = ["Manila", "Cebu", "Davao", "Remote"];
    const locationDistribution = [
        Math.round(totalHeadcount * 0.40),
        Math.round(totalHeadcount * 0.30),
        Math.round(totalHeadcount * 0.20),
        Math.round(totalHeadcount * 0.10),
    ];

    // Civil Status distribution
    const civilStatusCategories = ["Single", "Married", "Divorced", "Widowed"];
    const civilStatusDistribution = [
        Math.round(totalHeadcount * 0.50),
        Math.round(totalHeadcount * 0.46),
        Math.round(totalHeadcount * 0.03),
        Math.round(totalHeadcount * 0.01),
    ];

    // Calculate attrition rates from filtered data
    const totalSeparations = filteredData.reduce(
        (sum, record) => sum + record.separations,
        0
    );
    const avgHeadcount = totalHeadcount;
    const overallAttritionRate = avgHeadcount > 0 ? (totalSeparations / avgHeadcount) * 100 : 0;

    // Attrition rates by category (simplified - in real app would calculate from actual data)
    const tenureAttritionRates = [8.5, 6.2, 4.8, 3.1];
    const ageAttritionRates = [9.2, 7.5, 5.8, 4.2, 3.5];
    const genderAttritionRates = [7.2, 6.8, 8.5];
    const civilStatusAttritionRates = [8.5, 6.2, 12.5, 5.0];
    const locationAttritionRates = [7.8, 6.5, 8.2, 5.5];

    return {
        averageTenure,
        tenureChange: Math.abs(tenureChange).toFixed(1),
        tenureChangeType,
        tenureChangeSymbol: tenureChange >= 0 ? "↑" : "↓",
        tenureDescription:
            "Average tenure increased, showing improved employee retention.",
        tenureDistribution: {
            categories: tenureCategories,
            values: tenureDistribution,
        },
        demographics: {
            age: {
                categories: ageCategories,
                values: ageDistribution,
            },
            gender: {
                categories: genderCategories,
                values: genderDistribution,
            },
            civilStatus: {
                categories: civilStatusCategories,
                values: civilStatusDistribution,
            },
            location: {
                categories: locationCategories,
                values: locationDistribution,
            },
        },
        attritionRates: {
            tenure: {
                categories: tenureCategories,
                values: tenureAttritionRates,
            },
            age: {
                categories: ageCategories,
                values: ageAttritionRates,
            },
            gender: {
                categories: genderCategories,
                values: genderAttritionRates,
            },
            civilStatus: {
                categories: civilStatusCategories,
                values: civilStatusAttritionRates,
            },
            location: {
                categories: locationCategories,
                values: locationAttritionRates,
            },
        },
        description:
            "60% of employees have tenure below 1 year — indicating a young or growing workforce.",
    };
}

/**
 * Generate department attrition data
 */
export function getDepartmentAttritionData(filters?: AttritionFilters | null) {
    const allData = getData();
    const filteredData = filterData(allData, filters || null);

    // Group by department
    const deptData = new Map<
        string,
        { separations: number; headcount: number }
    >();

    filteredData.forEach((record) => {
        const existing = deptData.get(record.department) || {
            separations: 0,
            headcount: 0,
        };
        deptData.set(record.department, {
            separations: existing.separations + record.separations,
            headcount: Math.max(existing.headcount, record.headcount),
        });
    });

    const categories: string[] = [];
    const values: number[] = [];

    DEPARTMENTS.forEach((dept) => {
        const data = deptData.get(dept);
        if (data) {
            categories.push(dept);
            const rate =
                data.headcount > 0
                    ? (data.separations / data.headcount) * 100
                    : 0;
            values.push(parseFloat(rate.toFixed(1)));
        }
    });

    return {
        categories,
        values,
    };
}

/**
 * Generate department attrition data with job role breakdown
 */
export function getDepartmentAttritionWithJobRoles(
    filters?: AttritionFilters | null
) {
    const allData = getData();
    const filteredData = filterData(allData, filters || null);

    const departmentData = [
        {
            department: "Sales",
            size: 580,
            rate: 9.8,
            roles: [
                { key: "role1", label: "Sales Manager", pct: 0.15 },
                { key: "role2", label: "Account Executive", pct: 0.55 },
                { key: "role3", label: "Sales Representative", pct: 0.30 },
            ],
        },
        {
            department: "Customer Service",
            size: 690,
            rate: 8.5,
            roles: [
                { key: "role1", label: "Team Lead", pct: 0.12 },
                { key: "role2", label: "CS Representative", pct: 0.75 },
                { key: "role3", label: "Quality Analyst", pct: 0.13 },
            ],
        },
        {
            department: "Operations",
            size: 460,
            rate: 7.2,
            roles: [
                { key: "role1", label: "Operations Manager", pct: 0.18 },
                { key: "role2", label: "Coordinator", pct: 0.52 },
                { key: "role3", label: "Process Analyst", pct: 0.30 },
            ],
        },
        {
            department: "IT",
            size: 230,
            rate: 6.5,
            roles: [
                { key: "role1", label: "IT Manager", pct: 0.15 },
                { key: "role2", label: "Developer", pct: 0.50 },
                { key: "role3", label: "Data Analyst", pct: 0.35 },
            ],
        },
        {
            department: "HR",
            size: 115,
            rate: 5.8,
            roles: [
                { key: "role1", label: "HR Manager", pct: 0.22 },
                { key: "role2", label: "Recruiter", pct: 0.55 },
                { key: "role3", label: "HR Specialist", pct: 0.23 },
            ],
        },
        {
            department: "Finance",
            size: 92,
            rate: 4.2,
            roles: [
                { key: "role1", label: "Finance Manager", pct: 0.20 },
                { key: "role2", label: "Accountant", pct: 0.35 },
                { key: "role3", label: "Financial Analyst", pct: 0.45 },
            ],
        },
        {
            department: "Other",
            size: 133,
            rate: 7.5,
            roles: [
                { key: "role1", label: "Supervisor", pct: 0.18 },
                { key: "role2", label: "Specialist", pct: 0.55 },
                { key: "role3", label: "Assistant", pct: 0.27 },
            ],
        },
    ];

    // Calculate actual separations from filtered data
    const deptSeparations = new Map<string, number>();
    filteredData.forEach((record) => {
        const existing = deptSeparations.get(record.department) || 0;
        deptSeparations.set(record.department, existing + record.separations);
    });

    return departmentData
        .filter((dept) => {
            // Filter by selected departments if filter is applied
            if (filters?.departments && filters.departments.length > 0) {
                return filters.departments.includes(dept.department);
            }
            return true;
        })
        .map((dept) => {
            const totalSeparations =
                deptSeparations.get(dept.department) ||
                Math.round((dept.size * dept.rate) / 100);
            let remaining = totalSeparations;
            const roleValues: Record<string, number> = {};

            // Calculate separations per role
            dept.roles.forEach((role, idx) => {
                if (idx === dept.roles.length - 1) {
                    roleValues[role.key] = remaining;
                } else {
                    const count = Math.round(totalSeparations * role.pct);
                    roleValues[role.key] = count;
                    remaining -= count;
                }
            });

            return {
                department: dept.department,
                ...roleValues,
                separations: totalSeparations,
                rate: dept.rate,
                roleLabels: dept.roles.reduce(
                    (acc, role) => {
                        acc[role.key] = role.label;
                        return acc;
                    },
                    {} as Record<string, string>
                ),
            };
        });
}

/**
 * Generate department voluntary vs involuntary attrition data
 */
export function getDepartmentVoluntaryInvoluntary(
    filters?: AttritionFilters | null
) {
    const allData = getData();
    const filteredData = filterData(allData, filters || null);

    const departments = [
        "Sales",
        "Customer Service",
        "Operations",
        "IT",
        "HR",
        "Finance",
        "Other",
    ];
    const departmentSizes: Record<string, number> = {
        Sales: 580,
        "Customer Service": 690,
        Operations: 460,
        IT: 230,
        HR: 115,
        Finance: 92,
        Other: 133,
    };

    const voluntaryPercentages: Record<string, number> = {
        Sales: 0.72,
        "Customer Service": 0.70,
        Operations: 0.68,
        IT: 0.65,
        HR: 0.62,
        Finance: 0.60,
        Other: 0.66,
    };

    // Calculate actual data from filtered records
    const deptStats = new Map<
        string,
        { voluntary: number; involuntary: number; headcount: number }
    >();

    filteredData.forEach((record) => {
        const existing = deptStats.get(record.department) || {
            voluntary: 0,
            involuntary: 0,
            headcount: 0,
        };
        if (record.type === "voluntary") {
            existing.voluntary += record.separations;
        } else {
            existing.involuntary += record.separations;
        }
        existing.headcount = Math.max(existing.headcount, record.headcount);
        deptStats.set(record.department, existing);
    });

    return departments
        .filter((dept) => {
            if (filters?.departments && filters.departments.length > 0) {
                return filters.departments.includes(dept);
            }
            return true;
        })
        .map((department) => {
            const stats = deptStats.get(department) || {
                voluntary: 0,
                involuntary: 0,
                headcount: departmentSizes[department],
            };
            const totalEmployees = stats.headcount || departmentSizes[department];
            const totalSeparations = stats.voluntary + stats.involuntary;

            // Use actual data if available, otherwise use default percentages
            let voluntaryCount: number;
            let involuntaryCount: number;

            if (totalSeparations > 0) {
                voluntaryCount = stats.voluntary;
                involuntaryCount = stats.involuntary;
            } else {
                const voluntaryPct = voluntaryPercentages[department];
                voluntaryCount = Math.round(
                    totalSeparations * voluntaryPct
                );
                involuntaryCount = totalSeparations - voluntaryCount;
            }

            const voluntaryRate =
                totalEmployees > 0
                    ? (voluntaryCount / totalEmployees) * 100
                    : 0;
            const involuntaryRate =
                totalEmployees > 0
                    ? (involuntaryCount / totalEmployees) * 100
                    : 0;
            const rate =
                totalEmployees > 0
                    ? (totalSeparations / totalEmployees) * 100
                    : 0;

            return {
                department,
                voluntary: parseFloat(voluntaryRate.toFixed(1)),
                involuntary: parseFloat(involuntaryRate.toFixed(1)),
                voluntaryCount,
                involuntaryCount,
                totalSeparations,
                rate: parseFloat(rate.toFixed(1)),
            };
        });
}

/**
 * Generate supervisor performance ranking data
 */
export function getSupervisorPerformanceRankingData(
    filters?: AttritionFilters | null
) {
    // This data doesn't change with filters in this implementation
    return [
        {
            rank: 1,
            supervisor: "John Smith",
            department: "Procurement",
            attritionRate: 28.3,
            separations: 12,
            totalEmployees: 42,
            riskLevel: "high" as const,
        },
        {
            rank: 2,
            supervisor: "Sarah Johnson",
            department: "Sales",
            attritionRate: 18.3,
            separations: 9,
            totalEmployees: 38,
            riskLevel: "high" as const,
        },
        {
            rank: 3,
            supervisor: "Michael Chen",
            department: "Administration",
            attritionRate: 13.21,
            separations: 11,
            totalEmployees: 55,
            riskLevel: "high" as const,
        },
        {
            rank: 4,
            supervisor: "Emily Davis",
            department: "Production",
            attritionRate: 12.19,
            separations: 12,
            totalEmployees: 68,
            riskLevel: "high" as const,
        },
        {
            rank: 5,
            supervisor: "David Wilson",
            department: "HR",
            attritionRate: 10.75,
            separations: 5,
            totalEmployees: 29,
            riskLevel: "moderate" as const,
        },
        {
            rank: 6,
            supervisor: "Lisa Anderson",
            department: "Quality",
            attritionRate: 8.12,
            separations: 7,
            totalEmployees: 45,
            riskLevel: "moderate" as const,
        },
        {
            rank: 7,
            supervisor: "Robert Taylor",
            department: "Maintenance",
            attritionRate: 6.17,
            separations: 3,
            totalEmployees: 24,
            riskLevel: "moderate" as const,
        },
        {
            rank: 8,
            supervisor: "Jennifer Martinez",
            department: "Security",
            attritionRate: 6.01,
            separations: 5,
            totalEmployees: 52,
            riskLevel: "low" as const,
        },
        {
            rank: 9,
            supervisor: "William Brown",
            department: "Marketing",
            attritionRate: 4.89,
            separations: 8,
            totalEmployees: 89,
            riskLevel: "low" as const,
        },
        {
            rank: 10,
            supervisor: "Amanda Garcia",
            department: "Project",
            attritionRate: 3.21,
            separations: 1,
            totalEmployees: 18,
            riskLevel: "low" as const,
        },
    ];
}

/**
 * Generate departure reason data
 */
export function getDepartureReasonData(filters?: AttritionFilters | null) {
    const allData = getData();
    const filteredData = filterData(allData, filters || null);

    // Aggregate by reason
    const reasonStats = new Map<
        string,
        { count: number; type: "voluntary" | "involuntary"; category: string }
    >();

    filteredData.forEach((record) => {
        const existing = reasonStats.get(record.reason) || {
            count: 0,
            type: record.type,
            category: record.type === "voluntary" ? "Voluntary" : "Involuntary",
        };
        existing.count += record.separations;
        reasonStats.set(record.reason, existing);
    });

    const totalSeparations = filteredData.reduce(
        (sum, record) => sum + record.separations,
        0
    );

    // Map reasons to their types
    const reasonTypeMap: Record<string, string> = {
        "Better Opportunity": "Resigned",
        Relocation: "Resigned",
        "Personal Reasons": "Resigned",
        "Career Change": "Resigned",
        Performance: "Terminated",
        Misconduct: "Terminated",
        AWOL: "AWOL",
    };

    const specificReasons = Array.from(reasonStats.entries())
        .map(([reason, stats]) => ({
            reason,
            type: reasonTypeMap[reason] || "Resigned",
            category: stats.category,
            count: stats.count,
            percentage:
                totalSeparations > 0
                    ? (stats.count / totalSeparations) * 100
                    : 0,
        }))
        .sort((a, b) => b.count - a.count);

    // Calculate voluntary vs involuntary breakdown
    const voluntaryCount = filteredData
        .filter((r) => r.type === "voluntary")
        .reduce((sum, r) => sum + r.separations, 0);
    const involuntaryCount = filteredData
        .filter((r) => r.type === "involuntary")
        .reduce((sum, r) => sum + r.separations, 0);

    const voluntaryPercentage =
        totalSeparations > 0 ? (voluntaryCount / totalSeparations) * 100 : 0;
    const involuntaryPercentage =
        totalSeparations > 0 ? (involuntaryCount / totalSeparations) * 100 : 0;

    return {
        voluntaryInvoluntary: {
            labels: ["Voluntary", "Involuntary"],
            values: [
                parseFloat(voluntaryPercentage.toFixed(1)),
                parseFloat(involuntaryPercentage.toFixed(1)),
            ],
        },
        specificReasons,
        totalSeparations,
    };
}

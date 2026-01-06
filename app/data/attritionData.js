/**
 * Attrition Data
 * Modular data file for Attrition dashboard metrics and analytics
 */

/**
 * Generate attrition trend data for the last 12 months
 * @returns {Object} Attrition trend data with labels, series, and metadata
 */
export function getAttritionTrendData() {
    const months = [];
    const attritionRates = [];
    const currentDate = new Date();

    // Generate data for the last 12 months
    for (let i = 11; i >= 0; i--) {
        const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - i,
            1
        );
        const monthName = date.toLocaleDateString("en-US", { month: "short" });
        months.push(monthName);

        // Generate realistic attrition rate (between 4% and 8%)
        const baseRate = 6.5;
        const variation = (Math.random() - 0.5) * 2; // -1 to 1
        const rate = Math.max(4, Math.min(8, baseRate + variation));
        attritionRates.push(parseFloat(rate.toFixed(1)));
    }

    // Calculate current attrition rate and percentage change
    const currentRate = attritionRates[attritionRates.length - 1];
    const previousRate = attritionRates[attritionRates.length - 2];
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
 * @returns {Object} Tenure distribution and demographic breakdowns with attrition rates
 */
export function getTenureDemographicsData() {
    // Tenure distribution
    const tenureCategories = ["<1 year", "1-3 years", "3-5 years", ">5 years"];
    const tenureDistribution = [
        Math.round(2300 * 0.35), // 35% < 1 year
        Math.round(2300 * 0.28), // 28% 1-3 years
        Math.round(2300 * 0.22), // 22% 3-5 years
        Math.round(2300 * 0.15), // 15% > 5 years
    ];

    // Calculate average tenure
    const averageTenure = 2.1;
    const previousAverageTenure = 2.0;
    const tenureChange =
        ((averageTenure - previousAverageTenure) / previousAverageTenure) * 100;
    const tenureChangeType = tenureChange >= 0 ? "positive" : "negative";

    // Age distribution
    const ageCategories = ["18-25", "26-35", "36-45", "46-55", "55+"];
    const ageDistribution = [520, 980, 580, 180, 40];

    // Gender distribution
    const genderCategories = ["Male", "Female", "Other"];
    const genderDistribution = [920, 1350, 30];

    // Department distribution
    const departmentCategories = [
        "Sales",
        "Customer Service",
        "Operations",
        "IT",
        "HR",
        "Finance",
        "Other",
    ];
    const departmentDistribution = [580, 690, 460, 230, 115, 92, 133];

    // Location/Site distribution
    const locationCategories = ["Manila", "Cebu", "Davao", "Remote"];
    const locationDistribution = [920, 690, 460, 230];

    // Civil Status distribution
    const civilStatusCategories = ["Single", "Married", "Divorced", "Widowed"];
    const civilStatusDistribution = [1150, 1050, 80, 20];

    // Attrition rates by category (percentage)
    const tenureAttritionRates = [8.5, 6.2, 4.8, 3.1]; // Higher attrition for lower tenure
    const ageAttritionRates = [9.2, 7.5, 5.8, 4.2, 3.5]; // Higher attrition for younger employees
    const genderAttritionRates = [7.2, 6.8, 8.5]; // Male, Female, Other
    const civilStatusAttritionRates = [8.5, 6.2, 12.5, 5.0]; // Single, Married, Divorced, Widowed
    const locationAttritionRates = [7.8, 6.5, 8.2, 5.5]; // Manila, Cebu, Davao, Remote

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
 * @returns {Object} Department categories and attrition rates
 */
export function getDepartmentAttritionData() {
    const departmentCategories = [
        "Sales",
        "Customer Service",
        "Operations",
        "IT",
        "HR",
        "Finance",
        "Other",
    ];
    const departmentAttritionRates = [9.8, 8.5, 7.2, 6.5, 5.8, 4.2, 7.5];

    return {
        categories: departmentCategories,
        values: departmentAttritionRates,
    };
}

/**
 * Generate supervisor performance ranking data
 * @returns {Array} Array of supervisor performance data (top 10)
 */
export function getSupervisorPerformanceRankingData() {
    return [
        {
            rank: 1,
            supervisor: "John Smith",
            department: "Procurement",
            attritionRate: 28.3,
            separations: 12,
            totalEmployees: 42,
            riskLevel: "high",
        },
        {
            rank: 2,
            supervisor: "Sarah Johnson",
            department: "Sales",
            attritionRate: 18.3,
            separations: 9,
            totalEmployees: 38,
            riskLevel: "high",
        },
        {
            rank: 3,
            supervisor: "Michael Chen",
            department: "Administration",
            attritionRate: 13.21,
            separations: 11,
            totalEmployees: 55,
            riskLevel: "high",
        },
        {
            rank: 4,
            supervisor: "Emily Davis",
            department: "Production",
            attritionRate: 12.19,
            separations: 12,
            totalEmployees: 68,
            riskLevel: "high",
        },
        {
            rank: 5,
            supervisor: "David Wilson",
            department: "HR",
            attritionRate: 10.75,
            separations: 5,
            totalEmployees: 29,
            riskLevel: "moderate",
        },
        {
            rank: 6,
            supervisor: "Lisa Anderson",
            department: "Quality",
            attritionRate: 8.12,
            separations: 7,
            totalEmployees: 45,
            riskLevel: "moderate",
        },
        {
            rank: 7,
            supervisor: "Robert Taylor",
            department: "Maintenance",
            attritionRate: 6.17,
            separations: 3,
            totalEmployees: 24,
            riskLevel: "moderate",
        },
        {
            rank: 8,
            supervisor: "Jennifer Martinez",
            department: "Security",
            attritionRate: 6.01,
            separations: 5,
            totalEmployees: 52,
            riskLevel: "low",
        },
        {
            rank: 9,
            supervisor: "William Brown",
            department: "Marketing",
            attritionRate: 4.89,
            separations: 8,
            totalEmployees: 89,
            riskLevel: "low",
        },
        {
            rank: 10,
            supervisor: "Amanda Garcia",
            department: "Project",
            attritionRate: 3.21,
            separations: 1,
            totalEmployees: 18,
            riskLevel: "low",
        },
    ];
}

/**
 * Generate departure reason data
 * @returns {Object} Departure reason data with voluntary/involuntary breakdown and specific reasons
 */
export function getDepartureReasonData() {
    // Voluntary vs Involuntary breakdown (percentages)
    const voluntaryInvoluntaryData = {
        labels: ["Voluntary", "Involuntary"],
        values: [68.4, 31.6], // 68.4% voluntary, 31.6% involuntary
    };

    // Specific departure reasons with counts and percentages
    const specificReasons = [
        {
            reason: "Better Opportunity",
            type: "Resigned",
            category: "Voluntary",
            count: 68,
            percentage: 36.4,
        },
        {
            reason: "Relocation",
            type: "Resigned",
            category: "Voluntary",
            count: 24,
            percentage: 12.8,
        },
        {
            reason: "Personal Reasons",
            type: "Resigned",
            category: "Voluntary",
            count: 18,
            percentage: 9.6,
        },
        {
            reason: "Career Change",
            type: "Resigned",
            category: "Voluntary",
            count: 18,
            percentage: 9.6,
        },
        {
            reason: "Performance",
            type: "Terminated",
            category: "Involuntary",
            count: 32,
            percentage: 17.1,
        },
        {
            reason: "Misconduct",
            type: "Terminated",
            category: "Involuntary",
            count: 15,
            percentage: 8.0,
        },
        {
            reason: "AWOL",
            type: "AWOL",
            category: "Involuntary",
            count: 12,
            percentage: 6.4,
        },
    ];

    // Total separations
    const totalSeparations = specificReasons.reduce(
        (sum, item) => sum + item.count,
        0
    );

    return {
        voluntaryInvoluntary: voluntaryInvoluntaryData,
        specificReasons,
        totalSeparations,
    };
}

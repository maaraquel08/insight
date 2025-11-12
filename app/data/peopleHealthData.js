/**
 * People Health Data
 * Modular data file for People Health section metrics
 */

/**
 * Generate headcount trend data for the last 6 months
 * @returns {Object} Headcount trend data with labels, series, and metadata
 */
export function getHeadcountTrendData() {
    // Get the last 6 months
    const months = [];
    const headcounts = [];
    const currentDate = new Date();

    // Generate data for the last 6 months
    for (let i = 5; i >= 0; i--) {
        const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - i,
            1
        );
        const monthName = date.toLocaleDateString("en-US", { month: "short" });
        months.push(monthName);

        // Generate realistic headcount data (starting around 2,300 and growing)
        const baseHeadcount = 2300;
        const growth = Math.random() * 100 + 50; // Random growth between 50-150
        const headcount = Math.round(baseHeadcount + ((5 - i) * growth) / 6);
        headcounts.push(headcount);
    }

    // Calculate current headcount and percentage change
    const currentHeadcount = headcounts[headcounts.length - 1];
    const previousHeadcount = headcounts[headcounts.length - 2];
    const percentageChange =
        ((currentHeadcount - previousHeadcount) / previousHeadcount) * 100;
    const changeType = percentageChange >= 0 ? "positive" : "negative";
    const changeSymbol = percentageChange >= 0 ? "↑" : "↓";

    return {
        labels: months,
        series: headcounts,
        currentHeadcount,
        percentageChange: Math.abs(percentageChange).toFixed(1),
        changeType,
        changeSymbol,
        description:
            percentageChange >= 0
                ? "Growth driven by new client onboarding in Cebu site."
                : "Reduction due to seasonal adjustments and team restructuring.",
    };
}

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
 * Generate tenure and demographics data
 * @returns {Object} Tenure distribution and demographic breakdowns
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
            department: {
                categories: departmentCategories,
                values: departmentDistribution,
            },
            location: {
                categories: locationCategories,
                values: locationDistribution,
            },
        },
        description:
            "60% of employees have tenure below 1 year — indicating a young or growing workforce.",
    };
}

/**
 * Generate leave and absenteeism data
 * @returns {Object} Leave utilization and absenteeism trend data
 */
export function getLeaveAbsenteeismData() {
    const months = [];
    const absenteeismRates = [];
    const currentDate = new Date();

    // Generate data for the last 6 months
    for (let i = 5; i >= 0; i--) {
        const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - i,
            1
        );
        const monthName = date.toLocaleDateString("en-US", { month: "short" });
        months.push(monthName);

        // Generate realistic absenteeism rate (between 3% and 5%)
        const baseRate = 4.0;
        const variation = (Math.random() - 0.5) * 1.5; // -0.75 to 0.75
        const rate = Math.max(3, Math.min(5, baseRate + variation));
        absenteeismRates.push(parseFloat(rate.toFixed(1)));
    }

    // Current values
    const leaveUtilization = 78;
    const previousLeaveUtilization = 75;
    const leaveUtilizationChange =
        ((leaveUtilization - previousLeaveUtilization) /
            previousLeaveUtilization) *
        100;
    const leaveUtilizationChangeType =
        leaveUtilizationChange >= 0 ? "positive" : "negative";
    const leaveUtilizationChangeSymbol =
        leaveUtilizationChange >= 0 ? "↑" : "↓";
    const leaveUtilizationDescription =
        leaveUtilizationChange >= 0
            ? "Leave utilization increased, indicating higher time-off usage this period."
            : "Leave utilization decreased, showing lower time-off usage this period.";

    const currentAbsenteeismRate =
        absenteeismRates[absenteeismRates.length - 1];
    const previousAbsenteeismRate =
        absenteeismRates[absenteeismRates.length - 2];
    const change = currentAbsenteeismRate - previousAbsenteeismRate;
    const changeType = change <= 0 ? "positive" : "negative";
    const changeSymbol = change <= 0 ? "↓" : "↑";

    // Leave types breakdown (stacked bar data)
    const leaveTypes = ["Sick Leave", "Vacation", "Personal", "Emergency"];
    const leaveTypesData = [
        [45, 52, 38, 48, 55, 42], // Sick Leave
        [120, 135, 128, 142, 138, 145], // Vacation
        [28, 32, 25, 30, 35, 28], // Personal
        [12, 15, 10, 14, 18, 12], // Emergency
    ];

    return {
        leaveUtilization,
        leaveUtilizationChange: `${leaveUtilizationChangeSymbol} ${Math.abs(
            leaveUtilizationChange
        ).toFixed(1)}% vs last month`,
        leaveUtilizationChangeType,
        leaveUtilizationDescription,
        currentAbsenteeismRate: currentAbsenteeismRate.toFixed(1),
        change: Math.abs(change).toFixed(1),
        changeType,
        changeSymbol,
        months,
        absenteeismRates,
        leaveTypes,
        leaveTypesData,
        description:
            changeType === "positive"
                ? "Absenteeism decreased this month, showing improved attendance patterns."
                : "Absenteeism increased this month, particularly in night shift teams.",
    };
}

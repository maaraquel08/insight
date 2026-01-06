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

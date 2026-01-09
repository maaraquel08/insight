/**
 * Headcount Analytics Data
 * Comprehensive data structures for Headcount Analytics Dashboard
 */

/**
 * Get KPI metrics for Executive Summary section
 * @returns {Object} Headcount KPI metrics
 */
export function getHeadcountKPIs() {
    const currentHeadcount = 2432;
    const previousHeadcount = 2350;
    const change = currentHeadcount - previousHeadcount;
    const wowChange = 82; // Week over week change

    const hires = 120;
    const attritions = 38;
    const netChange = hires - attritions;

    const currentGrowthRate = 4.2;
    const targetGrowthRate = 5.0;
    
    // Generate sparkline data for last 4 weeks
    const sparkline = [];
    const baseValue = currentGrowthRate;
    for (let i = 0; i < 4; i++) {
        sparkline.push(parseFloat((baseValue + (Math.random() - 0.5) * 0.5).toFixed(1)));
    }

    const attritionRate = 1.5; // Monthly
    const highRiskDepartments = [
        { dept: "Sales", rate: 12.0 },
        { dept: "Marketing", rate: 8.5 },
    ];

    const weeklyHires = 30;
    const monthlyHires = 120;
    const yoyHiringVelocity = 20; // Percentage increase

    return {
        totalHeadcount: {
            current: currentHeadcount,
            previous: previousHeadcount,
            change: change,
            wowChange: wowChange,
        },
        netChange: {
            hires: hires,
            attritions: attritions,
            net: netChange,
        },
        growthRate: {
            current: currentGrowthRate,
            target: targetGrowthRate,
            sparkline: sparkline,
        },
        attritionRate: {
            current: attritionRate,
            highRisk: highRiskDepartments,
        },
        hiringVelocity: {
            weekly: weeklyHires,
            monthly: monthlyHires,
            yoy: yoyHiringVelocity,
        },
        diversityRatio: {
            partTime: 15,
            contractual: 25,
            regular: 60,
        },
    };
}

/**
 * Get historical trend data for headcount, hires, and attritions
 * @param {string} department - Optional department filter. If provided, returns department-specific data
 * @returns {Object} Historical trend data with 12 months of data
 */
export function getHeadcountTrendData(department = null) {
    const months = [];
    const totalHeadcount = [];
    const hires = [];
    const attritions = [];
    const previousYear = [];
    const currentDate = new Date();

    // Department-specific multipliers for scaling data
    const departmentMultipliers = {
        "Engineering": { headcount: 0.1, hires: 0.08, attritions: 0.06 },
        "Sales": { headcount: 0.06, hires: 0.12, attritions: 0.15 },
        "Marketing": { headcount: 0.035, hires: 0.04, attritions: 0.05 },
        "HR": { headcount: 0.02, hires: 0.02, attritions: 0.02 },
        "Finance": { headcount: 0.027, hires: 0.02, attritions: 0.02 },
        "Operations": { headcount: 0.074, hires: 0.06, attritions: 0.05 },
        "Customer Support": { headcount: 0.049, hires: 0.08, attritions: 0.06 },
        "Product": { headcount: 0.039, hires: 0.04, attritions: 0.03 },
    };

    const multiplier = department && departmentMultipliers[department] 
        ? departmentMultipliers[department] 
        : { headcount: 1, hires: 1, attritions: 1 };

    // Generate data for the last 12 months
    for (let i = 11; i >= 0; i--) {
        const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - i,
            1
        );
        const monthName = date.toLocaleDateString("en-US", { month: "short" });
        months.push(monthName);

        // Generate realistic headcount data (starting around 2,200 and growing)
        const baseHeadcount = 2200;
        const growth = (11 - i) * 20; // Steady growth
        const headcount = Math.round((baseHeadcount + growth + (Math.random() * 50 - 25)) * multiplier.headcount);
        totalHeadcount.push(headcount);

        // Generate hires (typically 80-150 per month)
        const monthlyHires = Math.round((100 + (Math.random() * 70 - 35)) * multiplier.hires);
        hires.push(monthlyHires);

        // Generate attritions (typically 20-50 per month)
        const monthlyAttritions = Math.round((35 + (Math.random() * 30 - 15)) * multiplier.attritions);
        attritions.push(monthlyAttritions);

        // Previous year data (slightly lower baseline)
        const prevYearHeadcount = Math.round((baseHeadcount - 200 + (11 - i) * 18 + (Math.random() * 50 - 25)) * multiplier.headcount);
        previousYear.push(prevYearHeadcount);
    }

    return {
        months: months,
        totalHeadcount: totalHeadcount,
        hires: hires,
        attritions: attritions,
        previousYear: previousYear,
    };
}

/**
 * Get departmental distribution data with employment status breakdown
 * @returns {Object} Departmental data with headcount by status
 */
export function getDepartmentalData() {
    const departments = [
        {
            name: "Engineering",
            current: 250,
            previous: 217,
            byStatus: {
                regular: 200,
                contractual: 45,
                partTime: 5,
            },
            growthRate: 15.2,
            hiringVelocity: 8.5,
        },
        {
            name: "Sales",
            current: 150,
            previous: 165,
            byStatus: {
                regular: 120,
                contractual: 25,
                partTime: 5,
            },
            growthRate: -9.1,
            hiringVelocity: 5.2,
        },
        {
            name: "Marketing",
            current: 85,
            previous: 78,
            byStatus: {
                regular: 65,
                contractual: 18,
                partTime: 2,
            },
            growthRate: 9.0,
            hiringVelocity: 3.8,
        },
        {
            name: "HR",
            current: 50,
            previous: 45,
            byStatus: {
                regular: 42,
                contractual: 7,
                partTime: 1,
            },
            growthRate: 11.1,
            hiringVelocity: 2.1,
        },
        {
            name: "Finance",
            current: 65,
            previous: 62,
            byStatus: {
                regular: 55,
                contractual: 9,
                partTime: 1,
            },
            growthRate: 4.8,
            hiringVelocity: 1.8,
        },
        {
            name: "Operations",
            current: 180,
            previous: 175,
            byStatus: {
                regular: 140,
                contractual: 35,
                partTime: 5,
            },
            growthRate: 2.9,
            hiringVelocity: 4.5,
        },
        {
            name: "Customer Support",
            current: 120,
            previous: 115,
            byStatus: {
                regular: 95,
                contractual: 22,
                partTime: 3,
            },
            growthRate: 4.3,
            hiringVelocity: 3.2,
        },
        {
            name: "Product",
            current: 95,
            previous: 88,
            byStatus: {
                regular: 80,
                contractual: 13,
                partTime: 2,
            },
            growthRate: 8.0,
            hiringVelocity: 2.8,
        },
    ];

    return {
        departments: departments,
    };
}

/**
 * Get attrition heatmap data by department and tenure bucket
 * @returns {Object} Attrition rates organized by department and tenure
 */
export function getAttritionHeatmapData() {
    const departments = [
        "Engineering",
        "Sales",
        "Marketing",
        "HR",
        "Finance",
        "Operations",
        "Customer Support",
        "Product",
    ];

    const tenureBuckets = ["<1yr", "1-3yr", "3-5yr", "5+yr"];

    // Generate realistic attrition rates (2D array: [department][tenure])
    // Higher rates for new hires (<1yr) and lower for long-tenured (5+yr)
    const rates = departments.map((dept) => {
        const baseRate = dept === "Sales" ? 8.0 : dept === "Marketing" ? 6.0 : 4.0;
        return tenureBuckets.map((tenure, index) => {
            // New hires have higher attrition, long-tenured have lower
            const multiplier = index === 0 ? 1.5 : index === 1 ? 1.2 : index === 2 ? 0.8 : 0.5;
            const rate = baseRate * multiplier + (Math.random() * 2 - 1);
            return parseFloat(Math.max(0, rate).toFixed(1));
        });
    });

    return {
        departments: departments,
        tenureBuckets: tenureBuckets,
        rates: rates,
    };
}

/**
 * Get YoY comparison data for departments
 * @returns {Object} Year-over-year comparison metrics
 */
export function getYoYComparisonData() {
    const departments = [
        {
            name: "Engineering",
            currentHeadcount: 250,
            previousYearHeadcount: 217,
            yoyChange: 15.2,
            growthRate: 4.5,
            trend: [210, 215, 220, 225, 230, 235, 240, 245, 248, 250, 252, 250], // 12 months trend
        },
        {
            name: "Sales",
            currentHeadcount: 150,
            previousYearHeadcount: 165,
            yoyChange: -9.1,
            growthRate: 2.1,
            trend: [170, 168, 165, 162, 160, 158, 155, 152, 150, 148, 150, 150],
        },
        {
            name: "Marketing",
            currentHeadcount: 85,
            previousYearHeadcount: 78,
            yoyChange: 9.0,
            growthRate: 3.8,
            trend: [75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 85],
        },
        {
            name: "HR",
            currentHeadcount: 50,
            previousYearHeadcount: 45,
            yoyChange: 11.1,
            growthRate: 3.8,
            trend: [43, 44, 45, 46, 47, 48, 49, 50, 50, 50, 50, 50],
        },
        {
            name: "Finance",
            currentHeadcount: 65,
            previousYearHeadcount: 62,
            yoyChange: 4.8,
            growthRate: 2.5,
            trend: [60, 61, 62, 63, 64, 65, 65, 65, 65, 65, 65, 65],
        },
        {
            name: "Operations",
            currentHeadcount: 180,
            previousYearHeadcount: 175,
            yoyChange: 2.9,
            growthRate: 3.2,
            trend: [172, 173, 174, 175, 176, 177, 178, 179, 180, 180, 180, 180],
        },
        {
            name: "Customer Support",
            currentHeadcount: 120,
            previousYearHeadcount: 115,
            yoyChange: 4.3,
            growthRate: 3.5,
            trend: [112, 113, 114, 115, 116, 117, 118, 119, 120, 120, 120, 120],
        },
        {
            name: "Product",
            currentHeadcount: 95,
            previousYearHeadcount: 88,
            yoyChange: 8.0,
            growthRate: 4.2,
            trend: [85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 95],
        },
    ];

    // Calculate totals
    const totalCurrent = departments.reduce((sum, dept) => sum + dept.currentHeadcount, 0);
    const totalPrevious = departments.reduce((sum, dept) => sum + dept.previousYearHeadcount, 0);
    const totalYoYChange = ((totalCurrent - totalPrevious) / totalPrevious) * 100;
    const avgGrowthRate = departments.reduce((sum, dept) => sum + dept.growthRate, 0) / departments.length;

    return {
        departments: departments,
        totals: {
            currentHeadcount: totalCurrent,
            previousYearHeadcount: totalPrevious,
            yoyChange: parseFloat(totalYoYChange.toFixed(1)),
            growthRate: parseFloat(avgGrowthRate.toFixed(1)),
        },
    };
}

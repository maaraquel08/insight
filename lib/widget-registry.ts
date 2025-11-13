import type { WidgetMetadata } from "@/types/dashboard";

export const widgetRegistry: WidgetMetadata[] = [
    {
        id: "metric-cards-section",
        name: "Metric Cards",
        description: "Key performance indicators including headcount, attrition rate, absenteeism, leave utilization, and average tenure",
        category: "People Health",
        dataSource: ["People Health"],
        defaultSize: "Medium", // All widgets use equal width
        component: "MetricCardsSection",
        locked: false,
    },
    {
        id: "headcount-trend-chart",
        name: "Headcount Trend",
        description: "Monitor workforce growth or reduction over time with visual trend analysis",
        category: "People Health",
        dataSource: ["People Health"],
        defaultSize: "Medium",
        component: "HeadcountTrendChart",
        locked: false,
    },
    {
        id: "attrition-trend-chart",
        name: "Attrition Trend",
        description: "Track employee turnover rates and identify patterns over time",
        category: "People Health",
        dataSource: ["People Health"],
        defaultSize: "Medium",
        component: "AttritionTrendChart",
        locked: false,
    },
    {
        id: "leave-types-breakdown",
        name: "Leave Types Breakdown",
        description: "Visual breakdown of different types of leave taken by employees",
        category: "Time & Attendance",
        dataSource: ["Time & Attendance"],
        defaultSize: "Medium",
        component: "LeaveTypesBreakdown",
        locked: false,
    },
    {
        id: "absenteeism-trend-chart",
        name: "Absenteeism Trend",
        description: "Analyze absenteeism patterns and trends over time",
        category: "Time & Attendance",
        dataSource: ["Time & Attendance"],
        defaultSize: "Medium",
        component: "AbsenteeismTrendChart",
        locked: false,
    },
    {
        id: "tenure-demographics",
        name: "Tenure & Demographics",
        description: "Comprehensive view of employee tenure distribution and demographic insights",
        category: "People Health",
        dataSource: ["People Health"],
        defaultSize: "Medium",
        component: "TenureDemographics",
        locked: false,
    },
];

export function getWidgetById(id: string): WidgetMetadata | undefined {
    return widgetRegistry.find((widget) => widget.id === id);
}

export function getWidgetsByCategory(
    category: string
): WidgetMetadata[] {
    return widgetRegistry.filter((widget) => widget.category === category);
}

export function searchWidgets(query: string): WidgetMetadata[] {
    const lowerQuery = query.toLowerCase();
    return widgetRegistry.filter(
        (widget) =>
            widget.name.toLowerCase().includes(lowerQuery) ||
            widget.description.toLowerCase().includes(lowerQuery) ||
            widget.category.toLowerCase().includes(lowerQuery)
    );
}


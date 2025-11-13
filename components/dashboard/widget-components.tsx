"use client";

import { MetricCardsSection } from "./metric-cards-section";
import { HeadcountTrendChart } from "./headcount-trend-chart";
import { AttritionTrendChart } from "./attrition-trend-chart";
import { LeaveTypesBreakdown } from "./leave-types-breakdown";
import { AbsenteeismTrendChart } from "./absenteeism-trend-chart";
import { TenureDemographics } from "./tenure-demographics";

type WidgetComponentMap = {
    [key: string]: React.ComponentType<any>;
};

const widgetComponents: WidgetComponentMap = {
    "metric-cards-section": MetricCardsSection,
    "headcount-trend-chart": HeadcountTrendChart,
    "attrition-trend-chart": AttritionTrendChart,
    "leave-types-breakdown": LeaveTypesBreakdown,
    "absenteeism-trend-chart": AbsenteeismTrendChart,
    "tenure-demographics": TenureDemographics,
};

export function getWidgetComponent(
    widgetId: string
): React.ComponentType<any> | null {
    return widgetComponents[widgetId] || null;
}


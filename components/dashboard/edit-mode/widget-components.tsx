"use client";

import { MetricCardsSection } from "../widgets/metric-cards-section";
import { HeadcountTrendChart } from "../widgets/headcount-trend-chart";
import { AttritionTrendChart } from "../widgets/attrition-trend-chart";
import { LeaveTypesBreakdown } from "../widgets/leave-types-breakdown";
import { AbsenteeismTrendChart } from "../widgets/absenteeism-trend-chart";
import { TenureDemographics } from "../widgets/tenure-demographics";

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


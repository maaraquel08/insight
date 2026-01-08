"use client";

import { MetricCardsSection } from "../widgets/kpi-cards/metric-cards-section";
import { HeadcountTrendChart } from "../widgets/headcount/headcount-trend-chart";
import { AttritionTrendChart } from "../widgets/attrition/attrition-trend-chart";
import { LeaveTypesBreakdown } from "../widgets/time-attendance/leave-types-breakdown";
import { AbsenteeismTrendChart } from "../widgets/time-attendance/absenteeism-trend-chart";
import { TenureDemographics } from "../widgets/people-analytics/tenure-demographics";
import { SupervisorPerformanceRanking } from "../widgets/people-analytics/supervisor-performance-ranking";
import { AttritionByDepartment } from "../widgets/attrition/attrition-by-department";
import { DepartureReason } from "../widgets/attrition/departure-reason";
import { HeadcountKPICards } from "../widgets/kpi-cards/headcount-kpi-cards";
import { HeadcountTrendAdvanced } from "../widgets/headcount/headcount-trend-advanced";
import { DepartmentalDistributionChart } from "../widgets/headcount/departmental-distribution-chart";
import { AttritionHeatmap } from "../widgets/attrition/attrition-heatmap";
import { YoYComparisonTable } from "../widgets/people-analytics/yoy-comparison-table";

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
    "supervisor-performance-ranking": SupervisorPerformanceRanking,
    "attrition-by-department": AttritionByDepartment,
    "departure-reason": DepartureReason,
    "headcount-kpi-cards": HeadcountKPICards,
    "headcount-trend-advanced": HeadcountTrendAdvanced,
    "departmental-distribution-chart": DepartmentalDistributionChart,
    "attrition-heatmap": AttritionHeatmap,
    "yoy-comparison-table": YoYComparisonTable,
};

export function getWidgetComponent(
    widgetId: string
): React.ComponentType<any> | null {
    return widgetComponents[widgetId] || null;
}


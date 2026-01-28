"use client";

import { useMemo } from "react";
import { DashboardContainer } from "@/components/dashboard/layout/dashboard-container";
import { PersonalizeHeader } from "@/components/dashboard/layout/personalize-header";
import { FloatingChatSidekick } from "@/components/chatbot-sidekick";
import { ExecutiveSnapshotCard } from "@/components/dashboard/widgets/kpi-cards/executive-snapshot-card";
import { AttritionTrendChart } from "@/components/dashboard/widgets/attrition/attrition-trend-chart";
import { TenureDemographics } from "@/components/dashboard/widgets/people-analytics/tenure-demographics";
import { SupervisorPerformanceRanking } from "@/components/dashboard/widgets/people-analytics/supervisor-performance-ranking";
import { AttritionByDepartment } from "@/components/dashboard/widgets/attrition/attrition-by-department";
import { DepartureReason } from "@/components/dashboard/widgets/attrition/departure-reason";
import { AIOverview } from "@/components/dashboard/ai-overview";
import { AttritionFilters } from "@/components/dashboard/attrition-filters";
import { AttritionFilterProvider, useAttritionFilters } from "@/contexts/attrition-filter-context";
import { Users } from "lucide-react";
import { useChatSidekick } from "@/components/chatbot-sidekick";
import { DraggableWidgetWrapper } from "@/components/dashboard/draggable-widget-wrapper";
import { MasonryGrid, masonryItemStyle } from "@/components/dashboard/layout/masonry-grid";
import type { WidgetLayout } from "@/types/dashboard";
import {
    getAttritionTrendData,
    getTenureDemographicsData,
    getDepartmentAttritionData,
    getDepartureReasonData,
} from "@/app/data/attritionData";

function AttritionMetricCards() {
    const { openChat } = useChatSidekick();

    const handleAskSidekick = (title: string) => {
        openChat(`Can you provide more insights about ${title.toLowerCase()}?`);
    };

    // Create widget layouts for drag and drop
    const overallAttritionLayout: WidgetLayout = {
        id: "attrition-metric-overall-attrition",
        widgetId: "executive-snapshot-card-overall-attrition",
        x: 0,
        y: 0,
        width: 3,
        height: 1,
        size: "Small",
        order: 0,
    };

    const totalSeparationsLayout: WidgetLayout = {
        id: "attrition-metric-total-separations",
        widgetId: "executive-snapshot-card-total-separations",
        x: 0,
        y: 0,
        width: 3,
        height: 1,
        size: "Small",
        order: 1,
    };

    const averageTenureLayout: WidgetLayout = {
        id: "attrition-metric-average-tenure",
        widgetId: "executive-snapshot-card-average-tenure",
        x: 0,
        y: 0,
        width: 3,
        height: 1,
        size: "Small",
        order: 2,
    };

    const voluntaryTurnoverLayout: WidgetLayout = {
        id: "attrition-metric-voluntary-turnover",
        widgetId: "executive-snapshot-card-voluntary-turnover",
        x: 0,
        y: 0,
        width: 3,
        height: 1,
        size: "Small",
        order: 3,
    };

    return (
        <div className="flex gap-6 w-full">
            <div className="flex-1 min-w-0">
                <DraggableWidgetWrapper layout={overallAttritionLayout}>
                    <ExecutiveSnapshotCard
                        icon={<Users className="w-6 h-6 text-[#738482]" />}
                        title="Overall Attrition"
                        value="6.5%"
                        change="-0.8% vs last period"
                        changeType="positive"
                        description="Attrition decreased from 7.3% to 6.5%, driven by improved retention in sales and customer service departments. Early tenure turnover (less than 1 year) saw the largest reduction."
                        onAskSidekick={() =>
                            handleAskSidekick("Overall Attrition")
                        }
                    />
                </DraggableWidgetWrapper>
            </div>
            <div className="flex-1 min-w-0">
                <DraggableWidgetWrapper layout={totalSeparationsLayout}>
                    <ExecutiveSnapshotCard
                        icon={<Users className="w-6 h-6 text-[#738482]" />}
                        title="Total Separations"
                        value="187"
                        change="-12 vs last period"
                        changeType="positive"
                        description="Total separations decreased from 199 to 187 employees. Voluntary separations accounted for 68% of departures, with the remainder being involuntary terminations and retirements."
                        onAskSidekick={() =>
                            handleAskSidekick("Total Separations")
                        }
                    />
                </DraggableWidgetWrapper>
            </div>
            <div className="flex-1 min-w-0">
                <DraggableWidgetWrapper layout={averageTenureLayout}>
                    <ExecutiveSnapshotCard
                        icon={<Users className="w-6 h-6 text-[#738482]" />}
                        title="Average Tenure Department"
                        value="2.8 Years"
                        change="+0.2 years vs last period"
                        changeType="positive"
                        description="Average tenure increased from 2.6 to 2.8 years, indicating improved employee retention. IT and Finance departments show the highest average tenure at 3.4 and 3.1 years respectively."
                        onAskSidekick={() =>
                            handleAskSidekick("Average Tenure Department")
                        }
                    />
                </DraggableWidgetWrapper>
            </div>
            <div className="flex-1 min-w-0">
                <DraggableWidgetWrapper layout={voluntaryTurnoverLayout}>
                    <ExecutiveSnapshotCard
                        icon={<Users className="w-6 h-6 text-[#738482]" />}
                        title="Voluntary Turnover"
                        value="68.4%"
                        change="+2.3% vs last period"
                        changeType="negative"
                        description="Voluntary turnover increased from 66.1% to 68.4% of total separations. Top reasons include career advancement opportunities elsewhere (32%), compensation concerns (28%), and work-life balance (18%)."
                        onAskSidekick={() =>
                            handleAskSidekick("Voluntary Turnover")
                        }
                    />
                </DraggableWidgetWrapper>
            </div>
        </div>
    );
}

function AttritionWidgets() {
    // Create widget layouts for drag and drop
    const attritionTrendLayout: WidgetLayout = {
        id: "attrition-trend-chart-widget",
        widgetId: "attrition-trend-chart",
        x: 0,
        y: 0,
        width: 6,
        height: 1,
        size: "Medium",
        order: 0,
    };

    const tenureDemographicsLayout: WidgetLayout = {
        id: "tenure-demographics-widget",
        widgetId: "tenure-demographics",
        x: 0,
        y: 0,
        width: 6,
        height: 1,
        size: "Medium",
        order: 1,
    };

    const supervisorPerformanceLayout: WidgetLayout = {
        id: "supervisor-performance-ranking-widget",
        widgetId: "supervisor-performance-ranking",
        x: 0,
        y: 0,
        width: 6,
        height: 1,
        size: "Medium",
        order: 2,
    };

    const attritionByDepartmentLayout: WidgetLayout = {
        id: "attrition-by-department-widget",
        widgetId: "attrition-by-department",
        x: 0,
        y: 0,
        width: 6,
        height: 1,
        size: "Medium",
        order: 3,
    };

    const departureReasonLayout: WidgetLayout = {
        id: "departure-reason-widget",
        widgetId: "departure-reason",
        x: 0,
        y: 0,
        width: 6,
        height: 1,
        size: "Medium",
        order: 4,
    };

    return (
        <MasonryGrid className="w-full">
            {/* Widget 1 */}
            <div style={masonryItemStyle}>
                <DraggableWidgetWrapper layout={attritionTrendLayout}>
                    <AttritionTrendChart />
                </DraggableWidgetWrapper>
            </div>
            {/* Widget 2 */}
            <div style={masonryItemStyle}>
                <DraggableWidgetWrapper layout={tenureDemographicsLayout}>
                    <TenureDemographics />
                </DraggableWidgetWrapper>
            </div>
            {/* Widget 3 */}
            <div style={masonryItemStyle}>
                <DraggableWidgetWrapper layout={supervisorPerformanceLayout}>
                    <SupervisorPerformanceRanking />
                </DraggableWidgetWrapper>
            </div>
            {/* Widget 4 */}
            <div style={masonryItemStyle}>
                <DraggableWidgetWrapper layout={attritionByDepartmentLayout}>
                    <AttritionByDepartment />
                </DraggableWidgetWrapper>
            </div>
            {/* Widget 5 */}
            <div style={masonryItemStyle}>
                <DraggableWidgetWrapper layout={departureReasonLayout}>
                    <DepartureReason />
                </DraggableWidgetWrapper>
            </div>
        </MasonryGrid>
    );
}

function AttritionDashboardContent() {
    const { filters } = useAttritionFilters();
    
    // Collect all dashboard data for AI Overview
    const dashboardData = useMemo(() => {
        const trendData = getAttritionTrendData(filters) as {
            currentRate: string;
            changeType: string;
            description: string;
        };
        const tenureData = getTenureDemographicsData(filters) as {
            tenureDistribution: { categories: string[]; values: number[] };
            demographics: { age: { categories: string[]; values: number[] } };
        };
        const departmentData = getDepartmentAttritionData(filters) as {
            categories: string[];
            values: number[];
        };
        const departureData = getDepartureReasonData(filters) as {
            voluntaryInvoluntary: { labels: string[]; values: number[] };
            specificReasons: Array<{ reason: string; percentage: number }>;
        };

        return {
            metrics: {
                overallAttrition: {
                    value: "6.5%",
                    change: "-0.8% vs last period",
                    changeType: "positive",
                },
                totalSeparations: {
                    value: "187",
                    change: "-12 vs last period",
                    changeType: "positive",
                },
                averageTenure: {
                    value: "2.8 Years",
                    change: "+0.2 years vs last period",
                    changeType: "positive",
                },
                voluntaryTurnover: {
                    value: "68.4%",
                    change: "+2.3% vs last period",
                    changeType: "negative",
                },
            },
            trends: {
                currentRate: trendData.currentRate,
                trendDirection: trendData.changeType === "positive" ? "decreasing" : "increasing",
                description: trendData.description,
            },
            departments: {
                categories: departmentData.categories,
                values: departmentData.values,
            },
            demographics: {
                tenure: tenureData.tenureDistribution,
                age: tenureData.demographics.age,
            },
            departureReasons: {
                voluntaryInvoluntary: departureData.voluntaryInvoluntary,
                topReasons: departureData.specificReasons
                    .sort((a: any, b: any) => b.percentage - a.percentage)
                    .slice(0, 5),
            },
        };
    }, [filters]);

    return (
        <main className="bg-[#f1f2f3] min-h-screen flex flex-col">
            <div className="flex flex-col gap-6 p-10 flex-1">
                <div className="flex flex-col gap-6 items-start max-w-[1320px] w-full mx-auto">
                    <PersonalizeHeader
                        title="Attrition"
                        description="Analytics dashboard for attrition insights and trends"
                    />

                    {/* AI Overview Section */}
                    <AIOverview dashboardData={dashboardData} />

                    {/* Filters Section */}
                    <AttritionFilters />

                    {/* Metric Cards Section */}
                    <AttritionMetricCards />

                    {/* Widgets Section */}
                    <AttritionWidgets />
                </div>
            </div>

            {/* Floating Chat Sidekick */}
            <FloatingChatSidekick />
        </main>
    );
}

export default function AttritionDashboardPage() {
    return (
        <DashboardContainer userId="user-1" role="admin">
            <AttritionFilterProvider>
                <AttritionDashboardContent />
            </AttritionFilterProvider>
        </DashboardContainer>
    );
}

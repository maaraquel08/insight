"use client";

import { DashboardContainer } from "@/components/dashboard/layout/dashboard-container";
import { PersonalizeHeader } from "@/components/dashboard/layout/personalize-header";
import { FloatingChatSidekick } from "@/components/chatbot-sidekick";
import { ExecutiveSnapshotCard } from "@/components/dashboard/widgets/executive-snapshot-card";
import { AttritionTrendChart } from "@/components/dashboard/widgets/attrition-trend-chart";
import { TenureDemographics } from "@/components/dashboard/widgets/tenure-demographics";
import { SupervisorPerformanceRanking } from "@/components/dashboard/widgets/supervisor-performance-ranking";
import { AttritionByDepartment } from "@/components/dashboard/widgets/attrition-by-department";
import { DepartureReason } from "@/components/dashboard/widgets/departure-reason";
import { Users } from "lucide-react";
import { useChatSidekick } from "@/components/chatbot-sidekick";
import { DraggableWidgetWrapper } from "@/components/dashboard/draggable-widget-wrapper";
import { MasonryGrid, masonryItemStyle } from "@/components/dashboard/layout/masonry-grid";
import type { WidgetLayout } from "@/types/dashboard";

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
                        value="12.4%"
                        change="3.1% vs last period"
                        changeType="positive"
                        description=""
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
                        change="3.1% vs last period"
                        changeType="positive"
                        description=""
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
                        change="3.1% vs last period"
                        changeType="positive"
                        description=""
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
                        change="3.1% vs last period"
                        changeType="positive"
                        description=""
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

export default function AttritionDashboardPage() {
    return (
        <DashboardContainer userId="user-1" role="admin">
            <main className="bg-[#f1f2f3] min-h-screen flex flex-col">
                <div className="flex flex-col gap-6 p-10 flex-1">
                    <div className="flex flex-col gap-6 items-start max-w-[1320px] w-full mx-auto">
                        <PersonalizeHeader
                            title="Attrition"
                            description="Analytics dashboard for attrition insights and trends"
                        />

                        {/* Metric Cards Section */}
                        <AttritionMetricCards />

                        {/* Widgets Section */}
                        <AttritionWidgets />
                    </div>
                </div>

                {/* Floating Chat Sidekick */}
                <FloatingChatSidekick />
            </main>
        </DashboardContainer>
    );
}

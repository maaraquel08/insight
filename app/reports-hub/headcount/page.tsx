"use client";

import { DashboardContainer } from "@/components/dashboard/layout/dashboard-container";
import { PersonalizeHeader } from "@/components/dashboard/layout/personalize-header";
import { DashboardGrid } from "@/components/dashboard/layout/dashboard-grid";
import { FloatingChatSidekick } from "@/components/chatbot-sidekick";
import { HeadcountMovementKPICards } from "@/components/dashboard/widgets";

export default function HeadcountDashboardPage() {
    return (
        <DashboardContainer userId="headcount-movement" role="admin">
            <main className="bg-[#f1f2f3] min-h-screen flex flex-col">
                <div className="flex flex-col gap-6 p-10 flex-1">
                    <div className="flex flex-col gap-6 items-start max-w-[1320px] w-full mx-auto">
                        <PersonalizeHeader
                            title="Headcount Analytics Dashboard"
                            description="Comprehensive headcount insights with executive summary, trends, departmental breakdown, attrition analysis, and forecasting"
                        />

                        {/* KPI Cards Section */}
                        <div className="w-full">
                            <HeadcountMovementKPICards />
                        </div>

                        {/* Dashboard Grid - Includes all widgets */}
                        <div className="w-full">
                            <DashboardGrid />
                        </div>
                    </div>
                </div>

                {/* Floating Chat Sidekick */}
                <FloatingChatSidekick />
            </main>
        </DashboardContainer>
    );
}

"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { MetricCardsSection } from "@/components/dashboard/metric-cards-section";
import { HeadcountTrendChart } from "@/components/dashboard/headcount-trend-chart";
import { AttritionTrendChart } from "@/components/dashboard/attrition-trend-chart";
import { LeaveTypesBreakdown } from "@/components/dashboard/leave-types-breakdown";
import { AbsenteeismTrendChart } from "@/components/dashboard/absenteeism-trend-chart";
import { TenureDemographics } from "@/components/dashboard/tenure-demographics";

export default function Home() {
    const router = useRouter();

    const handleCreateReport = () => {
        router.push("/create-report");
    };

    return (
        <main className="bg-[#f1f2f3] min-h-screen flex flex-col">
            <div className="flex flex-col gap-6 p-10 flex-1">
                <div className="flex flex-col gap-6 items-start max-w-[1320px] w-full mx-auto">
                    <PageHeader
                        title="Foresight Analytics"
                        description="Central analytics tool for key decision makers, CEO, admin, COO, executives"
                        actionLabel="Create Report"
                        onAction={handleCreateReport}
                    />

                    {/* Metric Cards Section */}
                    <div className="w-full">
                        <MetricCardsSection />
                    </div>

                    {/* Widgets Grid */}
                    <div className="w-full">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Attrition Trend */}
                            <AttritionTrendChart />

                            {/* Headcount Trend */}
                            <HeadcountTrendChart />

                            {/* Leave Types Breakdown */}
                            <LeaveTypesBreakdown />

                            {/* Absenteeism Trend */}
                            <AbsenteeismTrendChart />

                            {/* Tenure & Demographics - Full Width */}
                            <div className="lg:col-span-2">
                                <TenureDemographics />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

"use client";

import { useState, useEffect } from "react";
import { MetricCard } from "./metric-card";
import { Users, Clock, TrendingUp } from "lucide-react";
// @ts-ignore - JavaScript file
import { getHeadcountTrendData } from "@/app/data/peopleHealthData";
// @ts-ignore - JavaScript file
import { getAttritionTrendData } from "@/app/data/peopleHealthData";
// @ts-ignore - JavaScript file
import { getLeaveAbsenteeismData } from "@/app/data/peopleHealthData";
// @ts-ignore - JavaScript file
import { getTenureDemographicsData } from "@/app/data/peopleHealthData";

export function MetricCardsSection() {
    const [headcountData, setHeadcountData] = useState<any>(null);
    const [attritionData, setAttritionData] = useState<any>(null);
    const [leaveData, setLeaveData] = useState<any>(null);
    const [tenureData, setTenureData] = useState<any>(null);

    useEffect(() => {
        setHeadcountData(getHeadcountTrendData());
        setAttritionData(getAttritionTrendData());
        setLeaveData(getLeaveAbsenteeismData());
        setTenureData(getTenureDemographicsData());
    }, []);

    if (!headcountData || !attritionData || !leaveData || !tenureData) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl border border-[#d9dede] p-4"
                    >
                        <div className="h-24 animate-pulse bg-gray-100 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Total Headcount */}
            <MetricCard
                icon={<Users className="w-5 h-5 text-[#738482]" />}
                title="Total Headcount"
                value={`${headcountData.currentHeadcount.toLocaleString()} Employees`}
                change={`+${headcountData.percentageChange}% vs last month`}
                changeType={headcountData.changeType}
                description={headcountData.description}
            />

            {/* Attrition Rate */}
            <MetricCard
                icon={<Users className="w-5 h-5 text-[#738482]" />}
                title="Attrition Rate"
                value={`${attritionData.currentRate}%`}
                change={`${attritionData.changeSymbol} ${attritionData.change} pts vs last month`}
                changeType={attritionData.changeType}
                description={attritionData.description}
            />

            {/* Absenteeism Rate */}
            <MetricCard
                icon={<Clock className="w-5 h-5 text-[#738482]" />}
                title="Absenteeism Rate"
                value={`${leaveData.currentAbsenteeismRate}%`}
                change={`${leaveData.changeSymbol} ${leaveData.change} pts vs last month`}
                changeType={leaveData.changeType}
            />

            {/* Leave Utilization */}
            <MetricCard
                icon={<Clock className="w-5 h-5 text-[#738482]" />}
                title="Leave Utilization"
                value={`${leaveData.leaveUtilization}%`}
                change={leaveData.leaveUtilizationChange.replace(
                    "vs last month",
                    "vs last period"
                )}
                changeType={leaveData.leaveUtilizationChangeType}
            />

            {/* Average Tenure */}
            <MetricCard
                icon={<Users className="w-5 h-5 text-[#738482]" />}
                title="Average Tenure"
                value={`${tenureData.averageTenure} years`}
                change={`${tenureData.tenureChangeSymbol} ${tenureData.tenureChange}% vs last period`}
                changeType={tenureData.tenureChangeType}
                description={tenureData.tenureDescription}
            />
        </div>
    );
}


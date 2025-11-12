"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import type { ApexOptions } from "apexcharts";
// @ts-ignore - JavaScript file
import { getLeaveAbsenteeismData } from "@/app/data/peopleHealthData";
import { MetricCard } from "./metric-card";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface LeaveAbsenteeismData {
    leaveUtilization: number;
    leaveUtilizationChange: string;
    leaveUtilizationChangeType: "positive" | "negative";
    leaveUtilizationDescription: string;
    currentAbsenteeismRate: string;
    change: string;
    changeType: "positive" | "negative";
    changeSymbol: string;
    months: string[];
    absenteeismRates: number[];
    leaveTypes: string[];
    leaveTypesData: number[][];
    description: string;
}

export function LeaveAbsenteeism() {
    const [data, setData] = useState<LeaveAbsenteeismData | null>(null);

    useEffect(() => {
        setData(getLeaveAbsenteeismData() as LeaveAbsenteeismData);
    }, []);

    // Stacked bar chart for leave types
    const leaveChartOptions: ApexOptions = useMemo(
        () => ({
            chart: {
                type: "bar",
                height: 300,
                toolbar: {
                    show: false,
                },
                stacked: true,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 4,
                },
            },
            dataLabels: {
                enabled: false,
            },
            xaxis: {
                categories: data?.months || [],
                labels: {
                    style: {
                        colors: "#5d6c6b",
                        fontSize: "12px",
                    },
                },
            },
            yaxis: {
                labels: {
                    style: {
                        colors: "#5d6c6b",
                        fontSize: "12px",
                    },
                    formatter: (val: number) => val.toLocaleString(),
                },
            },
            fill: {
                opacity: 1,
            },
            colors: ["#158039", "#17ad49", "#f59e0b", "#ef4444"],
            legend: {
                position: "bottom",
                fontSize: "12px",
                labels: {
                    colors: "#5d6c6b",
                },
            },
            grid: {
                borderColor: "#e5e7eb",
                strokeDashArray: 4,
            },
            tooltip: {
                theme: "light",
                y: {
                    formatter: (val: number) => `${val.toLocaleString()} days`,
                },
            },
        }),
        [data]
    );

    const leaveChartSeries = useMemo(
        () =>
            data?.leaveTypes.map((type, index) => ({
                name: type,
                data: data.leaveTypesData[index] || [],
            })) || [],
        [data]
    );

    // Line chart for absenteeism trend
    const absenteeismChartOptions: ApexOptions = useMemo(
        () => ({
            chart: {
                type: "line",
                height: 300,
                toolbar: {
                    show: false,
                },
            },
            stroke: {
                curve: "smooth",
                width: 2,
                colors: ["#8139ee"],
            },
            dataLabels: {
                enabled: true,
                formatter: (val: number) => `${val}%`,
                style: {
                    colors: ["#5d6c6b"],
                    fontSize: "12px",
                },
            },
            xaxis: {
                categories: data?.months || [],
                labels: {
                    style: {
                        colors: "#5d6c6b",
                        fontSize: "12px",
                    },
                },
            },
            yaxis: {
                labels: {
                    style: {
                        colors: "#5d6c6b",
                        fontSize: "12px",
                    },
                    formatter: (val: number) => `${val}%`,
                },
            },
            grid: {
                borderColor: "#e5e7eb",
                strokeDashArray: 4,
            },
            tooltip: {
                theme: "light",
                y: {
                    formatter: (val: number) => `${val}%`,
                },
            },
            colors: ["#8139ee"],
        }),
        [data]
    );

    const absenteeismChartSeries = useMemo(
        () => [
            {
                name: "Absenteeism Rate",
                data: data?.absenteeismRates || [],
            },
        ],
        [data]
    );

    if (!data) {
        return (
            <div className="bg-white border border-[#d9dede] rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#d9dede]">
                    <div className="flex gap-1 items-center mb-1">
                        <Clock className="w-5 h-5 text-[#738482]" />
                        <h2 className="text-base font-medium text-[#262b2b]">
                            🕒 4️⃣ Leave & Absenteeism Overview
                        </h2>
                    </div>
                    <p className="text-sm text-[#5d6c6b]">
                        Track time-off patterns to assess employee availability and
                        attendance behavior.
                    </p>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-center h-64">
                        <p className="text-sm text-[#5d6c6b]">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-[#d9dede] rounded-2xl overflow-hidden">
            {/* Card Header */}
            <div className="px-4 py-3 border-b border-[#d9dede]">
                <div className="flex gap-1 items-center mb-1">
                    <Clock className="w-5 h-5 text-[#738482]" />
                    <h2 className="text-base font-medium text-[#262b2b]">
                        🕒 4️⃣ Leave & Absenteeism Overview
                    </h2>
                </div>
                <p className="text-sm text-[#5d6c6b]">
                    Track time-off patterns to assess employee availability and
                    attendance behavior.
                </p>
            </div>

            {/* Card Body */}
            <div className="p-6">
                <div className="flex flex-col gap-6">
                    {/* Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <MetricCard
                            icon={<Clock className="w-5 h-5 text-[#738482]" />}
                            title="Leave Utilization"
                            value={`${data.leaveUtilization}%`}
                            change={data.leaveUtilizationChange.replace("vs last month", "vs last period")}
                            changeType={data.leaveUtilizationChangeType}
                        />
                        <MetricCard
                            icon={<Clock className="w-5 h-5 text-[#738482]" />}
                            title="Absenteeism Rate"
                            value={`${data.currentAbsenteeismRate}%`}
                            change={`${data.changeSymbol} ${data.change} pts vs last month`}
                            changeType={data.changeType}
                        />
                    </div>

                    {/* Leave Types Stacked Bar Chart */}
                    <div className="bg-white rounded-lg border border-[#d9dede] p-4">
                        <h3 className="text-sm font-medium text-[#262b2b] mb-3">
                            Leave Types Breakdown
                        </h3>
                        <Chart
                            type="bar"
                            options={leaveChartOptions}
                            series={leaveChartSeries}
                            height={300}
                        />
                    </div>

                    {/* Absenteeism Trend Line Chart */}
                    <div className="bg-white rounded-lg border border-[#d9dede] p-4">
                        <h3 className="text-sm font-medium text-[#262b2b] mb-3">
                            Absenteeism Trend
                        </h3>
                        <Chart
                            type="line"
                            options={absenteeismChartOptions}
                            series={absenteeismChartSeries}
                            height={300}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <p className="text-sm text-[#5d6c6b]">{data.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}


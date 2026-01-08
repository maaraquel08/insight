"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Clock } from "lucide-react";
import type { ApexOptions } from "apexcharts";
// @ts-ignore - JavaScript file
import { getLeaveAbsenteeismData } from "@/app/data/peopleHealthData";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function LeaveTypesBreakdown() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        setData(getLeaveAbsenteeismData());
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
            data?.leaveTypes.map((type: string, index: number) => ({
                name: type,
                data: data.leaveTypesData[index] || [],
            })) || [],
        [data]
    );

    if (!data) {
        return (
            <div className="bg-white rounded-xl border border-[#d9dede] overflow-hidden">
                <div className="px-4 py-3 border-b border-[#d9dede]">
                    <div className="flex gap-1 items-center mb-1">
                        <Clock className="w-5 h-5 text-[#738482]" />
                        <h2 className="text-base font-medium text-[#262b2b]">
                            Leave Types Breakdown
                        </h2>
                    </div>
                    <p className="text-sm text-[#5d6c6b]">
                        Track time-off patterns by leave type.
                    </p>
                </div>
                <div className="p-4">
                    <div className="flex items-center justify-center h-[300px]">
                        <p className="text-sm text-[#5d6c6b]">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-[#d9dede] overflow-hidden">
            {/* Card Header */}
            <div className="px-4 py-3 border-b border-[#d9dede]">
                <div className="flex gap-1 items-center mb-1">
                    <Clock className="w-5 h-5 text-[#738482]" />
                    <h2 className="text-base font-medium text-[#262b2b]">
                        Leave Types Breakdown
                    </h2>
                </div>
                <p className="text-sm text-[#5d6c6b]">
                    Track time-off patterns by leave type.
                </p>
            </div>

            {/* Chart */}
            <div className="p-4">
                <Chart
                    type="bar"
                    options={leaveChartOptions}
                    series={leaveChartSeries}
                    height={300}
                />
            </div>
        </div>
    );
}


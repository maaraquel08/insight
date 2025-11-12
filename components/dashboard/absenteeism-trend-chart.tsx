"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Clock } from "lucide-react";
import type { ApexOptions } from "apexcharts";
// @ts-ignore - JavaScript file
import { getLeaveAbsenteeismData } from "@/app/data/peopleHealthData";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function AbsenteeismTrendChart() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        setData(getLeaveAbsenteeismData());
    }, []);

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
            <div className="bg-white rounded-xl border border-[#d9dede] overflow-hidden">
                <div className="px-4 py-3 border-b border-[#d9dede]">
                    <div className="flex gap-1 items-center mb-1">
                        <Clock className="w-5 h-5 text-[#738482]" />
                        <h2 className="text-base font-medium text-[#262b2b]">
                            Absenteeism Trend
                        </h2>
                    </div>
                    <p className="text-sm text-[#5d6c6b]">
                        Track employee attendance patterns over time.
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
                        Absenteeism Trend
                    </h2>
                </div>
                <p className="text-sm text-[#5d6c6b]">
                    Track employee attendance patterns over time.
                </p>
            </div>

            {/* Chart */}
            <div className="p-4">
                <Chart
                    type="line"
                    options={absenteeismChartOptions}
                    series={absenteeismChartSeries}
                    height={300}
                />
            </div>
        </div>
    );
}


"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { TrendingUp, TrendingDown, Users } from "lucide-react";
import type { ApexOptions } from "apexcharts";
// @ts-ignore - JavaScript file
import { getAttritionTrendData } from "@/app/data/peopleHealthData";
import { MetricCard } from "./metric-card";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface AttritionTrendData {
    labels: string[];
    series: number[];
    currentRate: string;
    change: string;
    changeType: "positive" | "negative";
    changeSymbol: string;
    description: string;
}

export function AttritionTrend() {
    const [data, setData] = useState<AttritionTrendData | null>(null);

    useEffect(() => {
        setData(getAttritionTrendData() as AttritionTrendData);
    }, []);

    // Line chart for attrition trend
    const chartOptions: ApexOptions = useMemo(
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
                colors: ["#ef4444"],
            },
            dataLabels: {
                enabled: true,
                formatter: (val: number) => `${val}%`,
                style: {
                    colors: ["#5d6c6b"],
                    fontSize: "12px",
                },
            },
            markers: {
                size: 4,
                colors: ["#ef4444"],
            },
            xaxis: {
                categories: data?.labels || [],
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
            colors: ["#ef4444"],
        }),
        [data]
    );

    const chartSeries = useMemo(
        () => [
            {
                name: "Attrition Rate",
                data: data?.series || [],
            },
        ],
        [data]
    );

    if (!data) {
        return (
            <div className="bg-white border border-[#d9dede] rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#d9dede]">
                    <div className="flex gap-1 items-center mb-1">
                        <Users className="w-5 h-5 text-[#738482]" />
                        <h2 className="text-base font-medium text-[#262b2b]">
                            📈 2️⃣ Attrition Trend
                        </h2>
                    </div>
                    <p className="text-sm text-[#5d6c6b]">
                        Measure how well the company retains its employees over time.
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
                    <Users className="w-5 h-5 text-[#738482]" />
                    <h2 className="text-base font-medium text-[#262b2b]">
                        📈 2️⃣ Attrition Trend
                    </h2>
                </div>
                <p className="text-sm text-[#5d6c6b]">
                    Measure how well the company retains its employees over time.
                </p>
            </div>

            {/* Card Body */}
            <div className="p-6">
                <div className="flex flex-col gap-6">
                    {/* Metric Card */}
                    <MetricCard
                        icon={<Users className="w-5 h-5 text-[#738482]" />}
                        title="Attrition Rate"
                        value={`${data.currentRate}%`}
                        change={`${data.changeSymbol} ${data.change} pts vs last month`}
                        changeType={data.changeType}
                        description={data.description}
                    />

                    {/* Trend Chart */}
                    <div className="bg-white rounded-lg border border-[#d9dede] p-4">
                        <h3 className="text-sm font-medium text-[#262b2b] mb-3">
                            Attrition Trend
                        </h3>
                        <Chart
                            type="line"
                            options={chartOptions}
                            series={chartSeries}
                            height={300}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}


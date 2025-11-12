"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import type { ApexOptions } from "apexcharts";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface HeadcountTrendProps {
    currentHeadcount?: number;
    previousHeadcount?: number;
    monthlyData?: { month: string; headcount: number }[];
    growthNote?: string;
}

export function HeadcountTrend({
    currentHeadcount = 2432,
    previousHeadcount = 2350,
    monthlyData,
    growthNote = "Growth driven by new client onboarding in Cebu site.",
}: HeadcountTrendProps) {
    // Calculate percentage change
    const percentageChange = useMemo(() => {
        if (!previousHeadcount || previousHeadcount === 0) return 0;
        return ((currentHeadcount - previousHeadcount) / previousHeadcount) * 100;
    }, [currentHeadcount, previousHeadcount]);

    const isPositive = percentageChange >= 0;

    // Default sample data if not provided
    const chartData = useMemo(() => {
        if (monthlyData && monthlyData.length > 0) {
            return {
                categories: monthlyData.map((d) => d.month),
                series: monthlyData.map((d) => d.headcount),
            };
        }

        // Default sample data
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const currentMonth = new Date().getMonth();
        const recentMonths = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1);
        
        // Generate sample data with trend
        const baseValue = previousHeadcount;
        const sampleData = recentMonths.map((_, index) => {
            const growth = (percentageChange / recentMonths.length) * (index + 1);
            return Math.round(baseValue + (baseValue * growth) / 100);
        });

        return {
            categories: recentMonths,
            series: sampleData,
        };
    }, [monthlyData, previousHeadcount, percentageChange]);

    const chartOptions: ApexOptions = {
        chart: {
            type: "area",
            height: 300,
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
            width: 2,
            colors: ["#158039"],
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.3,
                stops: [0, 100],
                colorStops: [
                    {
                        offset: 0,
                        color: "#158039",
                        opacity: 0.7,
                    },
                    {
                        offset: 100,
                        color: "#158039",
                        opacity: 0.1,
                    },
                ],
            },
        },
        xaxis: {
            categories: chartData.categories,
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
        grid: {
            borderColor: "#e5e7eb",
            strokeDashArray: 4,
        },
        tooltip: {
            theme: "light",
            y: {
                formatter: (val: number) => `${val.toLocaleString()} Employees`,
            },
        },
        colors: ["#158039"],
    };

    const chartSeries = [
        {
            name: "Headcount",
            data: chartData.series,
        },
    ];

    return (
        <div className="bg-white border border-[#d9dede] rounded-2xl overflow-hidden">
            {/* Card Header */}
            <div className="px-4 py-3 border-b border-[#d9dede]">
                <div className="flex gap-1 items-center mb-1">
                    <BarChart3 className="w-5 h-5 text-[#738482]" />
                    <h2 className="text-base font-medium text-[#262b2b]">
                        Headcount Trend
                    </h2>
                </div>
                <p className="text-sm text-[#5d6c6b]">
                    Monitor workforce growth or reduction over time.
                </p>
            </div>

            {/* Card Body */}
            <div className="p-6">
                <div className="flex flex-col gap-6">
                    {/* Data Card */}
                    <div className="bg-white rounded-lg border border-[#d9dede] p-4">
                        <div className="flex flex-col gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-[#5d6c6b] mb-2">
                                    Total Headcount
                                </h3>
                                <div className="flex items-baseline gap-3 flex-wrap">
                                    <span className="text-3xl font-semibold text-[#262b2b]">
                                        {currentHeadcount.toLocaleString()} Employees
                                    </span>
                                    <div
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                                            isPositive
                                                ? "bg-green-50 text-green-700"
                                                : "bg-red-50 text-red-700"
                                        }`}
                                    >
                                        {isPositive ? (
                                            <TrendingUp className="h-4 w-4" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4" />
                                        )}
                                        <span className="text-sm font-medium">
                                            {isPositive ? "+" : ""}
                                            {percentageChange.toFixed(1)}% vs last month
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {growthNote && (
                                <p className="text-sm text-[#5d6c6b]">{growthNote}</p>
                            )}
                        </div>
                    </div>

                    {/* Chart Card */}
                    <div className="bg-white rounded-lg border border-[#d9dede] p-4">
                        <Chart
                            options={chartOptions}
                            series={chartSeries}
                            type="area"
                            height={300}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}


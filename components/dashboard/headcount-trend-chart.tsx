"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { BarChart3 } from "lucide-react";
import type { ApexOptions } from "apexcharts";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface HeadcountTrendChartProps {
    currentHeadcount?: number;
    previousHeadcount?: number;
    monthlyData?: { month: string; headcount: number }[];
    isLoading?: boolean;
}

export function HeadcountTrendChart({
    currentHeadcount = 2432,
    previousHeadcount = 2350,
    monthlyData,
    isLoading: externalIsLoading,
}: HeadcountTrendChartProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading state on mount
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const showLoading = externalIsLoading !== undefined ? externalIsLoading : isLoading;
    const percentageChange = useMemo(() => {
        if (!previousHeadcount || previousHeadcount === 0) return 0;
        return ((currentHeadcount - previousHeadcount) / previousHeadcount) * 100;
    }, [currentHeadcount, previousHeadcount]);

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
        const recentMonths = months.slice(
            Math.max(0, currentMonth - 5),
            currentMonth + 1
        );

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
        <div className="bg-white rounded-xl border border-[#d9dede] overflow-hidden">
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

            {/* Chart or Loading State */}
            <div className="p-4">
                {showLoading ? (
                    <div className="flex items-center justify-center h-[300px]">
                        <p className="text-sm text-[#5d6c6b]">Loading...</p>
                    </div>
                ) : (
                    <Chart
                        options={chartOptions}
                        series={chartSeries}
                        type="area"
                        height={300}
                    />
                )}
            </div>
        </div>
    );
}


"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { LineChart } from "lucide-react";
import type { ApexOptions } from "apexcharts";
import { getHeadcountTrendData } from "@/app/data/headcountData";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function HeadcountTrendAdvanced() {
    const [isLoading, setIsLoading] = useState(true);
    const [trendData, setTrendData] = useState<any>(null);

    useEffect(() => {
        // Simulate loading state on mount
        const timer = setTimeout(() => {
            const data = getHeadcountTrendData();
            setTrendData(data);
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const chartOptions: ApexOptions = useMemo(() => {
        if (!trendData) return {};

        return {
            chart: {
                type: "line",
                height: 400,
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                        selection: true,
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                        reset: true,
                    },
                },
                zoom: {
                    enabled: true,
                    type: "x",
                    autoScaleYaxis: true,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth",
                width: [3, 2, 2, 2],
                dashArray: [0, 0, 0, 5], // YoY line is dashed
                colors: ["#1356ba", "#158039", "#b61f27", "#738482"], // Blue, Green, Red, Gray
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
                            color: "#1356ba",
                            opacity: 0.7,
                        },
                        {
                            offset: 100,
                            color: "#1356ba",
                            opacity: 0.1,
                        },
                    ],
                },
            },
            markers: {
                size: [5, 4, 4, 4],
                hover: {
                    size: 7,
                },
            },
            xaxis: {
                categories: trendData.months,
                labels: {
                    style: {
                        colors: "#5d6c6b",
                        fontSize: "12px",
                    },
                },
            },
            yaxis: [
                {
                    title: {
                        text: "Employee Count",
                        style: {
                            color: "#5d6c6b",
                            fontSize: "12px",
                        },
                    },
                    labels: {
                        style: {
                            colors: "#5d6c6b",
                            fontSize: "12px",
                        },
                        formatter: (val: number) => val.toLocaleString(),
                    },
                },
            ],
            grid: {
                borderColor: "#e5e7eb",
                strokeDashArray: 4,
            },
            tooltip: {
                shared: true,
                intersect: false,
                theme: "light",
                y: {
                    formatter: (val: number, opts: any) => {
                        const seriesName = opts.w.globals.seriesNames[opts.seriesIndex];
                        if (seriesName === "YoY Comparison") {
                            return `${val.toLocaleString()} (Previous Year)`;
                        }
                        return `${val.toLocaleString()} Employees`;
                    },
                },
            },
            legend: {
                position: "top",
                horizontalAlign: "right",
                fontSize: "12px",
                labels: {
                    colors: "#5d6c6b",
                },
                markers: {
                    width: 12,
                    height: 12,
                },
            },
            colors: ["#1356ba", "#158039", "#b61f27", "#738482"],
            annotations: {
                yaxis: [
                    {
                        y: 2500,
                        borderColor: "#158039",
                        borderWidth: 2,
                        borderDashArray: 5,
                        label: {
                            text: "Growth Target",
                            style: {
                                color: "#158039",
                                fontSize: "11px",
                                fontWeight: 600,
                            },
                            position: "right",
                        },
                    },
                ],
            },
        };
    }, [trendData]);

    const chartSeries = useMemo(() => {
        if (!trendData) return [];

        return [
            {
                name: "Total Headcount",
                data: trendData.totalHeadcount,
                type: "line",
            },
            {
                name: "Hires",
                data: trendData.hires,
                type: "line",
            },
            {
                name: "Attritions",
                data: trendData.attritions,
                type: "line",
            },
            {
                name: "YoY Comparison",
                data: trendData.previousYear,
                type: "line",
            },
        ];
    }, [trendData]);

    return (
        <div className="bg-white rounded-xl border border-[#d9dede] overflow-hidden">
            {/* Card Header */}
            <div className="px-4 py-3 border-b border-[#d9dede]">
                <div className="flex gap-1 items-center mb-1">
                    <LineChart className="w-5 h-5 text-[#738482]" />
                    <h2 className="text-base font-medium text-[#262b2b]">
                        Headcount Trend & Growth
                    </h2>
                </div>
                <p className="text-sm text-[#5d6c6b]">
                    Historical headcount over time with hires, attritions, and
                    year-over-year comparison
                </p>
            </div>

            {/* Chart or Loading State */}
            <div className="p-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-[400px]">
                        <p className="text-sm text-[#5d6c6b]">Loading chart...</p>
                    </div>
                ) : trendData ? (
                    <Chart
                        options={chartOptions}
                        series={chartSeries}
                        type="line"
                        height={400}
                    />
                ) : (
                    <div className="flex items-center justify-center h-[400px]">
                        <p className="text-sm text-[#5d6c6b]">No data available</p>
                    </div>
                )}
            </div>
        </div>
    );
}

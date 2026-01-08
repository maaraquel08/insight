"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Grid3x3 } from "lucide-react";
import type { ApexOptions } from "apexcharts";
import { getAttritionHeatmapData } from "@/app/data/headcountData";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function AttritionHeatmap() {
    const [isLoading, setIsLoading] = useState(true);
    const [heatmapData, setHeatmapData] = useState<any>(null);

    useEffect(() => {
        // Simulate data loading
        const timer = setTimeout(() => {
            const data = getAttritionHeatmapData();
            setHeatmapData(data);
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const chartOptions: ApexOptions = useMemo(() => {
        if (!heatmapData) return {};

        return {
            chart: {
                type: "heatmap",
                height: 400,
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                    },
                },
            },
            dataLabels: {
                enabled: true,
                style: {
                    fontSize: "11px",
                    fontWeight: 600,
                },
            },
            colors: ["#fee2e2", "#fecaca", "#fca5a5", "#ef4444", "#dc2626", "#b91c1c"], // Light to dark red gradient
            xaxis: {
                categories: heatmapData.tenureBuckets,
                labels: {
                    style: {
                        colors: "#5d6c6b",
                        fontSize: "11px",
                    },
                },
            },
            yaxis: {
                labels: {
                    style: {
                        colors: "#5d6c6b",
                        fontSize: "11px",
                    },
                },
            },
            plotOptions: {
                heatmap: {
                    shadeIntensity: 0.5,
                    radius: 0,
                    useFillColorAsStroke: false,
                    colorScale: {
                        ranges: [
                            {
                                from: 0,
                                to: 2,
                                color: "#fee2e2", // Very light red
                                name: "Low Risk",
                            },
                            {
                                from: 2,
                                to: 5,
                                color: "#fca5a5", // Light red
                                name: "Moderate Risk",
                            },
                            {
                                from: 5,
                                to: 10,
                                color: "#ef4444", // Medium red
                                name: "High Risk",
                            },
                            {
                                from: 10,
                                to: 20,
                                color: "#dc2626", // Dark red
                                name: "Very High Risk",
                            },
                        ],
                    },
                },
            },
            tooltip: {
                theme: "light",
                y: {
                    formatter: (val: number) => `${val.toFixed(1)}% Attrition Rate`,
                },
            },
            title: {
                text: undefined,
            },
        };
    }, [heatmapData]);

    const chartSeries = useMemo(() => {
        if (!heatmapData) return [];

        return heatmapData.departments.map((dept: string, deptIndex: number) => {
            return {
                name: dept,
                data: heatmapData.tenureBuckets.map((tenure: string, tenureIndex: number) => ({
                    x: tenure,
                    y: heatmapData.rates[deptIndex][tenureIndex],
                })),
            };
        });
    }, [heatmapData]);

    // Find high-risk cells (attrition rate > 10%)
    const highRiskCells = useMemo(() => {
        if (!heatmapData) return [];
        const risks: Array<{ dept: string; tenure: string; rate: number }> = [];
        heatmapData.departments.forEach((dept: string, deptIndex: number) => {
            heatmapData.tenureBuckets.forEach((tenure: string, tenureIndex: number) => {
                const rate = heatmapData.rates[deptIndex][tenureIndex];
                if (rate > 10) {
                    risks.push({ dept, tenure, rate });
                }
            });
        });
        return risks;
    }, [heatmapData]);

    return (
        <div className="bg-white rounded-xl border border-[#d9dede] overflow-hidden">
            {/* Card Header */}
            <div className="px-4 py-3 border-b border-[#d9dede]">
                <div className="flex gap-1 items-center mb-1">
                    <Grid3x3 className="w-5 h-5 text-[#738482]" />
                    <h2 className="text-base font-medium text-[#262b2b]">
                        Attrition Heatmap
                    </h2>
                </div>
                <p className="text-sm text-[#5d6c6b]">
                    Attrition rates by department and tenure. Darker red indicates
                    higher risk.
                </p>
            </div>

            {/* Chart or Loading State */}
            <div className="p-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-[400px]">
                        <p className="text-sm text-[#5d6c6b]">Loading heatmap...</p>
                    </div>
                ) : heatmapData ? (
                    <>
                        <Chart
                            options={chartOptions}
                            series={chartSeries}
                            type="heatmap"
                            height={400}
                        />
                        {highRiskCells.length > 0 && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm font-medium text-red-800 mb-2">
                                    High-Risk Areas Detected:
                                </p>
                                <ul className="text-xs text-red-700 space-y-1">
                                    {highRiskCells.map((risk, index) => (
                                        <li key={index}>
                                            {risk.dept} - {risk.tenure}: {risk.rate.toFixed(1)}%
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-[400px]">
                        <p className="text-sm text-[#5d6c6b]">No data available</p>
                    </div>
                )}
            </div>
        </div>
    );
}

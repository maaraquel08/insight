"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Grid3x3 } from "lucide-react";
import { Sparkle, CaretRight } from "phosphor-react";
import type { ApexOptions } from "apexcharts";
import { getAttritionHeatmapData } from "@/app/data/headcountData";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

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
                    show: false,
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

            {/* High-Risk Areas Banner */}
            {!isLoading && heatmapData && highRiskCells.length > 0 && (
                <div className="border-b border-[#d9dede] border-solid relative shrink-0 w-full">
                    <div className="rotating-gradient-border w-full">
                        <div className="flex gap-2 items-center p-4 relative z-10">
                            <Sparkle
                                className="w-6 h-6 text-[#8139ee] shrink-0"
                                weight="fill"
                            />
                            <p className="flex-1 font-normal grow leading-5 min-w-0 relative shrink-0 text-[#262b2b] text-sm">
                                High-Risk Areas Detected: {highRiskCells.map((risk, index) => (
                                    <span key={index}>
                                        {risk.dept} - {risk.tenure}: {risk.rate.toFixed(1)}%
                                        {index < highRiskCells.length - 1 ? ", " : ""}
                                    </span>
                                ))}
                            </p>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button
                                        type="button"
                                        className="bg-white border border-[#b8c1c0] border-solid max-h-9 min-w-[48px] relative rounded-lg shrink-0 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <div className="box-border flex gap-2 items-center justify-center max-h-inherit min-w-inherit overflow-clip p-2 relative rounded-[inherit]">
                                            <div className="flex gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                                                <p className="flex flex-col font-medium justify-center leading-0 relative shrink-0 text-[#262b2b] text-sm text-nowrap tracking-normal">
                                                    <span className="leading-4 whitespace-pre">
                                                        Explore Insight
                                                    </span>
                                                </p>
                                            </div>
                                            <CaretRight
                                                className="w-3 h-3 text-[#262b2b] shrink-0"
                                                weight="fill"
                                            />
                                        </div>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[720px] max-h-[80vh] overflow-y-auto p-0">
                                    <DialogHeader className="p-4 border-b border-[#d9dede]">
                                        <DialogTitle>
                                            High-Risk Attrition Areas
                                        </DialogTitle>
                                        <DialogDescription>
                                            Detailed breakdown of departments and tenure buckets with elevated attrition rates
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-4 items-start p-4 relative shrink-0 w-full">
                                        <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
                                            <h3 className="text-base font-medium text-[#262b2b] leading-5">
                                                High-Risk Areas Detected
                                            </h3>
                                            <ul className="list-disc ml-6 text-base font-normal text-[#5d6c6b] leading-6 space-y-2">
                                                {highRiskCells.map((risk, index) => (
                                                    <li key={index}>
                                                        <strong>{risk.dept}</strong> - {risk.tenure}: <strong>{risk.rate.toFixed(1)}%</strong> attrition rate
                                                    </li>
                                                ))}
                                            </ul>
                                            <p className="text-base font-normal text-[#5d6c6b] leading-6 w-full">
                                                These areas show attrition rates above 10%, which may indicate retention challenges. Consider reviewing engagement strategies, compensation, and management practices for these specific department and tenure combinations.
                                            </p>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            )}

            {/* Chart or Loading State */}
            <div className="p-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-[400px]">
                        <p className="text-sm text-[#5d6c6b]">Loading heatmap...</p>
                    </div>
                ) : heatmapData ? (
                    <Chart
                        options={chartOptions}
                        series={chartSeries}
                        type="heatmap"
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

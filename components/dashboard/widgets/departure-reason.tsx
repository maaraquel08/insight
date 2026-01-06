"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { LogOut } from "lucide-react";
import type { ApexOptions } from "apexcharts";
// @ts-ignore - JavaScript file
import { getDepartureReasonData } from "@/app/data/attritionData";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface DepartureReasonData {
    voluntaryInvoluntary: {
        labels: string[];
        values: number[];
    };
    specificReasons: Array<{
        reason: string;
        type: string;
        category: string;
        count: number;
        percentage: number;
    }>;
    totalSeparations: number;
}

export function DepartureReason() {
    const [departureData, setDepartureData] =
        useState<DepartureReasonData | null>(null);

    useEffect(() => {
        const data = getDepartureReasonData() as DepartureReasonData;
        setDepartureData(data);
    }, []);

    // Donut chart options for Voluntary vs Involuntary
    const voluntaryInvoluntaryChartOptions: ApexOptions = useMemo(
        () => ({
            chart: {
                type: "donut",
                toolbar: {
                    show: false,
                },
            },
            labels: departureData?.voluntaryInvoluntary.labels || [],
            colors: ["#158039", "#ef4444"], // Green for Voluntary, Red for Involuntary
            legend: {
                position: "bottom",
                fontSize: "12px",
                labels: {
                    colors: "#5d6c6b",
                },
            },
            dataLabels: {
                enabled: true,
                formatter: (val: number) => {
                    return `${val.toFixed(1)}%`;
                },
            },
            tooltip: {
                theme: "light",
                y: {
                    formatter: (value: number) => {
                        return `${value.toFixed(1)}%`;
                    },
                },
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: "70%",
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                label: "Total",
                                formatter: () => {
                                    return `${departureData?.totalSeparations || 0}`;
                                },
                            },
                        },
                    },
                },
            },
        }),
        [departureData]
    );

    const voluntaryInvoluntaryChartSeries = useMemo(
        () => departureData?.voluntaryInvoluntary.values || [],
        [departureData]
    );

    // Get color for each reason based on type and order
    const getReasonColor = useMemo(() => {
        if (!departureData) return () => "#5d6c6b";

        const resignedReasons = departureData.specificReasons.filter(
            (r) => r.type === "Resigned"
        );
        const terminatedReasons = departureData.specificReasons.filter(
            (r) => r.type === "Terminated"
        );

        // Shades of blue: dark to light for Resigned
        const blueShades = ["#1e40af", "#3b82f6", "#60a5fa", "#93c5fd"];
        // Shades of red: dark to light for Terminated
        const redShades = ["#dc2626", "#ef4444", "#f87171"];

        return (reason: string, type: string) => {
            if (type === "Resigned") {
                const index = resignedReasons.findIndex(
                    (r) => r.reason === reason
                );
                return blueShades[index % blueShades.length];
            } else if (type === "Terminated") {
                const index = terminatedReasons.findIndex(
                    (r) => r.reason === reason
                );
                return redShades[index % redShades.length];
            } else if (type === "AWOL") {
                return "#fca5a5"; // Light red/pink for AWOL
            }
            return "#5d6c6b"; // Default gray
        };
    }, [departureData]);

    if (!departureData) {
        return (
            <div className="w-full bg-white border border-[#d9dede] rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#d9dede]">
                    <div className="flex gap-1 items-center mb-1">
                        <LogOut className="w-5 h-5 text-[#738482]" />
                        <h2 className="text-base font-medium text-[#262b2b]">
                            Departure Reason
                        </h2>
                    </div>
                    <p className="text-sm text-[#5d6c6b]">
                        Analyze voluntary vs involuntary departures and specific
                        reasons
                    </p>
                </div>
                <div className="p-4">
                    <div className="flex items-center justify-center h-64">
                        <p className="text-sm text-[#5d6c6b]">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white border border-[#d9dede] rounded-xl overflow-hidden">
            {/* Card Header */}
            <div className="px-4 py-3 border-b border-[#d9dede]">
                <div className="flex gap-1 items-center mb-1">
                    <LogOut className="w-5 h-5 text-[#738482]" />
                    <h2 className="text-base font-medium text-[#262b2b]">
                        Departure Reason
                    </h2>
                </div>
                <p className="text-sm text-[#5d6c6b]">
                    Analyze voluntary vs involuntary departures and specific
                    reasons
                </p>
            </div>

            {/* Card Body */}
            <div className="p-4">
                {/* Voluntary vs Involuntary Donut Chart */}
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-[#262b2b] mb-3">
                        Voluntary vs Involuntary
                    </h3>
                    <Chart
                        type="donut"
                        options={voluntaryInvoluntaryChartOptions}
                        series={voluntaryInvoluntaryChartSeries}
                        height={250}
                    />
                </div>

                {/* Specific Reasons List */}
                <div>
                    <h3 className="text-sm font-medium text-[#262b2b] mb-3">
                        Specific Reasons
                    </h3>
                    <div className="flex flex-col gap-3">
                        {departureData.specificReasons.map((reason, index) => {
                            const color = getReasonColor(
                                reason.reason,
                                reason.type
                            );

                            return (
                                <div
                                    key={`${reason.reason}-${reason.type}`}
                                    className="flex items-center gap-3"
                                >
                                    {/* Colored Circle Icon */}
                                    <div
                                        className="w-3 h-3 rounded-full shrink-0"
                                        style={{ backgroundColor: color }}
                                    />
                                    {/* Reason Label */}
                                    <div className="flex-1 flex items-center gap-2">
                                        <span className="text-sm text-[#262b2b]">
                                            {reason.type} - {reason.reason}
                                        </span>
                                    </div>
                                    {/* Count */}
                                    <span className="text-sm text-[#262b2b] font-medium">
                                        {reason.count}
                                    </span>
                                    {/* Percentage */}
                                    <span className="text-sm text-[#5d6c6b] min-w-[50px] text-right">
                                        {reason.percentage.toFixed(1)}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}


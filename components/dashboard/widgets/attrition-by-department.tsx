"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Building2 } from "lucide-react";
import type { ApexOptions } from "apexcharts";
// @ts-ignore - JavaScript file
import { getDepartmentAttritionData } from "@/app/data/attritionData";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface DepartmentAttritionData {
    categories: string[];
    values: number[];
}

export function AttritionByDepartment() {
    const [departmentData, setDepartmentData] =
        useState<DepartmentAttritionData | null>(null);

    useEffect(() => {
        const data = getDepartmentAttritionData() as DepartmentAttritionData;
        setDepartmentData(data);
    }, []);

    // Bar chart options
    const chartOptions: ApexOptions = useMemo(
        () => ({
            chart: {
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: true,
                formatter: (val: number) => {
                    return `${val.toFixed(1)}%`;
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 4,
                },
            },
            xaxis: {
                categories: departmentData?.categories || [],
                labels: {
                    style: {
                        colors: "#5d6c6b",
                        fontSize: "12px",
                    },
                    rotate: -45,
                    rotateAlways: false,
                },
            },
            yaxis: {
                labels: {
                    style: {
                        colors: "#5d6c6b",
                        fontSize: "12px",
                    },
                    formatter: (value: number) => {
                        return `${value.toFixed(1)}%`;
                    },
                },
            },
            grid: {
                borderColor: "#e5e7eb",
                strokeDashArray: 4,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                yaxis: {
                    lines: {
                        show: true,
                    },
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
            colors: ["#ef4444"],
        }),
        [departmentData]
    );

    const chartSeries = useMemo(
        () => [
            {
                name: "Attrition Rate",
                data: departmentData?.values || [],
            },
        ],
        [departmentData]
    );

    if (!departmentData) {
        return (
            <div className="w-full bg-white border border-[#d9dede] rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#d9dede]">
                    <div className="flex gap-1 items-center mb-1">
                        <Building2 className="w-5 h-5 text-[#738482]" />
                        <h2 className="text-base font-medium text-[#262b2b]">
                            Attrition by Department
                        </h2>
                    </div>
                    <p className="text-sm text-[#5d6c6b]">
                        Analyze attrition rates across different departments
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
                    <Building2 className="w-5 h-5 text-[#738482]" />
                    <h2 className="text-base font-medium text-[#262b2b]">
                        Attrition by Department
                    </h2>
                </div>
                <p className="text-sm text-[#5d6c6b]">
                    Analyze attrition rates across different departments
                </p>
            </div>

            {/* Card Body */}
            <div className="p-4">
                {/* Chart Display */}
                <div className="w-full">
                    <Chart
                        type="bar"
                        options={chartOptions}
                        series={chartSeries}
                        height={300}
                    />
                </div>
            </div>
        </div>
    );
}

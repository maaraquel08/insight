"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Users } from "lucide-react";
import type { ApexOptions } from "apexcharts";
// @ts-ignore - JavaScript file
import { getTenureDemographicsData } from "@/app/data/peopleHealthData";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface TenureDemographicsData {
    averageTenure: number;
    tenureChange: string;
    tenureChangeType: "positive" | "negative";
    tenureChangeSymbol: string;
    tenureDescription: string;
    tenureDistribution: {
        categories: string[];
        values: number[];
    };
    demographics: {
        age: {
            categories: string[];
            values: number[];
        };
        gender: {
            categories: string[];
            values: number[];
        };
        department: {
            categories: string[];
            values: number[];
        };
        location: {
            categories: string[];
            values: number[];
        };
    };
    description: string;
}

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type ViewType = "tenure" | "age" | "gender" | "department" | "location";

const distributionOptions = [
    { label: "Tenure Distribution", value: "tenure" },
    { label: "Age Distribution", value: "age" },
    { label: "Gender Distribution", value: "gender" },
    { label: "Department Distribution", value: "department" },
    { label: "Location Distribution", value: "location" },
];

export function TenureDemographics() {
    const [selectedView, setSelectedView] = useState<ViewType>("tenure");
    const [demographicsData, setDemographicsData] =
        useState<TenureDemographicsData | null>(null);

    useEffect(() => {
        setDemographicsData(
            getTenureDemographicsData() as TenureDemographicsData
        );
    }, []);

    // Base bar chart options
    const baseBarChartOptions: Partial<ApexOptions> = useMemo(
        () => ({
            chart: {
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: true,
                formatter: (val: number) => {
                    return val.toLocaleString();
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 4,
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
                        return `${value.toLocaleString()} employees`;
                    },
                },
            },
        }),
        []
    );

    // Tenure Distribution Chart
    const tenureChartOptions: ApexOptions = useMemo(
        () => ({
            ...baseBarChartOptions,
            colors: ["#8139ee"],
            xaxis: {
                categories:
                    demographicsData?.tenureDistribution.categories || [],
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
                    formatter: (value: number) => {
                        return value.toLocaleString();
                    },
                },
            },
        }),
        [demographicsData, baseBarChartOptions]
    );

    const tenureChartSeries = useMemo(
        () => [
            {
                name: "Employees",
                data: demographicsData?.tenureDistribution.values || [],
            },
        ],
        [demographicsData]
    );

    // Age Distribution Chart
    const ageChartOptions: ApexOptions = useMemo(
        () => ({
            ...baseBarChartOptions,
            colors: ["#17ad49"],
            xaxis: {
                categories: demographicsData?.demographics.age.categories || [],
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
        }),
        [demographicsData, baseBarChartOptions]
    );

    const ageChartSeries = useMemo(
        () => [
            {
                name: "Employees",
                data: demographicsData?.demographics.age.values || [],
            },
        ],
        [demographicsData]
    );

    // Gender Distribution Chart (Donut)
    const genderChartOptions: ApexOptions = useMemo(
        () => ({
            chart: {
                type: "donut",
                toolbar: {
                    show: false,
                },
            },
            labels: demographicsData?.demographics.gender.categories || [],
            colors: ["#8139ee", "#aa8bfa", "#f59e0b"],
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
                        return `${value.toLocaleString()} employees`;
                    },
                },
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: "70%",
                    },
                },
            },
        }),
        [demographicsData]
    );

    const genderChartSeries = useMemo(
        () => demographicsData?.demographics.gender.values || [],
        [demographicsData]
    );

    // Department Distribution Chart
    const departmentChartOptions: ApexOptions = useMemo(
        () => ({
            ...baseBarChartOptions,
            colors: ["#06b6d4"],
            xaxis: {
                categories:
                    demographicsData?.demographics.department.categories || [],
                labels: {
                    style: {
                        colors: "#5d6c6b",
                        fontSize: "10px",
                    },
                    rotate: -45,
                    rotateAlways: false,
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
        }),
        [demographicsData, baseBarChartOptions]
    );

    const departmentChartSeries = useMemo(
        () => [
            {
                name: "Employees",
                data: demographicsData?.demographics.department.values || [],
            },
        ],
        [demographicsData]
    );

    // Location Distribution Chart
    const locationChartOptions: ApexOptions = useMemo(
        () => ({
            ...baseBarChartOptions,
            colors: ["#f59e0b"],
            xaxis: {
                categories:
                    demographicsData?.demographics.location.categories || [],
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
        }),
        [demographicsData, baseBarChartOptions]
    );

    const locationChartSeries = useMemo(
        () => [
            {
                name: "Employees",
                data: demographicsData?.demographics.location.values || [],
            },
        ],
        [demographicsData]
    );

    if (!demographicsData) {
        return (
            <div className="w-full bg-white border border-[#d9dede] rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#d9dede]">
                    <div className="flex gap-1 items-center mb-1">
                        <Users className="w-5 h-5 text-[#738482]" />
                        <h2 className="text-base font-medium text-[#262b2b]">
                            Tenure & Demographics
                        </h2>
                    </div>
                    <p className="text-sm text-[#5d6c6b]">
                        Understand workforce maturity, diversity, and balance
                        across tenure and demographics
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

    // Get current chart config based on selected view
    const getChartConfig = () => {
        switch (selectedView) {
            case "tenure":
                return {
                    type: "bar" as const,
                    options: tenureChartOptions,
                    series: tenureChartSeries,
                };
            case "age":
                return {
                    type: "bar" as const,
                    options: ageChartOptions,
                    series: ageChartSeries,
                };
            case "gender":
                return {
                    type: "donut" as const,
                    options: genderChartOptions,
                    series: genderChartSeries,
                };
            case "department":
                return {
                    type: "bar" as const,
                    options: departmentChartOptions,
                    series: departmentChartSeries,
                };
            case "location":
                return {
                    type: "bar" as const,
                    options: locationChartOptions,
                    series: locationChartSeries,
                };
            default:
                return {
                    type: "bar" as const,
                    options: tenureChartOptions,
                    series: tenureChartSeries,
                };
        }
    };

    const chartConfig = getChartConfig();
    const chartTitle =
        distributionOptions.find((opt) => opt.value === selectedView)?.label ||
        "Distribution";

    return (
        <div className="w-full bg-white border border-[#d9dede] rounded-xl overflow-hidden">
            {/* Card Header */}
            <div className="px-4 py-3 border-b border-[#d9dede]">
                <div className="flex gap-1 items-center mb-1">
                    <Users className="w-5 h-5 text-[#738482]" />
                    <h2 className="text-base font-medium text-[#262b2b]">
                        Tenure & Demographics
                    </h2>
                </div>
                <p className="text-sm text-[#5d6c6b]">
                    Understand workforce maturity, diversity, and balance across
                    tenure and demographics
                </p>
            </div>

            {/* Card Body */}
            <div className="p-6">
                {/* Dropdown Selector */}
                <div className="mb-6">
                    <Select
                        value={selectedView}
                        onValueChange={(value) =>
                            setSelectedView(value as ViewType)
                        }
                    >
                        <SelectTrigger
                            id="demographic-select"
                            className="w-full"
                        >
                            <SelectValue placeholder="Select a distribution view" />
                        </SelectTrigger>
                        <SelectContent>
                            {distributionOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Dynamic Chart Display */}
                <div className="mb-6 w-full">
                    <Chart
                        type={chartConfig.type}
                        options={chartConfig.options}
                        series={chartConfig.series}
                        height={300}
                    />
                </div>

                {/* Description */}
                <div className="mt-4">
                    <p className="text-sm text-[#5d6c6b]">
                        {demographicsData.description}
                    </p>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Users } from "lucide-react";
import type { ApexOptions } from "apexcharts";
import { getTenureDemographicsData } from "@/app/data/attritionData";
import { useAttritionFilters } from "@/contexts/attrition-filter-context";
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
        civilStatus: {
            categories: string[];
            values: number[];
        };
        location: {
            categories: string[];
            values: number[];
        };
    };
    attritionRates: {
        tenure: {
            categories: string[];
            values: number[];
        };
        age: {
            categories: string[];
            values: number[];
        };
        gender: {
            categories: string[];
            values: number[];
        };
        civilStatus: {
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

type ViewType = "tenure" | "age" | "gender" | "civilStatus" | "location";

const distributionOptions = [
    { label: "Attrition by Tenure", value: "tenure" },
    { label: "Attrition by Age", value: "age" },
    { label: "Attrition by Gender", value: "gender" },
    { label: "Attrition by Civil Status", value: "civilStatus" },
    { label: "Attrition by Location", value: "location" },
];

export function TenureDemographics() {
    const { filters } = useAttritionFilters();
    const [selectedView, setSelectedView] = useState<ViewType>("tenure");
    const [demographicsData, setDemographicsData] =
        useState<TenureDemographicsData | null>(null);

    useEffect(() => {
        setDemographicsData(
            getTenureDemographicsData(filters) as TenureDemographicsData
        );
    }, [filters]);

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
                    return `${val.toFixed(1)}%`;
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
                        return `${value.toFixed(1)}%`;
                    },
                },
            },
        }),
        []
    );

    // Tenure Attrition Chart
    const tenureChartOptions: ApexOptions = useMemo(
        () => ({
            ...baseBarChartOptions,
            colors: ["#8139ee"],
            xaxis: {
                categories:
                    demographicsData?.attritionRates.tenure.categories || [],
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
                        return `${value.toFixed(1)}%`;
                    },
                },
            },
        }),
        [demographicsData, baseBarChartOptions]
    );

    const tenureChartSeries = useMemo(
        () => [
            {
                name: "Attrition Rate",
                data: demographicsData?.attritionRates.tenure.values || [],
            },
        ],
        [demographicsData]
    );

    // Age Attrition Chart
    const ageChartOptions: ApexOptions = useMemo(
        () => ({
            ...baseBarChartOptions,
            colors: ["#17ad49"],
            xaxis: {
                categories: demographicsData?.attritionRates.age.categories || [],
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
                    formatter: (value: number) => {
                        return `${value.toFixed(1)}%`;
                    },
                },
            },
        }),
        [demographicsData, baseBarChartOptions]
    );

    const ageChartSeries = useMemo(
        () => [
            {
                name: "Attrition Rate",
                data: demographicsData?.attritionRates.age.values || [],
            },
        ],
        [demographicsData]
    );

    // Gender Attrition Chart (Bar chart instead of donut for consistency)
    const genderChartOptions: ApexOptions = useMemo(
        () => ({
            ...baseBarChartOptions,
            colors: ["#8139ee"],
            xaxis: {
                categories: demographicsData?.attritionRates.gender.categories || [],
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
                        return `${value.toFixed(1)}%`;
                    },
                },
            },
        }),
        [demographicsData, baseBarChartOptions]
    );

    const genderChartSeries = useMemo(
        () => [
            {
                name: "Attrition Rate",
                data: demographicsData?.attritionRates.gender.values || [],
            },
        ],
        [demographicsData]
    );

    // Civil Status Attrition Chart
    const civilStatusChartOptions: ApexOptions = useMemo(
        () => ({
            ...baseBarChartOptions,
            colors: ["#06b6d4"],
            xaxis: {
                categories:
                    demographicsData?.attritionRates.civilStatus.categories || [],
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
                        return `${value.toFixed(1)}%`;
                    },
                },
            },
        }),
        [demographicsData, baseBarChartOptions]
    );

    const civilStatusChartSeries = useMemo(
        () => [
            {
                name: "Attrition Rate",
                data: demographicsData?.attritionRates.civilStatus.values || [],
            },
        ],
        [demographicsData]
    );

    // Location Attrition Chart
    const locationChartOptions: ApexOptions = useMemo(
        () => ({
            ...baseBarChartOptions,
            colors: ["#f59e0b"],
            xaxis: {
                categories:
                    demographicsData?.attritionRates.location.categories || [],
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
                    formatter: (value: number) => {
                        return `${value.toFixed(1)}%`;
                    },
                },
            },
        }),
        [demographicsData, baseBarChartOptions]
    );

    const locationChartSeries = useMemo(
        () => [
            {
                name: "Attrition Rate",
                data: demographicsData?.attritionRates.location.values || [],
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
                    type: "bar" as const,
                    options: genderChartOptions,
                    series: genderChartSeries,
                };
            case "civilStatus":
                return {
                    type: "bar" as const,
                    options: civilStatusChartOptions,
                    series: civilStatusChartSeries,
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
                        Attrition by Demographics
                    </h2>
                </div>
                <p className="text-sm text-[#5d6c6b]">
                    Analyze attrition rates across different demographic categories
                    and tenure segments
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

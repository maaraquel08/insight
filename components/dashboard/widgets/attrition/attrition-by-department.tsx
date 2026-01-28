"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Building2 } from "lucide-react";
import type { ApexOptions } from "apexcharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    getDepartmentAttritionData,
    getDepartmentAttritionWithJobRoles,
    getDepartmentVoluntaryInvoluntary,
} from "@/app/data/attritionData";
import { useAttritionFilters } from "@/contexts/attrition-filter-context";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface DepartmentAttritionData {
    categories: string[];
    values: number[];
}

interface JobRoleData {
    department: string;
    role1: number;
    role2: number;
    role3: number;
    separations: number;
    rate: number;
    roleLabels: Record<string, string>;
}

interface VoluntaryInvoluntaryData {
    department: string;
    voluntary: number;
    involuntary: number;
    voluntaryCount: number;
    involuntaryCount: number;
    totalSeparations: number;
    rate: number;
}

export function AttritionByDepartment() {
    const { filters } = useAttritionFilters();
    const [departmentData, setDepartmentData] =
        useState<DepartmentAttritionData | null>(null);
    const [jobRoleData, setJobRoleData] = useState<JobRoleData[]>([]);
    const [voluntaryInvoluntaryData, setVoluntaryInvoluntaryData] = useState<
        VoluntaryInvoluntaryData[]
    >([]);

    useEffect(() => {
        const defaultData = getDepartmentAttritionData(filters) as DepartmentAttritionData;
        setDepartmentData(defaultData);

        const jobRoles = getDepartmentAttritionWithJobRoles(filters) as JobRoleData[];
        setJobRoleData(jobRoles);

        const volInvData =
            getDepartmentVoluntaryInvoluntary(filters) as VoluntaryInvoluntaryData[];
        setVoluntaryInvoluntaryData(volInvData);
    }, [filters]);

    // Calculate dynamic chart height based on number of categories
    const calculateChartHeight = (categories: string[]) => {
        const baseHeight = 200;
        const categoryHeight = 40;
        const minHeight = 250;
        const maxHeight = 500;
        const calculatedHeight = baseHeight + (categories.length * categoryHeight);
        return Math.max(minHeight, Math.min(maxHeight, calculatedHeight));
    };

    // Prepare data for default chart
    const defaultChartData = useMemo(() => {
        if (!departmentData || jobRoleData.length === 0) return { series: [], categories: [] };
        const separations = departmentData.categories.map((dept) => {
            const jobRoleEntry = jobRoleData.find((j) => j.department === dept);
            return jobRoleEntry?.separations || 0;
        });
        return {
            series: [
                {
                    name: "Attrition Rate",
                    data: departmentData.values,
                },
            ],
            categories: departmentData.categories,
            separations,
        };
    }, [departmentData, jobRoleData]);

    // Prepare data for job roles stacked chart
    const jobRoleChartData = useMemo(() => {
        if (jobRoleData.length === 0) return { series: [], categories: [] };
        return {
            series: [
                {
                    name: "Management",
                    data: jobRoleData.map((d) => d.role1),
                },
                {
                    name: "Specialist",
                    data: jobRoleData.map((d) => d.role2),
                },
                {
                    name: "Analyst",
                    data: jobRoleData.map((d) => d.role3),
                },
            ],
            categories: jobRoleData.map((d) => d.department),
            roleLabels: jobRoleData.map((d) => d.roleLabels),
        };
    }, [jobRoleData]);

    // Prepare data for voluntary/involuntary chart
    const voluntaryInvoluntaryChartData = useMemo(() => {
        if (voluntaryInvoluntaryData.length === 0)
            return { series: [], categories: [], data: [] };
        return {
            series: [
                {
                    name: "Voluntary",
                    data: voluntaryInvoluntaryData.map((d) => d.voluntary),
                },
                {
                    name: "Involuntary",
                    data: voluntaryInvoluntaryData.map((d) => d.involuntary),
                },
            ],
            categories: voluntaryInvoluntaryData.map((d) => d.department),
            data: voluntaryInvoluntaryData,
        };
    }, [voluntaryInvoluntaryData]);

    // Default chart options
    const defaultChartOptions: ApexOptions = useMemo(
        () => ({
            chart: {
                toolbar: { show: false },
                type: "bar",
            },
            dataLabels: {
                enabled: true,
                formatter: (val: number) => `${val.toFixed(1)}%`,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 4,
                },
            },
            xaxis: {
                categories: defaultChartData.categories,
                labels: {
                    style: { colors: "#5d6c6b", fontSize: "12px" },
                    rotate: -45,
                    rotateAlways: false,
                },
            },
            yaxis: {
                labels: {
                    style: { colors: "#5d6c6b", fontSize: "12px" },
                    formatter: (value: number) => `${value.toFixed(1)}%`,
                },
            },
            grid: {
                borderColor: "#e5e7eb",
                strokeDashArray: 4,
                xaxis: { lines: { show: false } },
                yaxis: { lines: { show: true } },
            },
            tooltip: {
                theme: "light",
                custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                    const dept = defaultChartData.categories[dataPointIndex];
                    const rate = series[seriesIndex][dataPointIndex];
                    const separations = defaultChartData.separations?.[dataPointIndex] || 0;
                    return `
                        <div class="bg-white px-2 py-1.5 text-xs shadow-md rounded">
                            <div class="font-medium text-gray-900">${dept}</div>
                            <div class="flex items-center gap-2 mt-1">
                                <span class="text-gray-500">${rate.toFixed(1)}%</span>
                                <span class="text-gray-400">•</span>
                                <span class="text-gray-500">${separations} separations</span>
                            </div>
                        </div>
                    `;
                },
            },
            colors: ["#ff3333"],
        }),
        [defaultChartData]
    );

    // Job roles stacked chart options
    const jobRoleChartOptions: ApexOptions = useMemo(
        () => ({
            chart: {
                toolbar: { show: false },
                type: "bar",
                stacked: true,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 4,
                },
            },
            xaxis: {
                categories: jobRoleChartData.categories,
                labels: {
                    style: { colors: "#5d6c6b", fontSize: "12px" },
                    rotate: -45,
                    rotateAlways: false,
                },
            },
            yaxis: {
                labels: {
                    style: { colors: "#5d6c6b", fontSize: "12px" },
                },
            },
            grid: {
                borderColor: "#e5e7eb",
                strokeDashArray: 4,
                xaxis: { lines: { show: false } },
                yaxis: { lines: { show: true } },
            },
            tooltip: {
                theme: "light",
                custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                    const roleLabels = jobRoleChartData.roleLabels?.[dataPointIndex] || {};
                    const deptData = jobRoleData[dataPointIndex];
                    
                    const roleKeys = ["role1", "role2", "role3"];
                    
                    // Only show the hovered role
                    const hoveredSeries = series[seriesIndex];
                    const separations = hoveredSeries[dataPointIndex];
                    const roleKey = roleKeys[seriesIndex];
                    const roleLabel = roleLabels[roleKey] || `Role ${seriesIndex + 1}`;
                    
                    return `
                        <div class="bg-white px-2 py-1.5 text-xs shadow-md rounded">
                            <div class="font-medium text-gray-900 mb-2">${roleLabel}</div>
                            <div class="space-y-1">
                                <div class="flex items-center justify-between gap-4">
                                    <span class="text-gray-500">Attrition Rate</span>
                                    <span class="font-medium text-gray-900">${deptData.rate.toFixed(1)}%</span>
                                </div>
                                <div class="flex items-center justify-between gap-4">
                                    <span class="text-gray-500">Separation</span>
                                    <span class="font-medium text-gray-900">${separations}</span>
                                </div>
                            </div>
                        </div>
                    `;
                },
            },
            colors: ["#ff6b35", "#17c9ad", "#3399ff"],
            legend: {
                show: false,
            },
        }),
        [jobRoleChartData, jobRoleData]
    );

    // Voluntary/involuntary chart options
    const voluntaryInvoluntaryChartOptions: ApexOptions = useMemo(
        () => ({
            chart: {
                toolbar: { show: false },
                type: "bar",
            },
            dataLabels: {
                enabled: true,
                formatter: (val: number) => `${val.toFixed(1)}%`,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 4,
                },
            },
            xaxis: {
                categories: voluntaryInvoluntaryChartData.categories,
                labels: {
                    style: { colors: "#5d6c6b", fontSize: "12px" },
                    rotate: -45,
                    rotateAlways: false,
                },
            },
            yaxis: {
                labels: {
                    style: { colors: "#5d6c6b", fontSize: "12px" },
                    formatter: (value: number) => `${value.toFixed(1)}%`,
                },
            },
            grid: {
                borderColor: "#e5e7eb",
                strokeDashArray: 4,
                xaxis: { lines: { show: false } },
                yaxis: { lines: { show: true } },
            },
            tooltip: {
                theme: "light",
                custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                    const data = voluntaryInvoluntaryChartData.data?.[dataPointIndex];
                    if (!data) return "";
                    
                    // Only show the hovered series
                    const hoveredSeries = series[seriesIndex];
                    const rate = hoveredSeries[dataPointIndex];
                    const name = seriesIndex === 0 ? "Voluntary" : "Involuntary";
                    const separations = seriesIndex === 0 ? data.voluntaryCount : data.involuntaryCount;
                    
                    return `
                        <div class="bg-white px-2 py-1.5 text-xs shadow-md rounded">
                            <div class="font-medium text-gray-900 mb-2">${name}</div>
                            <div class="space-y-1">
                                <div class="flex items-center justify-between gap-4">
                                    <span class="text-gray-500">Attrition Rate</span>
                                    <span class="font-medium text-gray-900">${rate.toFixed(1)}%</span>
                                </div>
                                <div class="flex items-center justify-between gap-4">
                                    <span class="text-gray-500">Separation</span>
                                    <span class="font-medium text-gray-900">${separations}</span>
                                </div>
                            </div>
                        </div>
                    `;
                },
            },
            colors: ["#17ad49", "#ff3333"],
            legend: {
                show: true,
                position: "bottom",
                labels: {
                    colors: "#5d6c6b",
                },
            },
        }),
        [voluntaryInvoluntaryChartData]
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
                <Tabs defaultValue="default" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-gray-100 p-1">
                        <TabsTrigger 
                            value="default"
                            className="rounded-xl font-normal data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-none text-gray-600"
                        >
                            Default
                        </TabsTrigger>
                        <TabsTrigger 
                            value="job-roles"
                            className="rounded-xl font-normal data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-none text-gray-600"
                        >
                            Job Roles
                        </TabsTrigger>
                        <TabsTrigger 
                            value="voluntary-involuntary"
                            className="rounded-xl font-normal data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-none text-gray-600"
                        >
                            Voluntary vs Involuntary
                        </TabsTrigger>
                    </TabsList>

                    {/* Default Tab */}
                    <TabsContent value="default" className="mt-4">
                        <Chart
                            type="bar"
                            options={defaultChartOptions}
                            series={defaultChartData.series}
                            height={calculateChartHeight(defaultChartData.categories)}
                        />
                    </TabsContent>

                    {/* Job Roles Tab */}
                    <TabsContent value="job-roles" className="mt-4">
                        <Chart
                            type="bar"
                            options={jobRoleChartOptions}
                            series={jobRoleChartData.series}
                            height={calculateChartHeight(jobRoleChartData.categories)}
                        />
                    </TabsContent>

                    {/* Voluntary vs Involuntary Tab */}
                    <TabsContent value="voluntary-involuntary" className="mt-4">
                        <Chart
                            type="bar"
                            options={voluntaryInvoluntaryChartOptions}
                            series={voluntaryInvoluntaryChartData.series}
                            height={calculateChartHeight(voluntaryInvoluntaryChartData.categories)}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

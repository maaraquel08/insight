"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { BarChart3 } from "lucide-react";
import type { ApexOptions } from "apexcharts";
import { getDepartmentalData } from "@/app/data/headcountData";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function DepartmentalDistributionChart() {
    const [isLoading, setIsLoading] = useState(true);
    const [departmentData, setDepartmentData] = useState<any>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
        null
    );
    const [sortBy, setSortBy] = useState<"size" | "growth">("size");

    useEffect(() => {
        // Simulate data loading
        const timer = setTimeout(() => {
            const data = getDepartmentalData();
            setDepartmentData(data);
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const sortedDepartments = useMemo(() => {
        if (!departmentData) return [];

        const sorted = [...departmentData.departments];
        if (sortBy === "size") {
            sorted.sort((a, b) => b.current - a.current);
        } else {
            sorted.sort((a, b) => b.growthRate - a.growthRate);
        }
        return sorted;
    }, [departmentData, sortBy]);

    const chartOptions: ApexOptions = useMemo(() => {
        if (!departmentData) return {};

        const categories = sortedDepartments.map((d) => d.name);
        const regularData = sortedDepartments.map((d) => d.byStatus.regular);
        const contractualData = sortedDepartments.map(
            (d) => d.byStatus.contractual
        );
        const partTimeData = sortedDepartments.map((d) => d.byStatus.partTime);

        return {
            chart: {
                type: "bar",
                height: 400,
                stacked: true,
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                        selection: false,
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                        reset: false,
                    },
                },
                events: {
                    dataPointSelection: (event: any, chartContext: any, config: any) => {
                        const departmentIndex = config.dataPointIndex;
                        const department = sortedDepartments[departmentIndex];
                        if (department) {
                            setSelectedDepartment(department.name);
                        }
                    },
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: "60%",
                    borderRadius: 4,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
                colors: ["#fff"],
            },
            xaxis: {
                categories: categories,
                labels: {
                    style: {
                        colors: "#5d6c6b",
                        fontSize: "11px",
                    },
                    rotate: -45,
                    rotateAlways: false,
                },
            },
            yaxis: {
                title: {
                    text: "Headcount",
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
            fill: {
                opacity: 1,
                colors: ["#1356ba", "#158039", "#738482"], // Blue, Green, Gray
            },
            legend: {
                position: "top",
                horizontalAlign: "right",
                fontSize: "12px",
                labels: {
                    colors: "#5d6c6b",
                },
            },
            tooltip: {
                shared: true,
                intersect: false,
                theme: "light",
                y: {
                    formatter: (val: number) => `${val.toLocaleString()} Employees`,
                },
            },
            colors: ["#1356ba", "#158039", "#738482"],
        };
    }, [departmentData, sortedDepartments]);

    const chartSeries = useMemo(() => {
        if (!departmentData) return [];

        return [
            {
                name: "Regular",
                data: sortedDepartments.map((d) => d.byStatus.regular),
            },
            {
                name: "Contractual",
                data: sortedDepartments.map((d) => d.byStatus.contractual),
            },
            {
                name: "Part-time",
                data: sortedDepartments.map((d) => d.byStatus.partTime),
            },
        ];
    }, [departmentData, sortedDepartments]);

    const selectedDeptDetails = useMemo(() => {
        if (!selectedDepartment || !departmentData) return null;
        return departmentData.departments.find(
            (d: any) => d.name === selectedDepartment
        );
    }, [selectedDepartment, departmentData]);

    return (
        <>
            <div className="bg-white rounded-xl border border-[#d9dede] overflow-hidden">
                {/* Card Header */}
                <div className="px-4 py-3 border-b border-[#d9dede]">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex gap-1 items-center mb-1">
                            <BarChart3 className="w-5 h-5 text-[#738482]" />
                            <h2 className="text-base font-medium text-[#262b2b]">
                                Departmental Distribution
                            </h2>
                        </div>
                        <div className="flex gap-2 items-center">
                            <button
                                onClick={() => setSortBy("size")}
                                className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                                    sortBy === "size"
                                        ? "bg-[#158039] text-white border-[#158039]"
                                        : "bg-white text-[#5d6c6b] border-[#d9dede] hover:bg-gray-50"
                                }`}
                            >
                                Sort by Size
                            </button>
                            <button
                                onClick={() => setSortBy("growth")}
                                className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                                    sortBy === "growth"
                                        ? "bg-[#158039] text-white border-[#158039]"
                                        : "bg-white text-[#5d6c6b] border-[#d9dede] hover:bg-gray-50"
                                }`}
                            >
                                Sort by Growth
                            </button>
                        </div>
                    </div>
                    <p className="text-sm text-[#5d6c6b] mt-2">
                        Headcount per department segmented by employment status.
                        Click a bar to see details.
                    </p>
                </div>

                {/* Chart or Loading State */}
                <div className="p-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-[400px]">
                            <p className="text-sm text-[#5d6c6b]">Loading chart...</p>
                        </div>
                    ) : departmentData ? (
                        <Chart
                            options={chartOptions}
                            series={chartSeries}
                            type="bar"
                            height={400}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-[400px]">
                            <p className="text-sm text-[#5d6c6b]">No data available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Drill-down Dialog */}
            <Dialog
                open={selectedDepartment !== null}
                onOpenChange={(open) => !open && setSelectedDepartment(null)}
            >
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedDepartment} - Detailed Metrics
                        </DialogTitle>
                        <DialogDescription>
                            Hiring velocity and employment status breakdown
                        </DialogDescription>
                    </DialogHeader>
                    {selectedDeptDetails && (
                        <div className="flex flex-col gap-4 mt-4">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-[#5d6c6b] mb-1">
                                        Current Headcount
                                    </p>
                                    <p className="text-2xl font-semibold text-[#262b2b]">
                                        {selectedDeptDetails.current}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-[#5d6c6b] mb-1">
                                        Growth Rate
                                    </p>
                                    <p className="text-2xl font-semibold text-[#262b2b]">
                                        {selectedDeptDetails.growthRate > 0 ? "+" : ""}
                                        {selectedDeptDetails.growthRate}%
                                    </p>
                                </div>
                            </div>

                            {/* Employment Status Breakdown */}
                            <div>
                                <h3 className="text-sm font-medium text-[#262b2b] mb-2">
                                    Employment Status Breakdown
                                </h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">
                                                Count
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Percentage
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Regular</TableCell>
                                            <TableCell className="text-right">
                                                {
                                                    selectedDeptDetails.byStatus
                                                        .regular
                                                }
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {(
                                                    (selectedDeptDetails.byStatus
                                                        .regular /
                                                        selectedDeptDetails.current) *
                                                    100
                                                ).toFixed(1)}
                                                %
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Contractual</TableCell>
                                            <TableCell className="text-right">
                                                {
                                                    selectedDeptDetails.byStatus
                                                        .contractual
                                                }
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {(
                                                    (selectedDeptDetails.byStatus
                                                        .contractual /
                                                        selectedDeptDetails.current) *
                                                    100
                                                ).toFixed(1)}
                                                %
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Part-time</TableCell>
                                            <TableCell className="text-right">
                                                {
                                                    selectedDeptDetails.byStatus
                                                        .partTime
                                                }
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {(
                                                    (selectedDeptDetails.byStatus
                                                        .partTime /
                                                        selectedDeptDetails.current) *
                                                    100
                                                ).toFixed(1)}
                                                %
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Hiring Velocity */}
                            <div>
                                <h3 className="text-sm font-medium text-[#262b2b] mb-2">
                                    Hiring Velocity
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-[#5d6c6b] mb-1">
                                        Average Hires per Month
                                    </p>
                                    <p className="text-xl font-semibold text-[#262b2b]">
                                        {selectedDeptDetails.hiringVelocity}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

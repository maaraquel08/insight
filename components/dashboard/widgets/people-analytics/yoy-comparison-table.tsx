"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Table as TableIcon, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { ApexOptions } from "apexcharts";
import { getYoYComparisonData } from "@/app/data/headcountData";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

// Dynamically import ApexCharts for sparklines
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type SortColumn = "department" | "headcount" | "yoyChange" | "growthRate" | null;
type SortDirection = "asc" | "desc";

interface SparklineCellProps {
    data: number[];
}

function SparklineCell({ data }: SparklineCellProps) {
    const sparklineOptions: ApexOptions = useMemo(
        () => ({
            chart: {
                type: "line",
                sparkline: {
                    enabled: true,
                },
                toolbar: {
                    show: false,
                },
            },
            stroke: {
                curve: "smooth",
                width: 2,
                colors: ["#158039"],
            },
            fill: {
                type: "solid",
            },
            tooltip: {
                enabled: false,
            },
            grid: {
                show: false,
            },
            xaxis: {
                labels: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
            },
            yaxis: {
                labels: {
                    show: false,
                },
            },
        }),
        []
    );

    return (
        <div className="w-24 h-8">
            <Chart
                options={sparklineOptions}
                series={[
                    {
                        name: "Trend",
                        data: data,
                    },
                ]}
                type="line"
                height={32}
            />
        </div>
    );
}

export function YoYComparisonTable() {
    const [isLoading, setIsLoading] = useState(true);
    const [comparisonData, setComparisonData] = useState<any>(null);
    const [sortColumn, setSortColumn] = useState<SortColumn>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Simulate data loading
        const timer = setTimeout(() => {
            const data = getYoYComparisonData();
            setComparisonData(data);
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const handleSort = (column: SortColumn) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const sortedAndFilteredData = useMemo(() => {
        if (!comparisonData) return [];

        let filtered = comparisonData.departments.filter((dept: any) =>
            dept.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (!sortColumn) return filtered;

        filtered = [...filtered].sort((a: any, b: any) => {
            let aValue: any;
            let bValue: any;

            switch (sortColumn) {
                case "department":
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case "headcount":
                    aValue = a.currentHeadcount;
                    bValue = b.currentHeadcount;
                    break;
                case "yoyChange":
                    aValue = a.yoyChange;
                    bValue = b.yoyChange;
                    break;
                case "growthRate":
                    aValue = a.growthRate;
                    bValue = b.growthRate;
                    break;
                default:
                    return 0;
            }

            if (typeof aValue === "string") {
                return sortDirection === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        });

        return filtered;
    }, [comparisonData, sortColumn, sortDirection, searchQuery]);

    const SortIcon = ({ column }: { column: SortColumn }) => {
        if (sortColumn !== column) {
            return <ArrowUpDown className="w-4 h-4 text-[#5d6c6b]" />;
        }
        return sortDirection === "asc" ? (
            <ArrowUp className="w-4 h-4 text-[#158039]" />
        ) : (
            <ArrowDown className="w-4 h-4 text-[#158039]" />
        );
    };

    const getCellColor = (value: number, type: "yoyChange" | "growthRate") => {
        if (type === "yoyChange") {
            if (value > 5) return "bg-green-50 text-green-700";
            if (value < -5) return "bg-red-50 text-red-700";
            return "";
        }
        if (type === "growthRate") {
            if (value > 4) return "bg-green-50 text-green-700";
            if (value < 2) return "bg-red-50 text-red-700";
            return "";
        }
        return "";
    };

    return (
        <div className="bg-white rounded-xl border border-[#d9dede] overflow-hidden">
            {/* Card Header */}
            <div className="px-4 py-3 border-b border-[#d9dede]">
                <div className="flex gap-1 items-center mb-1">
                    <TableIcon className="w-5 h-5 text-[#738482]" />
                    <h2 className="text-base font-medium text-[#262b2b]">
                        Year-over-Year Comparison
                    </h2>
                </div>
                <p className="text-sm text-[#5d6c6b]">
                    Departmental headcount comparison with trend analysis
                </p>
            </div>

            {/* Table */}
            <div className="p-4 overflow-x-auto">
                {/* Search Input */}
                <div className="mb-4">
                    <Input
                        placeholder="Search departments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                    />
                </div>
                {isLoading ? (
                    <div className="flex items-center justify-center h-[400px]">
                        <p className="text-sm text-[#5d6c6b]">Loading table...</p>
                    </div>
                ) : comparisonData ? (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-[#d9dede]">
                                <TableHead
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort("department")}
                                >
                                    <div className="flex items-center gap-2">
                                        Department
                                        <SortIcon column="department" />
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="text-right cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort("headcount")}
                                >
                                    <div className="flex items-center justify-end gap-2">
                                        Current Headcount
                                        <SortIcon column="headcount" />
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="text-right cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort("yoyChange")}
                                >
                                    <div className="flex items-center justify-end gap-2">
                                        YoY Change (%)
                                        <SortIcon column="yoyChange" />
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="text-right cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort("growthRate")}
                                >
                                    <div className="flex items-center justify-end gap-2">
                                        Growth Rate
                                        <SortIcon column="growthRate" />
                                    </div>
                                </TableHead>
                                <TableHead className="text-center">
                                    Trend Sparkline
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedAndFilteredData.map((dept: any) => (
                                <TableRow key={dept.name} className="border-[#d9dede]">
                                    <TableCell className="font-medium">
                                        {dept.name}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {dept.currentHeadcount.toLocaleString()}
                                    </TableCell>
                                    <TableCell
                                        className={`text-right font-medium ${getCellColor(
                                            dept.yoyChange,
                                            "yoyChange"
                                        )}`}
                                    >
                                        {dept.yoyChange > 0 ? "+" : ""}
                                        {dept.yoyChange.toFixed(1)}%
                                    </TableCell>
                                    <TableCell
                                        className={`text-right font-medium ${getCellColor(
                                            dept.growthRate,
                                            "growthRate"
                                        )}`}
                                    >
                                        {dept.growthRate.toFixed(1)}%
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <SparklineCell data={dept.trend} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {/* Totals Row */}
                            {comparisonData.totals && (
                                <TableRow className="bg-gray-50 font-semibold border-[#d9dede]">
                                    <TableCell>Total</TableCell>
                                    <TableCell className="text-right">
                                        {comparisonData.totals.currentHeadcount.toLocaleString()}
                                    </TableCell>
                                    <TableCell
                                        className={`text-right ${getCellColor(
                                            comparisonData.totals.yoyChange,
                                            "yoyChange"
                                        )}`}
                                    >
                                        {comparisonData.totals.yoyChange > 0 ? "+" : ""}
                                        {comparisonData.totals.yoyChange.toFixed(1)}%
                                    </TableCell>
                                    <TableCell
                                        className={`text-right ${getCellColor(
                                            comparisonData.totals.growthRate,
                                            "growthRate"
                                        )}`}
                                    >
                                        {comparisonData.totals.growthRate.toFixed(1)}%
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="flex items-center justify-center h-[400px]">
                        <p className="text-sm text-[#5d6c6b]">No data available</p>
                    </div>
                )}
            </div>
        </div>
    );
}

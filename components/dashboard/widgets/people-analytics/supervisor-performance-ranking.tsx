"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Award, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { getSupervisorPerformanceRankingData } from "@/app/data/attritionData";
import { useAttritionFilters } from "@/contexts/attrition-filter-context";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface SupervisorPerformanceData {
    rank: number;
    supervisor: string;
    department: string;
    attritionRate: number;
    separations: number;
    totalEmployees: number;
    riskLevel: "high" | "moderate" | "low";
}

function Avatar({ name }: { name: string }) {
    // Generate a consistent hash from the name to get the same photo for each person
    const getHash = (str: string): number => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    };

    // Use the hash to get a consistent photo index
    // Using randomuser.me which provides real person photos
    const photoIndex = useMemo(() => {
        return getHash(name) % 99; // randomuser.me has photos indexed 0-98
    }, [name]);

    // Determine gender based on hash for variety (alternate between men and women)
    const gender = useMemo(() => {
        return getHash(name) % 2 === 0 ? 'men' : 'women';
    }, [name]);

    // Use randomuser.me API for real person photos
    const avatarUrl = useMemo(() => {
        return `https://randomuser.me/api/portraits/${gender}/${photoIndex}.jpg`;
    }, [gender, photoIndex]);

    return (
        <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center">
            <Image
                src={avatarUrl}
                alt={name}
                width={32}
                height={32}
                className="rounded-full shrink-0 object-cover"
                unoptimized
            />
        </div>
    );
}

function RiskLevelBadge({
    riskLevel,
}: {
    riskLevel: "high" | "moderate" | "low";
}) {
    const styles = {
        high: {
            bg: "bg-[#fee2e3]",
            border: "border-[#971d23]",
            text: "text-[#971d23]",
            label: "HIGH RISK",
        },
        moderate: {
            bg: "bg-[#fff4d3]",
            border: "border-[#a1470b]",
            text: "text-[#a1470b]",
            label: "MODERATE",
        },
        low: {
            bg: "bg-[#dcfce6]",
            border: "border-[#166531]",
            text: "text-[#166531]",
            label: "Low risk",
        },
    };

    const style = styles[riskLevel];

    return (
        <div
            className={`${style.bg} ${style.border} ${style.text} rounded-[6px] px-1 py-1 inline-flex items-center justify-center`}
        >
            <span
                className={`${style.text} text-xs font-medium ${
                    riskLevel === "low" ? "" : "uppercase"
                } tracking-[0.7px]`}
            >
                {style.label}
            </span>
        </div>
    );
}

type SortColumn =
    | "rank"
    | "supervisor"
    | "department"
    | "attritionRate"
    | "separations"
    | "riskLevel"
    | null;
type SortDirection = "asc" | "desc" | null;

export function SupervisorPerformanceRanking() {
    const { filters } = useAttritionFilters();
    const [data, setData] = useState<SupervisorPerformanceData[]>([]);
    const [sortColumn, setSortColumn] = useState<SortColumn>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);
    const [hoveredColumn, setHoveredColumn] = useState<SortColumn>(null);

    useEffect(() => {
        const rankingData =
            getSupervisorPerformanceRankingData(filters) as SupervisorPerformanceData[];
        setData(rankingData);
    }, [filters]);

    const handleSort = (column: SortColumn) => {
        if (sortColumn !== column) {
            setSortColumn(column);
            setSortDirection("asc");
        } else {
            // Cycle through: asc -> desc -> null
            if (sortDirection === "asc") {
                setSortDirection("desc");
            } else if (sortDirection === "desc") {
                setSortColumn(null);
                setSortDirection(null);
            }
        }
    };

    const sortedData = useMemo(() => {
        if (!sortColumn || !sortDirection) {
            return data;
        }

        const sorted = [...data].sort((a, b) => {
            let aValue: string | number;
            let bValue: string | number;

            switch (sortColumn) {
                case "rank":
                    aValue = a.rank;
                    bValue = b.rank;
                    break;
                case "supervisor":
                    aValue = a.supervisor.toLowerCase();
                    bValue = b.supervisor.toLowerCase();
                    break;
                case "department":
                    aValue = a.department.toLowerCase();
                    bValue = b.department.toLowerCase();
                    break;
                case "attritionRate":
                    aValue = a.attritionRate;
                    bValue = b.attritionRate;
                    break;
                case "separations":
                    aValue = a.separations;
                    bValue = b.separations;
                    break;
                case "riskLevel":
                    // Risk level order: high > moderate > low
                    const riskOrder = { high: 3, moderate: 2, low: 1 };
                    aValue = riskOrder[a.riskLevel];
                    bValue = riskOrder[b.riskLevel];
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) {
                return sortDirection === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortDirection === "asc" ? 1 : -1;
            }
            return 0;
        });

        return sorted;
    }, [data, sortColumn, sortDirection]);

    const getSortIcon = (column: SortColumn) => {
        const iconSize = "w-4 h-4";
        const isActive = sortColumn === column;
        const isHovered = hoveredColumn === column;

        // Determine opacity: 1 if active or hovered, 0 otherwise
        const opacity = isActive || isHovered ? "opacity-100" : "opacity-0";

        if (isActive) {
            // Active state: always show, green color
            if (sortDirection === "asc") {
                return (
                    <ArrowUp
                        className={`${iconSize} text-[#158039] shrink-0 transition-opacity ${opacity}`}
                    />
                );
            }
            if (sortDirection === "desc") {
                return (
                    <ArrowDown
                        className={`${iconSize} text-[#158039] shrink-0 transition-opacity ${opacity}`}
                    />
                );
            }
        }

        // Default icon: show on hover, gray color
        return (
            <ArrowUpDown
                className={`${iconSize} text-[#5d6c6b] shrink-0 transition-opacity ${opacity}`}
            />
        );
    };

    if (data.length === 0) {
        return (
            <div className="w-full bg-white rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#d9dede]">
                    <div className="flex gap-1 items-center mb-1">
                        <Award className="w-5 h-5 text-[#738482]" />
                        <h2 className="text-base font-medium text-[#262b2b]">
                            Supervisor Performance Rankings
                        </h2>
                    </div>
                    <p className="text-sm text-[#5d6c6b]">
                        Refer anyone and claim the bounties.
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

    return (
        <div className="w-full bg-white border border-[#d9dede] rounded-xl overflow-hidden">
            {/* Card Header */}
            <div className="px-4 py-3 border-b border-[#d9dede]">
                <div className="flex gap-1 items-center mb-1">
                    <Award className="w-5 h-5 text-[#738482]" />
                    <h2 className="text-base font-medium text-[#262b2b]">
                        Supervisor Performance Rankings
                    </h2>
                </div>
                <p className="text-sm text-[#5d6c6b]">
                    Refer anyone and claim the bounties.
                </p>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow className="border-b border-[#d9dede] hover:bg-transparent">
                            <TableHead
                                className="bg-[#f7f8f8] border-b border-[#d9dede] h-9 min-h-[36px] px-3 py-3 w-[44px] whitespace-nowrap cursor-pointer hover:bg-[#e5e7eb] transition-colors"
                                onClick={() => handleSort("rank")}
                                onMouseEnter={() => setHoveredColumn("rank")}
                                onMouseLeave={() => setHoveredColumn(null)}
                            >
                                <div className="flex items-center justify-end gap-1">
                                    <span className="text-xs font-medium text-[#262b2b] uppercase tracking-[0.7px]">
                                        #
                                    </span>
                                    {getSortIcon("rank")}
                                </div>
                            </TableHead>
                            <TableHead
                                className="bg-[#f7f8f8] border-b border-[#d9dede] h-9 min-h-[36px] px-3 py-3 whitespace-nowrap cursor-pointer hover:bg-[#e5e7eb] transition-colors"
                                onClick={() => handleSort("supervisor")}
                                onMouseEnter={() =>
                                    setHoveredColumn("supervisor")
                                }
                                onMouseLeave={() => setHoveredColumn(null)}
                            >
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-medium text-[#262b2b] uppercase tracking-[0.7px]">
                                        Supervisor
                                    </span>
                                    {getSortIcon("supervisor")}
                                </div>
                            </TableHead>
                            <TableHead
                                className="bg-[#f7f8f8] border-b border-[#d9dede] h-9 min-h-[36px] px-3 py-3 whitespace-nowrap cursor-pointer hover:bg-[#e5e7eb] transition-colors"
                                onClick={() => handleSort("department")}
                                onMouseEnter={() =>
                                    setHoveredColumn("department")
                                }
                                onMouseLeave={() => setHoveredColumn(null)}
                            >
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-medium text-[#262b2b] uppercase tracking-[0.7px]">
                                        Department
                                    </span>
                                    {getSortIcon("department")}
                                </div>
                            </TableHead>
                            <TableHead
                                className="bg-[#f7f8f8] border-b border-[#d9dede] h-9 min-h-[36px] px-3 py-3 whitespace-nowrap cursor-pointer hover:bg-[#e5e7eb] transition-colors"
                                onClick={() => handleSort("attritionRate")}
                                onMouseEnter={() =>
                                    setHoveredColumn("attritionRate")
                                }
                                onMouseLeave={() => setHoveredColumn(null)}
                            >
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-medium text-[#262b2b] uppercase tracking-[0.7px]">
                                        Attrition Rate
                                    </span>
                                    {getSortIcon("attritionRate")}
                                </div>
                            </TableHead>
                            <TableHead
                                className="bg-[#f7f8f8] border-b border-[#d9dede] h-9 min-h-[36px] px-3 py-3 whitespace-nowrap cursor-pointer hover:bg-[#e5e7eb] transition-colors"
                                onClick={() => handleSort("separations")}
                                onMouseEnter={() =>
                                    setHoveredColumn("separations")
                                }
                                onMouseLeave={() => setHoveredColumn(null)}
                            >
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-medium text-[#262b2b] uppercase tracking-[0.7px]">
                                        Separations
                                    </span>
                                    {getSortIcon("separations")}
                                </div>
                            </TableHead>
                            <TableHead
                                className="bg-[#f7f8f8] border-b border-[#d9dede] h-9 min-h-[36px] px-3 py-3 whitespace-nowrap cursor-pointer hover:bg-[#e5e7eb] transition-colors"
                                onClick={() => handleSort("riskLevel")}
                                onMouseEnter={() =>
                                    setHoveredColumn("riskLevel")
                                }
                                onMouseLeave={() => setHoveredColumn(null)}
                            >
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-medium text-[#262b2b] uppercase tracking-[0.7px]">
                                        Risk Level
                                    </span>
                                    {getSortIcon("riskLevel")}
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.map((supervisor) => (
                            <TableRow
                                key={supervisor.rank}
                                className="border-b border-[#d9dede] hover:bg-transparent"
                            >
                                <TableCell className="px-3 py-3 w-[44px]">
                                    <div className="flex items-center justify-end">
                                        <span className="text-sm text-[#262b2b]">
                                            #{supervisor.rank}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-3 py-3">
                                    <div className="flex gap-2 items-center">
                                        <Avatar name={supervisor.supervisor} />
                                        <span className="text-sm font-medium text-[#262b2b]">
                                            {supervisor.supervisor}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-3 py-3">
                                    <span className="text-sm text-[#262b2b]">
                                        {supervisor.department}
                                    </span>
                                </TableCell>
                                <TableCell className="px-3 py-3">
                                    <span
                                        className="text-sm text-[#262b2b]"
                                        style={{
                                            fontFamily:
                                                "var(--font-roboto-mono)",
                                        }}
                                    >
                                        {supervisor.attritionRate.toFixed(2)}%
                                    </span>
                                </TableCell>
                                <TableCell className="px-3 py-3">
                                    <span
                                        className="text-sm text-[#262b2b]"
                                        style={{
                                            fontFamily:
                                                "var(--font-roboto-mono)",
                                        }}
                                    >
                                        {supervisor.separations}/
                                        {supervisor.totalEmployees}
                                    </span>
                                </TableCell>
                                <TableCell className="px-3 py-3">
                                    <RiskLevelBadge
                                        riskLevel={supervisor.riskLevel}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

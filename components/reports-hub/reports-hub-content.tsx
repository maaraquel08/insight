"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportCard, ReportCardProps } from "./report-card";
import { getReportIcon, iconRegistry } from "@/lib/report-icons";

// Ensure icons are included in the bundle by referencing the registry
// This prevents tree-shaking in production builds
void iconRegistry;

export interface CategoryTab {
    id: string;
    label: string;
}

export interface ReportsHubContentProps {
    categories: CategoryTab[];
    reports: ReportCardProps[];
    defaultCategory?: string;
}

export function ReportsHubContent({
    categories,
    reports,
    defaultCategory,
}: ReportsHubContentProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(
        defaultCategory || categories[0]?.id || ""
    );

    // Calculate counts for each category based on reports
    const categoryCounts = categories.reduce((acc, category) => {
        acc[category.id] = reports.filter(
            (report) => report.category === category.id
        ).length;
        return acc;
    }, {} as Record<string, number>);

    // Filter reports based on search and category
    const filteredReports = reports.filter((report) => {
        const matchesSearch =
            report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "" || report.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Search Input */}
            <div className="w-full">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Search Report"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9 w-full px-3 py-1.5 pr-10 border border-[#d9dede] rounded-lg bg-white text-sm placeholder:text-[#b8c1c0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#158039] focus-visible:ring-offset-2"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4b686e] pointer-events-none" />
                </div>
            </div>

            {/* Category Tabs */}
            <div className="border-b border-[#d9dede] w-full">
                <Tabs
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                    className="w-full"
                >
                    <TabsList className="inline-flex h-auto items-center justify-start gap-0 border-b border-[#d9dede] bg-transparent p-0 rounded-none w-full">
                        {categories.map((category) => {
                            const count = categoryCounts[category.id] || 0;
                            return (
                                <TabsTrigger
                                    key={category.id}
                                    value={category.id}
                                    className="inline-flex items-center justify-center gap-2 min-w-[64px] px-4 py-4 rounded-none border-b-2 border-transparent bg-transparent text-sm font-normal text-[#262b2b] uppercase tracking-[0.7px] data-[state=active]:border-[#158039] data-[state=active]:text-[#262b2b] data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-[#262b2b] focus-visible:outline-none focus-visible:ring-0 cursor-pointer"
                                >
                                    <span className="leading-[14px]">
                                        {category.label}
                                    </span>
                                    {count > 0 && (
                                        <span className="flex items-center justify-center min-w-[16px] px-1 py-0.5 bg-[#da2f38] text-white text-xs font-medium leading-[12px] tracking-[0.7px] uppercase rounded-full">
                                            {count}
                                        </span>
                                    )}
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                </Tabs>
            </div>

            {/* Reports Grid */}
            <div className="flex flex-wrap gap-4 w-full">
                {filteredReports.length > 0 ? (
                    filteredReports.map((report) => {
                        const Icon = getReportIcon(report.title);
                        return (
                            <ReportCard
                                key={report.title}
                                {...report}
                                icon={Icon}
                                onClick={() => {
                                    if (report.slug) {
                                        router.push(`/reports-hub/${report.slug}`);
                                    }
                                }}
                            />
                        );
                    })
                ) : (
                    <div className="w-full py-12 text-center">
                        <p className="text-sm text-[#5d6c6b]">
                            No reports found matching your search.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

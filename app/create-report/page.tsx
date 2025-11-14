"use client";

import { PageHeader } from "@/components/page-header";
import { FilterBar } from "@/components/filter-bar";
import { ReportSidebar } from "@/components/report-sidebar";
import { ReportTable } from "@/components/report-table";
import { ColumnProvider } from "@/contexts/column-context";
import { FilterProvider } from "@/contexts/filter-context";
import { SortProvider } from "@/contexts/sort-context";
import { ComputedValuesProvider } from "@/contexts/computed-values-context";

export default function CreateReportPage() {
    return (
        <ColumnProvider>
            <FilterProvider>
                <SortProvider>
                    <ComputedValuesProvider>
                    <main className="bg-[#f1f2f3] h-screen flex flex-col overflow-hidden">
                        <div className="flex flex-col gap-4 p-10 flex-1 min-h-0">
                            <div className="flex flex-col gap-4 items-start max-w-[1320px] w-full mx-auto h-full">
                                <PageHeader
                                    title="Create Report"
                                    description="Build and customize your report"
                                />

                                <div className="flex flex-col w-full flex-1 min-h-0 bg-white rounded-2xl border border-[#d9dede] overflow-hidden">
                                    {/* Filter Bar */}
                                    <div className="w-full shrink-0 overflow-hidden">
                                        <FilterBar />
                                    </div>

                                    {/* Main Content Area */}
                                    <div className="flex w-full flex-1 min-h-0">
                                        {/* Sidebar */}
                                        <div className="w-80 shrink-0 flex flex-col">
                                            <ReportSidebar />
                                        </div>

                                        {/* Table Area */}
                                        <ReportTable />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                    </ComputedValuesProvider>
                </SortProvider>
            </FilterProvider>
        </ColumnProvider>
    );
}

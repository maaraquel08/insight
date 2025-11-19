"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface CompanyHealthCardProps {
    score?: number;
    change?: string;
    description?: string;
}

export function CompanyHealthCard({ score = 82 }: CompanyHealthCardProps) {
    // Donut chart data - matching Figma design
    const chartOptions: ApexOptions = {
        chart: {
            type: "donut",
            height: 240,
            animations: {
                enabled: true,
                speed: 800,
            },
        },
        labels: [
            "Retention",
            "Engagement",
            "Wellbeing",
            "Learning",
            "Performance",
        ],
        colors: ["#158039", "#8139ee", "#f59e0b", "#3b82f6", "#ef4444"],
        dataLabels: {
            enabled: true,
        },
        legend: {
            show: false,
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "65%",
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#5d6c6b",
                            formatter: () => "Company Health",
                        },
                        value: {
                            show: true,
                            fontSize: "28px",
                            fontWeight: 600,
                            color: "#262b2b",
                            formatter: () => score.toString(),
                        },
                        total: {
                            show: false,
                        },
                    },
                },
                expandOnClick: false,
            },
        },
        stroke: {
            show: false,
        },
        tooltip: {
            enabled: true,
            fillSeriesColor: true,
            theme: "light",
            style: {
                fontSize: "14px",
            },
            y: {
                formatter: (val: number) => `${val}%`,
            },
        },
        states: {
            hover: {
                filter: {
                    type: "darken",
                },
            },
        },
    };

    // Sample data matching Figma: Retention (20), Engagement (30), Wellbeing (20), Learning (10), Performance (20)
    const chartSeries = [20, 30, 20, 10, 20];

    const legendItems = [
        { label: "Retention", color: "#158039" },
        { label: "Engagement", color: "#8139ee" },
        { label: "Wellbeing", color: "#f59e0b" },
        { label: "Learning", color: "#3b82f6" },
        { label: "Performance", color: "#ef4444" },
    ];

    return (
        <div className="w-full">
            {/* Chart and Legend */}
            <div className="flex flex-col sm:flex-row gap-8 items-center justify-center py-4">
                {/* Donut Chart */}
                <div className="shrink-0 flex items-center justify-center">
                    <Chart
                        type="donut"
                        options={chartOptions}
                        series={chartSeries}
                        height={240}
                        width={240}
                    />
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-2 min-w-[140px]">
                    {legendItems.map((item) => (
                        <div
                            key={item.label}
                            className="flex gap-2 items-center"
                        >
                            <div
                                className="w-4 h-4 rounded-sm shrink-0"
                                style={{ backgroundColor: item.color }}
                            />
                            <p className="text-sm text-[#262b2b] font-normal leading-5">
                                {item.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

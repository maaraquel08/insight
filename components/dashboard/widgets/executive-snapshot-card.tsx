"use client";

import { ReactNode } from "react";
import { CaretUp, CaretDown, Sparkle } from "phosphor-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface ExecutiveSnapshotCardProps {
    icon: ReactNode;
    title: string;
    value: string;
    change: string;
    changeType?: "positive" | "negative";
    description: string;
    onAskSidekick?: () => void;
}

export function ExecutiveSnapshotCard({
    icon,
    title,
    value,
    change,
    changeType = "positive",
    description,
    onAskSidekick,
}: ExecutiveSnapshotCardProps) {
    // Extract percentage from change text (e.g., "3.1% vs last period" -> "3.1%")
    const extractPercentage = (text: string): string => {
        const match = text.match(/([\d.]+%)/);
        return match ? match[1] : "";
    };

    const percentage = extractPercentage(change);
    const handleAskSidekick = () => {
        if (onAskSidekick) {
            onAskSidekick();
        }
    };

    // Generate simple computation explanations
    const getMetricComputation = () => {
        const titleLower = title.toLowerCase();
        const hasPoints = change.includes("pts") || change.includes("points");

        let metricExplanation = "";
        let changeExplanation = "";

        if (titleLower.includes("headcount")) {
            metricExplanation = "Total number of active employees on payroll.";
            changeExplanation = "Current headcount minus last period's headcount, divided by last period's headcount, times 100.";
        } else if (titleLower.includes("attrition")) {
            metricExplanation = "Percentage of employees who left. Employees who left divided by total employees, times 100.";
            if (hasPoints) {
                changeExplanation = "Current rate minus last period's rate. Shows the difference in percentage points.";
            } else {
                changeExplanation = "Current rate minus last period's rate, divided by last period's rate, times 100.";
            }
        } else if (titleLower.includes("payroll")) {
            metricExplanation = "Total cost of all employee payments: salaries, benefits, and bonuses.";
            changeExplanation = "Current payroll minus last period's payroll, divided by last period's payroll, times 100.";
        } else if (titleLower.includes("overtime")) {
            metricExplanation = "Overtime costs divided by total payroll costs, times 100.";
            if (hasPoints) {
                changeExplanation = "Current overtime percentage minus last period's percentage. Shows the change in points.";
            } else {
                changeExplanation = "Current overtime percentage minus last period's percentage, divided by last period's percentage, times 100.";
            }
        } else {
            // Generic fallback
            metricExplanation = `Current value of ${titleLower}.`;
            if (hasPoints) {
                changeExplanation = "Current value minus last period's value. Shows the change in percentage points.";
            } else {
                changeExplanation = "Current value minus last period's value, divided by last period's value, times 100.";
            }
        }

        return { metricExplanation, changeExplanation };
    };

    const { metricExplanation, changeExplanation } = getMetricComputation();

    return (
        <div
            className="flex flex-col items-start overflow-hidden relative rounded-xl w-full h-auto"
            style={{
                backgroundImage:
                    "linear-gradient(-58.45deg, rgba(245, 243, 255, 1) 2.45%, rgba(238, 233, 254, 1) 30.19%, rgba(240, 253, 244, 1) 79.1%), linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)",
            }}
        >
            {/* Body Section */}
            <div className="bg-white border border-[#d9dede] border-solid relative rounded-xl shrink-0 w-full">
                <div className="flex flex-col gap-4 p-4">
                    {/* Title */}
                    <div className="flex gap-1 items-center w-full">
                        <p className="text-base text-[#738482] font-normal leading-6 flex-1">
                            {title}
                        </p>
                        <div className="w-6 h-6 shrink-0">{icon}</div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col gap-2">
                        <p className="text-[28px] font-medium text-[#262b2b] leading-9 tracking-[-0.7px]">
                            {value}
                        </p>
                        {/* Change Badge with vs last period text */}
                        <div className="flex gap-1 items-center">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className={`inline-flex items-center justify-center gap-0.5 px-1 py-1 rounded-md border border-solid cursor-help ${
                                            changeType === "positive"
                                                ? "bg-[#dcfce6] border-[#158039]"
                                                : "bg-[#fee2e2] border-[#b61f27]"
                                        }`}
                                    >
                                        {changeType === "positive" ? (
                                            <CaretUp
                                                weight="fill"
                                                className="w-3 h-3 text-[#158039] shrink-0"
                                            />
                                        ) : (
                                            <CaretDown
                                                weight="fill"
                                                className="w-3 h-3 text-[#b61f27] shrink-0"
                                            />
                                        )}
                                        {percentage && (
                                            <p
                                                className={`text-xs font-medium leading-3 uppercase tracking-[0.7px] whitespace-nowrap ${
                                                    changeType === "positive"
                                                        ? "text-[#158039]"
                                                        : "text-[#b61f27]"
                                                }`}
                                            >
                                                {percentage}
                                            </p>
                                        )}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="top"
                                    sideOffset={8}
                                    className="max-w-sm bg-[#262b2b] text-white border border-[#5d6c6b] p-3"
                                >
                                    <div className="flex flex-col gap-2.5">
                                        <div>
                                            <p className="font-semibold text-sm mb-1.5">{title}</p>
                                            <p className="text-xs text-white/90 leading-relaxed">
                                                {metricExplanation}
                                            </p>
                                        </div>
                                        <div className="pt-1.5 border-t border-white/20">
                                            <p className="text-xs font-medium text-white mb-1.5">
                                                Change: {change}
                                            </p>
                                            <p className="text-xs text-white/85 leading-relaxed">
                                                {changeExplanation}
                                            </p>
                                        </div>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                            <p className="text-sm font-normal text-[#5d6c6b] leading-5 whitespace-nowrap">
                                vs last period
                            </p>
                        </div>
                    </div>

                    {/* Ask Sidekick Button */}
                    <button
                        onClick={handleAskSidekick}
                        className="bg-white border border-[#b8c1c0] border-solid relative rounded-lg shrink-0 w-fit h-fit hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center justify-center px-2 py-3 gap-2">
                            <div className="px-1">
                                <p className="text-sm font-medium text-[#262b2b] leading-4 whitespace-nowrap">
                                    Ask Sidekick
                                </p>
                            </div>
                            <div className="w-4 h-4 shrink-0 relative">
                                <Sparkle
                                    weight="fill"
                                    className="w-4 h-4 text-[#8139ee]"
                                />
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

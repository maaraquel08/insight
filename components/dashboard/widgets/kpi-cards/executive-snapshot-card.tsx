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
    // Extract percentage and determine direction from change text
    // Examples: "+3.1% vs last period" -> { value: "3.1%", isIncrease: true }
    //           "-2.3% vs last period" -> { value: "2.3%", isIncrease: false }
    //           "↑ 1.5% vs last period" -> { value: "1.5%", isIncrease: true }
    //           "↓ 2.3 pts vs last period" -> { value: "2.3 pts", isIncrease: false }
    //           "-12 vs last period" -> { value: "12", isIncrease: false }
    //           "+0.2 years vs last period" -> { value: "0.2 years", isIncrease: true }
    const extractChangeInfo = (text: string): { value: string; isIncrease: boolean } => {
        if (!text) return { value: "", isIncrease: true };
        
        // Check for arrow symbols first
        const hasUpArrow = text.includes("↑");
        const hasDownArrow = text.includes("↓");
        
        // Determine direction: check for explicit sign first, then arrow symbols
        // Look for + or - sign before the number
        const signMatch = text.match(/([+-])\s*[\d.]/);
        const hasPlusSign = signMatch?.[1] === "+";
        const hasMinusSign = signMatch?.[1] === "-";
        
        // Determine if it's an increase: arrow up, plus sign, or no down arrow/minus sign
        const isIncrease = hasUpArrow || hasPlusSign || (!hasDownArrow && !hasMinusSign);
        
        // Try matching different patterns in order of specificity:
        // 1. Number with % or pts: "5.1%", "2.3 pts"
        let numberUnitMatch = text.match(/([\d.]+)\s*(%|pts\b)/i);
        if (numberUnitMatch) {
            const number = numberUnitMatch[1];
            const unit = numberUnitMatch[2].toLowerCase();
            const value = `${number}${unit === "pts" ? " pts" : "%"}`;
            return { value, isIncrease };
        }
        
        // 2. Number with other units like "years": "+0.2 years"
        const yearMatch = text.match(/([+-])?\s*([\d.]+)\s*(years?|months?|days?|weeks?)/i);
        if (yearMatch) {
            const number = yearMatch[2];
            const unit = yearMatch[3].toLowerCase();
            return { value: `${number} ${unit}`, isIncrease };
        }
        
        // 3. Plain number with sign: "-12", "+5"
        const plainNumberMatch = text.match(/([+-])\s*([\d.]+)(?:\s+vs|\s*$)/i);
        if (plainNumberMatch) {
            const number = plainNumberMatch[2];
            return { value: number, isIncrease };
        }
        
        // 4. Just a number before "vs": "12 vs last period"
        const simpleMatch = text.match(/([\d.]+)\s+vs/i);
        if (simpleMatch) {
            return { value: simpleMatch[1], isIncrease };
        }
        
        return { value: "", isIncrease: true };
    };

    const { value: percentage, isIncrease } = extractChangeInfo(change);
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
            metricExplanation = "Percentage of employees who left the organization. Calculated as: (Employees who left ÷ Total employees) × 100. This includes both voluntary and involuntary separations.";
            if (hasPoints) {
                changeExplanation = "Current rate minus last period's rate. Shows the difference in percentage points.";
            } else {
                changeExplanation = "Current rate minus last period's rate, divided by last period's rate, times 100.";
            }
        } else if (titleLower.includes("separations")) {
            metricExplanation = "Total number of employees who left the organization during the period. Includes voluntary resignations, involuntary terminations, retirements, and other departures.";
            changeExplanation = "Current period separations minus last period's separations. A negative change indicates fewer departures, which is generally positive for retention.";
        } else if (titleLower.includes("tenure")) {
            metricExplanation = "Average length of time employees have been with the organization. Calculated by summing all employee tenures and dividing by total headcount. Higher tenure typically indicates better retention.";
            changeExplanation = "Current average tenure minus last period's average tenure. An increase suggests employees are staying longer, which is positive for organizational stability.";
        } else if (titleLower.includes("voluntary") || titleLower.includes("turnover")) {
            metricExplanation = "Percentage of total separations that were voluntary (employee-initiated). Calculated as: (Voluntary separations ÷ Total separations) × 100. High voluntary turnover may indicate compensation, culture, or career development issues.";
            changeExplanation = "Current voluntary turnover percentage minus last period's percentage. An increase suggests more employees are choosing to leave, which may require attention to retention strategies.";
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
                                        {isIncrease ? (
                                            <CaretUp
                                                weight="fill"
                                                className={`w-3 h-3 shrink-0 ${
                                                    changeType === "positive"
                                                        ? "text-[#158039]"
                                                        : "text-[#b61f27]"
                                                }`}
                                            />
                                        ) : (
                                            <CaretDown
                                                weight="fill"
                                                className={`w-3 h-3 shrink-0 ${
                                                    changeType === "positive"
                                                        ? "text-[#158039]"
                                                        : "text-[#b61f27]"
                                                }`}
                                            />
                                        )}
                                        {percentage ? (
                                            <p
                                                className={`text-xs font-medium leading-3 uppercase tracking-[0.7px] whitespace-nowrap ${
                                                    changeType === "positive"
                                                        ? "text-[#158039]"
                                                        : "text-[#b61f27]"
                                                }`}
                                            >
                                                {percentage}
                                            </p>
                                        ) : null}
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
                                        {description && (
                                            <div className="pt-1.5 border-t border-white/20">
                                                <p className="text-xs font-medium text-white mb-1.5">
                                                    Context
                                                </p>
                                                <p className="text-xs text-white/85 leading-relaxed">
                                                    {description}
                                                </p>
                                            </div>
                                        )}
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

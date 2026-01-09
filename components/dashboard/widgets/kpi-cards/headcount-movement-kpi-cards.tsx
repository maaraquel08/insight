"use client";

import { useState, useEffect, useMemo } from "react";
import { Users, TrendingUp, Zap } from "lucide-react";
import { CaretUp, CaretDown, Sparkle } from "phosphor-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useChatSidekick } from "@/components/chatbot-sidekick";
import { getHeadcountKPIs } from "@/app/data/headcountData";

interface KPICardProps {
    title: string;
    value: string;
    subtitle?: string;
    change?: string;
    changeType?: "positive" | "negative";
    icon: React.ReactNode;
    onClick?: () => void;
    description?: string;
    onAskSidekick?: () => void;
}

function KPICard({
    title,
    value,
    subtitle,
    change,
    changeType = "positive",
    icon,
    onClick,
    description,
    onAskSidekick,
}: KPICardProps) {
    // Extract percentage from change text
    const extractPercentage = (text: string): string => {
        if (!text) return "";
        const match = text.match(/([\d.+-]+%)/);
        return match ? match[1] : "";
    };

    const percentage = change ? extractPercentage(change) : "";
    const handleAskSidekick = () => {
        if (onAskSidekick) {
            onAskSidekick();
        }
    };


    return (
        <div
            className="bg-white border border-[#d9dede] border-solid relative rounded-xl w-full h-full flex flex-col"
            onClick={onClick}
        >
            <div className="flex flex-col gap-4 p-4 h-full">
                {/* Title */}
                <div className="flex gap-1 items-center w-full">
                    <p className="text-base text-[#738482] font-normal leading-6 flex-1">
                        {title}
                    </p>
                    <div className="w-6 h-6 shrink-0">{icon}</div>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-2 flex-1">
                    <p className="text-[28px] font-medium text-[#262b2b] leading-9 tracking-[-0.7px]">
                        {value}
                    </p>
                    {/* Change Badge with vs last period text */}
                    {change && (
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
                                            {description && (
                                                <p className="text-xs text-white/90 leading-relaxed">
                                                    {description}
                                                </p>
                                            )}
                                        </div>
                                        {subtitle && (
                                            <div className="pt-1.5 border-t border-white/20">
                                                <p className="text-xs text-white/85 leading-relaxed">
                                                    {subtitle}
                                                </p>
                                            </div>
                                        )}
                                        {change && (
                                            <div className="pt-1.5 border-t border-white/20">
                                                <p className="text-xs font-medium text-white mb-1.5">
                                                    Change: {change}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                            {change && (
                                <p className="text-sm font-normal text-[#5d6c6b] leading-5 whitespace-nowrap">
                                    vs last period
                                </p>
                            )}
                        </div>
                    )}
                    {subtitle && !change && (
                        <p className="text-sm font-normal text-[#5d6c6b] leading-5">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Ask Sidekick Button */}
                {onAskSidekick && (
                    <button
                        onClick={handleAskSidekick}
                        className="bg-white border border-[#b8c1c0] border-solid relative rounded-lg shrink-0 w-fit h-fit hover:bg-gray-50 transition-colors cursor-pointer mt-auto"
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
                )}
            </div>
        </div>
    );
}

export function HeadcountMovementKPICards() {
    const [kpiData, setKpiData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"active" | "all">("active");
    const { openChat } = useChatSidekick();

    useEffect(() => {
        // Simulate data loading
        const timer = setTimeout(() => {
            const data = getHeadcountKPIs();
            setKpiData(data);
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const handleAskSidekick = (title: string, description?: string) => {
        openChat(`Can you provide more insights about ${title.toLowerCase()}? ${description ? description : ""}`);
    };

    if (isLoading || !kpiData) {
        return (
            <div className="bg-white rounded-xl border border-[#d9dede] p-6">
                <p className="text-sm text-[#5d6c6b]">Loading KPIs...</p>
            </div>
        );
    }

    const totalHeadcountValue =
        viewMode === "active"
            ? kpiData.totalHeadcount.current.toLocaleString()
            : (kpiData.totalHeadcount.current * 1.15).toLocaleString();

    const wowChange = kpiData.totalHeadcount.wowChange;
    const wowChangeType = wowChange >= 0 ? "positive" : "negative";
    const wowChangeDisplay = `${wowChange >= 0 ? "+" : ""}${wowChange}`;

    const netChangeValue = kpiData.netChange.net;
    const netChangeType = netChangeValue >= 0 ? "positive" : "negative";
    const netChangeDisplay = `${netChangeValue >= 0 ? "+" : ""}${netChangeValue}`;

    const growthRateValue = `${kpiData.growthRate.current}%`;
    const growthRateChange =
        kpiData.growthRate.current >= kpiData.growthRate.target
            ? "positive"
            : "negative";
    const growthRateDisplay = `${kpiData.growthRate.current >= kpiData.growthRate.target ? "+" : ""}${(kpiData.growthRate.current - kpiData.growthRate.target).toFixed(1)}%`;

    const hiringVelocityValue = `${kpiData.hiringVelocity.weekly}/wk`;
    const hiringVelocityChange = "positive";
    const hiringVelocityDisplay = `+${kpiData.hiringVelocity.yoy}%`;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {/* Total Headcount */}
            <KPICard
                title="Total Headcount"
                value={totalHeadcountValue}
                subtitle={`Net change WoW: ${wowChangeDisplay}`}
                change={wowChangeDisplay}
                changeType={wowChangeType}
                icon={<Users className="w-6 h-6 text-[#738482]" />}
                onClick={() =>
                    setViewMode(viewMode === "active" ? "all" : "active")
                }
                description="Total number of active employees on payroll."
                onAskSidekick={() => handleAskSidekick("Total Headcount", "Current headcount with week-over-week change.")}
            />

            {/* Net Headcount Change */}
            <KPICard
                title="Net Headcount Change"
                value={netChangeDisplay}
                subtitle={`Hires: ${kpiData.netChange.hires} | Attritions: ${kpiData.netChange.attritions}`}
                change={netChangeDisplay}
                changeType={netChangeType}
                icon={<TrendingUp className="w-6 h-6 text-[#738482]" />}
                description="Net change in headcount calculated as hires minus attritions."
                onAskSidekick={() => handleAskSidekick("Net Headcount Change", `Hires: ${kpiData.netChange.hires}, Attritions: ${kpiData.netChange.attritions}`)}
            />

            {/* Overall Growth Rate */}
            <KPICard
                title="Overall Growth Rate"
                value={growthRateValue}
                subtitle={`Target: ${kpiData.growthRate.target}% | Actual: ${kpiData.growthRate.current}%`}
                change={growthRateDisplay}
                changeType={growthRateChange}
                icon={<TrendingUp className="w-6 h-6 text-[#738482]" />}
                description={`Growth rate is ${kpiData.growthRate.current}% compared to target of ${kpiData.growthRate.target}%.`}
                onAskSidekick={() => handleAskSidekick("Overall Growth Rate", `Target: ${kpiData.growthRate.target}%, Actual: ${kpiData.growthRate.current}%`)}
            />

            {/* Hiring Velocity */}
            <KPICard
                title="Hiring Velocity"
                value={hiringVelocityValue}
                subtitle={`YoY: ${hiringVelocityDisplay}`}
                change={hiringVelocityDisplay}
                changeType={hiringVelocityChange}
                icon={<Zap className="w-6 h-6 text-[#738482]" />}
                description={`Hiring velocity is ${kpiData.hiringVelocity.weekly} hires per week, with a year-over-year change of ${hiringVelocityDisplay}.`}
                onAskSidekick={() => handleAskSidekick("Hiring Velocity", `Weekly: ${kpiData.hiringVelocity.weekly}/wk, YoY: ${hiringVelocityDisplay}`)}
            />
        </div>
    );
}

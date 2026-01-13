"use client";

import { Database, Clock, CheckCircle2 } from "lucide-react";
import { getWidgetById } from "@/lib/widget-registry";
import type { WidgetLayout } from "@/types/dashboard";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface TrustBuilderProps {
    layout: WidgetLayout;
}

export function TrustBuilder({ layout }: TrustBuilderProps) {
    const widgetMetadata = getWidgetById(layout.widgetId);
    const dataSources = widgetMetadata?.dataSource || ["Unknown Source"];

    // Placeholder data - in real implementation, this would come from the data context
    const lastUpdated = "2 hours ago";
    const dataFreshness = "fresh"; // "fresh" | "stale" | "outdated"
    const updateFrequency = "Real-time";

    return (
        <div className="bg-white border-x border-b border-[#d9dede] rounded-b-xl px-4 py-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Data Source Icon */}
                    <Database className="w-3.5 h-3.5 text-[#738482] shrink-0" />
                    
                    {/* Data Sources */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs text-[#5d6c6b] font-normal">
                            Data from:
                        </span>
                        {dataSources.map((source, index) => (
                            <span
                                key={index}
                                className="text-xs font-medium text-[#262b2b] bg-[#f0f4f3] px-2 py-0.5 rounded-md border border-[#d9dede]"
                            >
                                {source}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Last Updated */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-1.5 cursor-help">
                                <Clock className="w-3.5 h-3.5 text-[#738482] shrink-0" />
                                <span className="text-xs text-[#5d6c6b]">
                                    {lastUpdated}
                                </span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent
                            side="top"
                            sideOffset={8}
                            className="max-w-xs bg-[#262b2b] text-white border border-[#5d6c6b] p-2.5"
                        >
                            <div className="flex flex-col gap-1.5">
                                <p className="text-xs font-semibold">
                                    Data Freshness
                                </p>
                                <p className="text-xs text-white/90 leading-relaxed">
                                    Last updated: {lastUpdated}
                                </p>
                                <p className="text-xs text-white/90 leading-relaxed">
                                    Update frequency: {updateFrequency}
                                </p>
                            </div>
                        </TooltipContent>
                    </Tooltip>

                    {/* Freshness Indicator */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-1 cursor-help">
                                <CheckCircle2
                                    className={`w-3.5 h-3.5 shrink-0 ${
                                        dataFreshness === "fresh"
                                            ? "text-[#158039]"
                                            : dataFreshness === "stale"
                                            ? "text-[#f59e0b]"
                                            : "text-[#b61f27]"
                                    }`}
                                />
                                <span
                                    className={`text-xs font-medium capitalize ${
                                        dataFreshness === "fresh"
                                            ? "text-[#158039]"
                                            : dataFreshness === "stale"
                                            ? "text-[#f59e0b]"
                                            : "text-[#b61f27]"
                                    }`}
                                >
                                    {dataFreshness}
                                </span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent
                            side="top"
                            sideOffset={8}
                            className="max-w-xs bg-[#262b2b] text-white border border-[#5d6c6b] p-2.5"
                        >
                            <p className="text-xs text-white/90">
                                {dataFreshness === "fresh"
                                    ? "Data is up-to-date and reliable"
                                    : dataFreshness === "stale"
                                    ? "Data may be slightly outdated"
                                    : "Data needs to be refreshed"}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}

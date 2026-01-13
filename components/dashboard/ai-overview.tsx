"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Database, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface AIOverviewProps {
    dashboardData?: any;
}

export function AIOverview({ dashboardData }: AIOverviewProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Hard-coded content for seamless display
    const summary = "Your attrition rate is currently at **12.5%**, showing a **+2.3%** increase from the previous quarter. This trend requires immediate attention, particularly in the Engineering and Sales departments where turnover has spiked significantly.";
    
    const bullets = [
        "**Engineering department** shows the highest attrition at **18.2%**, with voluntary turnover accounting for **75%** of separations",
        "Average tenure has decreased to **2.8 years**, indicating potential retention challenges",
        "Top departure reasons include **Career Growth (32%)** and **Compensation (28%)**",
        "**Q3 2024** saw a notable increase in mid-level employee departures (3-5 years tenure)",
        "Recommendation: Focus on retention programs for Engineering and Sales teams, with emphasis on career development opportunities"
    ];

    return (
        <Card className="w-full border border-[#d9dede] bg-white rounded-xl overflow-hidden">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CardHeader className={cn("pb-3", isOpen && "border-b border-[#d9dede]")}>
                    <CollapsibleTrigger className="w-full">
                        <CardTitle className="flex items-center justify-between text-lg font-semibold group hover:text-[#8139ee] transition-colors mb-2">
                            <div className="flex items-center gap-2">
                                <Image
                                    src="/images/Sidekick_Logo.png"
                                    alt="Sidekick"
                                    width={24}
                                    height={24}
                                    className="w-6 h-6 object-contain shrink-0"
                                />
                                <span className={cn(
                                    "transition-colors",
                                    isOpen ? "text-[#8139ee]" : "animate-breathe-color"
                                )}>
                                    AI Overview
                                </span>
                            </div>
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 text-[#738482] transition-transform duration-200",
                                    isOpen && "rotate-180"
                                )}
                            />
                        </CardTitle>
                    </CollapsibleTrigger>
                    <p className="font-normal leading-5 text-[#262b2b] text-sm">
                        {summary.split(/(\*\*.*?\*\*)/g).map((part, index) => 
                            part.startsWith('**') && part.endsWith('**') ? (
                                <strong key={index} className="font-semibold">
                                    {part.slice(2, -2)}
                                </strong>
                            ) : (
                                part
                            )
                        )}
                    </p>
                </CardHeader>
                <CollapsibleContent>
                    <CardContent className="p-4 bg-white">
                        <ul className="space-y-3 list-none">
                            {bullets.map((bullet, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-2 text-sm text-[#262b2b] leading-5"
                                >
                                    <span className="text-[#8139ee] mt-1.5 font-bold shrink-0">
                                        •
                                    </span>
                                    <span className="font-normal">
                                        {bullet.split(/(\*\*.*?\*\*)/g).map((part, partIndex) => 
                                            part.startsWith('**') && part.endsWith('**') ? (
                                                <strong key={partIndex} className="font-semibold">
                                                    {part.slice(2, -2)}
                                                </strong>
                                            ) : (
                                                part
                                            )
                                        )}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        
                        {/* Trust Builder Footer */}
                        <div className="mt-4 pt-4 border-t border-[#d9dede]">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-2 flex-wrap">
                                    {/* Data Source Icon */}
                                    <Database className="w-3.5 h-3.5 text-[#738482] shrink-0" />
                                    
                                    {/* Data Sources */}
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-xs text-[#5d6c6b] font-normal">
                                            Insights based on:
                                        </span>
                                        {[
                                            {
                                                name: "People Health",
                                                description: "Employee headcount, attrition rates, tenure demographics, department distribution, and separation reasons. Includes data from HRIS and employee records."
                                            },
                                            {
                                                name: "Time & Attendance",
                                                description: "Leave utilization, absenteeism trends, overtime hours, and attendance patterns. Includes data from time tracking systems and payroll records."
                                            }
                                        ].map((source, index) => (
                                            <Tooltip key={index}>
                                                <TooltipTrigger asChild>
                                                    <span className="text-xs font-medium text-[#262b2b] bg-[#f0f4f3] px-2 py-0.5 rounded-md border border-[#d9dede] cursor-help hover:bg-[#e0e8e6] transition-colors">
                                                        {source.name}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent
                                                    side="top"
                                                    sideOffset={8}
                                                    className="max-w-xs bg-[#262b2b] text-white border border-[#5d6c6b] p-2.5"
                                                >
                                                    <div className="flex flex-col gap-1.5">
                                                        <p className="text-xs font-semibold">
                                                            {source.name}
                                                        </p>
                                                        <p className="text-xs text-white/90 leading-relaxed">
                                                            {source.description}
                                                        </p>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
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
                                                    2 hours ago
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
                                                    Last updated: 2 hours ago
                                                </p>
                                                <p className="text-xs text-white/90 leading-relaxed">
                                                    Update frequency: Real-time
                                                </p>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>

                                    {/* Freshness Indicator */}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex items-center gap-1 cursor-help">
                                                <CheckCircle2
                                                    className="w-3.5 h-3.5 shrink-0 text-[#158039]"
                                                />
                                                <span className="text-xs font-medium text-[#158039] capitalize">
                                                    fresh
                                                </span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="top"
                                            sideOffset={8}
                                            className="max-w-xs bg-[#262b2b] text-white border border-[#5d6c6b] p-2.5"
                                        >
                                            <p className="text-xs text-white/90">
                                                Data is up-to-date and reliable
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}

"use client";

import { useMemo } from "react";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ReportStatusBadge, ReportStatus } from "./report-status-badge";

export interface ReportCardProps {
    title: string;
    description: string;
    status: ReportStatus;
    category: string;
    slug?: string;
    icon?: LucideIcon;
    onClick?: () => void;
}

// Generate a deterministic color from a string
function generateColorFromString(str: string): { icon: string; background: string } {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate a vibrant color (hue between 0-360)
    const hue = Math.abs(hash) % 360;
    
    // Use a medium saturation and lightness for the icon color
    const iconColor = `hsl(${hue}, 65%, 45%)`;
    
    // Use a lighter version for the background
    const backgroundColor = `hsl(${hue}, 65%, 92%)`;
    
    return { icon: iconColor, background: backgroundColor };
}

export function ReportCard({
    title,
    description,
    status,
    icon: Icon,
    onClick,
}: ReportCardProps) {
    const colors = useMemo(() => generateColorFromString(title), [title]);
    
    return (
        <Card
            className="bg-white border border-[#d9dede] rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors min-w-[280px] max-w-[320px] flex-1"
            onClick={onClick}
        >
            <div className="flex flex-col gap-2">
                {Icon && (
                    <div 
                        className="p-2 rounded-lg flex items-center shrink-0 w-fit"
                        style={{ backgroundColor: colors.background }}
                    >
                        <Icon 
                            className="w-6 h-6 flex-shrink-0" 
                            style={{ color: colors.icon }}
                        />
                    </div>
                )}
                <div className="flex flex-col gap-0.5">
                    <h3 className="text-base font-medium text-[#262b2b] leading-5">
                        {title}
                    </h3>
                    <p className="text-xs font-normal text-[#5d6c6b] leading-4 max-h-8 overflow-hidden overflow-ellipsis line-clamp-2">
                        {description}
                    </p>
                </div>
                <div className="flex items-start">
                    <ReportStatusBadge status={status} />
                </div>
            </div>
        </Card>
    );
}

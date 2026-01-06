"use client";

import { Card } from "@/components/ui/card";
import { ReportStatusBadge, ReportStatus } from "./report-status-badge";

export interface ReportCardProps {
    title: string;
    description: string;
    status: ReportStatus;
    category: string;
    slug?: string;
    onClick?: () => void;
}

export function ReportCard({
    title,
    description,
    status,
    onClick,
}: ReportCardProps) {
    return (
        <Card
            className="bg-white border border-[#d9dede] rounded-lg p-3 cursor-pointer hover:shadow-xs min-w-[280px] max-w-[320px] flex-1"
            onClick={onClick}
        >
            <div className="flex flex-col gap-2">
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

"use client";

import { cn } from "@/lib/utils";

export type ReportStatus = "default" | "published" | "unpublished";

interface ReportStatusBadgeProps {
    status: ReportStatus;
    className?: string;
}

const statusStyles = {
    default: {
        bg: "bg-[#eff1f1]",
        border: "border-[#b8c1c0]",
        text: "text-[#5d6c6b]",
    },
    published: {
        bg: "bg-[#d8ebff]",
        border: "border-[#0f6eeb]",
        text: "text-[#0f6eeb]",
    },
    unpublished: {
        bg: "bg-[#fff4d3]",
        border: "border-[#cc5c02]",
        text: "text-[#cc5c02]",
    },
};

const statusLabels = {
    default: "Default",
    published: "Published",
    unpublished: "Unpublished",
};

export function ReportStatusBadge({ status, className }: ReportStatusBadgeProps) {
    const style = statusStyles[status];

    return (
        <div
            className={cn(
                "inline-flex items-center justify-center px-1 py-0.5 rounded-md border border-solid",
                style.bg,
                style.border,
                className
            )}
        >
            <p
                className={cn(
                    "text-xs font-medium leading-3 uppercase tracking-[0.7px] whitespace-nowrap",
                    style.text
                )}
            >
                {statusLabels[status]}
            </p>
        </div>
    );
}


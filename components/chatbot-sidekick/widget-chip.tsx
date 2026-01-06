"use client";

import { X } from "phosphor-react";
import { getWidgetById } from "@/lib/widget-registry";
import type { WidgetLayout } from "@/types/dashboard";

interface WidgetChipProps {
    widgetLayout: WidgetLayout;
    onRemove?: () => void;
    onClick?: () => void;
    showRemove?: boolean;
    variant?: "inline" | "message";
}

export function WidgetChip({
    widgetLayout,
    onRemove,
    onClick,
    showRemove = true,
    variant = "inline",
}: WidgetChipProps) {
    const widgetMetadata = getWidgetById(widgetLayout.widgetId);

    if (!widgetMetadata) {
        return null;
    }

    const getWidgetIcon = (category: string) => {
        switch (category) {
            case "People Health":
                return "👥";
            case "Time & Attendance":
                return "⏰";
            case "Payroll":
                return "💰";
            case "Analytics":
                return "📊";
            case "KPIs":
                return "📈";
            default:
                return "📦";
        }
    };

    const chipClasses =
        variant === "inline"
            ? "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#f1f2f3] border border-[#d9dede] text-sm text-[#262b2b] hover:bg-[#e8e9ea] transition-colors cursor-pointer"
            : "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white border border-[#d9dede] text-sm text-[#262b2b] hover:bg-[#f9fafa] transition-colors cursor-pointer shadow-sm";

    return (
        <span
            className={chipClasses}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick?.();
                }
            }}
            aria-label={`Widget: ${widgetMetadata.name}`}
        >
            <span className="text-base leading-none">
                {getWidgetIcon(widgetMetadata.category)}
            </span>
            <span className="font-medium text-xs leading-tight">
                {widgetMetadata.name}
            </span>
            {showRemove && onRemove && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="ml-0.5 p-0.5 rounded-full hover:bg-[#d9dede] transition-colors flex items-center justify-center"
                    aria-label={`Remove ${widgetMetadata.name} widget`}
                >
                    <X className="w-3 h-3 text-[#5d6c6b]" weight="bold" />
                </button>
            )}
        </span>
    );
}

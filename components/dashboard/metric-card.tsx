"use client";

import { TrendingUp, TrendingDown, Clock } from "lucide-react";

interface MetricCardProps {
    icon?: React.ReactNode;
    title: string;
    value: string;
    change?: string;
    changeType?: "positive" | "negative";
    description?: string;
}

export function MetricCard({
    icon,
    title,
    value,
    change,
    changeType = "positive",
    description,
}: MetricCardProps) {
    const defaultIcon = <Clock className="w-5 h-5 text-[#738482]" />;
    const displayIcon = icon || defaultIcon;

    return (
        <div className="bg-white rounded-xl border border-[#d9dede] p-4">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    {displayIcon}
                    <h3 className="text-sm font-medium text-[#5d6c6b]">{title}</h3>
                </div>
                <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl font-semibold text-[#262b2b]">{value}</span>
                    {change && (
                        <div
                            className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                                changeType === "positive"
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-50 text-red-700"
                            }`}
                        >
                            {changeType === "positive" ? (
                                <TrendingUp className="h-4 w-4" />
                            ) : (
                                <TrendingDown className="h-4 w-4" />
                            )}
                            <span className="text-sm font-medium">{change}</span>
                        </div>
                    )}
                </div>
                {description && (
                    <p className="text-sm text-[#5d6c6b]">{description}</p>
                )}
            </div>
        </div>
    );
}


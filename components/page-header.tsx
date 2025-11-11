"use client";

import { Button } from "@/components/ui/button";

interface PageHeaderProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function PageHeader({
    title,
    description,
    actionLabel = "Create Report",
    onAction,
}: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between w-full max-w-[1320px] rounded-lg">
            <div className="flex flex-col gap-0.5">
                <h1 className="text-2xl font-medium text-[#262b2b] leading-8 tracking-[-0.7px]">
                    {title}
                </h1>
                <p className="text-sm font-normal text-[#5d6c6b] leading-5">
                    {description}
                </p>
            </div>
            {actionLabel && onAction && (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        onClick={onAction}
                        className="bg-[#158039] hover:bg-[#158039]/90 text-white h-9 min-w-[56px] px-2 py-3 rounded-lg"
                        size="sm"
                    >
                        {actionLabel}
                    </Button>
                </div>
            )}
        </div>
    );
}

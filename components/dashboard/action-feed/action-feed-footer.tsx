"use client";

import { Button } from "@/components/ui/button";

interface ActionItem {
    label: string;
    variant: "outline" | "primary" | "secondary";
    borderColor?: "purple" | "default";
    onClick?: () => void;
}

interface ActionFeedFooterProps {
    actions: ActionItem[];
}

export function ActionFeedFooter({ actions }: ActionFeedFooterProps) {
    if (!actions || actions.length === 0) {
        return null;
    }

    return (
        <div className="flex gap-2 items-center justify-end">
            {actions.map((action, index) => {
                const borderColorClass =
                    action.borderColor === "purple"
                        ? "border-[#8139ee]"
                        : "border-[#b8c1c0]";

                if (action.variant === "primary") {
                    return (
                        <Button
                            key={index}
                            size="sm"
                            className={`bg-[#158039] hover:bg-[#158039]/90 text-white h-9 px-2 text-sm font-medium rounded-lg`}
                            onClick={action.onClick}
                        >
                            {action.label}
                        </Button>
                    );
                }

                return (
                    <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className={`bg-white border ${borderColorClass} text-[#262b2b] hover:bg-gray-50 h-9 px-2 text-sm font-medium rounded-lg`}
                        onClick={action.onClick}
                    >
                        {action.label}
                    </Button>
                );
            })}
        </div>
    );
}


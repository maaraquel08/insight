"use client";

interface ActionFeedHeaderProps {
    title: string;
    timestamp: string;
    priority?: {
        label: string;
        variant: "high" | "medium" | "low";
    };
}

const priorityStyles = {
    high: {
        bg: "bg-[#fee2e3]",
        border: "border-[#b61f27]",
        text: "text-[#b61f27]",
    },
    medium: {
        bg: "bg-[#fef3c7]",
        border: "border-[#d97706]",
        text: "text-[#d97706]",
    },
    low: {
        bg: "bg-[#dbeafe]",
        border: "border-[#2563eb]",
        text: "text-[#2563eb]",
    },
};

export function ActionFeedHeader({
    title,
    timestamp,
    priority,
}: ActionFeedHeaderProps) {
    const priorityStyle = priority
        ? priorityStyles[priority.variant]
        : priorityStyles.high;

    return (
        <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex flex-col gap-1">
                <h3 className="text-base font-medium text-[#262b2b] leading-5">
                    {title}
                </h3>
                <p className="text-sm font-normal text-[#5d6c6b] leading-[21px]">
                    {timestamp}
                </p>
            </div>
            {priority && (
                <div
                    className={`${priorityStyle.bg} ${priorityStyle.border} border rounded-md px-1 py-1 flex items-center justify-center shrink-0`}
                >
                    <p
                        className={`${priorityStyle.text} text-xs font-medium leading-3 uppercase tracking-[0.7px]`}
                    >
                        {priority.label}
                    </p>
                </div>
            )}
        </div>
    );
}

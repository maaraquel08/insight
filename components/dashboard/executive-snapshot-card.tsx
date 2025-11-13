"use client";

import { ReactNode } from "react";

interface ExecutiveSnapshotCardProps {
    icon: ReactNode;
    title: string;
    value: string;
    change: string;
    changeType?: "positive" | "negative";
    description: string;
}

export function ExecutiveSnapshotCard({
    icon,
    title,
    value,
    change,
    changeType = "positive",
    description,
}: ExecutiveSnapshotCardProps) {
    return (
        <div className="bg-[#f7f8f8] outline outline-[#d9dede] rounded-lg flex flex-col overflow-hidden w-full h-full">
            {/* Body Section */}
            <div className="bg-white outline outline-[#d9dede] rounded-lg flex flex-col gap-4 p-4">
                {/* Title */}
                <div className="flex gap-1 items-center">
                    <div className="w-5 h-5 shrink-0">{icon}</div>
                    <p className="text-base text-[#738482] font-normal leading-6 flex-1">
                        {title}
                    </p>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1">
                    <p className="text-xl font-medium text-[#262b2b] leading-6 tracking-[-0.7px]">
                        {value}
                    </p>
                    <p
                        className={`text-base font-normal leading-5 ${
                            changeType === "positive"
                                ? "text-[#158039]"
                                : "text-[#b61f27]"
                        }`}
                    >
                        {change}
                    </p>
                </div>
            </div>

            {/* Footer Section */}
            <div className="flex gap-2 items-center p-4">
                <p className="text-sm text-[#5d6c6b] font-normal leading-5 flex-1">
                    {description}
                </p>
            </div>
        </div>
    );
}

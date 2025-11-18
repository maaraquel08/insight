"use client";

import { ReactNode } from "react";
import { CaretUp, CaretDown, Sparkle } from "phosphor-react";

interface ExecutiveSnapshotCardProps {
    icon: ReactNode;
    title: string;
    value: string;
    change: string;
    changeType?: "positive" | "negative";
    description: string;
    onAskSidekick?: () => void;
}

export function ExecutiveSnapshotCard({
    icon,
    title,
    value,
    change,
    changeType = "positive",
    description,
    onAskSidekick,
}: ExecutiveSnapshotCardProps) {
    // Remove arrow symbols from change text since the caret icon represents direction
    const cleanChangeText = change.replace(/[↓↑⬇⬆→←]/g, "").trim();

    const handleAskSidekick = () => {
        if (onAskSidekick) {
            onAskSidekick();
        }
    };

    return (
        <div
            className="flex flex-col items-start overflow-hidden relative rounded-xl w-full h-auto"
            style={{
                backgroundImage:
                    "linear-gradient(-62.13deg, rgba(245, 243, 255, 1) 2.45%, rgba(238, 233, 254, 1) 30.19%, rgba(240, 253, 244, 1) 79.1%), linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)",
            }}
        >
            {/* Body Section */}
            <div className="bg-white border border-[#d9dede] border-solid relative rounded-xl shrink-0 w-full">
                <div className="flex flex-col gap-4 p-4">
                {/* Title */}
                <div className="flex gap-1 items-center">
                    <div className="w-5 h-5 shrink-0">{icon}</div>
                    <p className="text-base text-[#738482] font-normal leading-6 flex-1">
                        {title}
                    </p>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1">
                        <p className="text-[28px] font-medium text-[#262b2b] leading-9 tracking-[-0.7px]">
                        {value}
                    </p>
                        {/* Change Badge - Insight Bubble */}
                        <div
                            className={`inline-flex items-center justify-center gap-0.5 p-1 rounded-md border border-solid w-fit ${
                                changeType === "positive"
                                    ? "bg-[#dcfce6] border-[#158039]"
                                    : "bg-[#fee2e2] border-[#b61f27]"
                            }`}
                        >
                            {changeType === "positive" ? (
                                <CaretUp weight="fill" className="w-3 h-3 text-[#158039] shrink-0" />
                            ) : (
                                <CaretDown weight="fill" className="w-3 h-3 text-[#b61f27] shrink-0" />
                            )}
                            <p
                                className={`text-xs font-medium leading-3 uppercase tracking-[0.7px] whitespace-nowrap ${
                            changeType === "positive"
                                ? "text-[#158039]"
                                : "text-[#b61f27]"
                        }`}
                    >
                                {cleanChangeText}
                    </p>
                </div>
            </div>

                    {/* Ask Sidekick Button */}
                    <button
                        onClick={handleAskSidekick}
                        className="bg-white border border-[#b8c1c0] border-solid relative rounded-lg shrink-0 w-fit h-fit hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center justify-center px-2 py-3 gap-2">
                            <div className="px-1">
                                <p className="text-sm font-medium text-[#262b2b] leading-4 whitespace-nowrap">
                                    Ask Sidekick
                                </p>
                            </div>
                            <div className="w-4 h-4 shrink-0 relative">
                                <Sparkle weight="fill" className="w-4 h-4 text-[#8139ee]" />
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

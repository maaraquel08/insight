"use client";

import { Sparkle, CaretUp, CaretDown } from "phosphor-react";

interface ActionFeedBodyProps {
    mainAlert?: {
        message: string;
    };
    comparison?: {
        value: string;
        direction: "up" | "down";
        show: boolean;
    };
    aiGenerated?: {
        message: string;
        show: boolean;
    };
    impact?: {
        label: string;
        message: string;
        show: boolean;
    };
}

export function ActionFeedBody({
    mainAlert,
    comparison,
    aiGenerated,
    impact,
}: ActionFeedBodyProps) {
    return (
        <div className="flex flex-col gap-4">
            {/* Main Alert Card */}
            {mainAlert && (
                <div className="bg-[#f7f8f8] rounded-xl p-6 border border-[#d9dede] flex flex-col items-center gap-1">
                    <p className="text-xl font-medium text-[#262b2b] leading-6 text-center tracking-[-0.7px]">
                        {mainAlert.message}
                    </p>
                    {comparison && comparison.show && (
                        <div
                            className={`${
                                comparison.direction === "up"
                                    ? "bg-[#dcfce6] border-[#158039]"
                                    : "bg-[#fee2e2] border-[#da2f38]"
                            } border rounded-md px-1 py-1 flex items-center gap-0.5 shrink-0 mt-1`}
                        >
                            {comparison.direction === "up" ? (
                                <CaretUp
                                    className="w-4 h-4 text-[#158039]"
                                    weight="fill"
                                />
                            ) : (
                                <CaretDown
                                    className="w-4 h-4 text-[#da2f38]"
                                    weight="fill"
                                />
                            )}
                            <p
                                className={`${
                                    comparison.direction === "up"
                                        ? "text-[#158039]"
                                        : "text-[#da2f38]"
                                } text-sm font-medium leading-[14px] uppercase tracking-[0.7px]`}
                            >
                                {comparison.value}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* AI Generated Section with Rotating Border */}
            {aiGenerated && aiGenerated.show && (
                <div
                    className="rotating-gradient-border w-full rounded-xl overflow-hidden"
                    style={{ borderRadius: "12px" }}
                >
                    <div
                        className="flex gap-2 items-center p-4 relative z-10"
                        style={{ borderRadius: "12px" }}
                    >
                        <Sparkle
                            className="w-6 h-6 text-[#8139ee] shrink-0"
                            weight="fill"
                        />
                        <p className="flex-1 font-normal leading-5 text-[#262b2b] text-sm">
                            {aiGenerated.message}
                        </p>
                    </div>
                </div>
            )}

            {/* Impact Section */}
            {impact && impact.show && (
                <div className="flex flex-col gap-1">
                    {impact.label && (
                        <p className="text-sm font-normal text-[#5d6c6b] leading-[21px]">
                            {impact.label}
                        </p>
                    )}
                    <p className="text-sm font-normal text-[#262b2b] leading-[21px]">
                        {impact.message}
                    </p>
                </div>
            )}
        </div>
    );
}


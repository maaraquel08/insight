"use client";

import { CompanyHealthCard } from "./company-health-card";
import { Sparkle, CaretRight } from "phosphor-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function MetricCardsSection() {
    // AI-generated context summary (1-2 sentences)
    const aiContext =
        "Company health score improved by 3 points, driven by better retention rates and reduced overtime costs. Engagement metrics show steady growth across all departments.";

    return (
        <div className="bg-white border border-[#d9dede] border-solid relative rounded-2xl w-full overflow-hidden">
            {/* Card Header */}
            <div className="bg-white border-b border-[#d9dede] border-solid flex gap-2 items-center justify-center px-4 py-3 relative shrink-0 w-full">
                <div className="flex gap-2 grow items-center min-w-0 relative shrink-0">
                    <div className="flex flex-col grow items-start justify-center min-w-0 relative shrink-0">
                        <div className="flex gap-2 items-center relative shrink-0 w-full">
                            <p className="text-base font-medium leading-5 relative shrink-0 text-[#262b2b] whitespace-nowrap">
                                Company Health
                            </p>
                        </div>
                        <p className="text-sm font-normal leading-5 relative shrink-0 text-[#5d6c6b] w-full">
                            Overall company health metrics
                        </p>
                    </div>
                </div>
                {/* Change Badge */}
                <div className="bg-[#dcfce6] border border-[#158039] border-solid flex gap-0.5 items-center justify-center p-1 relative rounded-md shrink-0">
                    <p className="text-xs font-medium leading-3 uppercase tracking-[0.7px] whitespace-nowrap text-[#158039]">
                        +3 pts vs last month
                    </p>
                </div>
            </div>

            {/* AI Context Section */}
            <div
                className="border-b border-[#d9dede] border-solid flex gap-2 items-center p-4 relative shrink-0 w-full"
                style={{
                    backgroundImage:
                        "linear-gradient(-16.72deg, rgba(245, 243, 255, 1) 2.45%, rgba(238, 233, 254, 1) 30.19%, rgba(240, 253, 244, 1) 79.10%)",
                }}
            >
                <Sparkle
                    className="w-6 h-6 text-[#8139ee] shrink-0"
                    weight="fill"
                />
                <p className="flex-1 font-normal grow leading-5 min-w-0 relative shrink-0 text-[#262b2b] text-sm">
                    {aiContext}
                </p>
                <Dialog>
                    <DialogTrigger asChild>
                        <button
                            type="button"
                            className="bg-white border border-[#b8c1c0] border-solid max-h-9 min-w-[48px] relative rounded-lg shrink-0 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <div className="box-border flex gap-2 items-center justify-center max-h-inherit min-w-inherit overflow-clip p-2 relative rounded-[inherit]">
                                <div className="flex gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                                    <p className="flex flex-col font-medium justify-center leading-0 relative shrink-0 text-[#262b2b] text-sm text-nowrap tracking-normal">
                                        <span className="leading-4 whitespace-pre">
                                            Explore Insight
                                        </span>
                                    </p>
                                </div>
                                <CaretRight
                                    className="w-3 h-3 text-[#262b2b] shrink-0"
                                    weight="fill"
                                />
                            </div>
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Company Health Insights</DialogTitle>
                            <DialogDescription>
                                Detailed insights about company health metrics
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            {/* Content will be added here */}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Body Section */}
            <div className="box-border flex flex-wrap gap-6 items-start p-6 relative shrink-0 w-full">
                <CompanyHealthCard score={82} />
            </div>
        </div>
    );
}

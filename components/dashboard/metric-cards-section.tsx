"use client";

import { CompanyHealthCard } from "./company-health-card";

export function MetricCardsSection() {
    return (
        <div className="bg-white rounded-xl border border-[#d9dede] overflow-hidden w-full">
            {/* Card Header */}
            <div className="px-4 py-3 border-b border-[#d9dede]">
                <h2 className="text-base font-medium text-[#262b2b] mb-1">
                    Company Health
                </h2>
                <p className="text-sm text-[#5d6c6b]">
                    Overall company health metrics
                </p>
            </div>

            {/* Body Section */}
            <div className="p-6">
                <CompanyHealthCard
                    score={82}
                    change="+3 pts vs last month"
                    description="Steady improvement in retention and overtime control"
                />
            </div>
        </div>
    );
}

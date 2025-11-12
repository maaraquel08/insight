"use client";

import { HeadcountTrend } from "./headcount-trend";
import { AttritionTrend } from "./attrition-trend";
import { TenureDemographics } from "./tenure-demographics";
import { LeaveAbsenteeism } from "./leave-absenteeism";

export function PeopleHealthSection() {
    return (
        <div className="bg-white rounded-xl border border-[#d9dede] w-full">
            {/* Card Header */}
            <div className="border-b border-[#d9dede] px-4 py-3">
                <div className="flex flex-col gap-2">
                    <h2 className="text-base font-medium text-[#262b2b]">
                        People Health
                    </h2>
                    <p className="text-sm text-[#5d6c6b] leading-5">
                        Understand the overall state of your workforce — how your headcount,
                        retention, and attendance are shaping your company's people health.
                    </p>
                </div>
            </div>

            {/* Card Body - Grid Layout */}
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Headcount Trend */}
                    <HeadcountTrend />

                    {/* Attrition Trend */}
                    <AttritionTrend />

                    {/* Tenure & Demographics */}
                    <TenureDemographics />

                    {/* Leave & Absenteeism Overview */}
                    <LeaveAbsenteeism />
                </div>
            </div>
        </div>
    );
}


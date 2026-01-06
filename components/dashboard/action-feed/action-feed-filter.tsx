"use client";

import { useState } from "react";
import type { ActionFeedItem } from "@/app/data/actionFeedData";

type Category = ActionFeedItem["category"] | "all";

const categoryLabels: Record<NonNullable<Category>, string> = {
    all: "All",
    payroll: "Payroll",
    engagement: "Engagement",
    attendance: "Attendance",
    productivity: "Productivity",
    operations: "Operations",
};

interface ActionFeedFilterProps {
    items: ActionFeedItem[];
    onFilterChange: (filteredItems: ActionFeedItem[]) => void;
}

export function ActionFeedFilter({
    items,
    onFilterChange,
}: ActionFeedFilterProps) {
    const [selectedCategory, setSelectedCategory] = useState<Category>("all");

    // Get unique categories from items
    const availableCategories = Array.from(
        new Set(items.map((item) => item.category).filter(Boolean))
    ) as NonNullable<Category>[];

    const handleCategoryChange = (category: Category) => {
        setSelectedCategory(category);

        if (category === "all") {
            onFilterChange(items);
        } else {
            const filtered = items.filter((item) => item.category === category);
            onFilterChange(filtered);
        }
    };

    // Get count for each category
    const getCategoryCount = (category: Category): number => {
        if (category === "all") {
            return items.length;
        }
        return items.filter((item) => item.category === category).length;
    };

    return (
        <div className="flex flex-wrap gap-2 items-center justify-center w-full px-4 py-4">
            <button
                onClick={() => handleCategoryChange("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    selectedCategory === "all"
                        ? "bg-[#158039] text-white"
                        : "bg-white border border-[#d9dede] text-[#262b2b] hover:bg-gray-50"
                }`}
            >
                <span>{categoryLabels.all}</span>
                <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        selectedCategory === "all"
                            ? "bg-white/20 text-white"
                            : "bg-[#f1f2f3] text-[#5d6c6b]"
                    }`}
                >
                    {getCategoryCount("all")}
                </span>
            </button>
            {availableCategories.map((category) => {
                const count = getCategoryCount(category);
                return (
                    <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                            selectedCategory === category
                                ? "bg-[#158039] text-white"
                                : "bg-white border border-[#d9dede] text-[#262b2b] hover:bg-gray-50"
                        }`}
                    >
                        <span>{categoryLabels[category]}</span>
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                selectedCategory === category
                                    ? "bg-white/20 text-white"
                                    : "bg-[#f1f2f3] text-[#5d6c6b]"
                            }`}
                        >
                            {count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

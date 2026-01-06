"use client";

import { useState } from "react";
import { ActionFeedCard } from "./action-feed-card";
import { ActionFeedHeader } from "./action-feed-header";
import { ActionFeedBody } from "./action-feed-body";
import { ActionFeedFooter } from "./action-feed-footer";
import { ActionFeedFilter } from "./action-feed-filter";
import { actionFeedData } from "@/app/data/actionFeedData";
import type { ActionFeedItem } from "@/app/data/actionFeedData";

export function ActionFeed() {
    const [filteredItems, setFilteredItems] = useState<ActionFeedItem[]>(actionFeedData);

    return (
        <div className="flex flex-col items-center gap-4 w-full py-6">
            {/* Filter Component */}
            <ActionFeedFilter
                items={actionFeedData}
                onFilterChange={setFilteredItems}
            />

            {/* Action Feed Cards */}
            {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                    <ActionFeedCard
                        key={item.id}
                        header={
                            <ActionFeedHeader
                                title={item.header.title}
                                timestamp={item.header.timestamp}
                                priority={item.header.priority}
                            />
                        }
                        body={
                            <ActionFeedBody
                                mainAlert={item.body.mainAlert}
                                comparison={item.body.comparison}
                                aiGenerated={item.body.aiGenerated}
                                impact={item.body.impact}
                            />
                        }
                        footer={<ActionFeedFooter actions={item.footer.actions} />}
                    />
                ))
            ) : (
                <div className="text-center py-12 text-[#5d6c6b]">
                    <p className="text-sm">No items found for this category.</p>
                </div>
            )}
        </div>
    );
}

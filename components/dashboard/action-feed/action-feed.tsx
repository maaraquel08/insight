"use client";

import { ActionFeedCard } from "./action-feed-card";
import { ActionFeedHeader } from "./action-feed-header";
import { ActionFeedBody } from "./action-feed-body";
import { ActionFeedFooter } from "./action-feed-footer";
import { actionFeedData } from "@/app/data/actionFeedData";

export function ActionFeed() {
    return (
        <div className="flex flex-col items-center gap-4 w-full py-6">
            {actionFeedData.map((item) => (
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
            ))}
        </div>
    );
}

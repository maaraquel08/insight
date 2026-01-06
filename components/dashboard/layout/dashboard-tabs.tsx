"use client";

import { ReactNode, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ActionFeed } from "../action-feed/action-feed";
import { PersonalizeHeader } from "./personalize-header";
import { EditModeBanner } from "../edit-mode/edit-mode-banner";

interface DashboardTabsProps {
    actionFeedCount?: number;
    analyticsContent: ReactNode;
}

export function DashboardTabs({
    actionFeedCount = 8,
    analyticsContent,
}: DashboardTabsProps) {
    const [activeTab, setActiveTab] = useState("analytics");

    return (
        <div className="w-full flex flex-col gap-6">
            <PersonalizeHeader activeTab={activeTab} />
            <EditModeBanner />
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                defaultValue="analytics"
                className="w-full"
            >
                <TabsList className="inline-flex h-auto items-center justify-start gap-0 border-b border-[#d9dede] bg-transparent p-0 rounded-none w-full">
                <TabsTrigger
                    value="action-feed"
                    className="inline-flex items-center justify-center gap-2 min-w-[64px] px-4 py-4 rounded-none border-b-2 border-transparent bg-transparent text-sm font-normal text-[#262b2b] uppercase tracking-[0.7px] data-[state=active]:border-[#158039] data-[state=active]:text-[#262b2b] data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-[#262b2b] focus-visible:outline-none focus-visible:ring-0"
                >
                    <span className="leading-[14px]">Action feed</span>
                    {actionFeedCount > 0 && (
                        <span className="flex items-center justify-center min-w-[16px] px-1 py-0.5 bg-[#da2f38] text-white text-xs font-medium leading-[12px] tracking-[0.7px] uppercase rounded-full">
                            {actionFeedCount}
                        </span>
                    )}
                </TabsTrigger>
                <TabsTrigger
                    value="analytics"
                    className="inline-flex items-center justify-center gap-2 min-w-[64px] px-4 py-4 rounded-none border-b-2 border-transparent bg-transparent text-sm font-normal text-[#262b2b] uppercase tracking-[0.7px] data-[state=active]:border-[#158039] data-[state=active]:text-[#262b2b] data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-[#262b2b] focus-visible:outline-none focus-visible:ring-0"
                >
                    <span className="leading-[14px]">Analytics</span>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="action-feed" className="mt-0">
                <ActionFeed />
            </TabsContent>
            <TabsContent value="analytics" className="mt-0">
                {analyticsContent}
            </TabsContent>
        </Tabs>
        </div>
    );
}

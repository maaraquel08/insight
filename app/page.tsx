"use client";

import { DashboardContainer } from "@/components/dashboard/layout/dashboard-container";
import { DashboardGrid } from "@/components/dashboard/layout/dashboard-grid";
import { EditModeBanner } from "@/components/dashboard/edit-mode/edit-mode-banner";
import { PersonalizeHeader } from "@/components/dashboard/layout/personalize-header";
import { ExecutiveSnapshotSection } from "@/components/dashboard/widgets/executive-snapshot-section";
import { FloatingChatSidekick } from "@/components/chatbot-sidekick";

export default function Home() {
    return (
        <DashboardContainer userId="user-1" role="admin">
            <main className="bg-[#f1f2f3] min-h-screen flex flex-col">
                <div className="flex flex-col gap-6 p-10 flex-1">
                    <div className="flex flex-col gap-6 items-start max-w-[1320px] w-full mx-auto">
                        <PersonalizeHeader />

                        {/* Edit Mode Banner */}
                        <EditModeBanner />

                        {/* Executive Snapshot Section - Metric cards at top */}
                        <div className="w-full">
                            <ExecutiveSnapshotSection />
                        </div>

                        {/* Dashboard Grid - Includes all widgets including Company Health */}
                        <div className="w-full">
                            <DashboardGrid />
                        </div>
                    </div>
                </div>
                
                {/* Floating Chat Sidekick */}
                <FloatingChatSidekick />
            </main>
        </DashboardContainer>
    );
}

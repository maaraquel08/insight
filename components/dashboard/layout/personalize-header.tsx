"use client";

import { useRouter, usePathname } from "next/navigation";
import { useDashboard } from "@/contexts/dashboard-context";
import { PageHeader } from "@/components/page-header";
import { EditModeControls } from "../edit-mode/edit-mode-controls";
import { WidgetLibrary } from "../edit-mode/widget-library";
import { Button } from "@/components/ui/button";

interface PersonalizeHeaderProps {
    title?: string;
    description?: string;
    activeTab?: string;
}

export function PersonalizeHeader({
    title = "Foresight Analytics",
    description = "Central analytics tool for key decision makers, CEO, admin, COO, executives",
    activeTab,
}: PersonalizeHeaderProps = {}) {
    const router = useRouter();
    const pathname = usePathname();
    const { isEditMode, toggleEditMode } = useDashboard();
    const isHomePage = pathname === "/";
    const isReportsHubPage = pathname === "/reports-hub";
    const isAttritionPage = pathname === "/reports-hub/attrition";
    const isAnalyticsTab = activeTab === "analytics";

    const handleCreateReport = () => {
        router.push("/create-report");
    };

    return (
        <div className="flex items-center justify-between w-full">
            <PageHeader
                title={title}
                description={description}
                actionLabel={isReportsHubPage ? "Create Report" : undefined}
                onAction={isReportsHubPage ? handleCreateReport : undefined}
            />
            <div className="flex items-center gap-2">
                {isEditMode && isHomePage && <WidgetLibrary />}
                {isEditMode && isHomePage ? (
                    <EditModeControls />
                ) : (
                    <>
                        {isAttritionPage && (
                            <Button
                                onClick={handleCreateReport}
                                className="bg-[#158039] hover:bg-[#158039]/90 text-white h-9 min-w-[56px] px-2 py-3 rounded-lg"
                                size="sm"
                            >
                                Export Report
                            </Button>
                        )}
                        {isHomePage && isAnalyticsTab && (
                            <Button
                                onClick={toggleEditMode}
                                variant="outline"
                                className="h-9 min-w-[56px] px-2 py-3 rounded-lg border-[#b8c1c0] text-[#262b2b] hover:bg-[#f1f2f3]"
                                size="sm"
                            >
                                Edit
                            </Button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}


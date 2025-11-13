"use client";

import { useRouter } from "next/navigation";
import { useDashboard } from "@/contexts/dashboard-context";
import { PageHeader } from "@/components/page-header";
import { EditModeControls } from "@/components/dashboard/edit-mode-controls";
import { WidgetLibrary } from "@/components/dashboard/widget-library";
import { Button } from "@/components/ui/button";

export function PersonalizeHeader() {
    const router = useRouter();
    const { isEditMode, toggleEditMode } = useDashboard();

    const handleCreateReport = () => {
        router.push("/create-report");
    };

    return (
        <div className="flex items-center justify-between w-full">
            <PageHeader
                title="Foresight Analytics"
                description="Central analytics tool for key decision makers, CEO, admin, COO, executives"
            />
            <div className="flex items-center gap-2">
                {isEditMode && <WidgetLibrary />}
                {isEditMode ? (
                    <EditModeControls />
                ) : (
                    <>
                        <Button
                            onClick={handleCreateReport}
                            className="bg-[#158039] hover:bg-[#158039]/90 text-white h-9 min-w-[56px] px-2 py-3 rounded-lg"
                            size="sm"
                        >
                            Create Report
                        </Button>
                        <Button
                            onClick={toggleEditMode}
                            variant="outline"
                            className="h-9 min-w-[56px] px-2 py-3 rounded-lg border-[#b8c1c0] text-[#262b2b] hover:bg-[#f1f2f3]"
                            size="sm"
                        >
                            Edit
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}


"use client";

import { Edit2 } from "lucide-react";
import { useDashboard } from "@/contexts/dashboard-context";

export function EditModeBanner() {
    const { isEditMode, hasUnsavedChanges } = useDashboard();

    if (!isEditMode) {
        return null;
    }

    return (
        <div className="w-full bg-[#158039]/10 border border-[#158039]/20 rounded-lg px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#158039]" />
                <p className="text-sm text-[#158039] font-medium">
                    Edit Mode Active
                </p>
                {hasUnsavedChanges && (
                    <span className="text-xs text-[#5d6c6b] ml-2">
                        • Unsaved changes
                    </span>
                )}
            </div>
            <p className="text-xs text-[#5d6c6b]">
                Press Esc to exit • Drag widgets to reorder
            </p>
        </div>
    );
}


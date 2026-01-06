"use client";

import { ReactNode, useState } from "react";
import { GripVertical, X, Lock } from "lucide-react";
import { useDashboard } from "@/contexts/dashboard-context";
import { getWidgetById } from "@/lib/widget-registry";
import type { WidgetLayout } from "@/types/dashboard";
import { Button } from "@/components/ui/button";

interface WidgetWrapperProps {
    layout: WidgetLayout;
    children: ReactNode;
    isDragging?: boolean;
    dragHandleProps?: {
        attributes: any;
        listeners: any;
    };
}

export function WidgetWrapper({
    layout,
    children,
    isDragging = false,
    dragHandleProps,
}: WidgetWrapperProps) {
    const { isEditMode, removeWidget } = useDashboard();
    const [showControls, setShowControls] = useState(false);
    const widgetMetadata = getWidgetById(layout.widgetId);
    const isLocked = widgetMetadata?.locked ?? false;

    const handleRemove = () => {
        if (!isLocked) {
            removeWidget(layout.id);
        }
    };

    if (!isEditMode) {
        return <div className="w-full h-auto">{children}</div>;
    }

    return (
        <div
            className={`relative group w-full h-auto ${
                isDragging ? "opacity-50" : ""
            }`}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            {/* Edit Mode Overlay */}
            {isEditMode && (
                <div
                    className={`absolute inset-0 border-2 rounded-xl pointer-events-none z-10 ${
                        showControls || isDragging
                            ? "border-[#158039]"
                            : "border-transparent"
                    } transition-colors`}
                />
            )}

            {/* Widget Content - height follows content */}
            <div className="w-full h-auto">{children}</div>

            {/* Edit Controls */}
            {isEditMode && (showControls || isDragging) && (
                <>
                    {/* Drag Handle */}
                    {dragHandleProps && (
                        <div
                            className="absolute top-2 left-2 z-20 cursor-grab active:cursor-grabbing"
                            {...dragHandleProps.attributes}
                            {...dragHandleProps.listeners}
                        >
                            <div className="bg-white rounded-md shadow-md p-1.5 border border-[#d9dede]">
                                <GripVertical className="w-4 h-4 text-[#5d6c6b]" />
                            </div>
                        </div>
                    )}

                    {/* Lock Indicator */}
                    {isLocked && (
                        <div className="absolute top-2 right-2 z-20">
                            <div className="bg-white rounded-md shadow-md p-1.5 border border-[#d9dede]">
                                <Lock className="w-4 h-4 text-[#738482]" />
                            </div>
                        </div>
                    )}

                    {/* Controls Menu */}
                    {!isLocked && (
                        <div className="absolute top-2 right-2 z-20">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 bg-white hover:bg-red-50 border border-[#d9dede] rounded-md shadow-md"
                                onClick={handleRemove}
                                aria-label="Remove widget"
                            >
                                <X className="w-4 h-4 text-red-600" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}


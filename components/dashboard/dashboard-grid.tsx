"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDashboard } from "@/contexts/dashboard-context";
import { WidgetWrapper } from "./widget-wrapper";
import { getWidgetComponent } from "./widget-components";
import type { WidgetLayout } from "@/types/dashboard";

interface SortableWidgetProps {
    layout: WidgetLayout;
}

function SortableWidget({ layout }: SortableWidgetProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: layout.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    const WidgetComponent = getWidgetComponent(layout.widgetId);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`h-auto ${
                isDragging ? "z-50" : ""
            }`}
        >
            <WidgetWrapper
                layout={layout}
                isDragging={isDragging}
                dragHandleProps={{ attributes, listeners }}
            >
                {WidgetComponent ? (
                    <WidgetComponent />
                ) : (
                    <div className="bg-white rounded-xl border border-[#d9dede] p-8">
                        <p className="text-sm text-[#5d6c6b]">
                            Widget "{layout.widgetId}" not found
                        </p>
                    </div>
                )}
            </WidgetWrapper>
        </div>
    );
}

export function DashboardGrid() {
    const { config, isEditMode, reorderWidgets } = useDashboard();
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Sort widgets by order
    const sortedWidgets = useMemo(() => {
        return [...config.widgets].sort((a, b) => a.order - b.order);
    }, [config.widgets]);

    // Get density spacing - uniform gaps for masonry/unsplash-style layout
    // Match main page gap-6 spacing
    const gapClass = config.density === "Compact" ? "gap-2" : "gap-6";
    const gapValue = config.density === "Compact" ? 0.5 : 1.5; // gap-2 = 0.5rem, gap-6 = 1.5rem

    // Get widget width styles for masonry layout
    // Uniform gaps, content-based heights, natural flow
    // All widgets use 2-column layout with uniform gaps
    const getWidgetWidth = (): { style: CSSProperties } => {
        // For 2-column: calc(50% - gap/2) ensures uniform gaps
        return {
            style: { width: `calc(50% - ${gapValue / 2}rem)` }
        };
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);

        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = sortedWidgets.findIndex(
            (w) => w.id === active.id
        );
        const newIndex = sortedWidgets.findIndex((w) => w.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            const newWidgets = arrayMove(sortedWidgets, oldIndex, newIndex);
            // Update order based on new positions
            const reorderedWidgets = newWidgets.map((widget, index) => ({
                ...widget,
                order: index,
            }));
            reorderWidgets(reorderedWidgets);
        }
    };

    if (!isEditMode) {
        // Render without drag-and-drop when not in edit mode
        // Flexbox masonry layout: uniform gaps, content-based heights, natural flow
        return (
            <div className={`flex flex-wrap ${gapClass} items-start`}>
                {sortedWidgets.map((layout) => {
                    const WidgetComponent = getWidgetComponent(layout.widgetId);
                    const widthProps = getWidgetWidth();
                    return (
                        <div 
                            key={layout.id} 
                            style={{ ...widthProps.style, height: 'auto' }}
                        >
                            <WidgetWrapper layout={layout}>
                                {WidgetComponent ? (
                                    <WidgetComponent />
                                ) : (
                                    <div className="bg-white rounded-xl border border-[#d9dede] p-8">
                                        <p className="text-sm text-[#5d6c6b]">
                                            Widget "{layout.widgetId}" not found
                                        </p>
                                    </div>
                                )}
                            </WidgetWrapper>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {/* Flexbox masonry layout: uniform gaps, content-based heights, natural flow */}
            <div className={`flex flex-wrap ${gapClass} items-start min-h-[400px]`}>
                <SortableContext
                    items={sortedWidgets.map((w) => w.id)}
                    strategy={rectSortingStrategy}
                >
                    {sortedWidgets.map((layout) => {
                        const widthProps = getWidgetWidth();
                        return (
                            <div 
                                key={layout.id} 
                                style={{ ...widthProps.style, height: 'auto' }}
                            >
                                <SortableWidget layout={layout} />
                            </div>
                        );
                    })}
                </SortableContext>
            </div>
            <DragOverlay>
                {activeId ? (
                    (() => {
                        const activeWidget = sortedWidgets.find(
                            (w) => w.id === activeId
                        );
                        if (!activeWidget) return null;

                        const WidgetComponent = getWidgetComponent(
                            activeWidget.widgetId
                        );
                        const widthProps = getWidgetWidth();

                        return (
                            <div 
                                style={{ ...widthProps.style, opacity: 0.9 }}
                            >
                                <div className="bg-white rounded-xl border-2 border-[#158039] shadow-lg">
                                    {WidgetComponent ? (
                                        <WidgetComponent />
                                    ) : (
                                        <div className="p-8">
                                            <p className="text-sm text-[#5d6c6b]">
                                                Widget "{activeWidget.widgetId}" not found
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })()
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}


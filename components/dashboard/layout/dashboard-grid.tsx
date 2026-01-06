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
import { WidgetWrapper } from "../edit-mode/widget-wrapper";
import { DraggableWidgetWrapper } from "../draggable-widget-wrapper";
import { getWidgetComponent } from "../edit-mode/widget-components";
import type { WidgetLayout } from "@/types/dashboard";
import { MasonryGrid, masonryItemStyle } from "./masonry-grid";

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
            className={`h-auto ${isDragging ? "z-50" : ""}`}
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
                            Widget &quot;{layout.widgetId}&quot; not found
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

    // Use standardized masonry grid with 24px uniform gap

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);

        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = sortedWidgets.findIndex((w) => w.id === active.id);
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
        // But enable drag-to-chat functionality
        // Masonry layout using CSS columns: uniform 24px gaps, content-based heights, natural flow
        return (
            <MasonryGrid>
                {sortedWidgets.map((layout) => {
                    const WidgetComponent = getWidgetComponent(layout.widgetId);
                    return (
                        <div key={layout.id} style={masonryItemStyle}>
                            <DraggableWidgetWrapper layout={layout}>
                            <WidgetWrapper layout={layout}>
                                {WidgetComponent ? (
                                    <WidgetComponent />
                                ) : (
                                    <div className="bg-white rounded-xl border border-[#d9dede] p-8">
                                        <p className="text-sm text-[#5d6c6b]">
                                            Widget &quot;{layout.widgetId}&quot;
                                            not found
                                        </p>
                                    </div>
                                )}
                            </WidgetWrapper>
                            </DraggableWidgetWrapper>
                        </div>
                    );
                })}
            </MasonryGrid>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {/* Masonry layout using CSS columns: uniform 24px gaps, content-based heights, natural flow */}
            <MasonryGrid style={{ minHeight: "400px" }}>
                <SortableContext
                    items={sortedWidgets.map((w) => w.id)}
                    strategy={rectSortingStrategy}
                >
                    {sortedWidgets.map((layout) => {
                        return (
                            <div
                                key={layout.id}
                                style={masonryItemStyle}
                            >
                                <SortableWidget layout={layout} />
                            </div>
                        );
                    })}
                </SortableContext>
            </MasonryGrid>
            <DragOverlay>
                {activeId
                    ? (() => {
                          const activeWidget = sortedWidgets.find(
                              (w) => w.id === activeId
                          );
                          if (!activeWidget) return null;

                          const WidgetComponent = getWidgetComponent(
                              activeWidget.widgetId
                          );

                          return (
                              <div
                                  style={{ 
                                      width: "calc(50% - 0.75rem)", 
                                      opacity: 0.9 
                                  }}
                              >
                                  <div className="bg-white rounded-xl border-2 border-[#158039] shadow-lg">
                                      {WidgetComponent ? (
                                          <WidgetComponent />
                                      ) : (
                                          <div className="p-8">
                                              <p className="text-sm text-[#5d6c6b]">
                                                  Widget &quot;
                                                  {activeWidget.widgetId}&quot;
                                                  not found
                                              </p>
                                          </div>
                                      )}
                                  </div>
                              </div>
                          );
                      })()
                    : null}
            </DragOverlay>
        </DndContext>
    );
}

"use client";

import { useState, useEffect } from "react";
import {
    Users,
    LogOut,
    DollarSign,
    RotateCw,
    GripVertical,
    X,
} from "lucide-react";
import { ExecutiveSnapshotCard } from "./executive-snapshot-card";
import { useDashboard } from "@/contexts/dashboard-context";
import { Button } from "@/components/ui/button";
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
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
// @ts-ignore - JavaScript file
import { getHeadcountTrendData } from "@/app/data/peopleHealthData";
// @ts-ignore - JavaScript file
import { getAttritionTrendData } from "@/app/data/peopleHealthData";
// @ts-ignore - JavaScript file
import { getLeaveAbsenteeismData } from "@/app/data/peopleHealthData";

interface CardData {
    id: string;
    icon: React.ReactNode;
    title: string;
    value: string;
    change: string;
    changeType: "positive" | "negative";
    description: string;
}

interface SortableCardProps {
    card: CardData;
    onRemove: (cardId: string) => void;
}

function SortableCard({ card, onRemove }: SortableCardProps) {
    const { isEditMode } = useDashboard();
    const [isHovered, setIsHovered] = useState(false);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: card.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex-1 min-w-0 relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Edit Mode Overlay */}
            {isEditMode && (
                <div
                    className={`absolute inset-0 border-2 rounded-lg pointer-events-none z-10 ${
                        isHovered || isDragging
                            ? "border-[#158039]"
                            : "border-transparent"
                    } transition-colors`}
                />
            )}

            {/* Card Content */}
            <ExecutiveSnapshotCard
                icon={card.icon}
                title={card.title}
                value={card.value}
                change={card.change}
                changeType={card.changeType}
                description={card.description}
            />

            {/* Edit Controls */}
            {isEditMode && (isHovered || isDragging) && (
                <>
                    {/* Drag Handle */}
                    <div
                        className="absolute top-2 left-2 z-20 cursor-grab active:cursor-grabbing"
                        {...attributes}
                        {...listeners}
                    >
                        <div className="bg-white rounded-md shadow-md p-1.5 border border-[#d9dede]">
                            <GripVertical className="w-4 h-4 text-[#5d6c6b]" />
                        </div>
                    </div>

                    {/* Remove Button */}
                    <div className="absolute top-2 right-2 z-20">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 bg-white hover:bg-red-50 border border-[#d9dede] rounded-md shadow-md"
                            onClick={() => onRemove(card.id)}
                            aria-label="Remove card"
                        >
                            <X className="w-4 h-4 text-red-600" />
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

export function ExecutiveSnapshotSection() {
    const { isEditMode } = useDashboard();
    const [headcountData, setHeadcountData] = useState<any>(null);
    const [attritionData, setAttritionData] = useState<any>(null);
    const [leaveData, setLeaveData] = useState<any>(null);
    const [cards, setCards] = useState<CardData[]>([]);
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

    useEffect(() => {
        const hData = getHeadcountTrendData() as any;
        const aData = getAttritionTrendData() as any;
        const lData = getLeaveAbsenteeismData() as any;

        setHeadcountData(hData);
        setAttritionData(aData);
        setLeaveData(lData);

        // Initialize cards data
        if (hData && aData && lData) {
            setCards([
                {
                    id: "headcount",
                    icon: <Users className="w-5 h-5 text-[#738482]" />,
                    title: "Total Headcount",
                    value: (hData.currentHeadcount || 0).toLocaleString(),
                    change: `+${hData.percentageChange || 0}% vs last month`,
                    changeType: hData.changeType || "positive",
                    description: hData.description || "",
                },
                {
                    id: "attrition",
                    icon: <LogOut className="w-5 h-5 text-[#738482]" />,
                    title: "Attrition Rate",
                    value: `${aData.currentRate || 0}%`,
                    change: `${aData.changeSymbol || ""} ${
                        aData.change || 0
                    }% vs previous month`,
                    changeType: aData.changeType || "positive",
                    description: aData.description || "",
                },
                {
                    id: "payroll",
                    icon: <DollarSign className="w-5 h-5 text-[#738482]" />,
                    title: "Payroll Cost",
                    value: "₱82.4M",
                    change: "+5.1% vs last month",
                    changeType: "negative",
                    description:
                        "Increase due to higher overtime and new hires in Q3",
                },
                {
                    id: "overtime",
                    icon: <RotateCw className="w-5 h-5 text-[#738482]" />,
                    title: "Overtime % of Payroll",
                    value: `${lData.currentAbsenteeismRate || 0}%`,
                    change: `${lData.changeSymbol || ""} ${
                        lData.change || 0
                    } pts vs last month`,
                    changeType: lData.changeType || "positive",
                    description:
                        "Spike due to coverage gaps during peak season",
                },
            ]);
        }
    }, []);

    const handleRemoveCard = (cardId: string) => {
        setCards(cards.filter((card) => card.id !== cardId));
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

        const oldIndex = cards.findIndex((c) => c.id === active.id);
        const newIndex = cards.findIndex((c) => c.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            setCards(arrayMove(cards, oldIndex, newIndex));
        }
    };

    if (!headcountData || !attritionData || !leaveData || cards.length === 0) {
        return (
            <div className="flex gap-6 w-full">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex-1 min-w-0">
                        <div className="bg-[#f7f8f8] rounded-lg p-4 h-32 animate-pulse" />
                    </div>
                ))}
            </div>
        );
    }

    if (!isEditMode) {
        // Render without drag-and-drop when not in edit mode
        return (
            <div className="flex gap-6 w-full">
                {cards.map((card) => (
                    <div key={card.id} className="flex-1 min-w-0">
                        <ExecutiveSnapshotCard
                            icon={card.icon}
                            title={card.title}
                            value={card.value}
                            change={card.change}
                            changeType={card.changeType}
                            description={card.description}
                        />
                    </div>
                ))}
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
            <div className="flex gap-6 w-full">
                <SortableContext
                    items={cards.map((c) => c.id)}
                    strategy={horizontalListSortingStrategy}
                >
                    {cards.map((card) => (
                        <SortableCard
                            key={card.id}
                            card={card}
                            onRemove={handleRemoveCard}
                        />
                    ))}
                </SortableContext>
            </div>
            <DragOverlay>
                {activeId
                    ? (() => {
                          const activeCard = cards.find(
                              (c) => c.id === activeId
                          );
                          if (!activeCard) return null;

                          return (
                              <div className="flex-1 min-w-0 opacity-90">
                                  <ExecutiveSnapshotCard
                                      icon={activeCard.icon}
                                      title={activeCard.title}
                                      value={activeCard.value}
                                      change={activeCard.change}
                                      changeType={activeCard.changeType}
                                      description={activeCard.description}
                                  />
                              </div>
                          );
                      })()
                    : null}
            </DragOverlay>
        </DndContext>
    );
}

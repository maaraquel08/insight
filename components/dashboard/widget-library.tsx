"use client";

import { useState, useMemo } from "react";
import { Search, Plus, X, Minus } from "lucide-react";
import { useDashboard } from "@/contexts/dashboard-context";
import { widgetRegistry, searchWidgets, getWidgetsByCategory } from "@/lib/widget-registry";
import type { WidgetMetadata } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface WidgetLibraryItemProps {
    widget: WidgetMetadata;
    isAdded: boolean;
    onAdd: () => void;
    onRemove: () => void;
}

function WidgetLibraryItem({
    widget,
    isAdded,
    onAdd,
    onRemove,
}: WidgetLibraryItemProps) {
    // Get tag styling based on category
    const getTagStyles = (category: string) => {
        if (category === "People Health") {
            return "bg-[#fffbc5] border border-[#985008] text-[#985008]";
        }
        if (category === "Time & Attendance") {
            return "bg-[#dcfce6] border border-[#158039] text-[#158039]";
        }
        // Default styling for other categories
        return "bg-[#f1f2f3] border border-[#d9dede] text-[#5d6c6b]";
    };

    // Get data source tag styling
    const getDataSourceTagStyles = (source: string) => {
        if (source === "People Health") {
            return "bg-[#fffbc5] border border-[#985008] text-[#985008]";
        }
        if (source === "Time & Attendance") {
            return "bg-[#dcfce6] border border-[#158039] text-[#158039]";
        }
        return "bg-[#f1f2f3] border border-[#d9dede] text-[#5d6c6b]";
    };

    return (
        <div className="bg-white rounded-lg border border-[#d9dede] hover:border-[#158039] transition-colors">
            <div className="flex flex-col">
                {/* Body Section */}
                <div className="border-b border-[#d9dede] p-4">
                    <div className="flex flex-col gap-1">
                        {/* Title */}
                        <h3 className="text-base font-medium text-[#262b2b] leading-6">
                            {widget.name}
                        </h3>
                        {/* Description */}
                        <p className="text-base font-normal text-[#738482] leading-6">
                            {widget.description}
                        </p>
                        {/* Chips/Tags */}
                        <div className="flex flex-wrap gap-2 mt-1">
                            <span
                                className={`text-xs font-medium uppercase tracking-[0.7px] px-1 py-1 rounded-sm ${getTagStyles(
                                    widget.category
                                )}`}
                            >
                                {widget.category}
                            </span>
                            {widget.dataSource
                                ?.filter(
                                    (source) => source !== widget.category
                                )
                                .map((source) => (
                                    <span
                                        key={source}
                                        className={`text-xs font-medium uppercase tracking-[0.7px] px-1 py-1 rounded-sm ${getDataSourceTagStyles(
                                            source
                                        )}`}
                                    >
                                        {source}
                                    </span>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="flex items-center gap-2 p-4">
                    {isAdded ? (
                        <Button
                            onClick={onRemove}
                            variant="outline"
                            className="max-h-9 min-w-[48px] border border-[#b61f27] text-[#b61f27] bg-white hover:bg-[#b61f27]/5 hover:text-[#b61f27] rounded-lg px-2 py-2"
                        >
                            <Minus className="w-3 h-3 mr-2" />
                            <span className="text-sm font-medium">Remove</span>
                        </Button>
                    ) : (
                        <Button
                            onClick={onAdd}
                            className="max-h-9 min-w-[48px] bg-[#158039] hover:bg-[#158039]/90 text-white rounded-lg px-2 py-2"
                        >
                            <Plus className="w-3 h-3 mr-2" />
                            <span className="text-sm font-medium">Add</span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export function WidgetLibrary() {
    const { config, isEditMode, addWidget, removeWidget } = useDashboard();
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [isOpen, setIsOpen] = useState(false);

    const addedWidgetIds = useMemo(
        () => new Set(config.widgets.map((w) => w.widgetId)),
        [config.widgets]
    );

    const widgetLayoutIdMap = useMemo(() => {
        const map = new Map<string, string>();
        config.widgets.forEach((w) => {
            map.set(w.widgetId, w.id);
        });
        return map;
    }, [config.widgets]);

    const filteredWidgets = useMemo(() => {
        let widgets = widgetRegistry;

        // Apply search filter
        if (searchQuery) {
            widgets = searchWidgets(searchQuery);
        }

        // Apply category filter
        if (categoryFilter !== "all") {
            widgets = widgets.filter(
                (w) => w.category === categoryFilter
            );
        }

        return widgets;
    }, [searchQuery, categoryFilter]);

    const categories = useMemo(() => {
        const cats = new Set(widgetRegistry.map((w) => w.category));
        return Array.from(cats);
    }, []);

    const handleAddWidget = (widgetId: string) => {
        const widget = widgetRegistry.find((w) => w.id === widgetId);
        if (widget && !addedWidgetIds.has(widgetId)) {
            addWidget(widgetId);
        }
    };

    const handleRemoveWidget = (widgetId: string) => {
        const layoutId = widgetLayoutIdMap.get(widgetId);
        if (layoutId) {
            removeWidget(layoutId);
        }
    };

    if (!isEditMode) {
        return null;
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    className="h-9 min-w-[56px] px-3 rounded-lg border-[#b8c1c0] text-[#262b2b] hover:bg-[#f1f2f3]"
                    size="sm"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Widget
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Widget Library</SheetTitle>
                    <SheetDescription>
                        Browse and add widgets to your dashboard
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 flex flex-col gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#5d6c6b]" />
                        <Input
                            placeholder="Search widgets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                                onClick={() => setSearchQuery("")}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    {/* Category Filter */}
                    <Select
                        value={categoryFilter}
                        onValueChange={setCategoryFilter}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Widget List */}
                    <div className="flex flex-col gap-3">
                        {filteredWidgets.length === 0 ? (
                            <div className="text-center py-8 text-sm text-[#5d6c6b]">
                                No widgets found. Try adjusting your search or
                                filters.
                            </div>
                        ) : (
                            filteredWidgets.map((widget) => (
                                <WidgetLibraryItem
                                    key={widget.id}
                                    widget={widget}
                                    isAdded={addedWidgetIds.has(widget.id)}
                                    onAdd={() => handleAddWidget(widget.id)}
                                    onRemove={() => handleRemoveWidget(widget.id)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}


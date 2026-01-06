"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";
import type { WidgetLayout } from "@/types/dashboard";

export interface ChatWidgetChip {
    id: string;
    widgetLayout: WidgetLayout;
    timestamp: number;
}

interface ChatWidgetContextType {
    chips: ChatWidgetChip[];
    addChip: (widgetLayout: WidgetLayout) => void;
    removeChip: (chipId: string) => void;
    clearChips: () => void;
    isDragOver: boolean;
    setIsDragOver: (isDragOver: boolean) => void;
    draggingWidget: WidgetLayout | null;
    setDraggingWidget: (widget: WidgetLayout | null) => void;
}

const ChatWidgetContext = createContext<ChatWidgetContextType | undefined>(
    undefined
);

export function ChatWidgetProvider({ children }: { children: ReactNode }) {
    const [chips, setChips] = useState<ChatWidgetChip[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [draggingWidget, setDraggingWidget] = useState<WidgetLayout | null>(
        null
    );

    const addChip = useCallback((widgetLayout: WidgetLayout) => {
        const chip: ChatWidgetChip = {
            id: `chip-${Date.now()}-${Math.random()}`,
            widgetLayout,
            timestamp: Date.now(),
        };
        setChips((prev) => [...prev, chip]);
    }, []);

    const removeChip = useCallback((chipId: string) => {
        setChips((prev) => prev.filter((chip) => chip.id !== chipId));
    }, []);

    const clearChips = useCallback(() => {
        setChips([]);
    }, []);

    return (
        <ChatWidgetContext.Provider
            value={{
                chips,
                addChip,
                removeChip,
                clearChips,
                isDragOver,
                setIsDragOver,
                draggingWidget,
                setDraggingWidget,
            }}
        >
            {children}
        </ChatWidgetContext.Provider>
    );
}

export function useChatWidget() {
    const context = useContext(ChatWidgetContext);
    if (context === undefined) {
        throw new Error(
            "useChatWidget must be used within a ChatWidgetProvider"
        );
    }
    return context;
}


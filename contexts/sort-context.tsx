"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type SortDirection = "asc" | "desc";

export interface SortConfig {
    columnId: string;
    direction: SortDirection;
}

interface SortContextType {
    sorts: SortConfig[];
    toggleSort: (columnId: string) => void;
    clearSorts: () => void;
}

const SortContext = createContext<SortContextType | undefined>(undefined);

export function SortProvider({ children }: { children: ReactNode }) {
    const [sorts, setSorts] = useState<SortConfig[]>([]);

    const toggleSort = (columnId: string) => {
        setSorts((prev) => {
            const existingIndex = prev.findIndex(
                (sort) => sort.columnId === columnId
            );

            if (existingIndex !== -1) {
                // Column already exists in sort array
                const existing = prev[existingIndex];
                if (existing.direction === "asc") {
                    // Change to desc
                    const updated = [...prev];
                    updated[existingIndex] = {
                        ...existing,
                        direction: "desc",
                    };
                    return updated;
                } else {
                    // Remove from sort array
                    return prev.filter((_, index) => index !== existingIndex);
                }
            } else {
                // Add new column to sort array (appended)
                return [...prev, { columnId, direction: "asc" }];
            }
        });
    };

    const clearSorts = () => {
        setSorts([]);
    };

    return (
        <SortContext.Provider value={{ sorts, toggleSort, clearSorts }}>
            {children}
        </SortContext.Provider>
    );
}

export function useSort() {
    const context = useContext(SortContext);
    if (context === undefined) {
        throw new Error("useSort must be used within a SortProvider");
    }
    return context;
}


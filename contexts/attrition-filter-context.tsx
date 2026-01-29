"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface AttritionFilters {
    dateFrom: Date | null;
    dateTo: Date | null;
    departments: string[];
}

interface AttritionFilterContextType {
    filters: AttritionFilters;
    setFilters: (filters: AttritionFilters) => void;
    clearFilters: () => void;
}

const AttritionFilterContext = createContext<AttritionFilterContextType | undefined>(undefined);

const defaultFilters: AttritionFilters = {
    dateFrom: null,
    dateTo: null,
    departments: [],
};

export function AttritionFilterProvider({ children }: { children: ReactNode }) {
    const [filters, setFilters] = useState<AttritionFilters>(defaultFilters);

    const clearFilters = () => {
        setFilters(defaultFilters);
    };

    return (
        <AttritionFilterContext.Provider value={{ filters, setFilters, clearFilters }}>
            {children}
        </AttritionFilterContext.Provider>
    );
}

export function useAttritionFilters() {
    const context = useContext(AttritionFilterContext);
    if (context === undefined) {
        // Return default filters when provider is not available (e.g., widgets used in main dashboard)
        return {
            filters: defaultFilters,
            setFilters: () => {},
            clearFilters: () => {},
        };
    }
    return context;
}

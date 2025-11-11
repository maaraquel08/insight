"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Filter } from "@/components/ui/filters";

interface FilterContextType {
    filters: Filter[];
    setFilters: (filters: Filter[]) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
    const [filters, setFilters] = useState<Filter[]>([]);

    return (
        <FilterContext.Provider value={{ filters, setFilters }}>
            {children}
        </FilterContext.Provider>
    );
}

export function useFilters() {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error("useFilters must be used within a FilterProvider");
    }
    return context;
}


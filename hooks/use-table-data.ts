"use client";

import { useMemo } from "react";
import { employees } from "@/app/data/sampleData";
import { useColumns } from "@/contexts/column-context";
import { useFilters } from "@/contexts/filter-context";
import { useSort } from "@/contexts/sort-context";
import { useComputedValues } from "@/contexts/computed-values-context";
import { getTableData } from "@/lib/download-utils";

/**
 * Hook to get processed table data for download
 * Returns headers and rows ready for export, including computed values
 */
export function useTableData() {
    const { visibleColumns } = useColumns();
    const { filters } = useFilters();
    const { sorts } = useSort();
    const { computedValues } = useComputedValues();

    const tableData = useMemo(() => {
        const data = getTableData(employees, visibleColumns, filters, sorts);
        
        // Add footer row with computed values
        const footer = visibleColumns.map((col) => {
            const computed = computedValues.get(col.id);
            if (computed) {
                return String(computed.value);
            }
            return "";
        });
        
        return {
            ...data,
            footer,
        };
    }, [visibleColumns, filters, sorts, computedValues]);

    return tableData;
}


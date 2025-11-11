"use client";

import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { columns } from "@/app/data/column";

interface Column {
    id: string;
    label: string;
    category: string;
    section: string;
    isParent?: boolean;
    isDependentOf?: string;
}

interface ColumnContextType {
    allColumns: Column[];
    selectedColumns: Record<string, boolean>;
    setSelectedColumns: (columns: Record<string, boolean>) => void;
    toggleColumn: (columnId: string, checked: boolean) => void;
    visibleColumns: Column[];
}

const ColumnContext = createContext<ColumnContextType | undefined>(undefined);

// Helper function to get all columns as a flat array
function getAllColumnsFlat(): Column[] {
    const result: Column[] = [];

    // Process informationDetails
    Object.entries(columns.informationDetails).forEach(
        ([sectionKey, section]) => {
            Object.entries(section).forEach(([fieldKey, field]) => {
                result.push({
                    id: field.id,
                    label: field.label,
                    category: field.category,
                    section: sectionKey,
                    isParent:
                        "isParent" in field
                            ? (field.isParent as boolean)
                            : undefined,
                    isDependentOf:
                        "isDependentOf" in field
                            ? (field.isDependentOf as string)
                            : undefined,
                });
            });
        }
    );

    // Process compensationPayroll
    Object.entries(columns.compensationPayroll).forEach(
        ([sectionKey, section]) => {
            Object.entries(section).forEach(([fieldKey, field]) => {
                result.push({
                    id: field.id,
                    label: field.label,
                    category: field.category,
                    section: sectionKey,
                    isParent:
                        "isParent" in field
                            ? (field.isParent as boolean)
                            : undefined,
                    isDependentOf:
                        "isDependentOf" in field
                            ? (field.isDependentOf as string)
                            : undefined,
                });
            });
        }
    );

    // Process leavesPTO
    Object.entries(columns.leavesPTO).forEach(([sectionKey, section]) => {
        Object.entries(section).forEach(([fieldKey, field]) => {
            result.push({
                id: field.id,
                label: field.label,
                category: field.category,
                section: sectionKey,
                isParent:
                    "isParent" in field
                        ? (field.isParent as boolean)
                        : undefined,
                isDependentOf:
                    "isDependentOf" in field
                        ? (field.isDependentOf as string)
                        : undefined,
            });
        });
    });

    return result;
}

// Default visible columns: Employee ID, First Name, Last Name, Full Name, and Email Address
const DEFAULT_VISIBLE_COLUMNS = [
    "employeeId",
    "firstName",
    "lastName",
    "fullName",
    "email",
];

export function ColumnProvider({ children }: { children: ReactNode }) {
    const allColumns = useMemo(() => getAllColumnsFlat(), []);

    // Initialize with only default columns visible
    const [selectedColumns, setSelectedColumns] = useState<
        Record<string, boolean>
    >(() => {
        const initial: Record<string, boolean> = {};
        allColumns.forEach((col) => {
            // Only default columns are visible initially
            initial[col.id] = DEFAULT_VISIBLE_COLUMNS.includes(col.id);
        });
        return initial;
    });

    // Track the order in which columns were added (for non-default columns)
    const [columnAddOrder, setColumnAddOrder] = useState<string[]>([]);

    const toggleColumn = (columnId: string, checked: boolean) => {
        setSelectedColumns((prev) => {
            const wasSelected = prev[columnId] ?? false;
            const isDefault = DEFAULT_VISIBLE_COLUMNS.includes(columnId);

            // If column is being added and it's not a default column, track its order
            if (checked && !wasSelected && !isDefault) {
                setColumnAddOrder((order) => {
                    // Only add if not already in the order array
                    if (!order.includes(columnId)) {
                        return [...order, columnId];
                    }
                    return order;
                });
            }

            return {
                ...prev,
                [columnId]: checked,
            };
        });
    };

    // Helper function to add a column and its dependents to the visible array
    const addColumnWithDependents = (
        col: Column,
        visible: Column[],
        addedColumns: Set<string>,
        selectedColumns: Record<string, boolean>
    ) => {
        if (addedColumns.has(col.id)) return;

        const isSelected = selectedColumns[col.id] ?? false;
        if (isSelected) {
            visible.push(col);
            addedColumns.add(col.id);

            // Add dependent columns right after the parent
            allColumns.forEach((dependent) => {
                if (dependent.isDependentOf === col.id) {
                    addColumnWithDependents(
                        dependent,
                        visible,
                        addedColumns,
                        selectedColumns
                    );
                }
            });
        }
    };

    // Get visible columns, including dependent columns if their parent is visible
    const visibleColumns = useMemo(() => {
        const visible: Column[] = [];
        const addedColumns = new Set<string>();

        // First, add default columns in their original order
        DEFAULT_VISIBLE_COLUMNS.forEach((columnId) => {
            const col = allColumns.find((c) => c.id === columnId);
            if (col) {
                addColumnWithDependents(col, visible, addedColumns, selectedColumns);
            }
        });

        // Then, add non-default columns in the order they were added
        columnAddOrder.forEach((columnId) => {
            const col = allColumns.find((c) => c.id === columnId);
            if (col) {
                addColumnWithDependents(col, visible, addedColumns, selectedColumns);
            }
        });

        return visible;
    }, [allColumns, selectedColumns, columnAddOrder]);

    return (
        <ColumnContext.Provider
            value={{
                allColumns,
                selectedColumns,
                setSelectedColumns,
                toggleColumn,
                visibleColumns,
            }}
        >
            {children}
        </ColumnContext.Provider>
    );
}

export function useColumns() {
    const context = useContext(ColumnContext);
    if (context === undefined) {
        throw new Error("useColumns must be used within a ColumnProvider");
    }
    return context;
}


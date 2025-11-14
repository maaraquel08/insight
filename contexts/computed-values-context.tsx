"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    ReactNode,
} from "react";

export interface ComputedValue {
    columnId: string;
    value: string | number;
    computationType: string;
}

interface ComputedValuesContextType {
    computedValues: Map<string, ComputedValue>;
    setComputedValue: (columnId: string, value: ComputedValue | null) => void;
    getComputedValue: (columnId: string) => ComputedValue | null;
    clearComputedValue: (columnId: string) => void;
    clearAllComputedValues: () => void;
}

const ComputedValuesContext = createContext<
    ComputedValuesContextType | undefined
>(undefined);

export function ComputedValuesProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [computedValues, setComputedValues] = useState<
        Map<string, ComputedValue>
    >(new Map());

    const setComputedValue = useCallback(
        (columnId: string, value: ComputedValue | null) => {
            setComputedValues((prev) => {
                const newMap = new Map(prev);
                if (value === null) {
                    newMap.delete(columnId);
                } else {
                    // Only update if the value actually changed
                    const existing = newMap.get(columnId);
                    if (
                        existing &&
                        existing.value === value.value &&
                        existing.computationType === value.computationType
                    ) {
                        return prev; // No change, return previous map
                    }
                    newMap.set(columnId, value);
                }
                return newMap;
            });
        },
        []
    );

    const getComputedValue = useCallback(
        (columnId: string): ComputedValue | null => {
            return computedValues.get(columnId) || null;
        },
        [computedValues]
    );

    const clearComputedValue = useCallback(
        (columnId: string) => {
            setComputedValue(columnId, null);
        },
        [setComputedValue]
    );

    const clearAllComputedValues = useCallback(() => {
        setComputedValues(new Map());
    }, []);

    const value = useMemo(
        () => ({
            computedValues,
            setComputedValue,
            getComputedValue,
            clearComputedValue,
            clearAllComputedValues,
        }),
        [
            computedValues,
            setComputedValue,
            getComputedValue,
            clearComputedValue,
            clearAllComputedValues,
        ]
    );

    return (
        <ComputedValuesContext.Provider value={value}>
            {children}
        </ComputedValuesContext.Provider>
    );
}

export function useComputedValues() {
    const context = useContext(ComputedValuesContext);
    if (context === undefined) {
        throw new Error(
            "useComputedValues must be used within a ComputedValuesProvider"
        );
    }
    return context;
}


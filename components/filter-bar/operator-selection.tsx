/**
 * Operator Selection Component
 *
 * Second step in the filter creation process.
 * Displays available operators based on the selected attribute's data type.
 * Examples: equals, is not equal to, greater than, between, etc.
 */

import { ArrowLeft } from "lucide-react";
import { getOperatorsForAttribute, findColumnById } from "./utils";
import type { Operator } from "./types";

interface OperatorSelectionProps {
    /** The currently selected attribute/column ID */
    attributeId: string;

    /** Callback to go back to attribute selection */
    onBack: () => void;

    /** Callback when an operator is selected */
    onSelectOperator: (operator: string) => void;
}

export function OperatorSelection({
    attributeId,
    onBack,
    onSelectOperator,
}: OperatorSelectionProps) {
    const column = findColumnById(attributeId);
    const operators = getOperatorsForAttribute(attributeId);

    return (
        <>
            {/* Header with back button */}
            <div className="border-b border-weak px-4 py-2 flex items-center gap-2">
                <button
                    onClick={onBack}
                    className="flex items-center justify-center h-6 w-6 hover:bg-accent rounded transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium text-[#262b2b]">
                    {column?.label || "Select operator"}
                </span>
            </div>

            {/* Operator List */}
            <div className="max-h-[400px] overflow-y-auto">
                {operators.map((op: Operator) => (
                    <button
                        key={op.value}
                        onClick={() => onSelectOperator(op.value)}
                        className="w-full px-4 py-3 text-sm text-[#262b2b] whitespace-nowrap text-left hover:bg-accent transition-colors"
                    >
                        {op.label}
                    </button>
                ))}
            </div>
        </>
    );
}

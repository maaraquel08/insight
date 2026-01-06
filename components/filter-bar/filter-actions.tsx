/**
 * Filter Actions Component
 * 
 * Footer component for the filter builder popover.
 * Contains Cancel and Apply buttons.
 */

import { Button } from "@/components/ui/button";

interface FilterActionsProps {
    /** Callback when Cancel is clicked */
    onCancel: () => void;
    
    /** Callback when Apply is clicked */
    onApply: () => void;
}

export function FilterActions({ onCancel, onApply }: FilterActionsProps) {
    return (
        <div className="flex gap-2 border-t border-weak p-4">
            <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1 h-9 border-[#b8c1c0] text-sm font-medium text-[#262b2b]"
            >
                Cancel
            </Button>
            <Button
                onClick={onApply}
                className="flex-1 h-9 bg-[#158039] hover:bg-[#158039]/90 text-white text-sm font-medium"
            >
                Apply
            </Button>
        </div>
    );
}


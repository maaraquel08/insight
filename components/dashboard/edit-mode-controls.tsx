"use client";

import { useEffect } from "react";
import { X, RotateCcw, Save } from "lucide-react";
import { useDashboard } from "@/contexts/dashboard-context";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export function EditModeControls() {
    const {
        isEditMode,
        hasUnsavedChanges,
        toggleEditMode,
        saveLayout,
        cancelChanges,
        resetLayout,
    } = useDashboard();
    const [showResetDialog, setShowResetDialog] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    // Keyboard shortcut: Cmd/Ctrl + E to toggle edit mode
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "e") {
                e.preventDefault();
                toggleEditMode();
            }
            // Escape to exit edit mode
            if (e.key === "Escape" && isEditMode) {
                if (hasUnsavedChanges) {
                    setShowCancelDialog(true);
                } else {
                    toggleEditMode();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isEditMode, hasUnsavedChanges, toggleEditMode]);

    const handleSave = () => {
        saveLayout();
    };

    const handleCancel = () => {
        if (hasUnsavedChanges) {
            setShowCancelDialog(true);
        } else {
            cancelChanges();
        }
    };

    const handleReset = () => {
        setShowResetDialog(true);
    };

    const confirmReset = () => {
        resetLayout();
        setShowResetDialog(false);
    };

    const confirmCancel = () => {
        cancelChanges();
        setShowCancelDialog(false);
    };

    // Only render when in edit mode
    if (!isEditMode) {
        return null;
    }

    return (
        <>
            <div className="flex items-center gap-2">
                <Button
                    onClick={handleSave}
                    className="bg-[#158039] hover:bg-[#158039]/90 text-white h-9 min-w-[56px] px-3 rounded-lg"
                    size="sm"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </Button>
                <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                    className="h-8 px-2.5 gap-1.25 text-xs border border-[#b61f27] text-[#b61f27] hover:bg-[#b61f27]/5 hover:text-[#b61f27]"
                >
                    <X className="w-3.5 h-3.5" />
                    Cancel
                </Button>
                <Button
                    onClick={handleReset}
                    variant="outline"
                    className="h-9 min-w-[56px] px-3 rounded-lg border-[#b8c1c0] text-[#262b2b] hover:bg-[#f1f2f3]"
                    size="sm"
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                </Button>
            </div>


            {/* Reset Confirmation Dialog */}
            <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reset Dashboard</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to reset your dashboard to
                            the default layout? This will discard all your
                            customizations.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowResetDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmReset}
                            className="bg-[#158039] hover:bg-[#158039]/90"
                        >
                            Reset
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Cancel Confirmation Dialog */}
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Discard Changes?</DialogTitle>
                        <DialogDescription>
                            You have unsaved changes. Are you sure you want to
                            discard them and exit edit mode?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowCancelDialog(false)}
                        >
                            Keep Editing
                        </Button>
                        <Button
                            onClick={confirmCancel}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Discard Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}


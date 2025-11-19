"use client";

import { useRef, useEffect, useState, KeyboardEvent, ClipboardEvent } from "react";
import { createRoot, Root } from "react-dom/client";
import { WidgetChip } from "./widget-chip";
import type { WidgetLayout } from "@/types/dashboard";

interface InlineChatInputProps {
    placeholder?: string;
    disabled?: boolean;
    onSend?: (content: { text: string; chips: WidgetLayout[] }) => void;
    initialValue?: string;
    onFocus?: () => void;
    onBlur?: () => void;
    onContentChange?: (hasContent: boolean) => void;
    sendButtonRef?: React.RefObject<{ triggerSend: () => void }>;
}

export function InlineChatInput({
    placeholder = "Message Sidekick... or drag a widget here",
    disabled = false,
    onSend,
    initialValue = "",
    onFocus,
    onBlur,
    onContentChange,
    sendButtonRef,
}: InlineChatInputProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const chipRootsRef = useRef<Map<string, { root: Root; element: HTMLElement }>>(new Map());

    const getContent = (): { text: string; chips: WidgetLayout[] } => {
        const editor = editorRef.current;
        if (!editor) return { text: "", chips: [] };

        const textParts: string[] = [];
        const chipLayouts: WidgetLayout[] = [];

        // Traverse child nodes to extract text and chips in order
        const traverse = (node: Node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent || "";
                // Filter out zero-width spaces
                const cleanText = text.replace(/\u200B/g, "");
                if (cleanText.length > 0) {
                    textParts.push(cleanText);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as HTMLElement;
                const chipId = element.dataset.chipId;
                
                if (chipId) {
                    // This is a chip - extract widget layout from stored data
                    const storedLayout = element.dataset.widgetLayout;
                    if (storedLayout) {
                        try {
                            const widgetLayout = JSON.parse(storedLayout) as WidgetLayout;
                            chipLayouts.push(widgetLayout);
                            textParts.push(`[WIDGET:${widgetLayout.widgetId}]`);
                        } catch (e) {
                            console.error("Failed to parse widget layout:", e);
                        }
                    }
                } else {
                    // Traverse children
                    Array.from(node.childNodes).forEach(traverse);
                }
            }
        };

        Array.from(editor.childNodes).forEach(traverse);

        const fullText = textParts.join("").trim();
        
        return {
            text: fullText,
            chips: chipLayouts,
        };
    };

    // Expose triggerSend method via ref
    useEffect(() => {
        if (sendButtonRef) {
            (sendButtonRef as React.MutableRefObject<{ triggerSend: () => void }>).current = {
                triggerSend: () => {
                    const content = getContent();
                    if (content.text || content.chips.length > 0) {
                        onSend?.(content);
                        // Clear editor
                        if (editorRef.current) {
                            // Clean up all chip roots - defer to avoid race conditions
                            const rootsToUnmount = Array.from(chipRootsRef.current.values());
                            chipRootsRef.current.clear();
                            editorRef.current.innerHTML = "";
                            
                            // Defer unmounting
                            setTimeout(() => {
                                rootsToUnmount.forEach(({ root }) => {
                                    try {
                                        root.unmount();
                                    } catch (error) {
                                        // Ignore errors if root is already unmounted
                                        console.warn("Error unmounting chip root:", error);
                                    }
                                });
                            }, 0);
                        }
                        // Notify content change (now empty)
                        onContentChange?.(false);
                    }
                },
            };
        }
    }, [sendButtonRef, onSend, onContentChange]);

    // Handle widget drop - insert chip at cursor position
    useEffect(() => {
        const handleWidgetDrop = (e: CustomEvent<WidgetLayout>) => {
            const widgetLayout = e.detail;
            insertChipAtCursor(widgetLayout);
        };

        window.addEventListener("widget-dropped", handleWidgetDrop as EventListener);

        return () => {
            window.removeEventListener("widget-dropped", handleWidgetDrop as EventListener);
        };
    }, []);

    const renderChipElement = (chipId: string, widgetLayout: WidgetLayout, element: HTMLElement) => {
        // Clean up existing root if any
        const existing = chipRootsRef.current.get(chipId);
        if (existing) {
            existing.root.unmount();
        }

        // Create new root and render chip
        const root = createRoot(element);
        root.render(
            <WidgetChip
                widgetLayout={widgetLayout}
                onRemove={() => handleRemoveChip(chipId)}
                variant="inline"
                showRemove={true}
            />
        );

        chipRootsRef.current.set(chipId, { root, element });
    };

    const insertChipAtCursor = (widgetLayout: WidgetLayout) => {
        const editor = editorRef.current;
        if (!editor) return;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            // If no selection, append at end
            appendChip(widgetLayout);
            return;
        }

        const range = selection.getRangeAt(0);
        const chipId = `chip-${Date.now()}-${Math.random()}`;
        
        // Create chip container element
        const chipContainer = document.createElement("span");
        chipContainer.contentEditable = "false";
        chipContainer.className = "inline-flex items-center mx-1 align-middle";
        chipContainer.dataset.chipId = chipId;
        chipContainer.dataset.widgetId = widgetLayout.widgetId;
        chipContainer.dataset.widgetLayoutId = widgetLayout.id;
        chipContainer.dataset.widgetLayout = JSON.stringify(widgetLayout);

        // Insert chip
        range.deleteContents();
        range.insertNode(chipContainer);
        
        // Render the chip component
        renderChipElement(chipId, widgetLayout, chipContainer);
        
        // Add zero-width space after chip for cursor positioning
        const textNode = document.createTextNode("\u200B");
        range.setStartAfter(chipContainer);
        range.insertNode(textNode);
        range.collapse(false);

        // Focus editor and set cursor
        editor.focus();
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Notify content change
        checkContent();
    };

    const appendChip = (widgetLayout: WidgetLayout) => {
        const editor = editorRef.current;
        if (!editor) return;

        const chipId = `chip-${Date.now()}-${Math.random()}`;
        
        const chipContainer = document.createElement("span");
        chipContainer.contentEditable = "false";
        chipContainer.className = "inline-flex items-center mx-1 align-middle";
        chipContainer.dataset.chipId = chipId;
        chipContainer.dataset.widgetId = widgetLayout.widgetId;
        chipContainer.dataset.widgetLayoutId = widgetLayout.id;
        chipContainer.dataset.widgetLayout = JSON.stringify(widgetLayout);

        editor.appendChild(chipContainer);
        renderChipElement(chipId, widgetLayout, chipContainer);
        
        const textNode = document.createTextNode("\u200B");
        editor.appendChild(textNode);

        // Focus and set cursor at end
        const range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
        editor.focus();
        
        // Notify content change
        checkContent();
    };

    const handleRemoveChip = (chipId: string) => {
        const editor = editorRef.current;
        if (!editor) return;

        const chipElement = editor.querySelector(`[data-chip-id="${chipId}"]`);
        if (chipElement) {
            // Clean up React root - defer to avoid race conditions
            const existing = chipRootsRef.current.get(chipId);
            if (existing) {
                chipRootsRef.current.delete(chipId);
                chipElement.remove();
                
                // Defer unmounting
                setTimeout(() => {
                    try {
                        existing.root.unmount();
                    } catch (error) {
                        // Ignore errors if root is already unmounted
                        console.warn("Error unmounting chip root:", error);
                    }
                }, 0);
            } else {
                chipElement.remove();
            }
        }
        
        // Notify content change
        checkContent();
    };

    // Check content and notify parent
    const checkContent = () => {
        const content = getContent();
        const hasContent = content.text.trim().length > 0 || content.chips.length > 0;
        onContentChange?.(hasContent);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;

        // Handle Enter to send (but allow Shift+Enter for new line)
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const content = getContent();
            if (content.text || content.chips.length > 0) {
                onSend?.(content);
                // Clear editor
                if (editorRef.current) {
                    // Clean up all chip roots - defer to avoid race conditions
                    const rootsToUnmount = Array.from(chipRootsRef.current.values());
                    chipRootsRef.current.clear();
                    editorRef.current.innerHTML = "";
                    
                    // Defer unmounting
                    setTimeout(() => {
                        rootsToUnmount.forEach(({ root }) => {
                            try {
                                root.unmount();
                            } catch (error) {
                                // Ignore errors if root is already unmounted
                                console.warn("Error unmounting chip root:", error);
                            }
                        });
                    }, 0);
                }
                // Notify content change (now empty)
                onContentChange?.(false);
            }
            return;
        }

        // Handle Backspace to delete chips
        if (e.key === "Backspace") {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;

            const range = selection.getRangeAt(0);
            if (range.collapsed && range.startOffset === 0) {
                const container = range.startContainer;
                if (container.nodeType === Node.TEXT_NODE) {
                    const prevSibling = container.previousSibling;
                    if (prevSibling && prevSibling.nodeType === Node.ELEMENT_NODE) {
                        const element = prevSibling as HTMLElement;
                        const chipId = element.dataset.chipId;
                        if (chipId) {
                            e.preventDefault();
                            handleRemoveChip(chipId);
                        }
                    }
                } else if (container.nodeType === Node.ELEMENT_NODE) {
                    const element = container as HTMLElement;
                    const chipId = element.dataset.chipId;
                    if (chipId) {
                        e.preventDefault();
                        handleRemoveChip(chipId);
                    }
                }
            }
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            const textNode = document.createTextNode(text);
            range.insertNode(textNode);
            range.setStartAfter(textNode);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    // Initialize with initial value
    useEffect(() => {
        if (initialValue && editorRef.current && editorRef.current.textContent === "") {
            editorRef.current.textContent = initialValue;
        }
    }, [initialValue]);

    // Cleanup on unmount - defer to avoid race conditions
    useEffect(() => {
        return () => {
            // Defer unmounting to avoid race conditions during render
            const rootsToUnmount = Array.from(chipRootsRef.current.values());
            chipRootsRef.current.clear();
            
            // Use setTimeout to defer unmounting until after current render cycle
            setTimeout(() => {
                rootsToUnmount.forEach(({ root }) => {
                    try {
                        root.unmount();
                    } catch (error) {
                        // Ignore errors if root is already unmounted
                        console.warn("Error unmounting chip root:", error);
                    }
                });
            }, 0);
        };
    }, []);

    return (
        <div
            ref={editorRef}
            contentEditable={!disabled}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onFocus={() => {
                setIsFocused(true);
                onFocus?.();
            }}
            onBlur={() => {
                setIsFocused(false);
                onBlur?.();
            }}
            className="flex flex-wrap items-center gap-1 min-h-[24px] max-h-[236px] overflow-y-auto px-0 py-1 text-sm text-[#262b2b] leading-6 outline-none focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-[#919f9d] empty:before:pointer-events-none"
            data-placeholder={placeholder}
            suppressContentEditableWarning
            onInput={checkContent}
        />
    );
}


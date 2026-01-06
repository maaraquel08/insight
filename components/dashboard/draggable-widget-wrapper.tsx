"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { GripVertical } from "lucide-react";
import { useChatWidget } from "@/contexts/chat-widget-context";
import { useChatSidekick } from "@/components/chatbot-sidekick/chat-sidekick-context";
import type { WidgetLayout } from "@/types/dashboard";

interface DraggableWidgetWrapperProps {
    layout: WidgetLayout;
    children: ReactNode;
    disabled?: boolean;
}

export function DraggableWidgetWrapper({
    layout,
    children,
    disabled = false,
}: DraggableWidgetWrapperProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const widgetRef = useRef<HTMLDivElement>(null);
    const ghostRef = useRef<HTMLDivElement>(null);
    const { setDraggingWidget } = useChatWidget();

    // Check if chat is open - only allow dragging when chat is open
    const { isOpen: isChatOpen } = useChatSidekick();

    // Check if dialog is open
    useEffect(() => {
        const checkDialog = () => {
            const dialogOverlay = document.querySelector(
                '[data-slot="dialog-overlay"][data-state="open"]'
            );
            setIsDialogOpen(!!dialogOverlay);
        };

        // Check initially
        checkDialog();

        // Watch for dialog state changes
        const observer = new MutationObserver(checkDialog);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["data-state"],
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (ghostRef.current) {
                ghostRef.current.style.left = `${e.clientX - dragOffset.x}px`;
                ghostRef.current.style.top = `${e.clientY - dragOffset.y}px`;
            }

            // Check if over chat drop zone and update drag over state
            const chatDropZone = document.querySelector(
                "[data-chat-drop-zone]"
            );
            if (chatDropZone) {
                const rect = chatDropZone.getBoundingClientRect();
                const isOverDropZone =
                    e.clientX >= rect.left &&
                    e.clientX <= rect.right &&
                    e.clientY >= rect.top &&
                    e.clientY <= rect.bottom;

                // Dispatch drag over event
                const dragOverEvent = new CustomEvent("widget-drag-over", {
                    detail: { isOver: isOverDropZone, layout },
                });
                window.dispatchEvent(dragOverEvent);
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            setIsDragging(false);

            // Check if dropped over chat drop zone
            const chatDropZone = document.querySelector(
                "[data-chat-drop-zone]"
            );
            if (chatDropZone) {
                const rect = chatDropZone.getBoundingClientRect();
                const isOverDropZone =
                    e.clientX >= rect.left &&
                    e.clientX <= rect.right &&
                    e.clientY >= rect.top &&
                    e.clientY <= rect.bottom;

                if (isOverDropZone) {
                    // Dispatch custom event for chat to handle
                    const dropEvent = new CustomEvent("widget-dropped", {
                        detail: layout,
                    });
                    window.dispatchEvent(dropEvent);
                }
            }

            setDraggingWidget(null);

            // Dispatch drag end event
            const dragEndEvent = new CustomEvent("widget-drag-end");
            window.dispatchEvent(dragEndEvent);

            if (ghostRef.current) {
                ghostRef.current.style.display = "none";
                ghostRef.current.innerHTML = "";
            }
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, dragOffset, layout, setDraggingWidget]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (disabled || isDialogOpen || !isChatOpen) return;

        e.preventDefault();
        const rect = widgetRef.current?.getBoundingClientRect();
        if (!rect) return;

        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });

        setIsDragging(true);
        setDraggingWidget(layout);

        // Create ghost element
        if (ghostRef.current && widgetRef.current) {
            const clone = widgetRef.current.cloneNode(true) as HTMLElement;
            // Remove the grab handle from clone
            const grabHandle = clone.querySelector("[data-grab-handle]");
            if (grabHandle) {
                grabHandle.remove();
            }
            ghostRef.current.appendChild(clone);
            ghostRef.current.style.display = "block";
            ghostRef.current.style.left = `${e.clientX - dragOffset.x}px`;
            ghostRef.current.style.top = `${e.clientY - dragOffset.y}px`;
            ghostRef.current.style.width = `${rect.width}px`;
        }
    };

    return (
        <>
            <div
                ref={widgetRef}
                data-widget-instance-id={layout.id}
                data-widget-id={layout.widgetId}
                className={`relative w-full h-auto transition-all ${
                    isDragging ? "opacity-50 scale-[0.98]" : ""
                } ${
                    isHovered && !disabled && !isDialogOpen && isChatOpen
                        ? "cursor-grab"
                        : ""
                } ${isDialogOpen ? "pointer-events-none" : ""}`}
                onMouseEnter={() =>
                    !disabled &&
                    !isDialogOpen &&
                    isChatOpen &&
                    setIsHovered(true)
                }
                onMouseLeave={() => setIsHovered(false)}
                onMouseDown={handleMouseDown}
            >
                {/* Grab Handle - appears on hover when chat is open */}
                {isHovered && !disabled && isChatOpen && (
                    <div
                        data-grab-handle
                        className="absolute top-2 left-2 z-20 pointer-events-none"
                    >
                        <div className="bg-white/90 backdrop-blur-sm rounded-md shadow-md p-1.5 border border-[#d9dede]">
                            <GripVertical className="w-4 h-4 text-[#5d6c6b]" />
                        </div>
                    </div>
                )}

                {children}
            </div>

            {/* Ghost element for dragging */}
            <div
                ref={ghostRef}
                className="fixed pointer-events-none z-9999 opacity-75 blur-[2px] scale-95 shadow-2xl rounded-xl overflow-hidden"
                style={{ display: "none", maxWidth: "400px" }}
            />
        </>
    );
}

"use client";

import { Button } from "@/components/ui/button";
import { useChatSidekick } from "@/components/chatbot-sidekick/chat-sidekick-context";
import { simulationFlows } from "@/lib/chat-simulations";
import type { SimulatedFlow } from "@/lib/chat-simulations";

interface ActionItem {
    label: string;
    variant: "outline" | "primary" | "secondary";
    borderColor?: "purple" | "default";
    onClick?: () => void;
    chatAction?:
        | "coa"
        | "leave"
        | "attendance"
        | "payroll"
        | "schedule"
        | string; // Pre-defined chat actions or custom message
    useSimulation?: boolean; // Whether to use simulated flow instead of just opening with message
}

interface ActionFeedFooterProps {
    actions: ActionItem[];
}

export function ActionFeedFooter({ actions }: ActionFeedFooterProps) {
    const { isOpen, openChat, queueMessage } = useChatSidekick();

    if (!actions || actions.length === 0) {
        return null;
    }

    const handleActionClick = (action: ActionItem) => {
        if (action.chatAction) {
            // Check if we should use a simulated flow
            if (action.useSimulation && simulationFlows[action.chatAction]) {
                // If chat is already open, queue the message instead of resetting
                if (isOpen) {
                    queueMessage("", simulationFlows[action.chatAction]);
                } else {
                    // Use simulated flow (opens chat)
                    openChat(undefined, simulationFlows[action.chatAction]);
                }
            } else {
                // Use simple message (fallback for non-simulated actions)
                const message = action.chatAction;
                // If chat is already open, queue the message instead of resetting
                if (isOpen) {
                    queueMessage(message);
                } else {
                    openChat(message);
                }
            }
        } else if (action.onClick) {
            action.onClick();
        }
    };

    return (
        <div className="flex gap-2 items-center justify-end">
            {actions.map((action, index) => {
                const borderColorClass =
                    action.borderColor === "purple"
                        ? "border-[#8139ee]"
                        : "border-[#b8c1c0]";

                if (action.variant === "primary") {
                    return (
                        <Button
                            key={index}
                            size="sm"
                            className={`bg-[#158039] hover:bg-[#158039]/90 text-white h-9 px-2 text-sm font-medium rounded-lg`}
                            onClick={() => handleActionClick(action)}
                        >
                            {action.label}
                        </Button>
                    );
                }

                return (
                    <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className={`bg-white border ${borderColorClass} text-[#262b2b] hover:bg-gray-50 h-9 px-2 text-sm font-medium rounded-lg`}
                        onClick={() => handleActionClick(action)}
                    >
                        {action.label}
                    </Button>
                );
            })}
        </div>
    );
}

"use client";

import { createContext, useContext, useState, ReactNode, useRef } from "react";
import type { SimulatedFlow } from "@/lib/chat-simulations";
import type { WidgetLayout } from "@/types/dashboard";

interface QueuedMessage {
    text: string;
    chips: WidgetLayout[];
}

interface ChatSidekickContextType {
    isOpen: boolean;
    openChat: (initialMessage?: string, simulatedFlow?: SimulatedFlow) => void;
    closeChat: () => void;
    queueMessage: (message: string, simulatedFlow?: SimulatedFlow) => void;
    initialMessage: string;
    simulatedFlow?: SimulatedFlow;
    queueHandlerRef: React.MutableRefObject<((message: QueuedMessage) => void) | null>;
}

const ChatSidekickContext = createContext<ChatSidekickContextType | undefined>(
    undefined
);

export function ChatSidekickProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [initialMessage, setInitialMessage] = useState("");
    const [simulatedFlow, setSimulatedFlow] = useState<SimulatedFlow | undefined>();
    const queueHandlerRef = useRef<((message: QueuedMessage) => void) | null>(null);

    const openChat = (message?: string, flow?: SimulatedFlow) => {
        setInitialMessage(message || "");
        setSimulatedFlow(flow);
        setIsOpen(true);
    };

    const closeChat = () => {
        setIsOpen(false);
        setInitialMessage("");
        setSimulatedFlow(undefined);
    };

    const queueMessage = (message: string, flow?: SimulatedFlow) => {
        // If chat is not open, open it first
        if (!isOpen) {
            openChat(message, flow);
            return;
        }

        // If chat is open, queue the message
        // For simulated flows, extract the first user message to queue
        let messageToQueue = message;
        if (flow && flow.messages && flow.messages.length > 0) {
            // Find the first user message from the flow
            const userMessage = flow.messages.find((msg) => msg.role === "user");
            if (userMessage) {
                messageToQueue = userMessage.content;
            }
        }

        // Only queue if we have a message
        if (messageToQueue && messageToQueue.trim()) {
            if (queueHandlerRef.current) {
                // Call the queue handler - this will queue the message
                queueHandlerRef.current({
                    text: messageToQueue,
                    chips: [],
                });
            } else {
                // Fallback: if queue handler not available, just open chat
                // This shouldn't happen, but just in case
                console.warn("Queue handler not available, opening chat instead");
                openChat(messageToQueue, flow);
            }
        }
    };

    return (
        <ChatSidekickContext.Provider
            value={{
                isOpen,
                openChat,
                closeChat,
                queueMessage,
                initialMessage,
                simulatedFlow,
                queueHandlerRef,
            }}
        >
            {children}
        </ChatSidekickContext.Provider>
    );
}

export function useChatSidekick() {
    const context = useContext(ChatSidekickContext);
    if (context === undefined) {
        throw new Error(
            "useChatSidekick must be used within a ChatSidekickProvider"
        );
    }
    return context;
}


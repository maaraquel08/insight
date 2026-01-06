"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { SimulatedFlow } from "@/lib/chat-simulations";

interface ChatSidekickContextType {
    isOpen: boolean;
    openChat: (initialMessage?: string, simulatedFlow?: SimulatedFlow) => void;
    closeChat: () => void;
    initialMessage: string;
    simulatedFlow?: SimulatedFlow;
}

const ChatSidekickContext = createContext<ChatSidekickContextType | undefined>(
    undefined
);

export function ChatSidekickProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [initialMessage, setInitialMessage] = useState("");
    const [simulatedFlow, setSimulatedFlow] = useState<SimulatedFlow | undefined>();

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

    return (
        <ChatSidekickContext.Provider
            value={{ isOpen, openChat, closeChat, initialMessage, simulatedFlow }}
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


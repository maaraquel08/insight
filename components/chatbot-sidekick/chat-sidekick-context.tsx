"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ChatSidekickContextType {
    isOpen: boolean;
    openChat: (initialMessage?: string) => void;
    closeChat: () => void;
    initialMessage: string;
}

const ChatSidekickContext = createContext<ChatSidekickContextType | undefined>(
    undefined
);

export function ChatSidekickProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [initialMessage, setInitialMessage] = useState("");

    const openChat = (message?: string) => {
        setInitialMessage(message || "");
        setIsOpen(true);
    };

    const closeChat = () => {
        setIsOpen(false);
        setInitialMessage("");
    };

    return (
        <ChatSidekickContext.Provider
            value={{ isOpen, openChat, closeChat, initialMessage }}
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


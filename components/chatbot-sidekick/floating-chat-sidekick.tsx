"use client";

import { useChatSidekick } from "./chat-sidekick-context";
import { ChatSidekick } from "./chat-sidekick";
import { Sparkle } from "phosphor-react";

export function FloatingChatSidekick() {
    const { isOpen, openChat, closeChat, initialMessage, simulatedFlow } = useChatSidekick();

    const handleSendMessage = (message: string) => {
        console.log("Message sent:", message);
        // TODO: Implement actual message sending logic
    };

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => openChat()}
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-white border border-[#d9dede] rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all hover:scale-105"
                    aria-label="Open chat with Sidekick"
                >
                    <Sparkle className="w-6 h-6 text-[#8139ee]" weight="fill" />
                </button>
            )}

            {/* Chat Interface */}
            {isOpen && (
                <div
                    className="fixed bottom-6 right-6 z-50 w-[560px] max-h-[calc(100vh-3rem)] flex flex-col"
                    style={{
                        animation: "slideUpFadeIn 0.3s ease-out",
                    }}
                >
                    <ChatSidekick
                        onClose={closeChat}
                        onMaximize={() => {
                            // TODO: Implement maximize functionality
                            console.log("Maximize clicked");
                        }}
                        onSendMessage={handleSendMessage}
                        initialMessage={initialMessage}
                        simulatedFlow={simulatedFlow}
                    />
                </div>
            )}
        </>
    );
}


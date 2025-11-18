"use client";

import { useState, useRef, useEffect } from "react";
import { PaperPlaneRight, Paperclip, X, ArrowsOut } from "phosphor-react";
import ReactMarkdown from "react-markdown";

interface Message {
    id: string;
    role: "user" | "ai";
    content: string;
    isLoading?: boolean;
}

interface ChatSidekickProps {
    onClose?: () => void;
    onMaximize?: () => void;
    onSendMessage?: (message: string) => void;
    initialMessage?: string;
}

// Loading Animation Component
function LoadingIndicator() {
    return (
        <div className="bg-[#fdfffe] border-[#098115] border-[1.5px] border-solid flex flex-col gap-2 h-[46px] items-center justify-center p-4 relative rounded-xl shrink-0">
            <div className="h-3 relative shrink-0 w-10 flex items-center justify-center gap-1">
                <div
                    className="w-2 h-2 bg-[#098115] rounded-full animate-bounce"
                    style={{ animationDelay: "0ms", animationDuration: "1.4s" }}
                />
                <div
                    className="w-2 h-2 bg-[#098115] rounded-full animate-bounce"
                    style={{
                        animationDelay: "0.2s",
                        animationDuration: "1.4s",
                    }}
                />
                <div
                    className="w-2 h-2 bg-[#098115] rounded-full animate-bounce"
                    style={{
                        animationDelay: "0.4s",
                        animationDuration: "1.4s",
                    }}
                />
            </div>
        </div>
    );
}

// AI Message Component with Typing Animation
function AIMessage({ message }: { message: Message }) {
    const [displayedContent, setDisplayedContent] = useState("");
    const [isTyping, setIsTyping] = useState(true);
    const messageIdRef = useRef(message.id);

    useEffect(() => {
        // Reset when message ID changes (new message)
        if (messageIdRef.current !== message.id) {
            messageIdRef.current = message.id;
            setDisplayedContent("");
            setIsTyping(true);
        }

        // Initialize with first character if empty
        if (displayedContent === "" && message.content.length > 0) {
            setDisplayedContent(message.content.slice(0, 1));
            return;
        }

        // If already fully displayed, stop typing
        if (displayedContent.length >= message.content.length) {
            setIsTyping(false);
            return;
        }

        // Typing speed: adjust delay for faster/slower typing
        const typingSpeed = 10; // milliseconds per character
        const timer = setTimeout(() => {
            const nextLength = Math.min(
                displayedContent.length + 1,
                message.content.length
            );
            setDisplayedContent(message.content.slice(0, nextLength));

            if (nextLength >= message.content.length) {
                setIsTyping(false);
            }
        }, typingSpeed);

        return () => clearTimeout(timer);
    }, [message.content, message.id, displayedContent]);

    return (
        <div className="flex gap-1.5 items-start w-full">
            <div className="flex flex-col gap-2 items-start max-w-[768px] relative shrink-0 w-full">
                {/* AI Logo */}
                <div className="relative shrink-0 w-8 h-8 mb-1">
                    <img
                        src="/images/Sidekick_Logo.png"
                        alt="Sidekick Logo"
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Message Content */}
                <div className="flex flex-col gap-4 items-start max-w-[768px] relative shrink-0 w-full">
                    <div className="flex flex-col font-normal justify-center leading-0 relative shrink-0 text-[#262b2b] text-base w-full prose prose-sm max-w-none leading-6 [&>p]:mb-4 [&>p:last-child]:mb-0 [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:mt-6 [&>h2]:mb-3 [&>h2]:text-[#262b2b] [&>h3]:text-base [&>h3]:font-semibold [&>h3]:mt-4 [&>h3]:mb-2 [&>h3]:text-[#262b2b] [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>ul>li]:mb-1 [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4 [&>ol>li]:mb-1 [&>strong]:font-semibold [&>strong]:text-[#262b2b] [&>code]:bg-[#f1f2f3] [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono">
                        <ReactMarkdown>{displayedContent}</ReactMarkdown>
                        {isTyping && (
                            <span className="inline-block w-2 h-4 bg-[#262b2b] ml-1 animate-pulse" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// User Message Component
function UserMessage({ message }: { message: Message }) {
    return (
        <div className="flex gap-1.5 items-end justify-end w-full">
            <div className="bg-[#f1f2f3] flex flex-col gap-6 items-end justify-center max-w-[512px] px-4 py-3 relative rounded-xl shrink-0">
                <div className="flex flex-col font-normal justify-center leading-0 relative shrink-0 text-[#262b2b] text-base w-full">
                    <p className="leading-6">{message.content}</p>
                </div>
            </div>
        </div>
    );
}

export function ChatSidekick({
    onClose,
    onMaximize,
    onSendMessage,
    initialMessage = "",
}: ChatSidekickProps) {
    const [message, setMessage] = useState(initialMessage);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const hasValue = message.trim().length > 0;
    const hasMessages = messages.length > 0;

    // Update message when initialMessage changes
    useEffect(() => {
        if (initialMessage) {
            setMessage(initialMessage);
            setIsFocused(true);
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 100);
        }
    }, [initialMessage]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!message.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: message.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        const currentMessage = message.trim();
        setMessage("");
        setIsLoading(true);

        // Call the onSendMessage callback
        if (onSendMessage) {
            onSendMessage(userMessage.content);
        }

        try {
            // Build conversation history for context
            const conversationHistory = messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
            }));

            // Call Gemini API
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: currentMessage,
                    conversationHistory,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.error ||
                        `Failed to get response from AI (${response.status})`
                );
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: data.message || "I apologize, but I couldn't generate a response.",
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content:
                    error instanceof Error
                        ? error.message
                        : "I'm sorry, I encountered an error. Please try again later.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="bg-white border border-[#d9dede] border-solid relative rounded-2xl w-full min-h-[580px] h-auto flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-[rgba(255,255,255,0.2)] flex gap-2 items-center justify-center px-4 py-3 relative shrink-0 w-full z-[7]">
                <div className="flex gap-2 items-center flex-1 min-w-0 min-h-0">
                    <p className="text-base font-medium text-[#262b2b] leading-5">
                        Chat with Sidekick
                    </p>
                </div>
                <div className="flex gap-[10px] items-center relative shrink-0">
                    <button
                        onClick={onMaximize}
                        className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
                        aria-label="Maximize"
                    >
                        <ArrowsOut
                            className="w-5 h-5 text-[#919f9d]"
                            weight="regular"
                        />
                    </button>
                    <button
                        onClick={onClose}
                        className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
                        aria-label="Close"
                    >
                        <X
                            className="w-5 h-5 text-[#919f9d]"
                            weight="regular"
                        />
                    </button>
                </div>
            </div>

            {/* Body - Messages or Greeting */}
            <div className="bg-[rgba(255,255,255,0.2)] flex flex-col gap-4 flex-1 px-4 py-4 relative w-full z-[6] overflow-y-auto">
                {!hasMessages ? (
                    // Greeting Section
                    <div className="flex flex-col gap-6 items-center justify-center flex-1 w-full">
                        {/* Logo */}
                        <div className="relative shrink-0 w-10 h-10">
                            <img
                                src="/images/Sidekick_Logo.png"
                                alt="Sidekick Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Greeting Text */}
                        <div className="flex flex-col gap-1 items-center justify-center text-center w-full">
                            <div className="flex flex-col font-medium justify-center overflow-ellipsis overflow-hidden relative shrink-0 text-[#262b2b] text-xl text-nowrap tracking-[-0.7px] w-full">
                                <p className="leading-6 overflow-ellipsis overflow-hidden text-[20px]">
                                    Hello, Call me Syd!
                                </p>
                            </div>
                            <div className="flex flex-col font-normal justify-center leading-5 relative shrink-0 text-[#5d6c6b] text-sm w-full">
                                <p className="mb-0">
                                    Your friendly neighborhood know-it-bot for
                                    Sprout Philippines.
                                </p>
                                <p>Let&apos;s grow your knowledge!</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Messages Section
                    <div className="flex flex-col gap-4 w-full">
                        {messages.map((msg) => (
                            <div key={msg.id}>
                                {msg.role === "user" ? (
                                    <UserMessage message={msg} />
                                ) : (
                                    <AIMessage message={msg} />
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-1.5 items-start w-full">
                                <LoadingIndicator />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Message Input */}
            <div className="flex gap-2 items-start p-4 relative shrink-0 w-full z-[5] border-t border-[#d9dede]">
                <div
                    className={`bg-white border border-solid flex flex-col gap-2 grow items-start max-w-[768px] p-3 relative rounded-xl shrink-0 transition-colors ${
                        isFocused ? "border-[#158039]" : "border-[#d9dede]"
                    }`}
                >
                    {/* Text Input Area */}
                    <div className="flex gap-[10px] items-start max-h-[236px] overflow-x-clip overflow-y-auto relative shrink-0 w-full">
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Message Sidekick..."
                            className="flex flex-col font-normal grow justify-center min-h-0 min-w-0 relative shrink-0 text-[#262b2b] text-sm leading-6 w-full resize-none border-none outline-none bg-transparent placeholder:text-[#919f9d]"
                            rows={1}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 items-center justify-between relative shrink-0 w-full">
                        <div className="flex gap-2 grow items-center justify-end min-h-0 min-w-0 relative shrink-0">
                            {/* Paperclip Button */}
                            <button
                                className="box-border flex items-center justify-center w-9 h-9 overflow-clip relative rounded-lg shrink-0 hover:bg-gray-50 transition-colors"
                                aria-label="Attach file"
                                disabled={isLoading}
                            >
                                <Paperclip
                                    className="w-5 h-5 text-[#4b686e]"
                                    weight="regular"
                                />
                            </button>

                            {/* Send Button */}
                            <button
                                onClick={handleSend}
                                className={`box-border flex items-center justify-center w-9 h-9 overflow-clip relative rounded-lg shrink-0 transition-colors ${
                                    hasValue && !isLoading
                                        ? "bg-[#158039] hover:bg-[#158039]/90"
                                        : "bg-[#f1f2f3] hover:bg-[#e1e2e3]"
                                }`}
                                aria-label="Send message"
                                disabled={!hasValue || isLoading}
                            >
                                <PaperPlaneRight
                                    className={`w-5 h-5 ${
                                        hasValue && !isLoading
                                            ? "text-white"
                                            : "text-[#4b686e]"
                                    }`}
                                    weight="fill"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Decorations */}
            {/* Layer 1: Circles (bottom) */}
            <div className="absolute left-[-131px] w-[248px] h-[248px] top-[-113px] z-[1] pointer-events-none">
                <div className="absolute inset-[-25.81%] bg-gradient-to-br from-purple-100 to-green-100 rounded-full opacity-30" />
            </div>
            <div className="absolute left-[448px] w-[236px] h-[236px] top-[-64px] z-[2] pointer-events-none">
                <div className="absolute inset-[-27.12%] bg-gradient-to-br from-green-100 to-blue-100 rounded-full opacity-30" />
            </div>
            <div className="absolute left-[200px] w-[160px] h-[160px] top-[306.52px] z-[3] pointer-events-none">
                <div className="absolute inset-[-40%] bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full opacity-30" />
            </div>

            {/* Layer 2: Texture (middle) */}
            <div className="absolute inset-0 z-[4] pointer-events-none opacity-40">
                <img
                    src="/images/Texture_BG_Pattern.png"
                    alt=""
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}


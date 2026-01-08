"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
    PaperPlaneRight,
    Paperclip,
    X,
    ArrowsOut,
    Stop,
    CaretDown,
    ArrowRight,
} from "phosphor-react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { useChatWidget } from "@/contexts/chat-widget-context";
import { useChatSidekick } from "./chat-sidekick-context";
import { WidgetChip } from "./widget-chip";
import { InlineChatInput } from "./inline-chat-input";
import type { WidgetLayout } from "@/types/dashboard";
import { getWidgetById } from "@/lib/widget-registry";

interface Message {
    id: string;
    role: "user" | "ai";
    content: string;
    isLoading?: boolean;
    widgetChips?: WidgetLayout[];
}

interface ChatSidekickProps {
    onClose?: () => void;
    onMaximize?: () => void;
    onSendMessage?: (message: string) => void;
    initialMessage?: string;
    simulatedFlow?: import("@/lib/chat-simulations").SimulatedFlow;
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
function AIMessage({
    message,
    onTypingComplete,
}: {
    message: Message;
    onTypingComplete?: () => void;
}) {
    const [displayedContent, setDisplayedContent] = useState("");
    const [isTyping, setIsTyping] = useState(true);
    const messageIdRef = useRef(message.id);
    const typingCompleteRef = useRef(false);

    useEffect(() => {
        // Reset when message ID changes (new message)
        if (messageIdRef.current !== message.id) {
            messageIdRef.current = message.id;
            setDisplayedContent("");
            setIsTyping(true);
            typingCompleteRef.current = false;
        }

        // Initialize with first character if empty
        if (displayedContent === "" && message.content.length > 0) {
            setDisplayedContent(message.content.slice(0, 1));
            return;
        }

        // If already fully displayed, stop typing
        if (displayedContent.length >= message.content.length) {
            if (!typingCompleteRef.current) {
                setIsTyping(false);
                typingCompleteRef.current = true;
                onTypingComplete?.();
            }
            return;
        }

        // Typing speed: adjust delay for faster/slower typing
        const typingSpeed = 3; // milliseconds per character
        const timer = setTimeout(() => {
            const nextLength = Math.min(
                displayedContent.length + 1,
                message.content.length
            );
            setDisplayedContent(message.content.slice(0, nextLength));

            if (nextLength >= message.content.length) {
                if (!typingCompleteRef.current) {
                    setIsTyping(false);
                    typingCompleteRef.current = true;
                    onTypingComplete?.();
                }
            }
        }, typingSpeed);

        return () => clearTimeout(timer);
    }, [message.content, message.id, displayedContent, onTypingComplete]);

    return (
        <div className="flex gap-1.5 items-start w-full">
            <div className="flex flex-col gap-2 items-start max-w-[768px] relative shrink-0 w-full">
                {/* AI Logo */}
                <div className="relative shrink-0 w-8 h-8 mb-1">
                    <Image
                        src="/images/Sidekick_Logo.png"
                        alt="Sidekick Logo"
                        width={32}
                        height={32}
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Message Content */}
                <div className="flex flex-col gap-4 items-start max-w-[768px] relative shrink-0 w-full">
                    <div className="flex flex-col font-normal justify-center relative shrink-0 text-[#262b2b] text-base w-full prose prose-sm max-w-none leading-6 [&>p]:mb-4 [&>p:last-child]:mb-0 [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:mt-6 [&>h2]:mb-3 [&>h2]:text-[#262b2b] [&>h3]:text-base [&>h3]:font-semibold [&>h3]:mt-4 [&>h3]:mb-2 [&>h3]:text-[#262b2b] [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>ul>li]:mb-1 [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4 [&>ol>li]:mb-1 [&>strong]:font-semibold [&>strong]:text-[#262b2b] [&>code]:bg-[#f1f2f3] [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono">
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
    // Parse message content to render chips inline with text
    const renderInlineContent = () => {
        if (!message.content) return null;

        const parts: (string | WidgetLayout)[] = [];
        const widgetRegex = /\[WIDGET:([^\]]+)\]/g;
        let lastIndex = 0;
        let match;
        let hasWidgets = false;

        // Reset regex for fresh search
        widgetRegex.lastIndex = 0;

        // Find all widget placeholders and split text
        while ((match = widgetRegex.exec(message.content)) !== null) {
            hasWidgets = true;
            // Add text before the widget placeholder
            if (match.index > lastIndex) {
                const textBefore = message.content.substring(
                    lastIndex,
                    match.index
                );
                if (textBefore) {
                    parts.push(textBefore);
                }
            }

            // Find matching chip by widgetId
            const widgetId = match[1];
            const matchingChip = message.widgetChips?.find(
                (chip) => chip.widgetId === widgetId
            );

            if (matchingChip) {
                parts.push(matchingChip);
            } else {
                // If chip not found, keep the placeholder text
                parts.push(match[0]);
            }

            lastIndex = match.index + match[0].length;
        }

        // Add remaining text after last widget
        if (lastIndex < message.content.length) {
            const textAfter = message.content.substring(lastIndex);
            if (textAfter) {
                parts.push(textAfter);
            }
        }

        // If no widgets found, return original content as plain text
        if (!hasWidgets) {
            return <span>{message.content}</span>;
        }

        // Render parts inline
        return (
            <span className="inline-block">
                {parts.map((part, index) => {
                    if (typeof part === "string") {
                        return <span key={index}>{part}</span>;
                    } else {
                        return (
                            <span
                                key={part.id}
                                className="inline-flex items-center mx-1 align-middle"
                            >
                                <WidgetChip
                                    widgetLayout={part}
                                    variant="inline"
                                    showRemove={false}
                                />
                            </span>
                        );
                    }
                })}
            </span>
        );
    };

    return (
        <div className="flex gap-1.5 items-end justify-end w-full">
            <div className="bg-[#f1f2f3] block max-w-[512px] px-4 py-3 relative rounded-xl shrink-0">
                {/* Message Content with Inline Chips */}
                <div className="font-normal text-[#262b2b] text-base leading-6">
                    {renderInlineContent()}
                </div>
            </div>
        </div>
    );
}

interface QueuedMessage {
    text: string;
    chips: WidgetLayout[];
}

export function ChatSidekick({
    onClose,
    onMaximize,
    onSendMessage,
    initialMessage = "",
    simulatedFlow,
}: ChatSidekickProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [messageQueue, setMessageQueue] = useState<QueuedMessage[]>([]);
    const [isQueueExpanded, setIsQueueExpanded] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const [hasContent, setHasContent] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);
    const sendButtonRef = useRef<{ triggerSend: () => void }>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const { isDragOver, setIsDragOver } = useChatWidget();
    const simulatedFlowRef = useRef(simulatedFlow);
    const hasSimulatedRef = useRef(false);
    const lastAIMessageIdRef = useRef<string | null>(null);
    const isProcessingQueueRef = useRef(false);
    const { queueHandlerRef } = useChatSidekick();

    const hasMessages = messages.length > 0;

    // Update focus when initialMessage changes
    useEffect(() => {
        if (initialMessage) {
            setIsFocused(true);
        }
    }, [initialMessage]);

    // Reset messages and simulation state when simulated flow changes or chat closes
    useEffect(() => {
        if (simulatedFlow) {
            setMessages([]);
            hasSimulatedRef.current = false;
        }
    }, [simulatedFlow]);

    // Reset simulation state when component unmounts or chat closes
    useEffect(() => {
        return () => {
            hasSimulatedRef.current = false;
        };
    }, []);

    // Handle simulated flow - use a ref to track the flow to prevent duplicate execution
    const currentFlowRef = useRef<typeof simulatedFlow>(undefined);
    const currentExecutionIdRef = useRef<number | null>(null);

    useEffect(() => {
        // Only execute if we have a new simulated flow that hasn't been processed
        if (
            simulatedFlow &&
            simulatedFlow !== currentFlowRef.current &&
            !hasSimulatedRef.current &&
            simulatedFlow.messages &&
            simulatedFlow.messages.length > 0
        ) {
            // Cancel any previous simulation by generating a new execution ID
            const executionId = Date.now();
            currentExecutionIdRef.current = executionId;
            currentFlowRef.current = simulatedFlow;
            hasSimulatedRef.current = true;

            const executeSimulatedFlow = async () => {
                // Generate a unique base timestamp for this flow execution
                const flowId = Date.now();

                for (let i = 0; i < simulatedFlow.messages.length; i++) {
                    // Check if this execution has been cancelled (new flow started)
                    if (currentExecutionIdRef.current !== executionId) {
                        // This simulation has been cancelled, stop executing
                        return;
                    }

                    const msg = simulatedFlow.messages[i];
                    const delay = msg.delay || 0;

                    // Wait for delay
                    if (delay > 0) {
                        await new Promise((resolve) =>
                            setTimeout(resolve, delay)
                        );
                    }

                    // Check again after delay in case flow changed during wait
                    if (currentExecutionIdRef.current !== executionId) {
                        return;
                    }

                    // Add message with unique ID using flowId + index + random component
                    const message: Message = {
                        id: `sim-${flowId}-${i}-${Math.random()
                            .toString(36)
                            .substr(2, 9)}`,
                        role: msg.role,
                        content: msg.content,
                    };

                    setMessages((prev) => {
                        // Prevent duplicate messages by checking if message already exists
                        const exists = prev.some((m) => m.id === message.id);
                        if (exists) {
                            return prev;
                        }
                        return [...prev, message];
                    });

                    // If it's a user message and autoSend is enabled, trigger send
                    if (
                        msg.role === "user" &&
                        simulatedFlow.autoSend &&
                        i === 0
                    ) {
                        // Call onSendMessage if provided
                        if (onSendMessage) {
                            onSendMessage(msg.content);
                        }
                    }

                    // If it's an AI message, show loading state briefly
                    if (msg.role === "ai") {
                        setIsLoading(true);
                        await new Promise((resolve) =>
                            setTimeout(resolve, 500)
                        );
                        setIsLoading(false);
                    }
                }
            };

            executeSimulatedFlow();
        }
    }, [simulatedFlow, onSendMessage]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    // Widget drop is handled by InlineChatInput component

    // Extract widget content from DOM
    const extractWidgetContent = useCallback(
        (widgetLayout: WidgetLayout): string => {
            try {
                // Find widget element by data attribute
                const widgetElement = document.querySelector(
                    `[data-widget-instance-id="${widgetLayout.id}"]`
                );

                if (!widgetElement) {
                    return "Widget not found in DOM";
                }

                // Extract text content from the widget
                const textContent: string[] = [];

                // Get all text nodes, excluding script and style elements
                const walker = document.createTreeWalker(
                    widgetElement,
                    NodeFilter.SHOW_TEXT,
                    {
                        acceptNode: (node) => {
                            const parent = node.parentElement;
                            if (!parent) return NodeFilter.FILTER_REJECT;

                            // Skip script, style, and hidden elements
                            if (
                                parent.tagName === "SCRIPT" ||
                                parent.tagName === "STYLE" ||
                                parent.closest("[hidden]") ||
                                parent.closest("[style*='display: none']")
                            ) {
                                return NodeFilter.FILTER_REJECT;
                            }

                            // Only include visible text
                            const text = node.textContent?.trim() || "";
                            if (text.length === 0)
                                return NodeFilter.FILTER_REJECT;

                            return NodeFilter.FILTER_ACCEPT;
                        },
                    }
                );

                const textNodes: string[] = [];
                let node;
                while ((node = walker.nextNode())) {
                    const text = node.textContent?.trim();
                    if (text && text.length > 0) {
                        textNodes.push(text);
                    }
                }

                // Also extract specific value elements (numbers, percentages, etc.)
                const valueSelectors = [
                    '[class*="value"]',
                    '[class*="metric"]',
                    '[class*="kpi"]',
                    '[class*="number"]',
                    '[class*="percentage"]',
                    '[class*="count"]',
                ];

                const extractedValues: string[] = [];
                valueSelectors.forEach((selector) => {
                    const elements = widgetElement.querySelectorAll(selector);
                    elements.forEach((el) => {
                        const text = el.textContent?.trim();
                        if (text && text.length > 0 && text.length < 100) {
                            extractedValues.push(text);
                        }
                    });
                });

                // Combine and deduplicate
                const allContent = [...textNodes, ...extractedValues];
                const uniqueContent = Array.from(new Set(allContent));

                // Filter out very short or common UI text
                const filteredContent = uniqueContent.filter((text) => {
                    return (
                        text.length > 1 &&
                        !text.match(
                            /^(and|or|the|a|an|in|on|at|to|for|of|with|by)$/i
                        ) &&
                        !text.match(/^[^\w\s]+$/) // Not just punctuation
                    );
                });

                // Limit to reasonable size and format
                const content = filteredContent.slice(0, 50).join(" | ");
                return content || "No extractable content found";
            } catch (error) {
                console.error("Error extracting widget content:", error);
                return "Error extracting widget content";
            }
        },
        []
    );

    // Send message to AI
    const sendMessage = useCallback(
        async (content: { text: string; chips: WidgetLayout[] }) => {
            if (!content.text.trim() && content.chips.length === 0) return;

            // Build conversation history before adding the new user message
            const conversationHistory = messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
            }));

            const currentMessage = content.text.trim();
            setIsLoading(true);
            setIsGenerating(true);

            // Add user message to chat body when we start processing (not when queued)
            const userMessage: Message = {
                id: Date.now().toString(),
                role: "user",
                content: content.text.trim(),
                widgetChips:
                    content.chips.length > 0 ? content.chips : undefined,
            };

            setMessages((prev) => [...prev, userMessage]);

            // Create new AbortController for this request
            const abortController = new AbortController();
            abortControllerRef.current = abortController;

            // Call the onSendMessage callback
            if (onSendMessage) {
                onSendMessage(userMessage.content);
            }

            try {
                // Build widget context from chips with extracted content
                const widgetContext = content.chips.map((chip) => {
                    const widgetMetadata = getWidgetById(chip.widgetId);
                    const extractedContent = extractWidgetContent(chip);

                    return {
                        widgetId: chip.widgetId,
                        name: widgetMetadata?.name || chip.widgetId,
                        description: widgetMetadata?.description || "",
                        category: widgetMetadata?.category || "",
                        dataSource: widgetMetadata?.dataSource || [],
                        content: extractedContent, // Add extracted DOM content
                    };
                });

                // Clean message text - remove widget placeholders when we have widget context
                let cleanedMessage = currentMessage;
                if (widgetContext.length > 0) {
                    // Remove [WIDGET:...] placeholders from the message text
                    cleanedMessage = cleanedMessage
                        .replace(/\[WIDGET:[^\]]+\]/g, "")
                        .trim();
                }

                // Enhance message with widget context
                let enhancedMessage = cleanedMessage;
                if (widgetContext.length > 0) {
                    const widgetContextText = widgetContext
                        .map(
                            (widget) =>
                                `Widget: ${widget.name} (${
                                    widget.widgetId
                                })\nDescription: ${
                                    widget.description
                                }\nCategory: ${widget.category}${
                                    widget.dataSource.length > 0
                                        ? `\nData Source: ${widget.dataSource.join(
                                              ", "
                                          )}`
                                        : ""
                                }${
                                    widget.content
                                        ? `\nContent: ${widget.content}`
                                        : ""
                                }`
                        )
                        .join("\n\n");
                    enhancedMessage = cleanedMessage
                        ? `${cleanedMessage}\n\nReferenced Widgets:\n${widgetContextText}`
                        : `Referenced Widgets:\n${widgetContextText}`;
                }

                // Call Gemini API with abort signal
                const response = await fetch("/api/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: enhancedMessage,
                        conversationHistory,
                        widgetContext:
                            widgetContext.length > 0
                                ? widgetContext
                                : undefined,
                    }),
                    signal: abortController.signal,
                });

                // Check if request was aborted
                if (abortController.signal.aborted) {
                    return;
                }

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    const errorMessage =
                        errorData.error ||
                        `Failed to get response from AI (${response.status})`;

                    // Check if it's a quota/rate limit error
                    if (
                        response.status === 429 ||
                        errorMessage.includes("quota") ||
                        errorMessage.includes("RESOURCE_EXHAUSTED") ||
                        errorMessage.includes("rate limit")
                    ) {
                        throw new Error("Exceeded current quota");
                    }

                    throw new Error(errorMessage);
                }

                const data = await response.json();

                if (data.error) {
                    // Check if it's a quota/rate limit error
                    const errorMessage = data.error;
                    if (
                        typeof errorMessage === "string" &&
                        (errorMessage.includes("quota") ||
                            errorMessage.includes("RESOURCE_EXHAUSTED") ||
                            errorMessage.includes("rate limit") ||
                            errorMessage.includes("429"))
                    ) {
                        throw new Error("Exceeded current quota");
                    }
                    throw new Error(errorMessage);
                }

                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "ai",
                    content:
                        data.message ||
                        "I apologize, but I couldn't generate a response.",
                };

                // Track the last AI message for typing completion
                lastAIMessageIdRef.current = aiMessage.id;
                setMessages((prev) => [...prev, aiMessage]);

                // Keep isGenerating true - it will be set to false when typing completes
                // Don't set it to false here, let the typing animation complete
            } catch (error) {
                // Don't show error if request was aborted
                if (error instanceof Error && error.name === "AbortError") {
                    const stoppedMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        role: "ai",
                        content: "Generation stopped.",
                    };
                    lastAIMessageIdRef.current = stoppedMessage.id;
                    setMessages((prev) => [...prev, stoppedMessage]);
                    return;
                }

                console.error("Error sending message:", error);

                // Simplify error message for quota/rate limit errors
                let displayError =
                    "I'm sorry, I encountered an error. Please try again later.";
                if (error instanceof Error) {
                    const errorMsg = error.message;
                    // Check if it's a quota/rate limit error
                    if (
                        errorMsg.includes("quota") ||
                        errorMsg.includes("RESOURCE_EXHAUSTED") ||
                        errorMsg.includes("rate limit") ||
                        errorMsg.includes("429") ||
                        errorMsg === "Exceeded current quota"
                    ) {
                        displayError = "Exceeded current quota";
                    } else {
                        displayError = errorMsg;
                    }
                }

                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "ai",
                    content: displayError,
                };
                lastAIMessageIdRef.current = errorMessage.id;
                setMessages((prev) => [...prev, errorMessage]);
            } finally {
                setIsLoading(false);
                // Don't set isGenerating to false here - let it stay true until typing completes
                // isGenerating will be set to false by the onTypingComplete callback
                abortControllerRef.current = null;
            }
        },
        [messages, onSendMessage, extractWidgetContent]
    );

    // Process queue when generation completes (after typing animation finishes)
    useEffect(() => {
        // Only process if we're not generating, not loading, have queued messages, and not already processing
        if (
            !isGenerating &&
            !isLoading &&
            messageQueue.length > 0 &&
            !isProcessingQueueRef.current
        ) {
            isProcessingQueueRef.current = true;

            // Get the first message from current queue state
            const nextMessage = messageQueue[0];

            // Remove from queue immediately (updates UI)
            setMessageQueue((prev) => prev.slice(1));

            // Send the message
            sendMessage(nextMessage);

            // Reset processing flag after delay to allow next message to process
            setTimeout(() => {
                isProcessingQueueRef.current = false;
            }, 500);
        }
    }, [isGenerating, isLoading, messageQueue, sendMessage]);

    // Handle custom drag and drop events
    useEffect(() => {
        const handleWidgetDragOver = (e: CustomEvent<{ isOver: boolean }>) => {
            setIsDragOver(e.detail.isOver);
        };

        const handleWidgetDragEnd = () => {
            setIsDragOver(false);
        };

        window.addEventListener(
            "widget-drag-over",
            handleWidgetDragOver as EventListener
        );
        window.addEventListener("widget-drag-end", handleWidgetDragEnd);

        return () => {
            window.removeEventListener(
                "widget-drag-over",
                handleWidgetDragOver as EventListener
            );
            window.removeEventListener("widget-drag-end", handleWidgetDragEnd);
        };
    }, [setIsDragOver]);

    // Handle send - send immediately if not generating, otherwise queue
    const handleSend = async (content: {
        text: string;
        chips: WidgetLayout[];
    }) => {
        if (!content.text.trim() && content.chips.length === 0) return;

        // If not generating and not loading, send immediately
        if (!isGenerating && !isLoading) {
            sendMessage(content);
        } else {
            // Otherwise, add to queue
            setMessageQueue((prev) => [...prev, content]);
        }
    };

    // Register queue handler with context so external components can queue messages
    // This must be after handleSend is defined
    // When called from external sources (like action feed), always queue, don't send immediately
    useEffect(() => {
        queueHandlerRef.current = (message: QueuedMessage) => {
            // Always add to queue when called from external sources
            // This ensures messages from action feed CTAs are queued, not sent immediately
            setMessageQueue((prev) => [...prev, message]);
        };

        return () => {
            queueHandlerRef.current = null;
        };
    }, [queueHandlerRef]);

    // Handle typing completion for AI messages
    const handleTypingComplete = useCallback(() => {
        // Set isGenerating to false when the tracked message finishes typing
        // This ensures we only stop generating when the last AI message completes typing
        setIsGenerating(false);
    }, []);

    // Handle stop - abort current request and clear queue
    const handleStop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsGenerating(false);
        setIsLoading(false);
        setMessageQueue([]);
        lastAIMessageIdRef.current = null;
    };

    // Get preview text for queued message
    const getQueueItemPreview = (item: QueuedMessage): string => {
        const textPreview = item.text.trim();
        const chipCount = item.chips.length;
        if (textPreview) {
            return chipCount > 0
                ? `${textPreview} (+${chipCount} widget${
                      chipCount > 1 ? "s" : ""
                  })`
                : textPreview;
        }
        return chipCount > 0
            ? `${chipCount} widget${chipCount > 1 ? "s" : ""}`
            : "Empty message";
    };

    return (
        <div className="bg-white border border-[#d9dede] border-solid relative rounded-2xl w-full min-h-[580px] h-auto flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-[rgba(255,255,255,0.2)] flex gap-2 items-center justify-center px-4 py-3 relative shrink-0 w-full z-7">
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
            <div className="bg-[rgba(255,255,255,0.2)] flex flex-col gap-4 flex-1 px-4 py-4 relative w-full z-6 overflow-y-auto">
                {!hasMessages ? (
                    // Greeting Section
                    <div className="flex flex-col gap-6 items-center justify-center flex-1 w-full">
                        {/* Logo */}
                        <div className="relative shrink-0 w-10 h-10">
                            <Image
                                src="/images/Sidekick_Logo.png"
                                alt="Sidekick Logo"
                                width={40}
                                height={40}
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
                                    <AIMessage
                                        message={msg}
                                        onTypingComplete={
                                            msg.id ===
                                            lastAIMessageIdRef.current
                                                ? handleTypingComplete
                                                : undefined
                                        }
                                    />
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

            {/* Queue UI - Show when there are queued messages */}
            {messageQueue.length > 0 && (
                <div className="border-t border-[#d9dede] bg-white">
                    {/* Queue Header */}
                    {messageQueue.length > 0 && (
                        <button
                            onClick={() => setIsQueueExpanded(!isQueueExpanded)}
                            className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <CaretDown
                                    className={`w-4 h-4 text-[#5d6c6b] transition-transform ${
                                        isQueueExpanded ? "" : "-rotate-90"
                                    }`}
                                    weight="regular"
                                />
                                <span className="text-sm font-medium text-[#262b2b]">
                                    {messageQueue.length} Queued
                                </span>
                            </div>
                        </button>
                    )}

                    {/* Queue Items */}
                    {isQueueExpanded && messageQueue.length > 0 && (
                        <div className="px-4 pb-2 space-y-1 max-h-[200px] overflow-y-auto">
                            {messageQueue.map((item, index) => (
                                <div
                                    key={`queue-${index}-${item.text.substring(
                                        0,
                                        10
                                    )}`}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 group"
                                >
                                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-[#d9dede] shrink-0 text-xs font-medium text-[#5d6c6b]">
                                        {index + 1}
                                    </div>
                                    <span className="flex-1 text-sm text-[#262b2b] truncate">
                                        {getQueueItemPreview(item)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Currently Generating */}
                    {isGenerating && (
                        <div className="px-4 py-2 border-t border-[#d9dede]">
                            <div className="flex items-center gap-2">
                                <ArrowRight
                                    className="w-4 h-4 text-[#158039] shrink-0"
                                    weight="regular"
                                />
                                <span className="flex-1 text-sm text-[#262b2b]">
                                    Generating...
                                </span>
                                <button
                                    onClick={handleStop}
                                    className="px-3 py-1 text-sm font-medium text-[#262b2b] hover:bg-gray-100 rounded transition-colors"
                                >
                                    Stop
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Message Input */}
            <div className="flex gap-2 items-start p-4 relative shrink-0 z-5 border-t border-[#d9dede] w-full">
                <div
                    ref={dropZoneRef}
                    data-chat-drop-zone
                    className={`bg-white border border-solid flex flex-col gap-2 grow items-start w-full p-3 relative rounded-xl shrink-0 transition-all ${
                        isDragOver
                            ? "border-[#158039] border-2 bg-[#f0f9f4] shadow-lg scale-[1.01]"
                            : isFocused
                            ? "border-[#158039]"
                            : "border-[#d9dede]"
                    }`}
                >
                    {/* Drop Zone Indicator */}
                    {isDragOver && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#158039]/5 rounded-xl pointer-events-none z-10">
                            <div className="text-center px-4 py-2">
                                <p className="text-sm font-medium text-[#158039]">
                                    Drop to reference this widget
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Inline Chat Input */}
                    <div className="flex gap-[10px] items-start max-h-[236px] overflow-x-clip overflow-y-auto relative shrink-0 w-full">
                        <InlineChatInput
                            placeholder="Message Sidekick... or drag a widget here"
                            disabled={false}
                            onSend={handleSend}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onContentChange={setHasContent}
                            initialValue={initialMessage}
                            sendButtonRef={
                                sendButtonRef as React.RefObject<{
                                    triggerSend: () => void;
                                }>
                            }
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 items-center justify-between relative shrink-0 w-full">
                        {/* Queue Indicator */}
                        {messageQueue.length > 0 && (
                            <div className="flex items-center gap-1.5 text-sm text-[#5d6c6b]">
                                <span className="font-medium">
                                    {messageQueue.length}
                                </span>
                                <span>
                                    {messageQueue.length === 1
                                        ? "message"
                                        : "messages"}{" "}
                                    queued
                                </span>
                            </div>
                        )}
                        <div className="flex gap-2 grow items-center justify-end min-h-0 min-w-0 relative shrink-0">
                            {/* Paperclip Button */}
                            <button
                                className="box-border flex items-center justify-center w-9 h-9 overflow-clip relative rounded-lg shrink-0 hover:bg-gray-50 transition-colors"
                                aria-label="Attach file"
                                disabled={isLoading || isGenerating}
                            >
                                <Paperclip
                                    className="w-5 h-5 text-[#4b686e]"
                                    weight="regular"
                                />
                            </button>

                            {/* Send/Stop Button */}
                            {isGenerating ? (
                                <button
                                    onClick={handleStop}
                                    className="box-border flex items-center justify-center w-9 h-9 overflow-clip relative rounded-lg shrink-0 transition-colors bg-red-500 hover:bg-red-600"
                                    aria-label="Stop generation"
                                >
                                    <Stop
                                        className="w-5 h-5 text-white"
                                        weight="fill"
                                    />
                                </button>
                            ) : (
                                <button
                                    onClick={() =>
                                        sendButtonRef.current?.triggerSend()
                                    }
                                    className={`box-border flex items-center justify-center w-9 h-9 overflow-clip relative rounded-lg shrink-0 transition-colors ${
                                        hasContent && !isLoading
                                            ? "bg-[#158039] hover:bg-[#158039]/90"
                                            : "bg-[#f1f2f3] hover:bg-[#e1e2e3]"
                                    }`}
                                    aria-label="Send message"
                                    disabled={!hasContent || isLoading}
                                >
                                    <PaperPlaneRight
                                        className={`w-5 h-5 ${
                                            hasContent && !isLoading
                                                ? "text-white"
                                                : "text-[#4b686e]"
                                        }`}
                                        weight="fill"
                                    />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Decorations */}
            {/* Layer 1: Circles (bottom) */}
            <div className="absolute left-[-131px] w-[248px] h-[248px] top-[-113px] z-1 pointer-events-none">
                <div className="absolute inset-[-25.81%] bg-linear-to-br from-purple-100 to-green-100 rounded-full opacity-30" />
            </div>
            <div className="absolute left-[448px] w-[236px] h-[236px] top-[-64px] z-2 pointer-events-none">
                <div className="absolute inset-[-27.12%] bg-linear-to-br from-green-100 to-blue-100 rounded-full opacity-30" />
            </div>
            <div className="absolute left-[200px] w-[160px] h-[160px] top-[306.52px] z-3 pointer-events-none">
                <div className="absolute inset-[-40%] bg-linear-to-br from-yellow-100 to-orange-100 rounded-full opacity-30" />
            </div>

            {/* Layer 2: Texture (middle) */}
            <div className="absolute inset-0 z-4 pointer-events-none opacity-40">
                <div className="relative w-full h-full">
                    <Image
                        src="/images/Texture_BG_Pattern.png"
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
        </div>
    );
}

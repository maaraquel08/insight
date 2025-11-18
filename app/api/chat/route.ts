import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { message, conversationHistory } = await request.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Check if API key is configured
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                {
                    error: "Gemini API key is not configured. Please set GEMINI_API_KEY environment variable.",
                },
                { status: 500 }
            );
        }

        // Initialize Google GenAI
        // The client gets the API key from the environment variable GEMINI_API_KEY
        const ai = new GoogleGenAI({});

        // Build conversation context
        // For conversation history, we'll build a context string
        let conversationContext = "";
        if (conversationHistory && conversationHistory.length > 0) {
            conversationContext = conversationHistory
                .map((msg: { role: string; content: string }) => {
                    const role = msg.role === "user" ? "User" : "Assistant";
                    return `${role}: ${msg.content}`;
                })
                .join("\n\n");
            conversationContext += `\n\nUser: ${message}`;
        } else {
            conversationContext = message;
        }

        // Generate response using Gemini 2.5 Flash
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: conversationContext,
        });

        const responseText =
            response.text || "I apologize, but I couldn't generate a response.";

        return NextResponse.json({ message: responseText });
    } catch (error: any) {
        console.error("Error calling Gemini API:", error);

        // Handle specific API errors
        if (error?.error?.code === 503) {
            return NextResponse.json(
                {
                    error: "The AI model is currently overloaded. Please try again in a moment.",
                },
                { status: 503 }
            );
        }

        if (error?.error?.code === 429) {
            return NextResponse.json(
                {
                    error: "Rate limit exceeded. Please wait a moment before trying again.",
                },
                { status: 429 }
            );
        }

        if (error?.error?.code === 401) {
            return NextResponse.json(
                {
                    error: "Invalid API key. Please check your GEMINI_API_KEY configuration.",
                },
                { status: 401 }
            );
        }

        // Generic error response
        const errorMessage =
            error?.error?.message ||
            error?.message ||
            "Failed to generate response. Please try again.";

        return NextResponse.json(
            { error: errorMessage },
            { status: error?.error?.code || error?.status || 500 }
        );
    }
}

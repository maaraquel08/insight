/**
 * Chat Actions Utility
 * Modular functions to trigger chatbot sidekick with pre-filled messages and simulated flows
 */

import { simulationFlows } from "./chat-simulations";
import type { SimulatedFlow } from "./chat-simulations";

/**
 * Opens the chat sidekick with a simulated COA (Certificate of Attendance) application flow
 * This simulates the AI agent automatically applying for missing logs
 */
export function createCOAApplicationAction(
    openChat: (initialMessage?: string, simulatedFlow?: SimulatedFlow) => void
) {
    return () => {
        openChat(undefined, simulationFlows.coa);
    };
}

/**
 * Generic function to open chat with a custom message or simulated flow
 */
export function createChatAction(
    openChat: (initialMessage?: string, simulatedFlow?: SimulatedFlow) => void,
    message?: string,
    flowKey?: string
) {
    return () => {
        if (flowKey && simulationFlows[flowKey]) {
            openChat(message, simulationFlows[flowKey]);
        } else {
            openChat(message);
        }
    };
}

/**
 * Pre-defined chat action messages for common scenarios
 */
export const ChatActionMessages = {
    COA_APPLICATION:
        "I need help applying for Certificate of Attendance for my missing clock in/out logs. Can you assist me with this?",
    LEAVE_REQUEST: "I'd like to request vacation leave. Can you help me with the process?",
    ATTENDANCE_ISSUE:
        "I'm having issues with my attendance records. Can you help me resolve this?",
    PAYROLL_QUESTION: "I have a question about my payroll. Can you help me?",
    SCHEDULE_CHANGE: "I need to request a schedule change. Can you assist me?",
} as const;

/**
 * Pre-defined simulation flow keys
 */
export const SimulationFlowKeys = {
    COA: "coa",
    LEAVE: "leave",
} as const;


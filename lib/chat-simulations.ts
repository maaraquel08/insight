/**
 * Chat Simulations
 * Pre-defined conversation flows for simulated chatbot experiences
 */

export interface SimulatedMessage {
    role: "user" | "ai";
    content: string;
    delay?: number; // Delay in ms before showing this message
}

export interface SimulatedFlow {
    messages: SimulatedMessage[];
    autoSend?: boolean; // Whether to auto-send the first user message
}

/**
 * COA Application Simulation
 * Simulates the AI agent applying Certificate of Attendance for the user
 */
export const coaApplicationFlow: SimulatedFlow = {
    autoSend: true,
    messages: [
        {
            role: "user",
            content: "I need help applying for Certificate of Attendance for my missing clock in/out logs. Can you assist me with this?",
            delay: 500, // Wait 500ms after opening chat
        },
        {
            role: "ai",
            content: "I'll help you apply for your Certificate of Attendance right away. Let me check your missing logs and prepare the application for you.",
            delay: 1000, // Wait 1s after user message
        },
        {
            role: "ai",
            content: "I found 3 missing log entries for this pay period:\n\n• January 15, 2025 - Missing clock out\n• January 18, 2025 - Missing clock in\n• January 20, 2025 - Missing clock out\n\nI'm now preparing your Certificate of Attendance application with these details.",
            delay: 2000, // Wait 2s after previous AI message
        },
        {
            role: "ai",
            content: "✅ **Certificate of Attendance Application Submitted**\n\nYour application has been successfully submitted for review. Here's what I've done:\n\n• Verified your missing log entries\n• Prepared the Certificate of Attendance form\n• Submitted the application to your supervisor\n• Sent you a confirmation email\n\n**Next Steps:**\nYour supervisor will review and approve the application within 24-48 hours. You'll receive a notification once it's processed.\n\nIs there anything else I can help you with regarding your attendance?",
            delay: 2500, // Wait 2.5s after previous AI message
        },
    ],
};

/**
 * Leave Request Simulation
 */
export const leaveRequestFlow: SimulatedFlow = {
    autoSend: true,
    messages: [
        {
            role: "user",
            content: "I'd like to request vacation leave. Can you help me with the process?",
            delay: 500,
        },
        {
            role: "ai",
            content: "I'll help you submit your vacation leave request. Let me guide you through the process.",
            delay: 1000,
        },
    ],
};

/**
 * Run Payroll Simulation
 * Simulates the AI agent running payroll for all companies
 */
export const runPayrollFlow: SimulatedFlow = {
    autoSend: true,
    messages: [
        {
            role: "user",
            content: "I need to run payroll for all companies. Can you help me process it?",
            delay: 500,
        },
        {
            role: "ai",
            content: "I'll process payroll for all companies right away. Let me verify attendance logs and prepare the payroll run.",
            delay: 1000,
        },
        {
            role: "ai",
            content: "✅ **Verification Complete**\n\nI've verified attendance logs for all 12 companies:\n\n• All attendance records are complete\n• Overtime calculations verified\n• Leave balances updated\n• Compliance checks passed\n\nReady to process payroll.",
            delay: 2000,
        },
        {
            role: "ai",
            content: "🚀 **Payroll Processing Started**\n\nProcessing payroll for:\n\n• Company A - 320 employees\n• Company B - 245 employees\n• Company C - 180 employees\n• ... (9 more companies)\n\nEstimated completion: 2-3 minutes.",
            delay: 2500,
        },
        {
            role: "ai",
            content: "✅ **Payroll Processing Complete**\n\nAll payroll runs have been successfully processed!\n\n**Summary:**\n• 12 companies processed\n• 1,847 employees paid\n• Total payroll amount: $2,345,678.90\n• All payments scheduled for next pay date\n• Confirmation emails sent to all supervisors\n\nPayroll is now ready for final review and approval.",
            delay: 3000,
        },
    ],
};

/**
 * Auto-Fix Anomalies Simulation
 * Simulates the AI agent automatically fixing payroll anomalies
 */
export const autoFixAnomaliesFlow: SimulatedFlow = {
    autoSend: true,
    messages: [
        {
            role: "user",
            content: "I found anomalies in payroll runs. Can you auto-fix them?",
            delay: 500,
        },
        {
            role: "ai",
            content: "I'll analyze and auto-fix the payroll anomalies for you. Let me scan the payroll runs and identify the issues.",
            delay: 1000,
        },
        {
            role: "ai",
            content: "🔍 **Anomaly Analysis Complete**\n\nFound 3 anomalies:\n\n1. **Company A** - +15% payroll increase\n   • Issue: Duplicate overtime entries\n   • Fix: Removed duplicate entries\n\n2. **Company B** - Unexpected bonuses\n   • Issue: Incorrect bonus calculation\n   • Fix: Recalculated based on actual performance\n\n3. **Company C** - +8% overtime costs\n   • Issue: Missing shift differential adjustments\n   • Fix: Applied correct shift differentials",
            delay: 2000,
        },
        {
            role: "ai",
            content: "🔧 **Auto-Fixing Anomalies...**\n\nApplying corrections to all identified issues...",
            delay: 2500,
        },
        {
            role: "ai",
            content: "✅ **Anomalies Fixed Successfully**\n\nAll payroll anomalies have been automatically corrected:\n\n**Fixed Issues:**\n• Company A: Removed duplicate entries (-$12,450)\n• Company B: Recalculated bonuses (-$3,200)\n• Company C: Applied shift differentials (-$5,800)\n\n**Total Savings:** $21,450\n\nPayroll runs are now accurate and ready for processing. All changes have been logged for audit purposes.",
            delay: 3000,
        },
    ],
};

/**
 * Generic simulation flows
 */
export const simulationFlows: Record<string, SimulatedFlow> = {
    coa: coaApplicationFlow,
    leave: leaveRequestFlow,
    "run-payroll": runPayrollFlow,
    "auto-fix-anomalies": autoFixAnomaliesFlow,
};


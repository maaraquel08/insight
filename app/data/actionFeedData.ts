/**
 * Action Feed Data Types
 * Type definitions for AI-generated action feed items
 */

export interface ActionFeedItem {
    id: string;
    category?:
        | "payroll"
        | "engagement"
        | "attendance"
        | "productivity"
        | "compliance"
        | "operations"; // Category for filtering
    header: {
        title: string;
        timestamp: string;
        priority?: {
            label: string;
            variant: "high" | "medium" | "low";
        };
    };
    body: {
        mainAlert?: {
            message: string;
        };
        comparison?: {
            value: string;
            direction: "up" | "down";
            show: boolean;
        };
        aiGenerated?: {
            message: string;
            show: boolean;
        };
        impact?: {
            label: string;
            message: string;
            show: boolean;
        };
    };
    footer: {
        actions: Array<{
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
        }>;
    };
}

/**
 * Action Feed Data
 * Data structure for AI-generated action feed items
 */
export const actionFeedData: ActionFeedItem[] = [
    {
        id: "absenteeism-alert-001",
        category: "attendance",
        header: {
            title: "Workforce Attendance & Adherence",
            timestamp: "3d 2h ago",
            priority: {
                label: "High priority",
                variant: "high",
            },
        },
        body: {
            mainAlert: {
                message:
                    "Absenteeism rate is 12%, higher than your daily target of 8%.",
            },
            comparison: {
                value: "4% above target",
                direction: "up",
                show: true,
            },
            aiGenerated: {
                message:
                    "Absenteeism spike concentrated in morning shifts. Consider activating reserve staff.",
                show: true,
            },
            impact: {
                label: "Impact",
                message:
                    "Service levels for Queue 2 may drop in the next 2 hours if no adjustments are made.",
                show: true,
            },
        },
        footer: {
            actions: [
                {
                    label: "View Affected Teams",
                    variant: "outline",
                    onClick: () => {
                        console.log("View Affected Teams clicked");
                    },
                },
                {
                    label: "Recommend Reallocation",
                    variant: "outline",
                    borderColor: "purple",
                    onClick: () => {
                        console.log("Recommend Reallocation clicked");
                    },
                },
            ],
        },
    },
    {
        id: "staffing-gap-002",
        category: "attendance",
        header: {
            title: "Workforce Attendance & Adherence",
            timestamp: "2h ago",
            priority: {
                label: "High priority",
                variant: "high",
            },
        },
        body: {
            mainAlert: {
                message: "2 queues are under-staffed for the next shift.",
            },
            comparison: {
                value: "Below threshold",
                direction: "down",
                show: true,
            },
            aiGenerated: {
                message:
                    "Queue A and Queue C need 3 additional agents each to meet SLA targets.",
                show: true,
            },
            impact: {
                label: "Impact",
                message:
                    "SLA performance may drop below 90% threshold if staffing gap is not addressed.",
                show: true,
            },
        },
        footer: {
            actions: [
                {
                    label: "Recommend Reallocation",
                    variant: "outline",
                    borderColor: "purple",
                    onClick: () => {
                        console.log("Recommend Reallocation clicked");
                    },
                },
            ],
        },
    },
    {
        id: "low-productivity-005",
        category: "productivity",
        header: {
            title: "Performance & Productivity",
            timestamp: "4h ago",
            priority: {
                label: "Medium priority",
                variant: "medium",
            },
        },
        body: {
            mainAlert: {
                message: "Team Delta productivity is down by 14% today.",
            },
            comparison: {
                value: "14% vs yesterday",
                direction: "down",
                show: true,
            },
            aiGenerated: {
                message:
                    "Productivity decline linked to increased call complexity and system delays.",
                show: true,
            },
            impact: {
                label: "Impact",
                message:
                    "Daily output targets may not be met if productivity trend continues.",
                show: true,
            },
        },
        footer: {
            actions: [
                {
                    label: "View Contributors",
                    variant: "outline",
                    onClick: () => {
                        console.log("View Contributors clicked");
                    },
                },
            ],
        },
    },
    {
        id: "qa-scores-dropping-006",
        category: "productivity",
        header: {
            title: "Performance & Productivity",
            timestamp: "6h ago",
            priority: {
                label: "Medium priority",
                variant: "medium",
            },
        },
        body: {
            mainAlert: {
                message: "QA pass rate decreased from 92% to 86%.",
            },
            comparison: {
                value: "6% drop",
                direction: "down",
                show: true,
            },
            aiGenerated: {
                message:
                    "QA decline concentrated in compliance-related errors. Additional training may be needed.",
                show: true,
            },
            impact: {
                label: "Impact",
                message:
                    "Client satisfaction scores may be affected if QA trends continue downward.",
                show: true,
            },
        },
        footer: {
            actions: [
                {
                    label: "See Insights",
                    variant: "outline",
                    onClick: () => {
                        console.log("See Insights clicked");
                    },
                },
            ],
        },
    },
    {
        id: "attrition-risk-007",
        category: "engagement",
        header: {
            title: "People Risk",
            timestamp: "1d ago",
            priority: {
                label: "High priority",
                variant: "high",
            },
        },
        body: {
            mainAlert: {
                message:
                    "7 agents show early indicators of potential attrition risk.",
            },
            comparison: {
                value: "Pattern detected",
                direction: "down",
                show: true,
            },
            aiGenerated: {
                message:
                    "Risk indicators include attendance dips and engagement score declines. Early intervention recommended.",
                show: true,
            },
            impact: {
                label: "Impact",
                message:
                    "Potential loss of experienced agents may affect team stability and knowledge retention.",
                show: true,
            },
        },
        footer: {
            actions: [
                {
                    label: "View Patterns",
                    variant: "outline",
                    onClick: () => {
                        console.log("View Patterns clicked");
                    },
                },
            ],
        },
    },
    {
        id: "team-sentiment-drop-008",
        category: "engagement",
        header: {
            title: "People Risk",
            timestamp: "2d ago",
            priority: {
                label: "Medium priority",
                variant: "medium",
            },
        },
        body: {
            mainAlert: {
                message: "Engagement scores for Team Gamma dropped this week.",
            },
            comparison: {
                value: "Below baseline",
                direction: "down",
                show: true,
            },
            aiGenerated: {
                message:
                    "Sentiment decline may be linked to recent schedule changes. Consider gathering feedback.",
                show: true,
            },
            impact: {
                label: "Impact",
                message:
                    "Lower engagement may affect productivity and increase attrition risk.",
                show: true,
            },
        },
        footer: {
            actions: [
                {
                    label: "See Feedback Summary",
                    variant: "outline",
                    onClick: () => {
                        console.log("See Feedback Summary clicked");
                    },
                },
            ],
        },
    },
    {
        id: "high-overtime-risk-009",
        category: "compliance",
        header: {
            title: "People Risk",
            timestamp: "4h ago",
            priority: {
                label: "High priority",
                variant: "high",
            },
        },
        body: {
            mainAlert: {
                message:
                    "6 agents exceeded OT limits and may be at risk of burnout.",
            },
            comparison: {
                value: "Above limit",
                direction: "up",
                show: true,
            },
            aiGenerated: {
                message:
                    "Extended overtime patterns detected. Recommend schedule adjustments to prevent fatigue.",
                show: true,
            },
            impact: {
                label: "Impact",
                message:
                    "Continued overtime may lead to decreased performance and increased error rates.",
                show: true,
            },
        },
        footer: {
            actions: [
                {
                    label: "Adjust Schedules",
                    variant: "outline",
                    borderColor: "purple",
                    onClick: () => {
                        console.log("Adjust Schedules clicked");
                    },
                },
            ],
        },
    },
    {
        id: "payroll-variance-010",
        category: "payroll",
        header: {
            title: "Payroll & Compliance Health",
            timestamp: "1d ago",
            priority: {
                label: "Medium priority",
                variant: "medium",
            },
        },
        body: {
            mainAlert: {
                message: "Payroll cost is trending +11% vs last month.",
            },
            comparison: {
                value: "11% increase",
                direction: "up",
                show: true,
            },
            aiGenerated: {
                message:
                    "Payroll variance driven by overtime hours and shift differentials. Review allocation.",
                show: true,
            },
            impact: {
                label: "Impact",
                message:
                    "Budget may exceed monthly allocation if current trend continues.",
                show: true,
            },
        },
        footer: {
            actions: [
                {
                    label: "See Department Breakdown",
                    variant: "outline",
                    onClick: () => {
                        console.log("See Department Breakdown clicked");
                    },
                },
            ],
        },
    },
    {
        id: "ai-rebalance-staffing-011",
        category: "operations",
        header: {
            title: "Operational Insights & AI Recommendations",
            timestamp: "30m ago",
            priority: {
                label: "Low priority",
                variant: "low",
            },
        },
        body: {
            mainAlert: {
                message:
                    "AI detected high idle time in Queue B — recommend moving 4 agents.",
            },
            comparison: {
                value: "Optimization opportunity",
                direction: "up",
                show: true,
            },
            aiGenerated: {
                message:
                    "Rebalancing agents from Queue B to Queue A can improve overall efficiency by 12%.",
                show: true,
            },
            impact: {
                label: "Impact",
                message:
                    "Better resource utilization and improved SLA performance across queues.",
                show: true,
            },
        },
        footer: {
            actions: [
                {
                    label: "Apply Suggestion",
                    variant: "outline",
                    borderColor: "purple",
                    onClick: () => {
                        console.log("Apply Suggestion clicked");
                    },
                },
            ],
        },
    },
    {
        id: "missing-logs-payroll-012",
        category: "payroll",
        header: {
            title: "Payroll & Compliance Health",
            timestamp: "2h ago",
            priority: {
                label: "High priority",
                variant: "high",
            },
        },
        body: {
            mainAlert: {
                message:
                    "15 employees have missing clock in/out logs affecting payroll processing.",
            },
            comparison: {
                value: "15 missing logs",
                direction: "down",
                show: true,
            },
            aiGenerated: {
                message:
                    "Missing logs detected for the current pay period. Notify employees to submit attendance corrections.",
                show: true,
            },
            impact: {
                label: "Impact",
                message:
                    "Payroll processing may be delayed if logs are not resolved before cutoff.",
                show: true,
            },
        },
        footer: {
            actions: [
                {
                    label: "Notify Them",
                    variant: "outline",
                    borderColor: "purple",
                    onClick: () => {
                        console.log("Notify Them clicked");
                    },
                },
                {
                    label: "View Missing Logs",
                    variant: "outline",
                    onClick: () => {
                        console.log("View Missing Logs clicked");
                    },
                },
            ],
        },
    },
    {
        id: "employee-missing-logs-013",
        category: "payroll",
        header: {
            title: "Payroll & Compliance Health",
            timestamp: "1h ago",
            priority: {
                label: "Medium priority",
                variant: "medium",
            },
        },
        body: {
            mainAlert: {
                message:
                    "You have missing clock in/out logs for 3 days this pay period.",
            },
            comparison: {
                value: "3 days missing",
                direction: "down",
                show: true,
            },
            aiGenerated: {
                message:
                    "Missing logs need to be resolved to ensure accurate payroll processing. Submit Certificate of Attendance to correct records.",
                show: true,
            },
            impact: {
                label: "Impact",
                message:
                    "Your payroll may be affected if logs are not corrected before the cutoff date.",
                show: true,
            },
        },
        footer: {
            actions: [
                {
                    label: "Apply COA Agent",
                    variant: "outline",
                    borderColor: "purple",
                    chatAction: "coa", // This will trigger the chatbot with COA application message
                    useSimulation: true, // Use simulated flow to show AI agent applying COA
                },
                {
                    label: "View Missing Days",
                    variant: "outline",
                    onClick: () => {
                        console.log("View Missing Days clicked");
                    },
                },
            ],
        },
    },
    {
        id: "vacation-leave-requests-014",
        category: "payroll",
        header: {
            title: "Payroll & Compliance Health",
            timestamp: "4h ago",
            priority: {
                label: "Medium priority",
                variant: "medium",
            },
        },
        body: {
            mainAlert: {
                message:
                    "8 employees have requested vacation leave pending approval.",
            },
            comparison: {
                value: "8 pending requests",
                direction: "up",
                show: true,
            },
            aiGenerated: {
                message:
                    "Review leave requests to ensure adequate coverage during requested periods. Some requests overlap with peak hours.",
                show: true,
            },
            impact: {
                label: "Impact",
                message:
                    "Approved leaves may require schedule adjustments to maintain staffing levels.",
                show: true,
            },
        },
        footer: {
            actions: [
                {
                    label: "Approve Leaves",
                    variant: "outline",
                    borderColor: "purple",
                    onClick: () => {
                        console.log("Approve Leaves clicked");
                    },
                },
                {
                    label: "View Requests",
                    variant: "outline",
                    onClick: () => {
                        console.log("View Requests clicked");
                    },
                },
            ],
        },
    },
    {
        id: "run-payroll-all-companies-015",
        category: "payroll",
        header: {
            title: "Payroll & Compliance Health",
            timestamp: "1d ago",
            priority: {
                label: "High priority",
                variant: "high",
            },
        },
        body: {
            mainAlert: {
                message:
                    "Payroll processing is due for all companies. Run payroll to process employee payments for the current pay period.",
            },
            comparison: {
                value: "Due today",
                direction: "up",
                show: true,
            },
            aiGenerated: {
                message:
                    "All attendance logs have been verified and approved. Payroll is ready to be processed for 12 companies.",
                show: true,
            },
            impact: {
                label: "Impact",
                message:
                    "Delayed payroll processing may affect employee payments and compliance deadlines.",
                show: true,
            },
        },
        footer: {
            actions: [
                {
                    label: "Run Payroll",
                    variant: "primary",
                    chatAction: "run-payroll",
                    useSimulation: true,
                },
            ],
        },
    },
    {
        id: "payroll-anomalies-detected-016",
        category: "payroll",
        header: {
            title: "Payroll & Compliance Health",
            timestamp: "3h ago",
            priority: {
                label: "High priority",
                variant: "high",
            },
        },
        body: {
            mainAlert: {
                message:
                    "I found anomalies in 3 payroll runs that increased payroll costs or have unexpected bonuses.",
            },
            comparison: {
                value: "3 anomalies",
                direction: "up",
                show: true,
            },
            aiGenerated: {
                message:
                    "Anomalies detected: Company A (+15% payroll), Company B (unexpected bonuses), Company C (+8% overtime costs). Review and fix before finalizing payroll.",
                show: true,
            },
            impact: {
                label: "Impact",
                message:
                    "Unresolved anomalies may result in incorrect payments and compliance issues.",
                show: true,
            },
        },
        footer: {
            actions: [
                {
                    label: "See Anomalies",
                    variant: "outline",
                    onClick: () => {
                        console.log("See Anomalies clicked");
                    },
                },
                {
                    label: "Auto-Fix Anomalies",
                    variant: "outline",
                    borderColor: "purple",
                    chatAction: "auto-fix-anomalies",
                    useSimulation: true,
                },
            ],
        },
    },
];

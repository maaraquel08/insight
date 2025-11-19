/**
 * Action Feed Data Types
 * Type definitions for AI-generated action feed items
 */

export interface ActionFeedItem {
    id: string;
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
                    "Absenteeism is at 12%, higher than your daily target of 8%.",
            },
            comparison: {
                value: "4 vs last month",
                direction: "up",
                show: true,
            },
            aiGenerated: {
                message: "Growth driven by new client onboarding in Cebu site.",
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
                    label: "Apply Suggestions",
                    variant: "outline",
                    borderColor: "purple",
                    onClick: () => {
                        console.log("Apply Suggestions clicked");
                    },
                },
            ],
        },
    },
    {
        id: "overtime-spike-002",
        header: {
            title: "Overtime Cost Management",
            timestamp: "1d 5h ago",
            priority: {
                label: "Medium priority",
                variant: "medium",
            },
        },
        body: {
            mainAlert: {
                message:
                    "Overtime costs increased by 15% this week, exceeding budget allocation.",
            },
            comparison: {
                value: "15% vs last week",
                direction: "up",
                show: true,
            },
            aiGenerated: {
                message:
                    "Spike due to coverage gaps during peak season. Consider redistributing shifts.",
                show: true,
            },
            impact: {
                label: "Impact",
                message:
                    "Monthly budget may be exceeded by 8% if current trend continues.",
                show: true,
            },
        },
        footer: {
            actions: [
                {
                    label: "View Budget Report",
                    variant: "outline",
                    onClick: () => {
                        console.log("View Budget Report clicked");
                    },
                },
                {
                    label: "Optimize Shifts",
                    variant: "primary",
                    onClick: () => {
                        console.log("Optimize Shifts clicked");
                    },
                },
            ],
        },
    },
    {
        id: "retention-improvement-003",
        header: {
            title: "Employee Retention Metrics",
            timestamp: "5h ago",
            priority: {
                label: "Low priority",
                variant: "low",
            },
        },
        body: {
            mainAlert: {
                message:
                    "Retention rate improved to 94%, up from 91% last quarter.",
            },
            comparison: {
                value: "3% vs last quarter",
                direction: "up",
                show: true,
            },
            aiGenerated: {
                message:
                    "Improved retention driven by enhanced onboarding program and flexible work arrangements.",
                show: true,
            },
            impact: {
                label: "Impact",
                message:
                    "Reduced hiring costs and improved team stability across all departments.",
                show: true,
            },
        },
        footer: {
            actions: [
                {
                    label: "View Details",
                    variant: "outline",
                    onClick: () => {
                        console.log("View Details clicked");
                    },
                },
            ],
        },
    },
    {
        id: "queue-overflow-004",
        header: {
            title: "Customer Service Queue Alert",
            timestamp: "2h ago",
            priority: {
                label: "High priority",
                variant: "high",
            },
        },
        body: {
            mainAlert: {
                message:
                    "Queue 3 has 45 pending tickets, exceeding the 30-ticket threshold.",
            },
            comparison: {
                value: "15 over threshold",
                direction: "up",
                show: true,
            },
            aiGenerated: {
                message:
                    "Recommend reassigning 3 agents from Queue 1 to handle the overflow.",
                show: true,
            },
            impact: {
                label: "Impact",
                message:
                    "Average wait time may increase to 8 minutes if not addressed within 30 minutes.",
                show: true,
            },
        },
        footer: {
            actions: [
                {
                    label: "View Queue Status",
                    variant: "outline",
                    onClick: () => {
                        console.log("View Queue Status clicked");
                    },
                },
                {
                    label: "Reassign Agents",
                    variant: "outline",
                    borderColor: "purple",
                    onClick: () => {
                        console.log("Reassign Agents clicked");
                    },
                },
            ],
        },
    },
    {
        id: "training-completion-005",
        header: {
            title: "Training Program Progress",
            timestamp: "1d ago",
        },
        body: {
            mainAlert: {
                message:
                    "85% of employees completed the Q4 safety training, meeting the target.",
            },
            comparison: {
                value: "5% above target",
                direction: "up",
                show: true,
            },
            aiGenerated: {
                message:
                    "Training completion rate exceeded expectations. Consider expanding program to other departments.",
                show: true,
            },
            impact: {
                label: "Impact",
                message:
                    "Improved compliance scores and reduced workplace incidents by 12%.",
                show: true,
            },
        },
        footer: {
            actions: [
                {
                    label: "View Report",
                    variant: "outline",
                    onClick: () => {
                        console.log("View Report clicked");
                    },
                },
                {
                    label: "Expand Program",
                    variant: "primary",
                    onClick: () => {
                        console.log("Expand Program clicked");
                    },
                },
            ],
        },
    },
    {
        id: "attendance-drop-006",
        header: {
            title: "Team Alpha Attendance",
            timestamp: "6h ago",
            priority: {
                label: "Medium priority",
                variant: "medium",
            },
        },
        body: {
            mainAlert: {
                message:
                    "Team Alpha attendance dropped to 88%, below the 92% target.",
            },
            comparison: {
                value: "4% vs target",
                direction: "down",
                show: true,
            },
            aiGenerated: {
                message:
                    "Recent absences concentrated in morning shifts. Consider flexible start times.",
                show: true,
            },
            impact: {
                label: "Impact",
                message:
                    "Morning shift coverage may be insufficient for the next 2 weeks.",
                show: true,
            },
        },
        footer: {
            actions: [
                {
                    label: "View Team Details",
                    variant: "outline",
                    onClick: () => {
                        console.log("View Team Details clicked");
                    },
                },
                {
                    label: "Adjust Schedule",
                    variant: "outline",
                    borderColor: "purple",
                    onClick: () => {
                        console.log("Adjust Schedule clicked");
                    },
                },
            ],
        },
    },
];

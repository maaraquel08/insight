"use client";

import { DashboardContainer } from "@/components/dashboard/layout/dashboard-container";
import { PersonalizeHeader } from "@/components/dashboard/layout/personalize-header";
import { FloatingChatSidekick } from "@/components/chatbot-sidekick";
import {
    ReportsHubContent,
    CategoryTab,
    ReportCardProps,
} from "@/components/reports-hub";

const categories: CategoryTab[] = [
    { id: "hr", label: "HR" },
    { id: "payroll", label: "Payroll" },
    { id: "finance", label: "Finance" },
    { id: "workday", label: "Workday" },
    { id: "app1", label: "App 1" },
];

const reports: ReportCardProps[] = [
    // HR Reports (8)
    {
        title: "Overtime",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "hr",
    },
    {
        title: "Leaves",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "hr",
    },
    {
        title: "Attendance Logs",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "hr",
    },
    {
        title: "Attrition",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "hr",
        slug: "attrition",
    },
    {
        title: "Employee Demographics",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "hr",
    },
    {
        title: "Employee List Report",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "hr",
    },
    {
        title: "Absenteeism",
        description: "Chatbot answers your questions about company",
        status: "published",
        category: "hr",
    },
    {
        title: "Performance Review",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "hr",
    },
    {
        title: "Headcount Movement",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "hr",
        slug: "headcount",
    },
    // Payroll Reports (4)
    {
        title: "Salary",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "payroll",
    },
    {
        title: "Payroll Summary",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "payroll",
    },
    {
        title: "Tax Deductions",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "payroll",
    },
    {
        title: "Benefits Report",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "payroll",
    },
    // Finance Reports (6)
    {
        title: "Financial Summary",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "finance",
    },
    {
        title: "Budget Analysis",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "finance",
    },
    {
        title: "Expense Report",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "finance",
    },
    {
        title: "Revenue Report",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "finance",
    },
    {
        title: "Cost Center Analysis",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "finance",
    },
    {
        title: "Financial Forecast",
        description: "Chatbot answers your questions about company",
        status: "published",
        category: "finance",
    },
    // Workday Reports (9)
    {
        title: "Workday Integration",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "workday",
    },
    {
        title: "Workday Sync Status",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "workday",
    },
    {
        title: "Workday Employee Data",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "workday",
    },
    {
        title: "Workday Payroll Sync",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "workday",
    },
    {
        title: "Workday Time Tracking",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "workday",
    },
    {
        title: "Workday Benefits",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "workday",
    },
    {
        title: "Workday Compliance",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "workday",
    },
    {
        title: "Workday Analytics",
        description: "Chatbot answers your questions about company",
        status: "published",
        category: "workday",
    },
    {
        title: "Workday Custom Fields",
        description: "Chatbot answers your questions about company",
        status: "default",
        category: "workday",
    },
    // App 1 Reports (2)
    {
        title: "Custom Report 2",
        description: "Chatbot answers your questions about company",
        status: "published",
        category: "app1",
    },
    {
        title: "Custom Report 3",
        description: "Chatbot answers your questions about company",
        status: "unpublished",
        category: "app1",
    },
];

export default function ReportsHubPage() {
    return (
        <DashboardContainer userId="user-1" role="admin">
            <main className="bg-[#f1f2f3] min-h-screen flex flex-col">
                <div className="flex flex-col gap-6 p-10 flex-1">
                    <div className="flex flex-col gap-6 items-start max-w-[1320px] w-full mx-auto">
                        <PersonalizeHeader
                            title="Reports Hub"
                            description="Select to the available Reports"
                        />
                        <ReportsHubContent
                            categories={categories}
                            reports={reports}
                            defaultCategory="hr"
                        />
                    </div>
                </div>

                {/* Floating Chat Sidekick */}
                <FloatingChatSidekick />
            </main>
        </DashboardContainer>
    );
}

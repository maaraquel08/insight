"use client";

import { ReactNode } from "react";
import { DashboardProvider } from "@/contexts/dashboard-context";

interface DashboardContainerProps {
    children: ReactNode;
    userId?: string;
    role?: string;
}

export function DashboardContainer({
    children,
    userId = "default",
    role = "admin",
}: DashboardContainerProps) {
    return (
        <DashboardProvider userId={userId} role={role}>
            {children}
        </DashboardProvider>
    );
}


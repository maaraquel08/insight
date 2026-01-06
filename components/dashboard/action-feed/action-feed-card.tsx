"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ActionFeedCardProps {
    header: ReactNode;
    body: ReactNode;
    footer: ReactNode;
}

export function ActionFeedCard({ header, body, footer }: ActionFeedCardProps) {
    return (
        <div className="bg-white border border-[#d9dede] rounded-xl overflow-hidden w-full max-w-[480px]">
            {/* Header */}
            <div className="px-4 py-3">{header}</div>

            {/* Divider - spans full width edge to edge */}
            <div className="w-full border-t border-[#d9dede]" />

            {/* Body */}
            <div className="p-6">{body}</div>

            {/* Divider - spans full width edge to edge */}
            <div className="w-full border-t border-[#d9dede]" />

            {/* Footer */}
            <div className="px-4 py-3">{footer}</div>
        </div>
    );
}

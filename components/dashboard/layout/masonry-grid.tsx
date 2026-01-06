"use client";

import { ReactNode } from "react";
import type { CSSProperties } from "react";

interface MasonryGridProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
}

/**
 * Reusable masonry grid component for dashboard widgets
 * Uses CSS columns for true masonry layout with uniform 24px spacing
 */
export function MasonryGrid({ children, className = "", style }: MasonryGridProps) {
    const masonryStyle: CSSProperties = {
        columnCount: 2,
        columnGap: "24px",
        columnFill: "balance" as const,
        ...style,
    };

    return (
        <div style={masonryStyle} className={className}>
            {children}
        </div>
    );
}

/**
 * Style for individual masonry grid items
 * Prevents widgets from breaking across columns
 * Ensures uniform 24px spacing both horizontally and vertically
 */
export const masonryItemStyle: CSSProperties = {
    breakInside: "avoid",
    pageBreakInside: "avoid",
    WebkitColumnBreakInside: "avoid",
    display: "inline-block",
    width: "100%",
    marginBottom: "24px",
};


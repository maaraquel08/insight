"use client";

import { ReactNode, useEffect, useState } from "react";
import type { CSSProperties } from "react";

interface MasonryGridProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
}

/**
 * Reusable masonry grid component for dashboard widgets
 * Uses CSS columns for true masonry layout with uniform 24px spacing
 * Responsive: 1 column on mobile, 2 columns on desktop
 */
export function MasonryGrid({ children, className = "", style }: MasonryGridProps) {
    const [columnCount, setColumnCount] = useState(1);

    useEffect(() => {
        const updateColumnCount = () => {
            setColumnCount(window.innerWidth >= 768 ? 2 : 1);
        };

        updateColumnCount();
        window.addEventListener("resize", updateColumnCount);
        return () => window.removeEventListener("resize", updateColumnCount);
    }, []);

    const masonryStyle: CSSProperties = {
        columnCount,
        columnGap: columnCount === 1 ? "0px" : "24px",
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
export const masonryItemStyle: CSSProperties & {
    WebkitColumnBreakInside?: string;
} = {
    breakInside: "avoid",
    pageBreakInside: "avoid",
    WebkitColumnBreakInside: "avoid",
    display: "inline-block",
    width: "100%",
    marginBottom: "24px",
};


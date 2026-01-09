import type { DashboardConfig, WidgetLayout } from "@/types/dashboard";

const STORAGE_KEY_PREFIX = "dashboard_config_";

function getStorageKey(userId: string, role: string): string {
    return `${STORAGE_KEY_PREFIX}${userId}_${role}`;
}

function getDraftStorageKey(userId: string, role: string): string {
    return `${STORAGE_KEY_PREFIX}draft_${userId}_${role}`;
}

export function loadDashboardConfig(
    userId: string,
    role: string
): DashboardConfig | null {
    if (typeof window === "undefined") return null;

    try {
        const key = getStorageKey(userId, role);
        const stored = localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored) as DashboardConfig;
        }
    } catch (error) {
        console.error("Error loading dashboard config:", error);
    }

    return null;
}

export function saveDashboardConfig(config: DashboardConfig): void {
    if (typeof window === "undefined") return;

    try {
        const key = getStorageKey(config.userId, config.role);
        const configToSave = {
            ...config,
            lastSaved: new Date().toISOString(),
        };
        localStorage.setItem(key, JSON.stringify(configToSave));

        // Clear draft after saving
        const draftKey = getDraftStorageKey(config.userId, config.role);
        localStorage.removeItem(draftKey);
    } catch (error) {
        console.error("Error saving dashboard config:", error);
    }
}

export function saveDraftConfig(config: DashboardConfig): void {
    if (typeof window === "undefined") return;

    try {
        const draftKey = getDraftStorageKey(config.userId, config.role);
        localStorage.setItem(draftKey, JSON.stringify(config));
    } catch (error) {
        console.error("Error saving draft config:", error);
    }
}

export function loadDraftConfig(
    userId: string,
    role: string
): DashboardConfig | null {
    if (typeof window === "undefined") return null;

    try {
        const draftKey = getDraftStorageKey(userId, role);
        const stored = localStorage.getItem(draftKey);
        if (stored) {
            return JSON.parse(stored) as DashboardConfig;
        }
    } catch (error) {
        console.error("Error loading draft config:", error);
    }

    return null;
}

export function resetToDefault(role: string): DashboardConfig {
    return getDefaultConfig(role);
}

export function getDefaultConfig(role: string): DashboardConfig {
    // Original People Health Dashboard - general widgets
    const defaultWidgets: WidgetLayout[] = [
        {
            id: "metric-cards-section",
            widgetId: "metric-cards-section",
            x: 0,
            y: 0,
            width: 12, // Full width for metric cards
            height: 1,
            size: "Medium",
            order: 0,
        },
        {
            id: "headcount-trend-chart",
            widgetId: "headcount-trend-chart",
            x: 0,
            y: 1,
            width: 6, // Half width
            height: 1,
            size: "Medium",
            order: 1,
        },
        {
            id: "attrition-trend-chart",
            widgetId: "attrition-trend-chart",
            x: 6,
            y: 1,
            width: 6, // Half width
            height: 1,
            size: "Medium",
            order: 2,
        },
        {
            id: "leave-types-breakdown",
            widgetId: "leave-types-breakdown",
            x: 0,
            y: 2,
            width: 6, // Half width
            height: 1,
            size: "Medium",
            order: 3,
        },
        {
            id: "absenteeism-trend-chart",
            widgetId: "absenteeism-trend-chart",
            x: 6,
            y: 2,
            width: 6, // Half width
            height: 1,
            size: "Medium",
            order: 4,
        },
    ];

    return {
        userId: "default",
        role,
        widgets: defaultWidgets,
        density: "Spacious",
        version: 1,
    };
}

export function getHeadcountMovementConfig(role: string): DashboardConfig {
    // Headcount Analytics Dashboard - headcount-specific widgets
    const headcountWidgets: WidgetLayout[] = [
        {
            id: "headcount-trend-advanced",
            widgetId: "headcount-trend-advanced",
            x: 0,
            y: 0,
            width: 12, // Full width for trend chart
            height: 1,
            size: "Medium",
            order: 0,
        },
        {
            id: "departmental-distribution",
            widgetId: "departmental-distribution-chart",
            x: 0,
            y: 1,
            width: 12, // Full width for departmental chart
            height: 1,
            size: "Medium",
            order: 1,
        },
        {
            id: "attrition-heatmap",
            widgetId: "attrition-heatmap",
            x: 0,
            y: 2,
            width: 12, // Full width for heatmap
            height: 1,
            size: "Medium",
            order: 2,
        },
        {
            id: "yoy-comparison-table",
            widgetId: "yoy-comparison-table",
            x: 0,
            y: 3,
            width: 12, // Full width for comparison table
            height: 1,
            size: "Medium",
            order: 3,
        },
    ];

    return {
        userId: "headcount-movement",
        role,
        widgets: headcountWidgets,
        density: "Spacious",
        version: 1,
    };
}

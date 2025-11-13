"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    ReactNode,
} from "react";
import type {
    DashboardConfig,
    WidgetLayout,
    WidgetSize,
    LayoutDensity,
} from "@/types/dashboard";
import {
    loadDashboardConfig,
    saveDashboardConfig,
    saveDraftConfig,
    loadDraftConfig,
    getDefaultConfig,
    resetToDefault,
} from "@/lib/dashboard-config";

interface DashboardContextType {
    config: DashboardConfig;
    isEditMode: boolean;
    hasUnsavedChanges: boolean;
    toggleEditMode: () => void;
    saveLayout: () => void;
    cancelChanges: () => void;
    resetLayout: () => void;
    addWidget: (widgetId: string) => void;
    removeWidget: (widgetLayoutId: string) => void;
    resizeWidget: (widgetLayoutId: string, size: WidgetSize) => void; // Kept for backward compatibility but no-op
    reorderWidgets: (widgets: WidgetLayout[]) => void;
    updateWidgetPosition: (
        widgetLayoutId: string,
        x: number,
        y: number
    ) => void;
    setDensity: (density: LayoutDensity) => void;
    initializeConfig: (userId: string, role: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
    undefined
);

interface DashboardProviderProps {
    children: ReactNode;
    userId: string;
    role: string;
}

export function DashboardProvider({
    children,
    userId,
    role,
}: DashboardProviderProps) {
    const [config, setConfig] = useState<DashboardConfig>(() =>
        getDefaultConfig(role)
    );
    const [isEditMode, setIsEditMode] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [originalConfig, setOriginalConfig] = useState<DashboardConfig>(
        getDefaultConfig(role)
    );

    // Initialize config from storage or default
    const initializeConfig = useCallback(
        (userId: string, role: string) => {
            // Try to load draft first
            const draftConfig = loadDraftConfig(userId, role);
            if (draftConfig) {
                setConfig(draftConfig);
                setOriginalConfig(draftConfig);
                setHasUnsavedChanges(true);
                return;
            }

            // Try to load saved config
            const savedConfig = loadDashboardConfig(userId, role);
            if (savedConfig) {
                setConfig(savedConfig);
                setOriginalConfig(savedConfig);
                setHasUnsavedChanges(false);
                return;
            }

            // Use default config
            const defaultConfig = getDefaultConfig(role);
            setConfig(defaultConfig);
            setOriginalConfig(defaultConfig);
            setHasUnsavedChanges(false);
        },
        []
    );

    useEffect(() => {
        initializeConfig(userId, role);
    }, [userId, role, initializeConfig]);

    // Auto-save draft every 30 seconds when in edit mode
    useEffect(() => {
        if (!isEditMode || !hasUnsavedChanges) return;

        const interval = setInterval(() => {
            saveDraftConfig(config);
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [isEditMode, hasUnsavedChanges, config]);

    const toggleEditMode = useCallback(() => {
        setIsEditMode((prev) => {
            const newMode = !prev;
            if (!newMode && hasUnsavedChanges) {
                // Exiting edit mode with unsaved changes - revert
                setConfig(originalConfig);
                setHasUnsavedChanges(false);
            }
            return newMode;
        });
    }, [hasUnsavedChanges, originalConfig]);

    const saveLayout = useCallback(() => {
        saveDashboardConfig(config);
        setOriginalConfig(config);
        setHasUnsavedChanges(false);
        setIsEditMode(false);
    }, [config]);

    const cancelChanges = useCallback(() => {
        setConfig(originalConfig);
        setHasUnsavedChanges(false);
        setIsEditMode(false);
    }, [originalConfig]);

    const resetLayout = useCallback(() => {
        const defaultConfig = resetToDefault(role);
        setConfig(defaultConfig);
        setOriginalConfig(defaultConfig);
        setHasUnsavedChanges(true);
    }, [role]);

    const addWidget = useCallback(
        (widgetId: string) => {
            // Metric cards use full width (12 columns), others use 2-column layout (6 columns)
            const maxY = Math.max(
                ...config.widgets.map((w) => w.y + w.height),
                0
            );

            const width = widgetId === "metric-cards-section" ? 12 : 6;

            const newWidget: WidgetLayout = {
                id: `${widgetId}-${Date.now()}`,
                widgetId,
                x: 0,
                y: maxY,
                width,
                height: 1,
                size: "Medium", // Kept for backward compatibility
                order: config.widgets.length,
            };

            setConfig((prev) => ({
                ...prev,
                widgets: [...prev.widgets, newWidget],
            }));
            setHasUnsavedChanges(true);
        },
        [config.widgets]
    );

    const removeWidget = useCallback((widgetLayoutId: string) => {
        const widget = config.widgets.find((w) => w.id === widgetLayoutId);
        if (widget) {
            // Check if widget is locked (would need to check registry)
            setConfig((prev) => ({
                ...prev,
                widgets: prev.widgets.filter((w) => w.id !== widgetLayoutId),
            }));
            setHasUnsavedChanges(true);
        }
    }, [config.widgets]);

    // Resize functionality removed - all widgets use equal width
    const resizeWidget = useCallback(() => {
        // No-op: sizing is no longer supported
    }, []);

    const reorderWidgets = useCallback((widgets: WidgetLayout[]) => {
        setConfig((prev) => ({
            ...prev,
            widgets,
        }));
        setHasUnsavedChanges(true);
    }, []);

    const updateWidgetPosition = useCallback(
        (widgetLayoutId: string, x: number, y: number) => {
            setConfig((prev) => ({
                ...prev,
                widgets: prev.widgets.map((w) =>
                    w.id === widgetLayoutId ? { ...w, x, y } : w
                ),
            }));
            setHasUnsavedChanges(true);
        },
        []
    );

    const setDensity = useCallback((density: LayoutDensity) => {
        setConfig((prev) => ({
            ...prev,
            density,
        }));
        setHasUnsavedChanges(true);
    }, []);

    return (
        <DashboardContext.Provider
            value={{
                config,
                isEditMode,
                hasUnsavedChanges,
                toggleEditMode,
                saveLayout,
                cancelChanges,
                resetLayout,
                addWidget,
                removeWidget,
                resizeWidget,
                reorderWidgets,
                updateWidgetPosition,
                setDensity,
                initializeConfig,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error("useDashboard must be used within a DashboardProvider");
    }
    return context;
}

